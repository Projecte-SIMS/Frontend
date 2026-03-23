<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading
      v-if="vehicle"
      :title="`${vehicle.brand} ${vehicle.model} - Control Remoto`"
      :description="`Gestiona el vehículo ${vehicle.license_plate} mediante comandos IoT.`"
    >
      <template #actions>
        <router-link
          to="/admin/vehicles"
          class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Volver a la lista</span>
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loading"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Estableciendo enlace remoto...</p>
    </div>

    <div v-else-if="vehicle" class="space-y-8">
      <div
        :class="{
          'bg-rose-500 dark:bg-rose-700': !deviceOnline,
          'bg-emerald-500 dark:bg-emerald-700': deviceOnline
        }"
        class="rounded-2xl p-4 text-white flex items-center justify-between shadow-lg"
      >
        <div class="flex items-center gap-4">
          <svg
            v-if="!deviceOnline"
            class="w-6 h-6 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p class="text-sm font-bold uppercase tracking-wide">
            {{ deviceOnline ? 'Enlace IoT Activo' : 'Enlace IoT Desconectado' }}
          </p>
        </div>
        <button
          @click="refreshData"
          class="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all"
        >
          <svg
            class="w-4 h-4"
            :class="{ 'animate-spin': refreshing }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          <span>Actualizar</span>
        </button>
      </div>

      <div
        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Comandos Remotos</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            @click="sendCommand('start')"
            :disabled="!deviceOnline || commandLoading"
            class="flex flex-col items-center justify-center p-6 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800/50 hover:bg-green-100 dark:hover:bg-green-800/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg
              v-if="commandLoading"
              class="w-6 h-6 animate-spin mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <svg
              v-else
              class="w-6 h-6 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span class="text-xs font-bold uppercase">Encender Motor</span>
          </button>

          <button
            @click="sendCommand('stop')"
            :disabled="!deviceOnline || commandLoading"
            class="flex flex-col items-center justify-center p-6 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-800/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg
              v-if="commandLoading"
              class="w-6 h-6 animate-spin mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <svg
              v-else
              class="w-6 h-6 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="text-xs font-bold uppercase">Apagar Motor</span>
          </button>

          <button
            @click="sendCommand('reboot')"
            :disabled="!deviceOnline || commandLoading"
            class="flex flex-col items-center justify-center p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-800/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg
              v-if="commandLoading"
              class="w-6 h-6 animate-spin mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <svg
              v-else
              class="w-6 h-6 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <span class="text-xs font-bold uppercase">Reiniciar Sistema</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8"
        >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Métricas en Tiempo Real</h3>
          <div class="grid grid-cols-2 gap-6">
            <div
              v-for="m in displayMetrics"
              :key="m.label"
              class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50"
            >
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ m.label }}</p>
              <p
                class="text-xl font-bold mt-1"
                :class="m.alert ? 'text-red-500' : 'text-gray-900 dark:text-white'"
              >
                {{ m.value }}
                <span class="text-sm font-normal text-slate-500 dark:text-slate-400">{{ m.unit }}</span>
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8"
        >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ubicación en Vivo</h3>
          <div ref="mapContainer" class="w-full h-80 rounded-xl"></div>
          <p class="text-sm text-gray-700 dark:text-gray-200 mt-4">
          Latitud: {{ telemetry.latitude.toFixed(6) }}, Longitud: {{ telemetry.longitude.toFixed(6) }}
          </p>
        </div>
      </div>
    </div>

  <div v-else class="text-center py-8">
    <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">Vehículo no encontrado</h2>
    <p class="mt-2 text-sm text-gray-500">No se pudo cargar el vehículo solicitado.</p>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useVehicles } from '../composables/useVehicles'
import iotService from '@/services/iotService'
import { useToast } from '@/modules/common/composables/useToast'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const route = useRoute()
const { getVehicle } = useVehicles()
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

const displayMetrics = computed(() => [
  { label: 'Velocidad', value: telemetry.speed.toFixed(0), unit: 'km/h', alert: false },
  { label: 'RPM', value: telemetry.rpm, unit: 'RPM', alert: false },
  { label: 'Temperatura del Motor', value: telemetry.engine_temp.toFixed(1), unit: '°C', alert: telemetry.engine_temp > 100 },
  { label: 'Batería', value: telemetry.battery_voltage.toFixed(1), unit: 'V', alert: telemetry.battery_voltage < 11.8 }
])

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const marker = ref<L.Marker | null>(null)

const refreshData = async () => {
  if (!vehicle.value?.iot_device_id) return
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
    toastError('Error al actualizar los datos del dispositivo.')
  } finally {
    refreshing.value = false
  }
}

const updateMarker = () => {
  if (!map.value || telemetry.latitude === 0) return

  const pos: L.LatLngTuple = [telemetry.latitude, telemetry.longitude]

  if (!marker.value) {
    const icon = L.divIcon({
      html: `<div class="size-10 bg-indigo-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white ring-4 ring-indigo-500/20"><svg class="size-5" fill="white" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg></div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })
    marker.value = L.marker(pos, { icon }).addTo(map.value)
    map.value.setView(pos, 16)
  } else {
    marker.value.setLatLng(pos)
    map.value.panTo(pos)
  }
}

const sendCommand = async (action: 'start' | 'stop' | 'reboot') => {
  if (!vehicle.value?.iot_device_id) return

  commandLoading.value = true
  try {
    const res = await iotService.sendCommand(vehicle.value.iot_device_id, action)
    if (res.success) {
      success('Comando enviado correctamente.')
    } else {
      toastError(res.error || 'No se pudo ejecutar el comando.')
    }
  } catch (e) {
    toastError('Error al conectar con el servidor de comandos.')
  } finally {
    commandLoading.value = false
  }
}

const initMap = async () => {
  await nextTick()
  if (!mapContainer.value || map.value) return

  map.value = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false
  }).setView([0, 0], 2)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(
    map.value
  )

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
    toastError('Error al cargar los detalles del vehículo.')
  }
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
  if (map.value) map.value.remove()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
