<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
    <div class="text-center">
      <ArrowPathIcon class="size-12 animate-spin text-indigo-600 mx-auto mb-4" />
      <p class="text-gray-500 font-medium">Cargando panel de control...</p>
    </div>
  </div>

  <div v-else-if="vehicle" class="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 font-sans">
    <!-- Header with Breadcrumbs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <nav class="flex mb-2" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400">
            <li><router-link to="/admin/vehicles" class="hover:text-indigo-600">Vehículos</router-link></li>
            <li><ChevronRightIcon class="size-3" /></li>
            <li class="text-gray-600">{{ vehicle.license_plate }}</li>
            <li><ChevronRightIcon class="size-3" /></li>
            <li class="text-indigo-600">Control Remoto</li>
          </ol>
        </nav>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Consola de Mando: {{ vehicle.brand }} {{ vehicle.model }}
        </h1>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="deviceOnline" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest border border-green-200">
          <span class="size-2 rounded-full bg-green-500 animate-pulse"></span>
          Sistema Online
        </span>
        <span v-else class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 text-red-700 text-xs font-black uppercase tracking-widest border border-red-200">
          <span class="size-2 rounded-full bg-red-500"></span>
          Sistema Offline
        </span>
        <button @click="refreshData" class="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 transition-all">
          <ArrowPathIcon class="size-5 text-gray-500" :class="{'animate-spin': refreshing}" />
        </button>
      </div>
    </div>

    <!-- Alert for Offline -->
    <div v-if="!deviceOnline" class="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 flex items-start gap-4">
      <div class="p-3 rounded-2xl bg-amber-100 text-amber-600">
        <ExclamationTriangleIcon class="size-6" />
      </div>
      <div>
        <h3 class="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Sin conexión con la unidad</h3>
        <p class="text-sm text-amber-700">El dispositivo IoT no responde. Los comandos remotos y la telemetría en tiempo real no están disponibles en este momento.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Controls & Telemetry -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Controls Grid -->
        <div class="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 text-center">Acciones de Administrador</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div class="text-center space-y-4">
              <button 
                @click="sendEngineCommand('on')"
                :disabled="!deviceOnline || commandLoading"
                class="group relative mx-auto size-32 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border-4 border-emerald-100 dark:border-emerald-800/30 transition-all active:scale-95 hover:bg-emerald-100 disabled:opacity-50 disabled:grayscale"
              >
                <PlayIcon class="size-12 text-emerald-600" />
                <div v-if="commandLoading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-[2.5rem]">
                  <ArrowPathIcon class="size-8 animate-spin text-emerald-600" />
                </div>
              </button>
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Arrancar Motor</p>
            </div>

            <div class="text-center space-y-4">
              <button 
                @click="sendEngineCommand('off')"
                :disabled="!deviceOnline || commandLoading"
                class="group relative mx-auto size-32 rounded-[2.5rem] bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center border-4 border-rose-100 dark:border-rose-800/30 transition-all active:scale-95 hover:bg-rose-100 disabled:opacity-50 disabled:grayscale"
              >
                <PowerIcon class="size-12 text-rose-600" />
                <div v-if="commandLoading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-[2.5rem]">
                  <ArrowPathIcon class="size-8 animate-spin text-rose-600" />
                </div>
              </button>
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Apagar Motor</p>
            </div>

            <div class="text-center space-y-4">
              <button 
                @click="sendEngineCommand('reboot')"
                :disabled="!deviceOnline || commandLoading"
                class="group relative mx-auto size-32 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border-4 border-indigo-100 dark:border-indigo-800/30 transition-all active:scale-95 hover:bg-indigo-100 disabled:opacity-50 disabled:grayscale"
              >
                <ArrowPathIcon class="size-12 text-indigo-600" />
                <div v-if="commandLoading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded-[2.5rem]">
                  <ArrowPathIcon class="size-8 animate-spin text-indigo-600" />
                </div>
              </button>
              <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">Reiniciar IoT</p>
            </div>
          </div>
        </div>

        <!-- Telemetry Data -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Velocidad</p>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ telemetry.speed.toFixed(0) }}</span>
              <span class="text-[10px] font-black text-gray-400 uppercase">km/h</span>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Revoluciones</p>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ telemetry.rpm }}</span>
              <span class="text-[10px] font-black text-gray-400 uppercase">RPM</span>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm" :class="{'bg-red-50 dark:bg-red-900/20 border-red-100': telemetry.engine_temp > 100}">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Temp. Motor</p>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black leading-none" :class="telemetry.engine_temp > 100 ? 'text-red-600' : 'text-gray-900 dark:text-white'">{{ telemetry.engine_temp.toFixed(1) }}</span>
              <span class="text-[10px] font-black text-gray-400 uppercase">°C</span>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm" :class="{'bg-amber-50 dark:bg-amber-900/20 border-amber-100': telemetry.battery_voltage < 11.8}">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Voltaje Bat.</p>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black leading-none" :class="telemetry.battery_voltage < 11.8 ? 'text-amber-600' : 'text-gray-900 dark:text-white'">{{ telemetry.battery_voltage.toFixed(1) }}</span>
              <span class="text-[10px] font-black text-gray-400 uppercase">V</span>
            </div>
          </div>
        </div>

        <!-- Raw Data Inspector -->
        <div class="bg-gray-900 rounded-[2rem] p-6 text-indigo-300 font-mono text-xs overflow-hidden">
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <span class="uppercase tracking-widest font-black text-[9px] text-gray-500">Stream de Telemetría RAW</span>
            <span class="flex items-center gap-2">
              <span class="size-1.5 rounded-full bg-indigo-500 animate-ping"></span>
              Live
            </span>
          </div>
          <div class="space-y-1 opacity-80">
            <p v-for="(val, key) in telemetry" :key="key">
              <span class="text-indigo-500">{{ key }}:</span> {{ val }}
            </p>
            <p><span class="text-indigo-500">device_id:</span> {{ vehicle.iot_device_id }}</p>
            <p><span class="text-indigo-500">last_update:</span> {{ new Date().toISOString() }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Vehicle Info & Location -->
      <div class="space-y-8">
        <!-- Vehicle Card -->
        <div class="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div class="aspect-video rounded-3xl bg-gray-50 dark:bg-gray-800 mb-6 overflow-hidden flex items-center justify-center">
            <img 
              :src="getVehicleImage(vehicle.brand, vehicle.model)" 
              class="size-full object-cover" 
              :alt="vehicle.brand + ' ' + vehicle.model"
            />
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matrícula</span>
              <span class="text-sm font-black text-gray-900 dark:text-white font-mono">{{ vehicle.license_plate }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</span>
              <span :class="vehicle.active ? 'text-amber-600' : 'text-green-600'" class="text-xs font-black uppercase tracking-widest">
                {{ vehicle.active ? 'En Uso' : 'Disponible' }}
              </span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">IoT ID</span>
              <span class="text-[10px] font-bold text-gray-500 truncate max-w-[120px]">{{ vehicle.iot_device_id || 'No vinculado' }}</span>
            </div>
          </div>
        </div>

        <!-- Mini Map -->
        <div class="bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 border border-gray-100 dark:border-gray-800 shadow-sm h-[350px] relative overflow-hidden">
          <div 
            ref="mapContainer" 
            class="absolute inset-0 z-0 bg-gray-50 dark:bg-gray-800"
          ></div>
          <div class="absolute bottom-6 left-6 right-6 z-10">
            <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Coordenadas Actuales</p>
              <p class="text-xs font-bold text-gray-900 dark:text-white font-mono">
                {{ telemetry.latitude.toFixed(6) }}, {{ telemetry.longitude.toFixed(6) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20">
    <ExclamationCircleIcon class="size-16 text-red-500 mx-auto mb-4" />
    <h2 class="text-2xl font-black text-gray-900 uppercase">Vehículo no encontrado</h2>
    <router-link to="/admin/vehicles" class="mt-4 inline-block text-indigo-600 font-bold hover:underline">Volver al listado</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useVehicles } from '../composables/useVehicles'
import iotService from '@/services/iotService'
import { useToast } from '@/modules/common/composables/useToast'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import {
  ArrowPathIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PowerIcon,
  TruckIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const route = useRoute()
const { getVehicle, loading: vehicleLoading } = useVehicles()
const { success, error: toastError } = useToast()

const vehicle = ref<any>(null)
const loading = ref(true)
const refreshing = ref(false)
const commandLoading = ref(false)
const deviceOnline = ref(false)

const telemetry = reactive({
  speed: 0,
  rpm: 0,
  engine_temp: 0,
  battery_voltage: 12.6,
  latitude: 0,
  longitude: 0
})

// Map
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const marker = ref<L.Marker | null>(null)

const refreshData = async () => {
  if (!vehicle.value) return
  refreshing.value = true
  try {
    const status = await iotService.getDevice(vehicle.value.iot_device_id)
    if (status) {
      deviceOnline.value = status.online
      if (status.telemetry) {
        Object.assign(telemetry, status.telemetry)
        updateMarker()
      }
    }
  } catch (e) {
    console.error('Error refreshing telemetry', e)
  } finally {
    refreshing.value = false
  }
}

const updateMarker = () => {
  if (!map.value || telemetry.latitude === 0) return
  
  const pos: L.LatLngTuple = [telemetry.latitude, telemetry.longitude]
  
  if (!marker.value) {
    const icon = L.divIcon({
      html: `<div class="size-8 bg-indigo-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white"><svg class="size-4" fill="white" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg></div>`,
      className: '', iconSize: [32, 32], iconAnchor: [16, 16]
    })
    marker.value = L.marker(pos, { icon }).addTo(map.value)
    map.value.setView(pos, 16)
  } else {
    marker.value.setLatLng(pos)
    map.value.panTo(pos)
  }
}

const sendEngineCommand = async (action: 'on' | 'off' | 'reboot') => {
  if (!vehicle.value?.iot_device_id) return
  
  commandLoading.value = true
  try {
    const res = await iotService.sendCommand(vehicle.value.iot_device_id, action)
    if (res.success) {
      success(`Comando ${action.toUpperCase()} enviado con éxito`)
    } else {
      toastError(res.error || 'Error al enviar comando')
    }
  } catch (e) {
    toastError('Error crítico de comunicación')
  } finally {
    commandLoading.value = false
  }
}

const initMap = async () => {
  await nextTick()
  if (!mapContainer.value || map.value) return
  
  map.value = L.map(mapContainer.value, { zoomControl: false, attributionControl: false })
    .setView([0, 0], 2)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)
  
  updateMarker()
}

let pollInterval: any = null

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    vehicle.value = await getVehicle(id)
    loading.value = false
    
    await refreshData()
    await initMap()
    
    pollInterval = setInterval(refreshData, 5000)
  } catch (e) {
    loading.value = false
  }
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  if (map.value) map.value.remove()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
