<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-8 sm:p-12">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      <div class="relative">
        <h1 class="text-3xl sm:text-4xl font-black text-white mb-3">
          Gestiona tu flota <span class="text-indigo-200">en tiempo real</span>
        </h1>
        <p class="text-indigo-100 text-lg max-w-2xl mb-6">
          Visualiza, reserva y gestiona vehículos fácilmente. Experiencia moderna, rápida y segura.
        </p>
        <button 
          @click="openMap" 
          class="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-indigo-700 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Ver mapa interactivo
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Map Section -->
      <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Mapa de vehículos</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Haz clic para ver el mapa completo</p>
        </div>
        <div ref="miniMap" class="w-full h-80 cursor-pointer"></div>
      </div>

      <!-- Nearby Vehicles -->
      <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Vehículos cercanos</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Disponibles para reservar</p>
        </div>
        <div class="p-4 max-h-80 overflow-y-auto custom-scrollbar">
          <div v-if="nearbyAvailable.length === 0" class="text-center py-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">No hay vehículos disponibles cerca</p>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="v in nearbyAvailable" 
              :key="v.id" 
              class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              @click="centerOnVehicleFromList(v)"
            >
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span class="text-white font-bold text-sm">{{ v.plate.slice(-3) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 dark:text-white truncate">{{ v.brand }} {{ v.model }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ v.plate }}</div>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span 
                  class="text-xs font-bold px-2.5 py-1 rounded-full"
                  :class="v.mongo_active 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'"
                >
                  {{ v.mongo_active ? 'En uso' : 'Disponible' }}
                </span>
                <span class="text-xs text-gray-400">{{ v.distanceMeters ? v.distanceMeters.toFixed(0) : '-' }} m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">¿Por qué elegir SIMS?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-500/50 transition-colors">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 mb-4">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Gestión en tiempo real</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Visualiza y controla tu flota al instante desde cualquier dispositivo.</p>
        </div>
        <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 p-6 hover:border-green-500/50 transition-colors">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20 mb-4">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Reservas fáciles</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Reserva vehículos en segundos, sin papeleo ni complicaciones.</p>
        </div>
        <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 p-6 hover:border-amber-500/50 transition-colors">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20 mb-4">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Soporte 24/7</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Nuestro equipo está siempre disponible para ayudarte.</p>
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Opiniones de usuarios</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex items-center gap-3 mb-4">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" class="w-12 h-12 rounded-full ring-2 ring-indigo-500/20" alt="Carlos M." />
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Carlos M.</div>
              <div class="text-xs text-gray-500">Usuario verificado</div>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 italic">"Reservar un coche nunca fue tan fácil. La app es rápida y el soporte excelente."</p>
        </div>
        <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex items-center gap-3 mb-4">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" class="w-12 h-12 rounded-full ring-2 ring-indigo-500/20" alt="Lucía G." />
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Lucía G.</div>
              <div class="text-xs text-gray-500">Usuario verificado</div>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 italic">"Puedo ver todos los vehículos disponibles en tiempo real. ¡Muy recomendable!"</p>
        </div>
        <div class="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex items-center gap-3 mb-4">
            <img src="https://randomuser.me/api/portraits/men/65.jpg" class="w-12 h-12 rounded-full ring-2 ring-indigo-500/20" alt="Jordi P." />
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Jordi P.</div>
              <div class="text-xs text-gray-500">Usuario verificado</div>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 italic">"La gestión de flota para empresas es perfecta. Todo centralizado y seguro."</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMap } from '@/modules/map/composables/useMap'

const router = useRouter()
const openMap = () => router.push('/vehicles/map')

const { map, mapContainer, initMap, destroyMap, fetchVehicles, addVehicleMarkers, rawVehicles, setUserLocation } = useMap()
const miniMap = ref<HTMLElement | null>(null)
const nearbyAvailable = ref<any[]>([])
const myLocation = ref<{ lat: number; lng: number } | null>(null)

function computeDistancesAndFilter() {
  if (!myLocation.value) return
  const R = 6371000
  const toRad = (x: number) => (x * Math.PI) / 180
  nearbyAvailable.value = rawVehicles.value
    .map(v => {
      if (v.latitude == null || v.longitude == null) return null
      const dLat = toRad(v.latitude - myLocation.value!.lat)
      const dLon = toRad(v.longitude - myLocation.value!.lng)
      const lat1 = toRad(myLocation.value!.lat)
      const lat2 = toRad(v.latitude)
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const d = R * c
      return { ...v, distanceMeters: d }
    })
    .filter(Boolean)
    .filter(v => !v.mongo_active)
    .sort((a, b) => a?.distanceMeters - b?.distanceMeters)
    .slice(0, 10)
}

function centerOnVehicleFromList(vehicle: any) {
  if (map.value && vehicle.latitude && vehicle.longitude) {
    map.value.setView([vehicle.latitude, vehicle.longitude], 17)
  }
}

onMounted(async () => {
  if (!miniMap.value) return
  mapContainer.value = miniMap.value
  initMap()
  
  // Centrar en la ubicación del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        myLocation.value = { lat: latitude, lng: longitude }
        if (map.value) {
          map.value.setView([latitude, longitude], 15)
          setUserLocation(latitude, longitude)
        }
        computeDistancesAndFilter()
      },
      (error) => {
        console.warn('No se pudo obtener la ubicación:', error)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }
  
  try {
    await fetchVehicles('/vehicles/map')
    addVehicleMarkers()
    setTimeout(() => computeDistancesAndFilter(), 400)
  } catch (e) {
    console.error(e)
  }
  if (map.value) {
    map.value.on('click', () => openMap())
  }
})

onUnmounted(() => destroyMap())
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

/* Map Marker Styles */
:deep(.custom-vehicle-marker) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.marker-pin) {
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  background: var(--marker-color);
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -24px 0 0 -16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  border: 2px solid white;
  transition: all 0.2s ease;
}

:deep(.marker-pin svg) {
  transform: rotate(45deg);
  width: 18px;
  height: 18px;
}

:deep(.marker-label) {
  position: absolute;
  top: 12px;
  background: white;
  color: #1e293b;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  pointer-events: none;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.2s ease;
}

:deep(.custom-vehicle-marker:hover .marker-label) {
  opacity: 1;
  transform: translateY(0);
}

:deep(.custom-vehicle-marker:hover .marker-pin) {
  transform: rotate(-45deg) scale(1.1);
  z-index: 1000;
}

:deep(.marker-pulse-red .marker-pin) {
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

:deep(.custom-cluster) {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 50%;
  border: 3px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 14px;
  box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.5);
}

:deep(.cluster-icon-parent) {
  background: transparent !important;
  border: none !important;
}

/* Smooth marker transitions during zoom */
:deep(.leaflet-marker-icon) {
  transition: none !important;
}

:deep(.leaflet-zoom-animated) {
  will-change: transform;
}

:deep(.leaflet-marker-pane) {
  will-change: transform;
}
</style>
