<template>
  <div class="max-w-4xl mx-auto space-y-8 font-sans h-full flex flex-col justify-center items-center py-12" v-if="!activeBooking && !loading">
    <div class="text-center space-y-6">
      <div class="size-24 rounded-[2.5rem] bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
        <TruckIcon class="size-12" />
      </div>
      <h2 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">No tienes ningún vehículo activo</h2>
      <p class="text-gray-500 max-w-sm mx-auto">Reserva un vehículo en el mapa y actívalo para ver los controles de mando aquí.</p>
      <router-link to="/vehicles/map" class="inline-block px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
        Ir al mapa
      </router-link>
    </div>
  </div>

  <div v-else-if="activeBooking" class="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
    <!-- Critical Alerts -->
    <div v-if="hasSafetyAlert" class="bg-red-600 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-pulse border-4 border-white/20">
      <div class="size-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
        <ExclamationTriangleIcon class="size-8" />
      </div>
      <div class="flex-1">
        <p class="font-black uppercase tracking-widest text-sm leading-none mb-1">Alerta Crítica de Seguridad</p>
        <p class="text-xs font-bold text-red-100">{{ safetyAlertMessage }}</p>
      </div>
      <div class="text-right px-4 border-l border-white/20">
        <p class="text-xs font-black uppercase tracking-widest">Estaciona de inmediato</p>
      </div>
    </div>

    <!-- Header Control -->
    <div class="relative overflow-hidden rounded-[3rem] bg-gray-900 p-8 sm:p-10 text-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/5">
      <div class="absolute -right-20 -top-20 size-64 rounded-full bg-indigo-600/20 blur-3xl"></div>
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex items-center gap-6">
          <div class="size-20 rounded-[1.5rem] bg-white/5 backdrop-blur-xl overflow-hidden border border-white/10 shadow-inner group shrink-0">
                <img :src="getVehicleImage(activeBooking.vehicle?.brand, activeBooking.vehicle?.model)" class="size-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Vehículo" />
              </div>
          <div class="text-left min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <span class="px-2 py-0.5 rounded-lg bg-green-500 text-white text-[8px] font-black uppercase tracking-widest">Activo</span>
              <span v-if="activeBooking.telemetry?.online" class="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-blue-400">
                <span class="size-1 rounded-full bg-blue-400 animate-pulse"></span> Online
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-1 truncate">{{ activeBooking.vehicle?.brand }} {{ activeBooking.vehicle?.model }}</h1>
            <p class="text-indigo-400 font-mono font-black text-sm tracking-widest uppercase">{{ activeBooking.vehicle?.license_plate }}</p>
          </div>
        </div>

        <div class="flex items-center gap-8 px-8 py-4 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
          <div class="text-center">
            <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Tiempo</p>
            <div class="text-2xl font-black font-mono tracking-tighter text-indigo-100">{{ tripDuration }}</div>
          </div>
          <div class="text-center border-l border-white/10 pl-8">
            <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Coste Estim.</p>
            <div class="text-2xl font-black font-mono tracking-tighter text-green-400">{{ estimatedCost }}€</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left: Telemetry & Controls -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Telemetry Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-900 rounded-[2rem] p-5 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 relative z-10">Velocidad</p>
            <div class="flex items-baseline gap-1 relative z-10">
              <span class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ activeBooking.telemetry?.speed?.toFixed(0) || 0 }}</span>
              <span class="text-[10px] font-black text-gray-400 uppercase">km/h</span>
            </div>
            <div class="mt-4 h-1 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden relative z-10">
              <div class="h-full bg-indigo-500 transition-all duration-1000" :style="{ width: `${Math.min((activeBooking.telemetry?.speed || 0) / 1.2, 100)}%` }"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-[2rem] p-5 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 relative z-10">Motor RPM</p>
            <div class="flex items-baseline gap-1 relative z-10">
              <span class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ activeBooking.telemetry?.rpm || 0 }}</span>
              <span class="text-[10px] font-black text-gray-400 uppercase">RPM</span>
            </div>
            <div class="mt-4 h-1 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden relative z-10">
              <div class="h-full bg-orange-500 transition-all duration-1000" :style="{ width: `${Math.min((activeBooking.telemetry?.rpm || 0) / 60, 100)}%` }"></div>
            </div>
          </div>

          <div :class="[isOverheating ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800']" class="rounded-[2rem] p-5 border shadow-sm transition-colors duration-500">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Temp. Motor</p>
            <div class="flex items-baseline gap-1">
              <span :class="[isOverheating ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white']" class="text-3xl font-black leading-none transition-colors">{{ activeBooking.telemetry?.engine_temp?.toFixed(1) || 0 }}</span>
              <span class="text-[10px] font-black text-gray-400 uppercase">°C</span>
            </div>
            <div class="mt-4 h-1 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
              <div :class="[isOverheating ? 'bg-red-600' : 'bg-red-500']" class="h-full transition-all duration-1000" :style="{ width: `${Math.min((activeBooking.telemetry?.engine_temp || 0), 100)}%` }"></div>
            </div>
          </div>

          <div :class="[isLowBattery ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800']" class="rounded-[2rem] p-5 border shadow-sm transition-colors duration-500">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Batería</p>
            <div class="flex items-baseline gap-1">
              <span :class="[isLowBattery ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white']" class="text-3xl font-black leading-none transition-colors">{{ activeBooking.telemetry?.battery_voltage?.toFixed(1) || 12.6 }}</span>
              <span class="text-[10px] font-black text-gray-400 uppercase">V</span>
            </div>
            <div class="mt-4 h-1 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
              <div :class="[isLowBattery ? 'bg-amber-500' : 'bg-green-500']" class="h-full" style="width: 95%"></div>
            </div>
          </div>
        </div>

        <!-- Controls Area -->
        <div class="bg-white dark:bg-gray-900 rounded-[3rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
          <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Mandos de Misión</h3>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24">
            <div class="text-center space-y-6 flex-1 w-full max-w-[200px]">
              <button 
                @click="handleEngineCommand('on')"
                :disabled="commandLoading || !activeBooking.telemetry?.online"
                class="group relative size-32 sm:size-40 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border-8 border-white dark:border-gray-950 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all active:scale-90 hover:border-green-500/30 disabled:opacity-50"
              >
                <div class="absolute inset-0 rounded-full bg-green-500/0 group-hover:bg-green-500/10 transition-all duration-500"></div>
                <PlayIcon v-if="!commandLoading" class="size-12 text-green-600 group-hover:scale-110 transition-transform" />
                <ArrowPathIcon v-else class="size-12 text-green-600 animate-spin" />
              </button>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Arrancar Contacto</p>
            </div>

            <div class="text-center space-y-6 flex-1 w-full max-w-[200px]">
              <button 
                @click="handleEngineCommand('off')"
                :disabled="commandLoading || !activeBooking.telemetry?.online"
                class="group relative size-32 sm:size-40 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border-8 border-white dark:border-gray-950 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all active:scale-90 hover:border-red-500/30 disabled:opacity-50"
              >
                <div class="absolute inset-0 rounded-full bg-red-500/0 group-hover:bg-red-500/10 transition-all duration-500"></div>
                <PowerIcon v-if="!commandLoading" class="size-12 text-red-600 group-hover:scale-110 transition-transform" />
                <ArrowPathIcon v-else class="size-12 text-red-600 animate-spin" />
              </button>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Cortar Encendido</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Live Map & Finish Trip -->
      <div class="space-y-8">
        <!-- Live Mini Map -->
        <div class="bg-white dark:bg-gray-900 rounded-[3rem] p-4 border border-gray-100 dark:border-gray-800 shadow-sm h-[400px] flex flex-col relative overflow-hidden group">
          <div class="px-4 py-2 flex items-center justify-between relative z-10 pointer-events-none">
            <span class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-white/80 dark:bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">Trayecto en vivo</span>
          </div>
          <div 
            ref="miniMapContainer" 
            class="absolute inset-0 z-0 bg-gray-100 dark:bg-gray-800"
            style="min-height: 400px;"
          ></div>
          
          <button @click="recenterMap" class="absolute bottom-6 right-6 z-10 size-10 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 active:scale-90 transition-all opacity-0 group-hover:opacity-100">
            <MapPinIcon class="size-5" />
          </button>
        </div>

        <!-- Finish Card -->
        <div class="bg-indigo-600 rounded-[3rem] p-8 text-white flex flex-col justify-between shadow-2xl shadow-indigo-500/30 relative overflow-hidden min-h-[200px]">
          <div class="absolute -right-10 -bottom-10 size-40 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
          <div class="relative z-10">
            <h3 class="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-4">Finalización</h3>
            <p class="text-xl font-black leading-tight tracking-tight uppercase">¿Has llegado?</p>
            <p class="text-indigo-100 text-xs mt-2 opacity-80 font-medium leading-relaxed">Termina el viaje para liberar el vehículo y procesar el pago.</p>
          </div>
          <button 
            @click="isConfirmFinishOpen = true"
            class="relative z-10 mt-8 w-full py-4 rounded-2xl bg-white text-indigo-600 font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
          >
            Terminar Viaje
          </button>
        </div>
      </div>
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
  ClockIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
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
  if (isOverheating.value) return 'TEMPERATURA DEL MOTOR CRÍTICA (>100°C).'
  if (isLowBattery.value) return 'TENSIÓN DE BATERÍA BAJA (<11.5V).'
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
    .setView([activeBooking.value.latitude, activeBooking.value.longitude], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap.value)

  const icon = L.divIcon({
    html: `<div class="size-8 bg-indigo-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white"><svg class="size-4" fill="white" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg></div>`,
    className: '', iconSize: [32, 32], iconAnchor: [16, 16]
  })

  const startPos = [activeBooking.value.latitude, activeBooking.value.longitude] as L.LatLngTuple
  routePoints.value = [startPos]
  
  // Línea de trayectoria más visible
  routeLine.value = L.polyline(routePoints.value, { 
    color: '#6366f1', 
    weight: 6, 
    opacity: 0.9,
    lineJoin: 'round',
    dashArray: '1, 10' // Efecto estético de camino
  }).addTo(miniMap.value)

  // Marcador de inicio
  L.circleMarker(startPos, {
    radius: 4,
    color: '#10b981',
    fillColor: '#10b981',
    fillOpacity: 1
  }).addTo(miniMap.value).bindPopup('Punto de partida')

  vehicleMarker.value = L.marker(startPos, { icon }).addTo(miniMap.value)

  // Forzar actualización de tamaño para evitar problemas de renderizado en contenedores dinámicos
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
      // Usar flyTo para un movimiento más suave si la distancia es grande, o panTo si es pequeña
      miniMap.value.panTo(latlng, { animate: true })
    }
  } else if (!miniMap.value && activeBooking.value) {
    // Si no hay mapa pero hay reserva activa, intentar inicializar
    initMiniMap()
  }
}

const recenterMap = () => {
  if (miniMap.value && activeBooking.value) {
    miniMap.value.setView([activeBooking.value.latitude, activeBooking.value.longitude], 17)
  }
}

// Actions
const handleEngineCommand = async (action: 'on' | 'off') => {
  if (!activeBooking.value) return
  commandLoading.value = true
  try {
    await apiClient.post(`/reservations/${activeBooking.value.id}/${action}`)
    showToast(`Comando de ${action === 'on' ? 'encendido' : 'apagado'} enviado`, 'success')
  } catch (e: any) {
    showToast('Error al enviar el comando', 'error')
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
    showToast('Error al finalizar el viaje', 'error')
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
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.no-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
