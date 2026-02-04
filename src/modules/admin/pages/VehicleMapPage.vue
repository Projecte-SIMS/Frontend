<template>
  <div class="h-full">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mapa de Vehículos</h1>
      <p class="text-gray-600 dark:text-gray-400">Ubicación en tiempo real de la flota</p>
    </div>
    
    <!-- Mapa -->
    <div ref="mapContainer" class="w-full h-[600px] rounded-lg shadow-lg z-0"></div>
    
    <!-- Lista de vehículos -->
    <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
        @click="centerOnVehicle(vehicle)"
      >
        <div class="flex items-center gap-3">
          <div :class="[
            'w-3 h-3 rounded-full',
            vehicle.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
          ]"></div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">{{ vehicle.plate }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.brand }} {{ vehicle.model }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Vehicle {
  id: number
  plate: string
  brand: string
  model: string
  latitude: number
  longitude: number
  status: 'active' | 'inactive'
}

// Vehículos hardcodeados (Barcelona área)
const vehicles = ref<Vehicle[]>([
  {
    id: 1,
    plate: '1234-ABC',
    brand: 'Toyota',
    model: 'Corolla',
    latitude: 41.3851,
    longitude: 2.1734,
    status: 'active'
  },
  {
    id: 2,
    plate: '5678-DEF',
    brand: 'Ford',
    model: 'Focus',
    latitude: 41.3902,
    longitude: 2.1540,
    status: 'active'
  },
  {
    id: 3,
    plate: '9012-GHI',
    brand: 'Volkswagen',
    model: 'Golf',
    latitude: 41.3780,
    longitude: 2.1900,
    status: 'inactive'
  },
  {
    id: 4,
    plate: '3456-JKL',
    brand: 'Seat',
    model: 'León',
    latitude: 41.4000,
    longitude: 2.1600,
    status: 'active'
  },
  {
    id: 5,
    plate: '7890-MNO',
    brand: 'Renault',
    model: 'Megane',
    latitude: 41.3700,
    longitude: 2.1450,
    status: 'active'
  }
])

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
const markers: Map<number, L.Marker> = new Map()

// Icono personalizado para vehículos
const createVehicleIcon = (status: string) => {
  const color = status === 'active' ? '#22c55e' : '#9ca3af'
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
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

const initMap = () => {
  if (!mapContainer.value) return

  // Crear mapa centrado en Barcelona
  map = L.map(mapContainer.value).setView([41.3851, 2.1734], 13)

  // Añadir capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // Añadir marcadores de vehículos
  vehicles.value.forEach(vehicle => {
    const marker = L.marker([vehicle.latitude, vehicle.longitude], {
      icon: createVehicleIcon(vehicle.status)
    })
      .addTo(map!)
      .bindPopup(`
        <div class="p-2">
          <p class="font-bold">${vehicle.plate}</p>
          <p class="text-sm">${vehicle.brand} ${vehicle.model}</p>
          <p class="text-xs text-gray-500">Estado: ${vehicle.status === 'active' ? 'Activo' : 'Inactivo'}</p>
        </div>
      `)
    
    markers.set(vehicle.id, marker)
  })
}

const centerOnVehicle = (vehicle: Vehicle) => {
  if (map) {
    map.setView([vehicle.latitude, vehicle.longitude], 15)
    const marker = markers.get(vehicle.id)
    if (marker) {
      marker.openPopup()
    }
  }
}

onMounted(() => {
  initMap()
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
</style>
