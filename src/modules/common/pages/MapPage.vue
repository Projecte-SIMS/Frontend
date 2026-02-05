<template>
  <!-- Contenedor principal del mapa -->
  <div class="relative min-h-[100dvh] bg-gray-800">
    <div ref="mapContainer" class="absolute inset-0" style="height: calc(100vh - 4rem);"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import apiClient from '@/services/api'

const route = useRoute()

interface Vehicle {
  id: number
  plate: string
  brand: string
  model: string
  latitude: number
  longitude: number
  postgres_active?: boolean
  status: 'active' | 'inactive'
}

const mapContainer = ref<HTMLElement | null>(null)
const vehicles = ref<Vehicle[]>([])
let map: L.Map | null = null
const markers: Map<number, L.Marker> = new Map()

const createVehicleIcon = (postgresActive?: boolean, mongoActive?: boolean) => {
  // Relleno: verde si disponible (postgresActive false), naranja si ocupado (postgresActive true)
  const color = postgresActive ? '#f59e0b' : '#22c55e'
  // Borde: rojo si arrancado (mongoActive true), blanco si apagado
  const borderColor = mongoActive ? '#ef4444' : '#ffffff'

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid ${borderColor};
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="18" height="18">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
    className: 'vehicle-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

const fetchVehicles = async () => {
  try {
    const response = await apiClient.get('/vehicles-map')
    // Backend returns postgres_active and mongo_active; determine status for UI
    vehicles.value = response.data.map((v: any) => ({
      id: v.id,
      plate: v.plate,
      brand: v.brand,
      model: v.model,
      latitude: v.latitude,
      longitude: v.longitude,
      postgres_active: v.postgres_active,
      status: (v.mongo_active === true) ? 'active' : 'inactive',
    }))

    addVehicleMarkers()
  } catch (error) {
    console.error('Error fetching vehicles:', error)
  }
}

const addVehicleMarkers = () => {
  if (!map) return

  markers.forEach(marker => marker.remove())
  markers.clear()

  vehicles.value.forEach(vehicle => {
    const marker = L.marker([vehicle.latitude, vehicle.longitude], {
      icon: createVehicleIcon(vehicle.postgres_active, vehicle.mongo_active)
    })
      .addTo(map!)
      .bindPopup(`
        <div class="p-2">
          <p class="font-bold">${vehicle.plate}</p>
          <p class="text-sm">${vehicle.brand} ${vehicle.model}</p>
          <p class="text-xs text-gray-500">Disponible (Postgres): ${vehicle.postgres_active ? 'No' : 'Sí'}</p>
          <p class="text-xs text-gray-500">Arrancado (Mongo): ${vehicle.status === 'active' ? 'Sí' : 'No'}</p>
        </div>
      `)
    
    markers.set(vehicle.id, marker)
  })

  // Ajustar vista para mostrar todos los vehículos
  if (vehicles.value.length > 0) {
    const bounds = L.latLngBounds(vehicles.value.map(v => [v.latitude, v.longitude]))
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

const initMap = () => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView([41.3851, 2.1734], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
}

onMounted(() => {
  initMap()
  // If query ?view=all then fetch vehicles, otherwise use geolocation
  const view = route.query.view?.toString()
  if (route.path === '/vehicles-map' || view === 'all') {
    fetchVehicles().catch(err => console.error(err))
  } else {
    // Use browser geolocation to center map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          if (map) {
            map.setView([lat, lng], 15)
            const youMarker = L.marker([lat, lng]).addTo(map)
            youMarker.bindPopup('<b>Estás aquí</b>').openPopup()
            L.circle([lat, lng], { radius: 50 }).addTo(map)
          }
        },
        (err) => {
          console.warn('Geolocation failed or denied', err)
        },
        { enableHighAccuracy: true }
      )
    }
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
.vehicle-marker {
  background: transparent !important;
  border: none !important;
}
/* Ensure Leaflet map and all its panes stay below the app sidebar */
.leaflet-container,
.leaflet-control-container,
.leaflet-map-pane,
.leaflet-pane,
.leaflet-overlay-pane,
.leaflet-tile-pane,
.leaflet-shadow-pane,
.leaflet-marker-pane,
.leaflet-popup-pane,
.leaflet-control {
  z-index: 0 !important;
}
/* Allow sidebar and menus to receive pointer events above the map */
.admin-sidebar,
.app-sidebar,
.fixed-sidebar {
  z-index: 9999 !important;
  position: relative;
}
</style>
