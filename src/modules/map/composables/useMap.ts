import { ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import apiClient from '@/services/api'

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
  let statusText = 'Libre'

  // If offline, show gray icon regardless of other states
  if (v.online === false) {
    color = '#94a3b8'
    statusText = 'Desconectado'
  } else if (v.status === 'running') {
    color = '#ef4444'
    extraClass = 'marker-pulse-red'
    statusText = 'En marcha'
  } else if (v.status === 'reserved') {
    color = '#f59e0b'
    statusText = v.is_mine ? 'Tu Reserva' : 'Reservado'
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
  if (map.value && clusterGroup) {
    const marker = markers.get(vehicle.id)
    if (marker) {
      try {
        clusterGroup.zoomToShowLayer(marker, () => {
          if (map.value) {
            map.value.setView([vehicle.latitude, vehicle.longitude], 17)
          }
        })
      } catch (e) {
        // Fallback: just center the map
        if (map.value) {
          map.value.setView([vehicle.latitude, vehicle.longitude], 17)
        }
      }
    }
  }
}

const setUserLocation = (lat: number, lng: number) => {
  userLocation.value = { lat, lng }
  if (map.value) {
    if (userMarker) {
      try { userMarker.setLatLng([lat, lng]) } catch { }
    } else {
      userMarker = L.circleMarker([lat, lng], { radius: 8, color: '#2563eb', weight: 2, fillColor: '#60a5fa', fillOpacity: 0.9 }).addTo(map.value as any)
      userMarker.bindPopup('<b>Estás aquí</b>')
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
