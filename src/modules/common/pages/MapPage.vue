<template>
  <!-- Full Screen Wrapper: Bloqueado debajo de la cabecera (top-16) -->
  <!-- Eliminamos lg:left-72 porque el layout de cliente NO tiene sidebar lateral fijo -->
  <div class="fixed top-16 bottom-0 left-0 right-0 z-0 overflow-hidden font-sans bg-gray-100 dark:bg-gray-950">
    <!-- Map Container -->
    <div ref="mapContainer" class="absolute inset-0 z-0"></div>

    <!-- UI Overlay Layer -->
    <div class="absolute inset-0 pointer-events-none z-10 p-4 sm:p-6 flex flex-col">
      
      <!-- Top Area: Search & Tools -->
      <div class="flex flex-col sm:flex-row items-start justify-between gap-4 pointer-events-auto w-full max-w-7xl mx-auto">
        <div class="relative w-full sm:w-80 group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            <MagnifyingGlassIcon class="size-4" />
          </div>
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar vehículo..." 
            class="block w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-0 shadow-2xl shadow-indigo-500/10 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none ring-1 ring-gray-900/5 dark:ring-white/10"
          />
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          <button @click="locateMe" class="p-2.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl text-gray-600 dark:text-gray-300 shadow-lg ring-1 ring-gray-900/5 hover:bg-white active:scale-95 transition-all" title="Mi ubicación">
            <MapPinIcon class="size-5" />
          </button>
          <button @click="refresh" class="p-2.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl text-gray-600 dark:text-gray-300 shadow-lg ring-1 ring-gray-900/5 hover:bg-white active:scale-95 transition-all" title="Actualizar">
            <ArrowPathIcon class="size-5" :class="{'animate-spin': isRefreshing}" />
          </button>
          <button @click="panelOpen = !panelOpen" :class="[panelOpen ? 'bg-indigo-600 text-white shadow-indigo-500/40' : 'bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 shadow-lg ring-1 ring-gray-900/5']" class="p-2.5 rounded-xl backdrop-blur-xl transition-all active:scale-95">
            <AdjustmentsHorizontalIcon class="size-5" />
          </button>
        </div>
      </div>

      <!-- Center / Flexible Area -->
      <div class="flex-1 relative mt-4">
        <!-- Panel Lateral -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="translate-x-full opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="translate-x-0 opacity-100"
          leave-to-class="translate-x-full opacity-0"
        >
          <div v-if="panelOpen" class="absolute top-0 right-0 bottom-4 w-full max-w-sm pointer-events-auto">
            <div class="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800 flex flex-col">
              <div class="px-6 pt-6 pb-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <h2 class="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">Opciones</h2>
                <button @click="panelOpen = false" class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><XMarkIcon class="size-4" /></button>
              </div>
              <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
                <section>
                  <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">Cercanos <span>{{ filteredNearby.length }}</span></h3>
                  <div v-if="filteredNearby.length === 0" class="py-6 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p class="text-[9px] text-gray-400 italic font-medium">No se encontraron vehículos</p>
                  </div>
                  <div v-else class="space-y-2">
                    <button v-for="v in filteredNearby" :key="v.id" @click="onNearbyClick(v)" class="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-indigo-500/30 hover:shadow-lg transition-all group">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <TruckIcon class="size-4 text-indigo-500 shrink-0" />
                        <div class="min-w-0">
                          <p class="text-[11px] font-bold text-gray-900 dark:text-white truncate">{{ v.plate }}</p>
                          <p class="text-[9px] text-gray-400 font-bold uppercase truncate">{{ v.brand }} {{ v.model }}</p>
                        </div>
                      </div>
                      <p class="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{{ formatDistance(v.distanceMeters) }}</p>
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Bottom Area: Selected Vehicle Card -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="translate-y-full opacity-0 scale-95"
        enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="translate-y-0 opacity-100 scale-100"
        leave-to-class="translate-y-full opacity-0 scale-95"
      >
        <div v-if="selectedVehicle" class="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-sm pointer-events-auto px-4">
          <div class="bg-gray-900 dark:bg-gray-900 rounded-[1.5rem] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative text-white">
            <button @click="selectedVehicle = null" class="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
              <XMarkIcon class="size-4" />
            </button>

            <div class="flex flex-col sm:flex-row h-full">
              <!-- Left: Image -->
              <div class="w-full sm:w-[35%] h-24 sm:h-auto bg-gray-800 relative">
                <img :src="'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'" class="size-full object-cover opacity-80" />
              </div>

              <!-- Right: Content -->
              <div class="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div class="min-w-0 mb-3 text-left">
                  <h2 class="text-sm font-black truncate tracking-tight leading-none text-white">{{ selectedVehicle.brand }} {{ selectedVehicle.model }}</h2>
                  <p class="text-indigo-400 font-mono font-black text-[9px] mt-1 uppercase leading-none">{{ selectedVehicle.plate }}</p>
                </div>

                <div class="grid grid-cols-2 gap-2 mb-4">
                  <div class="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col justify-center">
                    <p class="text-[7px] font-black text-gray-400 uppercase mb-0.5">Distancia</p>
                    <div class="flex items-center gap-1 font-black text-white text-[10px] leading-none">
                      <MapPinIcon class="size-2.5 text-indigo-400" /> {{ formatDistance(selectedVehicle.distanceMeters) }}
                    </div>
                  </div>
                  <div class="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col justify-center text-xs">
                    <span class="text-green-400 font-bold text-[10px]">0.15€</span><span class="text-[8px] text-gray-500">/min</span>
                  </div>
                </div>

                <button @click="confirmBooking" :disabled="isBooking" class="w-full py-2 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                  {{ isBooking ? 'Procesando...' : 'Reservar ahora' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMap } from '@/modules/map/composables/useMap'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ArrowPathIcon,
  XMarkIcon,
  BoltIcon,
  CalendarIcon,
  AdjustmentsHorizontalIcon,
  TruckIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { mapContainer, map, initMap, fetchVehicles, setUserLocation, destroyMap, rawVehicles, centerOnVehicle, markers, setSearchQuery } = useMap()

const search = ref('')
const selectedVehicle = ref<any | null>(null)
const isRefreshing = ref(false)
const isBooking = ref(false)
const panelOpen = ref(false)
const nearbyRadiusKm = ref(5)
const nearbyAvailable = ref<any[]>([])

watch(search, (newVal) => {
  setSearchQuery(newVal)
  computeNearbyAvailable()
})

const formatDistance = (meters?: number) => {
  if (meters == null) return '-'
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters/1000).toFixed(1)} km`
}

const filteredNearby = computed(() => {
  return nearbyAvailable.value.filter(v => !v.mongo_active)
})

const refresh = async () => {
  isRefreshing.value = true
  try {
    await fetchVehicles('/vehicles/map')
    computeNearbyAvailable()
  } finally {
    isRefreshing.value = false
  }
}

const locateMe = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords
    setUserLocation(latitude, longitude)
    map.value?.setView([latitude, longitude], 15)
    computeNearbyAvailable()
  })
}

function computeNearbyAvailable() {
  if (!map.value) return
  const center = map.value.getCenter()
  const R = 6371
  nearbyAvailable.value = rawVehicles.value
    .map(v => {
      if (v.latitude == null || v.longitude == null) return null
      const dLat = (v.latitude - center.lat) * Math.PI / 180
      const dLon = (v.longitude - center.lng) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(center.lat * Math.PI / 180) * Math.cos(v.latitude * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const d = R * c * 1000
      return { ...v, distanceMeters: d }
    })
    .filter(Boolean)
    .filter(v => v.distanceMeters <= nearbyRadiusKm.value * 1000)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, 10)
}

const onNearbyClick = (v: any) => {
  selectedVehicle.value = v
  centerOnVehicle(v)
  if (window.innerWidth < 640) panelOpen.value = false
}

const confirmBooking = async () => {
  if (!selectedVehicle.value) return
  isBooking.value = true
  try {
    const payload = { vehicle_id: selectedVehicle.value.id, scheduled_start: new Date().toISOString() }
    await apiClient.post('/reservations', payload)
    showToast('¡Vehículo reservado!', 'success')
    router.push('/bookings')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al reservar', 'error')
  } finally {
    isBooking.value = false
  }
}

watch(() => markers?.size, () => {
  markers?.forEach((marker, id) => {
    marker.off('click').on('click', () => {
      const v = rawVehicles.value.find(rv => rv.id === id)
      if (v) {
        selectedVehicle.value = v
        centerOnVehicle(v)
      }
    })
  })
}, { immediate: true })

onMounted(async () => {
  initMap()
  await fetchVehicles('/vehicles/map')
  if (route.query.select) {
    const v = rawVehicles.value.find(rv => rv.id === Number(route.query.select))
    if (v) { selectedVehicle.value = v; centerOnVehicle(v) }
  }
  locateMe()
  if (map.value) map.value.on('moveend', computeNearbyAvailable)
})

onUnmounted(() => { destroyMap() })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }

:deep(.leaflet-container) { z-index: 0 !important; border-radius: 0 !important; height: 100% !important; width: 100% !important; }
:deep(.leaflet-control-container) { z-index: 5 !important; }
:deep(.leaflet-bottom.leaflet-left) { bottom: 2rem !important; left: 1.5rem !important; }
:deep(.leaflet-bar) { border: none !important; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; border-radius: 1rem !important; overflow: hidden; }
:deep(.leaflet-bar a) { background-color: rgba(255, 255, 255, 0.9) !important; color: #4f46e5 !important; width: 36px !important; height: 36px !important; line-height: 36px !important; font-weight: bold !important; border-bottom: 1px solid #f3f4f6 !important; }
.dark :deep(.leaflet-bar a) { background-color: rgba(17, 24, 39, 0.9) !important; color: #818cf8 !important; border-bottom: 1px solid #374151 !important; }
</style>
