<template>
  <!-- EMPTY STATE: No hay reserva activa -->
  <div class="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center" v-if="!activeBooking && !loading">
    <div class="size-24 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 text-gray-400">
      <TruckIcon class="size-12" />
    </div>
    <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{{ t('active_trip.empty_title') }}</h2>
    <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">{{ t('active_trip.empty_subtitle') }}</p>
    <router-link to="/vehicles/map" class="px-8 py-4 bg-brand-primary-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-brand-primary-700 transition-all shadow-xl shadow-brand-primary-500/20 active:scale-95">
      {{ t('active_trip.explore_map') }}
    </router-link>
  </div>

  <!-- DASHBOARD: Vehículo Activo -->
  <div v-else-if="activeBooking" class="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12 px-4 sm:px-6">
    
    <!-- HEADER: Información General y Estado -->
    <header class="bg-white dark:bg-gray-900 rounded-[2rem] p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-5 w-full md:w-auto">
        <div class="size-16 rounded-2xl bg-brand-primary-50 dark:bg-brand-primary-900/20 flex items-center justify-center shrink-0 border border-brand-primary-100 dark:border-brand-primary-800/50">
          <TruckIcon class="size-8 text-brand-primary-600 dark:text-brand-primary-400" />
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <span class="size-1 rounded-full bg-green-500 animate-pulse"></span> {{ activeBooking.telemetry?.online ? t('active_trip.connected') : t('active_trip.no_signal') }}
            </span>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ activeBooking.vehicle?.license_plate }}</span>
          </div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white leading-none">
            {{ activeBooking.vehicle?.brand }} <span class="text-brand-primary-600 dark:text-brand-primary-400">{{ activeBooking.vehicle?.model }}</span>
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-8 w-full md:w-auto justify-around md:justify-end border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-6 md:pt-0 md:pl-8">
        <div class="text-center">
           <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ t('active_trip.travel_time') }}</p>
          <div class="text-2xl font-black text-gray-900 dark:text-white font-mono leading-none">{{ tripDuration }}</div>
        </div>
        <div class="text-center">
           <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ t('active_trip.estimated_cost') }}</p>
          <div class="text-2xl font-black text-green-600 dark:text-green-400 font-mono leading-none">{{ estimatedCost }}€</div>
        </div>
      </div>
    </header>

    <!-- ALERTA DE SEGURIDAD -->
    <div v-if="hasSafetyAlert" class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/50 p-4 rounded-3xl flex items-center gap-4 animate-pulse">
      <ExclamationTriangleIcon class="size-8 text-red-600 dark:text-red-400" />
      <div>
        <p class="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-0.5">{{ t('active_trip.safety_alert_title') }}</p>
        <p class="text-sm font-bold text-gray-700 dark:text-red-200">{{ safetyAlertMessage }}</p>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- COLUMNA IZQUIERDA: Telemetría / Salud del vehículo -->
      <aside class="lg:col-span-3 space-y-4 order-2 lg:order-1">
        <h3 class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] px-2 mb-2">{{ t('active_trip.vehicle_status') }}</h3>
        
        <!-- Tarjeta de Velocidad -->
        <div class="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm group">
          <div class="flex justify-between items-start mb-4">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ t('active_trip.speed') }}</span>
            <div class="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
              <span class="material-icons text-lg">speed</span>
            </div>
          </div>
          <div class="flex items-baseline gap-1 mb-2">
            <span class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ activeBooking.telemetry?.speed?.toFixed(0) || 0 }}</span>
            <span class="text-xs font-bold text-gray-400 uppercase">km/h</span>
          </div>
          <p class="text-[9px] text-gray-400 font-medium uppercase tracking-tight">{{ t('active_trip.current_speed_hint') }}</p>
        </div>

        <!-- Tarjeta de Batería -->
        <div class="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm" :class="{'border-amber-200 dark:border-amber-800': isLowBattery}">
          <div class="flex justify-between items-start mb-4">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ t('active_trip.battery') }}</span>
            <div class="size-8 rounded-xl flex items-center justify-center" :class="isLowBattery ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600' : 'bg-green-50 dark:bg-green-900/20 text-green-500'">
              <span class="material-icons text-lg">{{ isLowBattery ? 'battery_alert' : 'battery_full' }}</span>
            </div>
          </div>
          <div class="flex items-baseline gap-1 mb-2">
            <span class="text-3xl font-black text-gray-900 dark:text-white leading-none" :class="{'text-amber-600 dark:text-amber-400': isLowBattery}">
              {{ activeBooking.telemetry?.battery_voltage?.toFixed(1) || 12.6 }}
            </span>
            <span class="text-xs font-bold text-gray-400 uppercase">V</span>
          </div>
          <p class="text-[9px] text-gray-400 font-medium uppercase tracking-tight">{{ t('active_trip.battery_voltage_hint') }}</p>
          <div class="mt-4 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
            <div class="h-full transition-all duration-1000" :class="isLowBattery ? 'bg-amber-500' : 'bg-green-500'" style="width: 85%"></div>
          </div>
        </div>

        <!-- Tarjeta de Temperatura -->
        <div class="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm" :class="{'border-red-200 dark:border-red-800': isOverheating}">
          <div class="flex justify-between items-start mb-4">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ t('active_trip.temperature') }}</span>
            <div class="size-8 rounded-xl flex items-center justify-center" :class="isOverheating ? 'bg-red-100 dark:bg-red-900/40 text-red-600' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'">
              <span class="material-icons text-lg">thermostat</span>
            </div>
          </div>
          <div class="flex items-baseline gap-1 mb-2">
            <span class="text-3xl font-black text-gray-900 dark:text-white leading-none" :class="{'text-red-600 dark:text-red-400': isOverheating}">
              {{ activeBooking.telemetry?.engine_temp?.toFixed(1) || 0 }}
            </span>
            <span class="text-xs font-bold text-gray-400 uppercase">°C</span>
          </div>
          <p class="text-[9px] text-gray-400 font-medium uppercase tracking-tight">{{ t('active_trip.engine_temp_hint') }}</p>
        </div>
      </aside>

      <!-- COLUMNA CENTRAL: Visualización y Controles Principales -->
      <main class="lg:col-span-6 space-y-6 order-1 lg:order-2">
        <!-- Visualización del coche -->
        <div class="bg-white dark:bg-gray-900 rounded-[3rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
          <!-- Background decoration -->
          <div class="absolute inset-0 bg-gradient-to-b from-brand-primary-500/5 to-transparent pointer-events-none"></div>
          
          <img 
            :src="getVehicleImage(activeBooking.vehicle?.brand, activeBooking.vehicle?.model)" 
            class="relative z-10 max-w-[85%] sm:max-w-[70%] drop-shadow-[0_25px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105" 
            :alt="t('active_trip.vehicle_view_alt')"
          />
          
          <!-- Shadow reflection -->
          <div class="absolute bottom-16 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-gray-900/10 dark:bg-black/40 blur-xl rounded-full"></div>
        </div>

        <!-- Botones de Encendido/Apagado -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            @click="handleEngineCommand('on')"
            :disabled="commandLoading || !activeBooking.telemetry?.online"
            class="relative overflow-hidden group bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 active:scale-95 disabled:opacity-50"
          >
            <div class="size-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800">
              <PlayIcon v-if="!commandLoading" class="size-8" />
              <ArrowPathIcon v-else class="size-8 animate-spin" />
            </div>
            <div class="text-center">
              <span class="block text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{{ t('active_trip.start_engine') }}</span>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{{ t('active_trip.start_engine_hint') }}</span>
            </div>
          </button>

          <button 
            @click="handleEngineCommand('off')"
            :disabled="commandLoading || !activeBooking.telemetry?.online"
            class="relative overflow-hidden group bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10 active:scale-95 disabled:opacity-50"
          >
            <div class="size-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
              <PowerIcon v-if="!commandLoading" class="size-8" />
              <ArrowPathIcon v-else class="size-8 animate-spin" />
            </div>
            <div class="text-center">
              <span class="block text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{{ t('active_trip.stop_engine') }}</span>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{{ t('active_trip.stop_engine_hint') }}</span>
            </div>
          </button>
        </div>
      </main>

      <!-- COLUMNA DERECHA: GPS y Finalización -->
      <aside class="lg:col-span-3 space-y-6 order-3">
        <!-- Mapa de Seguimiento -->
        <div class="bg-white dark:bg-gray-900 rounded-[2.5rem] p-3 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-[350px]">
          <div class="px-3 py-2 flex justify-between items-center mb-1">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ t('active_trip.gps_location') }}</span>
            <button @click="recenterMap" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <MapPinIcon class="size-4 text-brand-primary-600" />
            </button>
          </div>
          <div 
            ref="miniMapContainer" 
            class="flex-1 rounded-[1.5rem] overflow-hidden bg-gray-100 dark:bg-gray-800 z-0"
          ></div>
        </div>

        <!-- Acción Final: Terminar Viaje -->
        <div class="bg-brand-primary-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-brand-primary-500/30 group">
          <div class="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
          
          <h4 class="text-xl font-black uppercase tracking-tight mb-2 relative z-10">{{ t('active_trip.arrived_title') }}</h4>
          <p class="text-xs text-brand-primary-100 opacity-80 mb-8 leading-relaxed relative z-10">{{ t('active_trip.arrived_subtitle') }}</p>
          
          <button 
            @click="isConfirmFinishOpen = true"
            class="w-full py-4 bg-white text-brand-primary-600 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:bg-brand-primary-50 active:scale-95 relative z-10"
          >
            {{ t('active_trip.finish_trip') }}
          </button>
        </div>
      </aside>
    </div>

    <!-- Modals -->
    <FinishTripConfirmModal 
      :is-open="isConfirmFinishOpen"
      :vehicle="activeBooking.vehicle"
      :loading="isFinishing"
      @close="isConfirmFinishOpen = false"
      @confirm="handleFinish"
    />

    <TripSummaryModal 
      :is-open="isSummaryOpen"
      :summary-data="tripSummary"
      @close="closeSummary"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useBookingsUser from '../composables/useBookingsUser'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import FinishTripConfirmModal from '@/modules/common/components/FinishTripConfirmModal.vue'
import TripSummaryModal from '@/modules/common/components/TripSummaryModal.vue'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import {
  TruckIcon,
  PlayIcon,
  PowerIcon,
  ArrowPathIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const { t } = useI18n()
const { bookings, loading, getBookings } = useBookingsUser()
const commandLoading = ref(false)
const isFinishing = ref(false)
const isConfirmFinishOpen = ref(false)
const isSummaryOpen = ref(false)
const tripSummary = ref<any>({})
const now = ref(new Date())

// Mini Map Refs
const miniMapContainer = ref<HTMLElement | null>(null)
const miniMap = ref<L.Map | null>(null)
const vehicleMarker = ref<L.Marker | null>(null)
const routeLine = ref<L.Polyline | null>(null)
const routePoints = ref<L.LatLngExpression[]>([])

const activeBooking = computed(() => 
  bookings.value.find(b => b.status === 'active')
)

// Safety Computeds
const isOverheating = computed(() => (activeBooking.value?.telemetry?.engine_temp || 0) > 100)
const isLowBattery = computed(() => (activeBooking.value?.telemetry?.battery_voltage || 12.6) < 11.5)
const hasSafetyAlert = computed(() => isOverheating.value || isLowBattery.value)
const safetyAlertMessage = computed(() => {
  if (isOverheating.value) return t('active_trip.safety_alert_overheat')
  if (isLowBattery.value) return t('active_trip.safety_alert_battery')
  return ''
})

const tripDuration = computed(() => {
  if (!activeBooking.value?.trip?.engine_started_at) return '00:00:00'
  const start = new Date(activeBooking.value.trip.engine_started_at).getTime()
  const diff = Math.max(0, now.value.getTime() - start)
  const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const estimatedCost = computed(() => {
  if (!activeBooking.value?.trip?.engine_started_at) return '0.00'
  const start = new Date(activeBooking.value.trip.engine_started_at).getTime()
  const mins = (now.value.getTime() - start) / 60000
  const price = activeBooking.value.vehicle?.price_per_minute || 0.15
  return (Math.max(1, mins) * price).toFixed(2)
})

// Map Management
const initMiniMap = async () => {
  await nextTick()
  if (!miniMapContainer.value || !activeBooking.value || activeBooking.value.latitude === null || activeBooking.value.latitude === undefined) return
  if (miniMap.value) return

  miniMap.value = L.map(miniMapContainer.value, { zoomControl: false, attributionControl: false })
    .setView([activeBooking.value.latitude as number, activeBooking.value.longitude as number], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap.value as any)

  const icon = L.divIcon({
    html: `<div class="size-6 bg-brand-primary-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white"><span class="material-icons text-xs">navigation</span></div>`,
    className: '', iconSize: [24, 24], iconAnchor: [12, 12]
  })

  const startPos = [activeBooking.value.latitude, activeBooking.value.longitude] as L.LatLngTuple
  routePoints.value = [startPos]
  
  routeLine.value = L.polyline(routePoints.value, { 
    color: '#6366f1', 
    weight: 4, 
    opacity: 0.6,
    lineJoin: 'round'
  }).addTo(miniMap.value as any)

  L.circleMarker(startPos, {
    radius: 3,
    color: '#10b981',
    fillColor: '#10b981',
    fillOpacity: 1
  }).addTo(miniMap.value as any)

  vehicleMarker.value = L.marker(startPos, { icon }).addTo(miniMap.value as any)

  setTimeout(() => {
    miniMap.value?.invalidateSize()
  }, 200)
}

const updateMapPosition = () => {
  if (miniMap.value && activeBooking.value && vehicleMarker.value && routeLine.value) {
    const lat = Number(activeBooking.value.latitude)
    const lng = Number(activeBooking.value.longitude)
    if (isNaN(lat) || isNaN(lng)) return

    const latlng: L.LatLngTuple = [lat, lng]
    
    const lastPoint = routePoints.value[routePoints.value.length - 1] as any
    if (lastPoint && (lastPoint[0] !== lat || lastPoint[1] !== lng)) {
      routePoints.value.push(latlng)
      routeLine.value.setLatLngs(routePoints.value)
      
      vehicleMarker.value.setLatLng(latlng)
      miniMap.value.panTo(latlng, { animate: true })
    }
  } else if (!miniMap.value && activeBooking.value) {
    initMiniMap()
  }
}

const recenterMap = () => {
  if (miniMap.value && activeBooking.value) {
    miniMap.value.setView([activeBooking.value.latitude as number, activeBooking.value.longitude as number], 17)
  }
}

// Actions
const handleEngineCommand = async (action: 'on' | 'off') => {
  if (!activeBooking.value) return
  commandLoading.value = true
  try {
    await apiClient.post(`/reservations/${activeBooking.value.id}/${action}`)
    showToast(t('active_trip.command_sent', { action: action === 'on' ? t('active_trip.command_start') : t('active_trip.command_stop') }), 'success')
  } catch (e: any) {
    showToast(t('active_trip.command_error'), 'error')
  } finally {
    commandLoading.value = false
  }
}

const handleFinish = async () => {
  if (!activeBooking.value) return
  isFinishing.value = true
  try {
    const res = await apiClient.post(`/reservations/${activeBooking.value.id}/finish`)
    tripSummary.value = res.data
    isConfirmFinishOpen.value = false
    isSummaryOpen.value = true
  } catch (e: any) {
    showToast(t('active_trip.finish_error'), 'error')
  } finally {
    isFinishing.value = false
  }
}

const closeSummary = () => {
  isSummaryOpen.value = false
  router.push('/bookings')
}

let timerInterval: any = null; let pollInterval: any = null

onMounted(() => {
  getBookings().then(() => initMiniMap())
  timerInterval = setInterval(() => { now.value = new Date() }, 1000)
  pollInterval = setInterval(() => { getBookings() }, 3000)
})

watch(() => [activeBooking.value?.latitude, activeBooking.value?.longitude], () => {
  updateMapPosition()
}, { deep: true })

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (pollInterval) clearInterval(pollInterval)
  if (miniMap.value) miniMap.value.remove()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

/* Estilos personalizados para Leaflet en modo oscuro si es necesario */
.dark .leaflet-tile {
  filter: brightness(0.7) contrast(1.2) saturate(0.8) hue-rotate(10deg) invert(0.9);
}
</style>
