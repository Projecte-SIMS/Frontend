import { ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import apiClient from '@/services/api'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import i18n from '@/i18n'

export interface Vehicle {
  id: number
  plate: string
  brand: string
  model: string
  latitude: number
  longitude: number
  postgres_active?: boolean
  mongo_active?: boolean
  status: 'available' | 'reserved' | 'running'
  is_mine?: boolean
  online?: boolean
  speed?: number
  rpm?: number
  engine_temp?: number
  battery_voltage?: number
  device_id?: string
  price_per_minute?: number
  distanceMeters?: number
}

const vehicles = ref<Vehicle[]>([])
const map = ref<L.Map | null>(null)
const mapContainer = ref<HTMLElement | null>(null)
const markers: Map<number, L.Marker> = new Map()
const selectedVehicle = ref<Vehicle | null>(null)
let clusterGroup: any = null
let userMarker: L.Marker | L.CircleMarker | null = null
let pollInterval: ReturnType<typeof setInterval> | null = null

const searchQuery = ref('')
const showOperativeOnly = ref(false)
const userLocation = ref<{ lat: number; lng: number } | null>(null)
const radiusMeters = ref<number | null>(null)
const rawVehicles = ref<Vehicle[]>([])
const t = (key: string, params?: Record<string, unknown>) => i18n.global.t(key, params as any) as string

const setSearchQuery = (q: string) => {
  searchQuery.value = q
  applyFiltersAndMarkers()
}

const setShowOperativeOnly = (v: boolean) => {
  showOperativeOnly.value = v
  applyFiltersAndMarkers()
}

const setRadiusMeters = (m: number | null) => {
  radiusMeters.value = m
  applyFiltersAndMarkers()
}

const createVehicleIcon = (v: Vehicle) => {
  let color = '#22c55e'
  let extraClass = ''
  let statusText = t('map.status_free')

  // If offline, show gray icon regardless of other states
  if (v.online === false) {
    color = '#94a3b8'
    statusText = t('common.offline')
  } else if (v.status === 'running') {
    color = '#ef4444'
    extraClass = 'marker-pulse-red'
    statusText = t('map.status_running')
  } else if (v.status === 'reserved') {
    color = '#f59e0b'
    statusText = v.is_mine ? t('common.your_booking') : t('map.status_reserved')
  }

  return L.divIcon({
    html: `
      <div class="custom-vehicle-marker ${extraClass}" style="--marker-color: ${color}">
        <div class="marker-pin shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
        <div class="marker-label">${statusText}</div>
      </div>
    `,
    className: 'vehicle-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  })
}

const fetchVehicles = async (endpoint = '/vehicles/map') => {
  try {
    const response = await apiClient.get(endpoint)
    rawVehicles.value = response.data.map((v: any) => ({
      id: v.id,
      plate: v.plate,
      brand: v.brand,
      model: v.model,
      latitude: Number(v.latitude),
      longitude: Number(v.longitude),
      postgres_active: v.postgres_active,
      mongo_active: v.mongo_active,
      status: v.status,
      is_mine: v.is_mine,
      online: v.online,
      speed: v.speed,
      rpm: v.rpm,
      engine_temp: v.engine_temp,
      battery_voltage: v.battery_voltage,
      device_id: v.device_id
    }))

    applyFiltersAndMarkers()
    
    if (selectedVehicle.value) {
      const updated = rawVehicles.value.find(v => v.id === selectedVehicle.value?.id)
      if (updated) {
        selectedVehicle.value = updated
      } else {
        selectedVehicle.value = null
      }
    }
  } catch (error) {
    console.error('Error fetching vehicles:', error)
  }
}

const initMap = () => {
  if (!mapContainer.value) return

  map.value = L.map(mapContainer.value, {
    zoomControl: false,
    preferCanvas: true,
    zoomAnimation: true, // Habilitado
    fadeAnimation: true, // Habilitado
    markerZoomAnimation: true // Habilitado
  }).setView([41.3851, 2.1734], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value as any)

  L.control.zoom({ position: 'bottomleft' }).addTo(map.value as any)

  // @ts-ignore
  clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 40,
    animate: true, // Habilitado
    animateAddingMarkers: true, // Habilitado
    disableClusteringAtZoom: 18,
    spiderfyOnMaxZoom: true,
    removeOutsideVisibleBounds: true, // Optimización: quitar marcadores fuera de vista
    chunkedLoading: true, // Optimización: cargar en lotes
    zoomToBoundsOnClick: true,
    iconCreateFunction: function(cluster: any) {
      const childCount = cluster.getChildCount();
      return L.divIcon({ 
        html: `<div class="custom-cluster"><span>${childCount}</span></div>`, 
        className: 'cluster-icon-parent', 
        iconSize: [40, 40] 
      });
    }
  }).addTo(map.value as any)

  if (!pollInterval) {
    pollInterval = setInterval(() => {
      const pathname = window.location.pathname
      const isAdminMap = pathname.includes('/admin/')
      const endpoint = isAdminMap ? '/admin/vehicles/map' : '/vehicles/map'
      fetchVehicles(endpoint).catch(() => {})
    }, 3000)
  }
}

const applyFiltersAndMarkers = () => {
  const q = searchQuery.value.trim().toLowerCase()
  const filtered = rawVehicles.value.filter(v => {
    if (showOperativeOnly.value && v.status !== 'running') return false
    if (q) {
      const combined = `${v.plate} ${v.brand} ${v.model}`.toLowerCase()
      if (!combined.includes(q)) return false
    }
    if (!withinRadius(v)) return false
    return true
  })

  vehicles.value = filtered
  addVehicleMarkers()
}

const addVehicleMarkers = () => {
  if (!map.value || !clusterGroup) return

  const visibleIds = new Set<number>()

  vehicles.value.forEach(v => {
    if (v.latitude == null || v.longitude == null) return
    visibleIds.add(v.id)

    if (markers.has(v.id)) {
      const m = markers.get(v.id) as L.Marker
      const currentPos = m.getLatLng()
      // Only update position if it changed significantly
      if (Math.abs(currentPos.lat - v.latitude) > 0.00001 || Math.abs(currentPos.lng - v.longitude) > 0.00001) {
        m.setLatLng([v.latitude, v.longitude])
      }
      // Update icon (status might have changed)
      const icon = createVehicleIcon(v)
      m.setIcon(icon)
    } else {
      const icon = createVehicleIcon(v)
      const marker = L.marker([v.latitude, v.longitude], { icon })
      
      const imageUrl = getVehicleImage(v.brand, v.model)
      const popupContent = `
        <div class="fleetly-map-popup" style="min-width: 200px; padding: 10px;">
          <div style="width: 100%; height: 100px; background: #f3f4f6; border-radius: 8px; overflow: hidden; margin-bottom: 10px;">
            <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/logo.png'">
          </div>
          <div style="font-weight: 900; text-transform: uppercase; font-size: 14px; margin-bottom: 2px;">${v.brand} ${v.model}</div>
          <div style="color: #6366f1; font-family: monospace; font-weight: 700; font-size: 12px; margin-bottom: 8px;">${v.plate}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; pt: 8px; margin-top: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #6b7280;">${t('map.rate')}</span>
            <span style="font-size: 13px; font-weight: 900;">${v.price_per_minute || '0.15'}€<span style="font-size: 9px; color: #9ca3af;">${t('vehicles.per_minute')}</span></span>
          </div>
        </div>
      `
      marker.bindPopup(popupContent, {
        className: 'fleetly-popup-custom',
        maxWidth: 250
      })

      marker.on('click', () => {
        selectedVehicle.value = v
        centerOnVehicle(v)
      })
      clusterGroup.addLayer(marker)
      markers.set(v.id, marker)
    }
  })

  markers.forEach((m, id) => {
    if (!visibleIds.has(id)) {
      clusterGroup.removeLayer(m)
      markers.delete(id)
    }
  })
}

const centerOnVehicle = (vehicle: Vehicle) => {
  if (!map.value) return
  if (vehicle.latitude == null || vehicle.longitude == null || (vehicle.latitude === 0 && vehicle.longitude === 0)) {
    console.warn('Vehicle has no valid coordinates to center on')
    return
  }

  const marker = markers.get(vehicle.id)
  if (marker && clusterGroup) {
    try {
      clusterGroup.zoomToShowLayer(marker, () => {
        if (map.value) {
          map.value.setView([vehicle.latitude, vehicle.longitude], 17, { animate: true })
        }
      })
      return
    } catch (e) {
      console.warn('Error using zoomToShowLayer, falling back to direct setView', e)
    }
  }

  // Fallback or if marker not found: center directly
  map.value.setView([vehicle.latitude, vehicle.longitude], 17, { animate: true })
}

const setUserLocation = (lat: number, lng: number) => {
  userLocation.value = { lat, lng }
  if (map.value) {
    if (userMarker) {
      try { userMarker.setLatLng([lat, lng]) } catch { }
    } else {
      userMarker = L.circleMarker([lat, lng], { radius: 8, color: '#2563eb', weight: 2, fillColor: '#60a5fa', fillOpacity: 0.9 }).addTo(map.value as any)
      userMarker.bindPopup(`<b>${t('map.you_are_here')}</b>`)
    }
  }
}

const withinRadius = (v: Vehicle) => {
  if (!userLocation.value || !radiusMeters.value) return true
  const R = 6371000
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(v.latitude - userLocation.value.lat)
  const dLon = toRad(v.longitude - userLocation.value.lng)
  const lat1 = toRad(userLocation.value.lat)
  const lat2 = toRad(v.latitude)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c) <= (radiusMeters.value || 0)
}

const destroyMap = () => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
  if (map.value) {
    try {
      // Stop any ongoing animations
      map.value.stop()
      // Remove all event listeners
      map.value.off()
      // Clear cluster group first
      if (clusterGroup) {
        clusterGroup.clearLayers()
      }
      // Remove the map
      map.value.remove()
    } catch (e) {
      // Ignore errors during cleanup
    }
    map.value = null
  }
  markers.clear()
  clusterGroup = null
  userMarker = null
  selectedVehicle.value = null
}

export function useMap() {
  return {
    mapContainer,
    vehicles,
    map,
    markers,
    selectedVehicle,
    fetchVehicles,
    initMap,
    addVehicleMarkers,
    centerOnVehicle,
    destroyMap,
    rawVehicles,
    searchQuery,
    setSearchQuery,
    showOperativeOnly,
    setShowOperativeOnly,
    userLocation,
    setUserLocation,
    radiusMeters,
    setRadiusMeters,
    _internal: {
      getUserMarker: () => userMarker
    }
  }
}
