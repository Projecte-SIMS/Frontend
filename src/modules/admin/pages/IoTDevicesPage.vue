<template>
  <div class="space-y-8 animate-fade-in px-4 sm:px-6 lg:px-8">
    <!-- Header Refinado -->
    <PageHeading
      title="Gestión de Hardware IoT"
      description="Aprovisionamiento de nodos, vinculación de unidades y monitoreo de telemetría"
    >
      <template #actions>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">GATEWAY:</span>
              <span v-if="microserviceOnline" class="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                <span class="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                ONLINE
              </span>
              <span v-else class="flex items-center gap-1.5 text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase">
                <span class="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.5)]"></span>
                ERROR
              </span>
            </div>
          </div>
          <button 
            @click="refresh" 
            class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50 shadow-sm"
            title="Sincronizar Dispositivos"
          >
            <ArrowPathIcon class="size-5" :class="{'animate-spin': loading}" />
          </button>
        </div>
      </template>
    </PageHeading>

    <!-- Sección de Aprovisionamiento con Título Mejorado -->
    <section>
      <div class="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
        <div class="flex items-center gap-3">
          <span class="material-icons text-indigo-500 text-2xl">add_moderator</span>
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Nodos Pendientes de Asignación</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Dispositivos detectados en la red que necesitan ser vinculados a un vehículo de la flota.</p>
          </div>
        </div>
      </div>
      
      <div v-if="loading && unlinkedDevices.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="h-56 rounded-2xl bg-slate-50 dark:bg-slate-900/50 animate-pulse border border-slate-100 dark:border-slate-800"></div>
      </div>
      
      <div v-else-if="unlinkedDevices.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 mb-4">
          <CheckBadgeIcon class="size-8" />
        </div>
        <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Infraestructura Sincronizada</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">No hay nodos pendientes de aprovisionamiento.</p>
      </div>
      
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="device in unlinkedDevices" :key="device.id" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="size-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                  <CpuChipIcon class="size-6" />
                </div>
                <div>
                  <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ device.name }}</h3>
                  <p class="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {{ device.id.substring(0, 8) }}...</p>
                </div>
              </div>
              <span class="size-2 rounded-full mt-1.5" :class="device.online ? 'bg-emerald-500' : 'bg-slate-300'"></span>
            </div>
          </div>
          
          <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <FormField label="ASIGNAR A VEHÍCULO">
               <select v-model="selectedVehicle[device.id]" class="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer">
                <option :value="null">Seleccionar Matrícula...</option>
                <option v-for="v in availableVehicles" :key="v.id" :value="v.id">{{ v.license_plate }} · {{ v.brand }} {{ v.model }}</option>
              </select>
            </FormField>
            
            <button @click="linkDevice(device.id)" :disabled="!selectedVehicle[device.id] || linkingDevice === device.id" class="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
              <span v-if="linkingDevice === device.id" class="flex items-center justify-center gap-2"><span class="material-icons text-sm animate-spin">autorenew</span> VINCULANDO...</span>
              <span v-else class="flex items-center justify-center gap-2"><LinkIcon class="size-4" /> Vincular Dispositivo</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Inventario Global con Título Mejorado -->
    <section>
      <div class="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
        <h2 class="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Directorio de Dispositivos</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Listado completo de todos los nodos de hardware registrados en el sistema.</p>
      </div>

      <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th class="px-6 py-5">Nodo Hardware</th>
                <th class="px-6 py-5 text-center">Estado</th>
                <th class="px-6 py-5">Unidad Vinculada</th>
                <th class="px-6 py-5">Última Telemetría</th>
                <th class="px-6 py-5 text-right">Localización</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="device in allDevices" :key="device.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4"><div class="flex items-center gap-4"><div class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"><CpuChipIcon class="size-5 text-slate-500" /></div><div><p class="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{{ device.name }}</p><p class="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{{ device.id.substring(0,12) }}</p></div></div></td>
                <td class="px-6 py-4 text-center"><span :class="device.online ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border">{{ device.online ? 'Online' : 'Offline' }}</span></td>
                <td class="px-6 py-4"><div class="flex items-center gap-2" v-if="!isUnlinked(device)"><TruckIcon class="size-4 text-slate-400" /><span class="font-mono font-bold text-sm text-slate-700 dark:text-slate-300 tracking-wider">{{ device.license_plate }}</span></div><div class="flex items-center gap-2" v-else><ExclamationTriangleIcon class="size-4 text-amber-500" /><span class="text-xs font-bold text-amber-600 dark:text-amber-500 italic uppercase">Pendiente</span></div></td>
                <td class="px-6 py-4"><div v-if="device.telemetry" class="flex items-center gap-4 text-xs font-bold"><div class="flex items-center gap-1.5 text-slate-500" title="Velocidad"><BoltIcon class="size-4" /><span>{{ device.telemetry.speed?.toFixed(0) || 0 }} km/h</span></div><div class="flex items-center gap-1.5" :class="(device.telemetry.battery_voltage || 12.6) < 12 ? 'text-rose-500' : 'text-slate-500'" title="Batería"><Battery50Icon class="size-4" /><span>{{ device.telemetry.battery_voltage?.toFixed(1) || 'N/A' }}V</span></div></div><span v-else class="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">Sin Datos</span></td>
                <td class="px-6 py-4 text-right"><div v-if="device.telemetry?.latitude" class="flex items-center justify-end gap-2 text-xs text-slate-500 font-medium"><MapPinIcon class="size-4 text-slate-400" /><span>{{ device.telemetry.latitude.toFixed(2) }}, {{ device.telemetry.longitude.toFixed(2) }}</span></div><span v-else class="text-[10px] font-black text-slate-300 dark:text-slate-700">-</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Toast -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="translate-y-full opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-full opacity-0">
      <div v-if="toast.show" class="fixed bottom-6 right-6 z-[100]">
        <div :class="toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'" class="px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
          <div :class="toast.type === 'success' ? 'bg-emerald-500' : 'bg-white/20'" class="p-1.5 rounded-full">
            <CheckIcon v-if="toast.type === 'success'" class="size-4" />
            <XMarkIcon v-else class="size-4" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{{ toast.type === 'success' ? 'Operación Exitosa' : 'Error de Sistema' }}</p>
            <p class="text-sm font-bold">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import FormField from '@/modules/admin/components/FormField.vue'
import iotService, { type IoTDevice, type Vehicle } from '@/services/iotService'
import {
  ArrowPathIcon, ExclamationTriangleIcon, CheckBadgeIcon, LinkIcon,
  CpuChipIcon, BoltIcon, Battery50Icon, MapPinIcon, TruckIcon, CheckIcon, XMarkIcon
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const microserviceOnline = ref(false)
const unlinkedDevices = ref<IoTDevice[]>([])
const availableVehicles = ref<Vehicle[]>([])
const allDevices = ref<IoTDevice[]>([])
const selectedVehicle = reactive<Record<string, number | null>>({})
const linkingDevice = ref<string | null>(null)

const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3500)
}

const isUnlinked = (device: IoTDevice) => device.license_plate?.startsWith('AUTO-')

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
    
    allDevices.value = devices.sort((a, b) => (isUnlinked(a) ? -1 : 1))
    unlinkedDevices.value = unlinked
    availableVehicles.value = vehicles
    
    unlinked.forEach(d => {
      if (!(d.id in selectedVehicle)) {
        selectedVehicle[d.id] = null
      }
    })
  } catch (error) {
    showToast('Error de conexión con el gateway IoT', 'error')
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
      showToast('Dispositivo vinculado con éxito', 'success')
      await refresh()
    } else {
      showToast(result.error || 'Error desconocido', 'error')
    }
  } catch (error) {
    showToast('Fallo en la comunicación con el nodo', 'error')
  } finally {
    linkingDevice.value = null
  }
}

onMounted(refresh)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
