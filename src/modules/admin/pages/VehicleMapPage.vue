<template>
  <div class="h-full">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Map</h1>
      <p class="text-gray-600 dark:text-gray-400">Real-time fleet location and control</p>
    </div>
    
    <!-- Map -->
    <div ref="mapContainer" class="w-full h-[500px] lg:ml-0 lg:pl-0 rounded-lg shadow-lg z-0" style="height: 60vh;"></div>
    <div class="map-legend absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 text-sm p-2 rounded shadow">
      <div class="flex items-center justify-between mb-1">
        <div class="font-semibold">Legend</div>
        <button @click="legendOpen = !legendOpen" class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{{ legendOpen ? 'Hide' : 'Show' }}</button>
      </div>
      <div v-if="legendOpen">
        <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff"></span><span>Available</span></div>
        <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff"></span><span>Occupied</span></div>
        <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#ffffff;display:inline-block;border:3px solid #ef4444"></span><span>Running</span></div>
        <div class="flex items-center gap-2 mt-1"><span style="width:12px;height:12px;border-radius:50%;background:#3b82f6;display:inline-block;border:2px solid #ffffff"></span><span>Online (IoT)</span></div>
      </div>
    </div>
    
    <!-- Vehicles list as responsive cards -->
    <div class="mt-4">
      <div class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="vehicle in vehicles" :key="vehicle.id" class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow hover:shadow-lg transition-shadow flex flex-col justify-between">
          <div @click="centerOnVehicle(vehicle)" class="cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white truncate">{{ vehicle.plate }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ vehicle.brand }} {{ vehicle.model }}</p>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="vehicle.postgres_active ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">{{ vehicle.postgres_active ? 'Occupied' : 'Available' }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full" :class="vehicle.mongo_active ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'">{{ vehicle.mongo_active ? 'Running' : 'Stopped' }}</span>
                <span v-if="vehicle.online" class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Online</span>
                <span v-else class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Offline</span>
              </div>
            </div>

            <div class="mt-2 text-xs text-gray-500 flex items-center justify-between gap-2">
              <div class="truncate">Lat: {{ vehicle.latitude?.toFixed(4) ?? '-' }}, Lng: {{ vehicle.longitude?.toFixed(4) ?? '-' }}</div>
              <div class="text-right text-xs text-gray-400">ID: {{ vehicle.id }}</div>
            </div>
            
            <!-- Telemetry data if available -->
            <div v-if="vehicle.speed || vehicle.rpm || vehicle.engine_temp" class="mt-2 text-xs text-gray-400 flex gap-3">
              <span v-if="vehicle.speed">🚗 {{ vehicle.speed?.toFixed(1) }} km/h</span>
              <span v-if="vehicle.rpm">⚙️ {{ vehicle.rpm }} RPM</span>
              <span v-if="vehicle.engine_temp">🌡️ {{ vehicle.engine_temp?.toFixed(1) }}°C</span>
            </div>
          </div>

          <!-- IoT Control Buttons -->
          <div class="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
            <div class="flex items-center gap-2">
              <button 
                v-if="vehicle.device_id && vehicle.online"
                @click.stop="turnOnVehicle(vehicle)"
                :disabled="commandLoading === vehicle.device_id"
                class="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <span v-if="commandLoading === vehicle.device_id">⏳</span>
                <span v-else>🔛</span> Encender
              </button>
              <button 
                v-if="vehicle.device_id && vehicle.online"
                @click.stop="turnOffVehicle(vehicle)"
                :disabled="commandLoading === vehicle.device_id"
                class="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <span v-if="commandLoading === vehicle.device_id">⏳</span>
                <span v-else>🔴</span> Apagar
              </button>
              <span v-if="!vehicle.device_id" class="text-xs text-gray-400">Sin IoT</span>
              <span v-else-if="!vehicle.online" class="text-xs text-gray-400">Dispositivo offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast notification -->
    <div v-if="toastMessage" class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in" :class="toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useMap } from '@/modules/map/composables/useMap'
import iotService from '@/services/iotService'

const { mapContainer, vehicles, markers, map, initMap, fetchVehicles, centerOnVehicle, destroyMap, setSearchQuery, setShowOperativeOnly, setUserLocation, setRadiusMeters, rawVehicles } = useMap()

const query = ref('')
const operativeOnly = ref(false)
const radiusKm = ref<number | null>(null)
const full = ref(false)
const legendOpen = ref(false)

// IoT control state
const commandLoading = ref<string | null>(null)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const turnOnVehicle = async (vehicle: any) => {
  if (!vehicle.device_id) return
  commandLoading.value = vehicle.device_id
  try {
    const result = await iotService.turnOn(vehicle.device_id)
    if (result.success) {
      showToast(`✓ Comando enviado: Encender ${vehicle.plate}`, 'success')
      // Refresh data after command
      setTimeout(() => fetchVehicles('/admin/vehicles/map'), 1000)
    } else {
      showToast(`✗ Error: ${result.error}`, 'error')
    }
  } catch (error) {
    showToast('✗ Error al enviar comando', 'error')
  } finally {
    commandLoading.value = null
  }
}

const turnOffVehicle = async (vehicle: any) => {
  if (!vehicle.device_id) return
  commandLoading.value = vehicle.device_id
  try {
    const result = await iotService.turnOff(vehicle.device_id)
    if (result.success) {
      showToast(`✓ Comando enviado: Apagar ${vehicle.plate}`, 'success')
      // Refresh data after command
      setTimeout(() => fetchVehicles('/admin/vehicles/map'), 1000)
    } else {
      showToast(`✗ Error: ${result.error}`, 'error')
    }
  } catch (error) {
    showToast('✗ Error al enviar comando', 'error')
  } finally {
    commandLoading.value = null
  }
}

const onSearch = () => setSearchQuery(query.value)
const onToggleOperative = () => setShowOperativeOnly(operativeOnly.value)
const onRadiusChange = () => setRadiusMeters(radiusKm.value ? radiusKm.value * 1000 : null)

const refresh = () => fetchVehicles('/admin/vehicles/map')

onMounted(() => {
  initMap()
  fetchVehicles('/admin/vehicles/map').catch(err => console.error(err))
})

onUnmounted(() => {
  destroyMap()
})
</script>

<style>
.vehicle-marker {
  background: transparent !important;
  border: none !important;
}
.leaflet-container,
.leaflet-control-container,
.leaflet-map-pane,
.leaflet-pane,
.leaflet-overlay-pane,
.leaflet-tile-pane,
.leaflet-shadow-pane {
  z-index: 0 !important;
}
.map-legend { z-index: 10001; }
.admin-sidebar,
.app-sidebar,
.fixed-sidebar {
  z-index: 9999 !important;
  position: relative;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
