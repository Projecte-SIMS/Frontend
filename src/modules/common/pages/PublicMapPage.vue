<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header simple para el mapa público -->
    <header class="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🚗</span>
        <h1 class="text-xl font-bold text-white">SIMS - Vehículos Disponibles</h1>
      </div>
      <router-link to="/login" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
        Iniciar sesión para reservar
      </router-link>
    </header>

    <!-- Mapa -->
    <div class="relative" style="height: calc(100vh - 60px);">
      <div ref="mapContainer" class="absolute inset-0"></div>
      
      <!-- Panel de información -->
      <aside class="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 p-4 rounded-xl shadow-xl w-72 backdrop-blur">
        <h2 class="font-bold text-lg mb-3 text-gray-900 dark:text-white">Vehículos disponibles</h2>
        
        <div v-if="loading" class="text-gray-500">Cargando...</div>
        
        <div v-else-if="vehicles.length === 0" class="text-gray-500">
          No hay vehículos disponibles en este momento.
        </div>
        
        <ul v-else class="space-y-2 max-h-96 overflow-y-auto">
          <li 
            v-for="v in vehicles" 
            :key="v.id"
            @click="centerOn(v)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
          >
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-green-500"></span>
              <span class="font-medium text-gray-900 dark:text-white">{{ v.plate }}</span>
            </div>
            <div class="text-sm text-gray-500">{{ v.brand }} {{ v.model }}</div>
          </li>
        </ul>
        
        <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <p class="text-xs text-gray-500">
            Para reservar un vehículo, inicia sesión o regístrate.
          </p>
        </div>
      </aside>
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
  available: boolean
}

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const vehicles = ref<Vehicle[]>([])
const loading = ref(true)
const markers = new Map<number, L.Marker>()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function fetchVehicles() {
  try {
    loading.value = true
    const response = await fetch(`${API_URL}/public/vehicles/map`)
    if (response.ok) {
      vehicles.value = await response.json()
      addMarkers()
    }
  } catch (error) {
    console.error('Error fetching vehicles:', error)
  } finally {
    loading.value = false
  }
}

function initMap() {
  if (!mapContainer.value) return

  map.value = L.map(mapContainer.value).setView([40.4168, -3.7038], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)
}

function addMarkers() {
  if (!map.value) return

  // Limpiar marcadores existentes
  markers.forEach(m => m.remove())
  markers.clear()

  vehicles.value.forEach(v => {
    if (v.latitude && v.longitude) {
      const icon = L.divIcon({
        className: 'vehicle-marker',
        html: `<div style="
          width: 30px; 
          height: 30px; 
          background: #22c55e; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        ">🚗</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })

      const marker = L.marker([v.latitude, v.longitude], { icon })
        .addTo(map.value!)
        .bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <strong>${v.plate}</strong><br>
            <span style="color: #666;">${v.brand} ${v.model}</span><br>
            <span style="color: #22c55e; font-weight: bold;">✓ Disponible</span><br>
            <a href="/login" style="color: #6366f1; text-decoration: underline;">Inicia sesión para reservar</a>
          </div>
        `)

      markers.set(v.id, marker)
    }
  })

  // Ajustar vista si hay vehículos
  if (vehicles.value.length > 0) {
    const bounds = L.latLngBounds(
      vehicles.value
        .filter(v => v.latitude && v.longitude)
        .map(v => [v.latitude, v.longitude] as [number, number])
    )
    map.value.fitBounds(bounds, { padding: [50, 50] })
  }
}

function centerOn(vehicle: Vehicle) {
  if (map.value && vehicle.latitude && vehicle.longitude) {
    map.value.setView([vehicle.latitude, vehicle.longitude], 15)
    const marker = markers.get(vehicle.id)
    if (marker) {
      marker.openPopup()
    }
  }
}

onMounted(() => {
  initMap()
  fetchVehicles()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})
</script>

<style>
.vehicle-marker {
  background: transparent !important;
  border: none !important;
}
</style>
