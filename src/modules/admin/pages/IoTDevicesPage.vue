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
        <span v-if="microserviceOnline" class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          <CheckCircleIcon class="size-3" />
          Online
        </span>
        <span v-else class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
          <XCircleIcon class="size-3" />
          Offline
        </span>
      </div>
      <button @click="refresh" class="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-700 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-600">
        <ArrowPathIcon class="size-4" :class="{'animate-spin': loading}" />
        Actualizar
      </button>
    </div>

    <!-- Dispositivos no vinculados -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <ExclamationTriangleIcon class="size-5 text-yellow-500" />
        Dispositivos pendientes de vincular
      </h2>
      
      <div v-if="loading && unlinkedDevices.length === 0" class="text-gray-500 flex items-center gap-2">
        <ArrowPathIcon class="size-4 animate-spin" />
        Cargando...
      </div>
      
      <div v-else-if="unlinkedDevices.length === 0" class="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/30">
        <CheckBadgeIcon class="size-5" />
        Todos los dispositivos están vinculados
      </div>
      
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="device in unlinkedDevices" 
          :key="device.id"
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 border-yellow-400/50 flex flex-col justify-between"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-mono text-xs text-gray-400 mb-0.5">{{ device.id }}</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ device.name }}</p>
              <p class="text-sm font-medium text-yellow-600 dark:text-yellow-500">{{ device.license_plate }}</p>
            </div>
            <span :class="device.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'" class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full">
              <span :class="device.online ? 'bg-green-500' : 'bg-gray-400'" class="size-1.5 rounded-full"></span>
              {{ device.online ? 'Online' : 'Offline' }}
            </span>
          </div>
          
          <!-- Selector de vehículo -->
          <div class="mt-3">
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Vincular a vehículo:</label>
            <select 
              v-model="selectedVehicle[device.id]"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
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
            class="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-lg shadow-indigo-500/20"
          >
            <ArrowPathIcon v-if="linkingDevice === device.id" class="size-4 animate-spin" />
            <LinkIcon v-else class="size-4" />
            {{ linkingDevice === device.id ? 'Vinculando...' : 'Vincular dispositivo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Todos los dispositivos -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CpuChipIcon class="size-5 text-indigo-500" />
          Todos los dispositivos
          <span class="ml-1 text-sm font-normal text-gray-500">({{ allDevices.length }})</span>
        </h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50/50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Dispositivo</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Matrícula</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Ubicación</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Telemetría</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="device in allDevices" :key="device.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
              <td class="px-6 py-4">
                <span :class="device.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'" class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  <span :class="device.online ? 'bg-green-500' : 'bg-gray-400'" class="size-1.5 rounded-full"></span>
                  {{ device.online ? 'Online' : 'Offline' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900 dark:text-white">{{ device.name }}</p>
                <p class="text-[10px] text-gray-400 font-mono tracking-tighter">{{ device.id }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span :class="isUnlinked(device) ? 'text-amber-600 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg' : 'text-gray-900 dark:text-white font-medium'">
                    {{ device.license_plate }}
                  </span>
                  <ExclamationTriangleIcon v-if="isUnlinked(device)" class="size-4 text-amber-500" title="Sin vincular" />
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                <div v-if="device.telemetry?.latitude && device.telemetry?.longitude" class="flex items-center gap-1">
                  <MapPinIcon class="size-3.5 text-gray-400" />
                  {{ device.telemetry.latitude.toFixed(4) }}, {{ device.telemetry.longitude.toFixed(4) }}
                </div>
                <span v-else class="text-gray-300 dark:text-gray-600">-</span>
              </td>
              <td class="px-6 py-4">
                <div v-if="device.telemetry" class="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-1" title="Velocidad">
                    <BoltIcon class="size-3.5 text-amber-500" />
                    <span>{{ device.telemetry.speed?.toFixed(1) || 0 }} <span class="text-[10px] text-gray-400">km/h</span></span>
                  </div>
                  <div class="flex items-center gap-1" title="RPM">
                    <Cog6ToothIcon class="size-3.5 text-indigo-500" />
                    <span>{{ device.telemetry.rpm || 0 }} <span class="text-[10px] text-gray-400">RPM</span></span>
                  </div>
                  <div class="flex items-center gap-1" title="Batería">
                    <Battery50Icon class="size-3.5" :class="device.telemetry.battery_voltage < 12 ? 'text-red-500' : 'text-green-500'" />
                    <span>{{ device.telemetry.battery_voltage?.toFixed(1) || 0 }}<span class="text-[10px] text-gray-400">V</span></span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Toast -->
    <div 
      v-if="toast.show" 
      class="fixed bottom-4 right-4 px-4 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in flex items-center gap-3 border border-white/10"
      :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
      <CheckCircleIcon v-if="toast.type === 'success'" class="size-5" />
      <XCircleIcon v-else class="size-5" />
      <span class="font-semibold text-sm">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import iotService, { type IoTDevice, type Vehicle } from '@/services/iotService'
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  LinkIcon,
  CpuChipIcon,
  BoltIcon,
  Cog6ToothIcon,
  Battery50Icon,
  MapPinIcon
} from '@heroicons/vue/24/outline'

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
      showToast(`Dispositivo vinculado a ${result.license_plate}`, 'success')
      await refresh()
    } else {
      showToast(`${result.error}`, 'error')
    }
  } catch (error) {
    showToast('Error al vincular dispositivo', 'error')
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
