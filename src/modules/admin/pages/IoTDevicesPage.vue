<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Dispositivos IoT</h1>
      <p class="text-gray-600 dark:text-gray-400">Vincula dispositivos Raspberry Pi a vehículos del sistema</p>
    </div>

    <!-- Estado del microservicio -->
    <div class="mb-6 flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Microservicio IoT:</span>
        <span v-if="microserviceOnline" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          ✓ Online
        </span>
        <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
          ✗ Offline
        </span>
      </div>
      <button @click="refresh" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
        🔄 Actualizar
      </button>
    </div>

    <!-- Dispositivos no vinculados -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="text-yellow-500">⚠️</span> Dispositivos pendientes de vincular
      </h2>
      
      <div v-if="loading" class="text-gray-500">Cargando...</div>
      
      <div v-else-if="unlinkedDevices.length === 0" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-400">
        ✓ Todos los dispositivos están vinculados
      </div>
      
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="device in unlinkedDevices" 
          :key="device.id"
          class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border-2 border-yellow-400"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-mono text-sm text-gray-500">{{ device.id }}</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ device.name }}</p>
              <p class="text-sm text-yellow-600">{{ device.license_plate }}</p>
            </div>
            <span :class="device.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'" class="px-2 py-1 text-xs rounded-full">
              {{ device.online ? '● Online' : '○ Offline' }}
            </span>
          </div>
          
          <!-- Selector de vehículo -->
          <div class="mt-3">
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Vincular a vehículo:</label>
            <select 
              v-model="selectedVehicle[device.id]"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option :value="null">-- Seleccionar vehículo --</option>
              <option v-for="v in availableVehicles" :key="v.id" :value="v.id">
                {{ v.license_plate }} - {{ v.brand }} {{ v.model }}
              </option>
            </select>
          </div>
          
          <button 
            @click="linkDevice(device.id)"
            :disabled="!selectedVehicle[device.id] || linkingDevice === device.id"
            class="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
          >
            <span v-if="linkingDevice === device.id">Vinculando...</span>
            <span v-else>🔗 Vincular dispositivo</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Todos los dispositivos -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        📡 Todos los dispositivos ({{ allDevices.length }})
      </h2>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Estado</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Dispositivo</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Matrícula</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Ubicación</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Telemetría</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="device in allDevices" :key="device.id" class="bg-white dark:bg-gray-800">
              <td class="px-4 py-3">
                <span :class="device.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'" class="px-2 py-1 text-xs rounded-full">
                  {{ device.online ? '● Online' : '○ Offline' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900 dark:text-white">{{ device.name }}</p>
                <p class="text-xs text-gray-500 font-mono">{{ device.id }}</p>
              </td>
              <td class="px-4 py-3">
                <span :class="isUnlinked(device) ? 'text-yellow-600 font-medium' : 'text-gray-900 dark:text-white'">
                  {{ device.license_plate }}
                </span>
                <span v-if="isUnlinked(device)" class="ml-2 text-xs text-yellow-500">(sin vincular)</span>
              </td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                <span v-if="device.telemetry?.latitude && device.telemetry?.longitude">
                  {{ device.telemetry.latitude.toFixed(4) }}, {{ device.telemetry.longitude.toFixed(4) }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-500">
                <span v-if="device.telemetry">
                  🚗 {{ device.telemetry.speed?.toFixed(1) || 0 }} km/h |
                  ⚙️ {{ device.telemetry.rpm || 0 }} RPM |
                  🔋 {{ device.telemetry.battery_voltage?.toFixed(1) || 0 }}V
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Toast -->
    <div 
      v-if="toast.show" 
      class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
      :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import iotService, { type IoTDevice, type Vehicle } from '@/services/iotService'

const loading = ref(true)
const microserviceOnline = ref(false)
const unlinkedDevices = ref<IoTDevice[]>([])
const availableVehicles = ref<Vehicle[]>([])
const allDevices = ref<IoTDevice[]>([])
const selectedVehicle = reactive<Record<string, number | null>>({})
const linkingDevice = ref<string | null>(null)

const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const isUnlinked = (device: IoTDevice) => {
  return device.license_plate?.startsWith('AUTO-')
}

const refresh = async () => {
  loading.value = true
  try {
    const health = await iotService.healthCheck()
    microserviceOnline.value = health.ok

    const [devices, unlinked, vehicles] = await Promise.all([
      iotService.getDevices(),
      iotService.getUnlinkedDevices(),
      iotService.getAvailableVehicles()
    ])
    
    allDevices.value = devices
    unlinkedDevices.value = unlinked
    availableVehicles.value = vehicles
    
    // Initialize selected vehicle state
    unlinked.forEach(d => {
      if (!(d.id in selectedVehicle)) {
        selectedVehicle[d.id] = null
      }
    })
  } catch (error) {
    console.error('Error loading IoT data:', error)
    microserviceOnline.value = false
  } finally {
    loading.value = false
  }
}

const linkDevice = async (deviceId: string) => {
  const vehicleId = selectedVehicle[deviceId]
  if (!vehicleId) return
  
  linkingDevice.value = deviceId
  try {
    const result = await iotService.linkDeviceToVehicle(deviceId, vehicleId)
    if (result.success) {
      showToast(`✓ Dispositivo vinculado a ${result.license_plate}`, 'success')
      await refresh()
    } else {
      showToast(`✗ ${result.error}`, 'error')
    }
  } catch (error) {
    showToast('✗ Error al vincular dispositivo', 'error')
  } finally {
    linkingDevice.value = null
  }
}

onMounted(() => {
  refresh()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
