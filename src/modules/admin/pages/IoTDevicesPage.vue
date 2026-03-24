<template>
  <div class="space-y-8 animate-fade-in px-4 sm:px-6 lg:px-8 pb-20">
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

    <!-- Alerta de Dispositivos Huérfanos -->
    <div v-if="orphanDevices.length > 0" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-4 animate-bounce-subtle">
      <div class="size-10 rounded-xl bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
        <ExclamationTriangleIcon class="size-6" />
      </div>
      <div class="flex-1">
        <p class="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest">Inconsistencia de Datos Detectada</p>
        <p class="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-tight">Hay {{ orphanDevices.length }} dispositivos vinculados a vehículos que ya no existen en el sistema.</p>
      </div>
      <button @click="scrollToOrphans" class="px-4 py-2 bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
        Ver Críticos
      </button>
    </div>

    <!-- Sección de Aprovisionamiento -->
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
            
            <div class="flex gap-2">
              <button 
                @click="linkDevice(device.id)" 
                :disabled="!selectedVehicle[device.id] || linkingDevice === device.id" 
                class="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200"
              >
                <span v-if="linkingDevice === device.id" class="flex items-center justify-center gap-2">VINCULANDO...</span>
                <span v-else class="flex items-center justify-center gap-2"><LinkIcon class="size-4" /> Vincular</span>
              </button>
              <button 
                @click="openCreateVehicleModal(device)"
                class="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-[10px] font-black uppercase tracking-widest"
                title="Crear Nuevo Vehículo"
              >
                <PlusIcon class="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Inventario Global -->
    <section id="orphans-section">
      <div class="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Directorio de Dispositivos</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Listado completo de todos los nodos de hardware registrados en el sistema.</p>
        </div>
      </div>

      <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th class="px-6 py-5">Nodo Hardware</th>
                <th class="px-6 py-5 text-center">Estado</th>
                <th class="px-6 py-5">Unidad Vinculada</th>
                <th class="px-6 py-5">Telemetría</th>
                <th class="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="device in allDevices" :key="device.id" :class="{'bg-amber-50/30 dark:bg-amber-900/10': device.is_orphan}" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                      <CpuChipIcon class="size-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div>
                      <p class="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{{ device.name }}</p>
                      <p class="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{{ device.id.substring(0,12) }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span :class="device.online ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border">
                    {{ device.online ? 'En línea' : 'Sin conexión' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="device.is_orphan" class="flex flex-col gap-1">
                    <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <ExclamationTriangleIcon class="size-4" />
                      <span class="text-xs font-black uppercase tracking-tight">HUÉRFANO ({{ device.license_plate }})</span>
                    </div>
                    <p class="text-[9px] text-slate-400 font-bold uppercase">Vehículo eliminado de SQL</p>
                  </div>
                  <div v-else-if="!isUnlinked(device)" class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <TruckIcon class="size-4 text-slate-400" />
                      <span class="font-mono font-bold text-sm text-slate-700 dark:text-slate-300 tracking-wider">{{ device.license_plate }}</span>
                    </div>
                    <p class="text-[9px] text-indigo-500 font-bold uppercase tracking-widest">{{ device.vehicle_name }}</p>
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <div class="size-1.5 rounded-full bg-slate-300"></div>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Asignado</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="device.telemetry" class="flex items-center gap-4 text-xs font-bold">
                    <div class="flex items-center gap-1.5 text-slate-500" title="Velocidad">
                      <BoltIcon class="size-4" />
                      <span>{{ device.telemetry.speed?.toFixed(0) || 0 }} km/h</span>
                    </div>
                    <div class="flex items-center gap-1.5" :class="(device.telemetry.battery_voltage || 12.6) < 12 ? 'text-rose-500' : 'text-slate-500'" title="Batería">
                      <Battery50Icon class="size-4" />
                      <span>{{ device.telemetry.battery_voltage?.toFixed(1) || 'N/A' }}V</span>
                    </div>
                  </div>
                  <span v-else class="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">Sin Datos</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      v-if="!isUnlinked(device) || device.is_orphan" 
                      @click="unlinkDevice(device.id)"
                      class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                      title="Desvincular"
                    >
                      <LinkIcon class="size-4" />
                    </button>
                    <button 
                      @click="confirmDeleteDevice(device)"
                      class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      title="Eliminar Dispositivo"
                    >
                      <TrashIcon class="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Modal: Crear Vehículo y Vincular -->
    <Transition name="modal">
      <div v-if="showCreateModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Nuevo Vehículo IoT</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium uppercase tracking-widest">Registrar unidad y vincular dispositivo <span class="text-indigo-600 font-black">#{{ selectedDeviceId?.substring(0,8) }}</span></p>
          
          <form @submit.prevent="handleCreateAndLink" class="space-y-4">
            <FormField label="Matrícula">
              <input v-model="createForm.license_plate" type="text" placeholder="Ej: 1234ABC" class="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold uppercase" required />
            </FormField>
            
            <div class="grid grid-cols-2 gap-4">
              <FormField label="Marca">
                <input v-model="createForm.brand" type="text" placeholder="Ej: Tesla" class="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold uppercase" required />
              </FormField>
              <FormField label="Modelo">
                <input v-model="createForm.model" type="text" placeholder="Ej: Model 3" class="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold uppercase" required />
              </FormField>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" @click="showCreateModal = false" class="flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all">Cancelar</button>
              <button type="submit" :disabled="creating" class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50">
                {{ creating ? 'PROCESANDO...' : 'CREAR Y VINCULAR' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal: Confirmar Eliminación Hardware -->
    <Transition name="modal">
      <div v-if="showDeleteDialog" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
          <div class="size-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center mb-6">
            <TrashIcon class="size-8" />
          </div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Eliminar Hardware</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">¿Estás seguro de eliminar el dispositivo <span class="font-black text-slate-900 dark:text-white">{{ deviceToDelete?.name }}</span>? Se perderá toda la telemetría histórica asociada.</p>
          <div class="flex gap-3">
            <button @click="showDeleteDialog = false" class="flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all">Cancelar</button>
            <button @click="handleDelete" class="flex-1 px-4 py-3 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 active:scale-95">Eliminar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toasts (Usando el sistema global del frontend) -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import FormField from '@/modules/admin/components/FormField.vue'
import iotService, { type IoTDevice, type Vehicle } from '@/services/iotService'
import useToast from '@/modules/common/composables/useToast'
import {
  ArrowPathIcon, ExclamationTriangleIcon, CheckBadgeIcon, LinkIcon,
  CpuChipIcon, BoltIcon, Battery50Icon, MapPinIcon, TruckIcon, PlusIcon, TrashIcon
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const microserviceOnline = ref(false)
const unlinkedDevices = ref<IoTDevice[]>([])
const availableVehicles = ref<Vehicle[]>([])
const allDevices = ref<IoTDevice[]>([])
const selectedVehicle = reactive<Record<string, number | null>>({})
const linkingDevice = ref<string | null>(null)
const creating = ref(false)

const showToast = (msg: string, type: 'success' | 'error' = 'success') => useToast(msg, type)

// Filtros y cálculos
const orphanDevices = computed(() => allDevices.value.filter(d => d.is_orphan))

const isUnlinked = (device: IoTDevice) => device.license_plate?.startsWith('AUTO-')

// Modales
const showCreateModal = ref(false)
const selectedDeviceId = ref<string | null>(null)
const createForm = reactive({ license_plate: '', brand: '', model: '' })

const showDeleteDialog = ref(false)
const deviceToDelete = ref<IoTDevice | null>(null)

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
    
    allDevices.value = devices.sort((a, b) => {
      // Priorizar huérfanos, luego desvinculados
      if (a.is_orphan && !b.is_orphan) return -1
      if (!a.is_orphan && b.is_orphan) return 1
      if (isUnlinked(a) && !isUnlinked(b)) return -1
      if (!isUnlinked(a) && isUnlinked(b)) return 1
      return 0
    })
    
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

const unlinkDevice = async (deviceId: string) => {
  if (!confirm('¿Desvincular este dispositivo del vehículo? El vehículo quedará sin telemetría.')) return
  
  try {
    const result = await iotService.unlinkDevice(deviceId)
    if (result.success) {
      showToast('Dispositivo desvinculado correctamente', 'success')
      await refresh()
    } else {
      showToast('Error al desvincular', 'error')
    }
  } catch (error) {
    showToast('Fallo en el servidor', 'error')
  }
}

const confirmDeleteDevice = (device: IoTDevice) => {
  deviceToDelete.value = device
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!deviceToDelete.value) return
  try {
    const success = await iotService.deleteDevice(deviceToDelete.value.id)
    if (success) {
      showToast('Dispositivo eliminado', 'success')
      showDeleteDialog.value = false
      await refresh()
    } else {
      showToast('No se pudo eliminar el dispositivo', 'error')
    }
  } catch {
    showToast('Error de conexión', 'error')
  }
}

const openCreateVehicleModal = (device: IoTDevice) => {
  selectedDeviceId.value = device.id
  createForm.license_plate = ''
  createForm.brand = ''
  createForm.model = ''
  showCreateModal.value = true
}

const handleCreateAndLink = async () => {
  if (!selectedDeviceId.value) return
  creating.value = true
  try {
    const result = await iotService.createVehicleAndLink(selectedDeviceId.value, createForm)
    if (result.success) {
      showToast('Vehículo creado y vinculado con éxito', 'success')
      showCreateModal.value = false
      await refresh()
    } else {
      showToast(result.error || 'Error al procesar', 'error')
    }
  } catch {
    showToast('Error crítico en la operación', 'error')
  } finally {
    creating.value = false
  }
}

const scrollToOrphans = () => {
  const el = document.getElementById('orphans-section')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(refresh)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-bounce-subtle {
  animation: bounceSubtle 2s infinite;
}
@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
