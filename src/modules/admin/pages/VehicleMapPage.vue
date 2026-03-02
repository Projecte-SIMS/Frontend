<template>
  <div class="fixed inset-0 lg:left-72 z-0 overflow-hidden font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <div class="absolute inset-0 top-16 lg:top-0">
      <div ref="mapContainer" class="absolute inset-0 z-0 border-0 outline-none"></div>
    </div>

    <!-- UI Overlay Layer -->
    <div class="absolute inset-0 pointer-events-none z-10 p-4 sm:p-6 flex flex-col">
      
      <!-- Top Area: Search & Stats -->
      <div class="flex flex-col lg:flex-row items-start justify-between gap-4 pointer-events-auto w-full">
        <!-- Search Bar -->
        <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div class="relative w-full sm:w-80 group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500">
              <MagnifyingGlassIcon class="size-4" />
            </div>
            <input 
              v-model="search" 
              type="text" 
              placeholder="Buscar vehículo..." 
              class="block w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-0 shadow-2xl shadow-gray-900/5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none ring-1 ring-gray-900/5 dark:ring-white/10"
            />
          </div>
          <button @click="refresh" class="p-2.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl text-gray-600 dark:text-gray-300 shadow-lg ring-1 ring-gray-900/5 hover:bg-white active:scale-95 transition-all">
            <ArrowPathIcon class="size-5" :class="{'animate-spin': isRefreshing}" />
          </button>
        </div>

        <!-- Fleet Stats Header -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar max-w-full">
          <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 shrink-0">
            <div class="size-2 rounded-full bg-green-500"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">{{ stats.available }} Libres</span>
          </div>
          <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 shrink-0">
            <div class="size-2 rounded-full bg-amber-500"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">{{ stats.reserved }} Reservados</span>
          </div>
          <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 shrink-0 border-2 border-red-500/20">
            <div class="size-2 rounded-full bg-red-500 animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">{{ stats.running }} En ruta</span>
          </div>
          <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-red-600 text-white shadow-lg shrink-0" v-if="fleetAlerts.length > 0">
            <ExclamationTriangleIcon class="size-4" />
            <span class="text-[10px] font-black uppercase tracking-widest">{{ fleetAlerts.length }} Alertas</span>
          </div>
        </div>
      </div>

      <!-- Center Area -->
      <div class="flex-1 relative mt-4">
        <!-- Fleet Management Side Panel -->
        <div class="absolute top-0 right-0 bottom-0 w-full max-w-sm pointer-events-auto flex flex-col gap-4">
          <div class="flex-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800 flex flex-col overflow-hidden">
            <div class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h2 class="text-xs font-black text-indigo-500 uppercase tracking-[0.2em]">Gestión de Flota</h2>
            </div>

            <!-- Vehicle List with Health Indicators -->
            <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <div 
                v-for="v in filteredVehicles" 
                :key="v.id"
                @click="onVehicleClick(v)"
                :class="[selectedVehicle?.id === v.id ? 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
                class="w-full flex flex-col p-3 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all cursor-pointer group"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div :class="[v.mongo_active ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400']" class="size-9 rounded-xl flex items-center justify-center shrink-0">
                      <TruckIcon class="size-5" />
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-xs font-black text-gray-900 dark:text-white truncate">{{ v.plate }}</p>
                        <Battery50Icon v-if="(v.battery_voltage || 12.6) < 11.8" class="size-3 text-red-500" title="Batería Baja" />
                        <FireIcon v-if="(v.engine_temp || 0) > 100" class="size-3 text-red-500 animate-bounce" title="Sobrecalentamiento" />
                      </div>
                      <p class="text-[10px] text-gray-400 font-bold uppercase truncate">{{ v.brand }} {{ v.model }}</p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span :class="getStatusClasses(v.status)" class="text-[9px] font-black uppercase tracking-widest">
                      {{ translateStatus(v.status) }}
                    </span>
                  </div>
                </div>
                
                <!-- Advanced Admin Controls -->
                <div v-if="selectedVehicle?.id === v.id" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-fade-in">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="bg-gray-50 dark:bg-gray-950 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Telemetría</p>
                      <p class="text-[10px] font-bold">{{ v.speed?.toFixed(0) }} km/h · {{ v.rpm }} rpm</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-950 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Sistema</p>
                      <p class="text-[10px] font-bold" :class="v.online ? 'text-blue-500' : 'text-red-500'">{{ v.online ? 'Online' : 'Offline' }}</p>
                    </div>
                  </div>

                  <!-- Admin Command Suite -->
                  <div class="grid grid-cols-2 gap-2">
                    <button @click.stop="sendCommand(v, 'on')" :disabled="!v.online || commandLoading === v.device_id" class="flex items-center justify-center gap-2 py-2 rounded-xl bg-green-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-green-700 active:scale-95 disabled:opacity-50">
                      <PlayIcon class="size-3" /> Encender
                    </button>
                    <button @click.stop="sendCommand(v, 'off')" :disabled="!v.online || commandLoading === v.device_id" class="flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-700 active:scale-95 disabled:opacity-50">
                      <PowerIcon class="size-3" /> Apagar
                    </button>
                    <button @click.stop="sendCommand(v, 'reboot')" :disabled="!v.online || commandLoading === v.device_id" class="col-span-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-black active:scale-95 disabled:opacity-50 border border-white/10">
                      <ArrowPathIcon class="size-3" /> Reiniciar Raspberry Pi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Command Audit Log (Quick View) -->
          <div class="h-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800 flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/30 dark:bg-indigo-900/10">
              <h3 class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Últimos Comandos</h3>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <div v-for="log in commandLogs" :key="log.id" class="text-[9px] font-bold border-b border-gray-50 dark:border-gray-800 pb-2 flex justify-between items-center">
                <span class="text-gray-500">{{ log.user?.name || 'Admin' }} sent <span class="text-indigo-500 uppercase">{{ log.action }}</span> to {{ log.device_id }}</span>
                <span class="text-[8px] opacity-40">{{ formatTime(log.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="translate-y-full" enter-to-class="translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="translate-y-0" leave-to-class="translate-y-full">
      <div v-if="toast.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
        <div :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'" class="px-6 py-3 rounded-2xl shadow-2xl text-white flex items-center gap-3 border border-white/10">
          <CheckCircleIcon v-if="toast.type === 'success'" class="size-5" />
          <XCircleIcon v-else class="size-5" />
          <span class="text-xs font-black uppercase tracking-widest">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, reactive, watch } from 'vue'
import { useMap } from '@/modules/map/composables/useMap'
import apiClient from '@/services/api'
import {
  MagnifyingGlassIcon, ArrowPathIcon, TruckIcon, CpuChipIcon, FireIcon, PlayIcon, PowerIcon,
  XMarkIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, Battery50Icon
} from '@heroicons/vue/24/outline'
import L from 'leaflet'

const { mapContainer, markers, map, initMap, fetchVehicles, centerOnVehicle, destroyMap, setSearchQuery, selectedVehicle, rawVehicles } = useMap()

const search = ref('')
const isRefreshing = ref(false)
const commandLoading = ref<string | null>(null)
const commandLogs = ref<any[]>([])
let geofence: L.Circle | null = null

const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.message = message; toast.type = type; toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const stats = computed(() => ({
  available: rawVehicles.value.filter(v => v.status === 'available').length,
  reserved: rawVehicles.value.filter(v => v.status === 'reserved').length,
  running: rawVehicles.value.filter(v => v.status === 'running').length,
}))

const fleetAlerts = computed(() => rawVehicles.value.filter(v => (v.engine_temp || 0) > 100 || (v.battery_voltage || 12.6) < 11.8))

const filteredVehicles = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? rawVehicles.value.filter(v => v.plate.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)) : rawVehicles.value
})

watch(search, (v) => setSearchQuery(v))

const getStatusClasses = (s: string) => {
  const map: any = { running: 'text-red-500', reserved: 'text-amber-500', available: 'text-green-500' }
  return map[s] || 'text-gray-400'
}

const translateStatus = (s: string) => {
  const map: any = { running: 'En ruta', reserved: 'Reservado', available: 'Libre' }
  return map[s] || s
}

const formatTime = (d: string) => new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

const loadLogs = async () => {
  try {
    const res = await apiClient.get('/iot/logs')
    commandLogs.value = res.data.data || []
  } catch (e) {}
}

const sendCommand = async (vehicle: any, action: string) => {
  if (!vehicle.device_id) return
  commandLoading.value = vehicle.device_id
  try {
    const res = await apiClient.post(`/admin/iot/devices/${vehicle.device_id}/command`, { action, relay: 0 })
    showToast(`Comando ${action.toUpperCase()} enviado con éxito`, 'success')
    loadLogs()
    setTimeout(() => fetchVehicles('/admin/vehicles/map'), 1000)
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al enviar comando', 'error')
  } finally {
    commandLoading.value = null
  }
}

const onVehicleClick = (v: any) => { selectedVehicle.value = v; centerOnVehicle(v) }

const refresh = async () => {
  isRefreshing.value = true
  try {
    await fetchVehicles('/admin/vehicles/map')
    await loadLogs()
  } finally { isRefreshing.value = false }
}

let logsInterval: any = null

onMounted(async () => {
  initMap()
  if (map.value) {
    // Geofencing: Ciudad ficticia (Ej. centro de Barcelona con radio de 5km)
    geofence = L.circle([41.3851, 2.1734], { radius: 5000, color: '#4f46e5', fillOpacity: 0.05, dashArray: '10, 10' }).addTo(map.value as any)
  }
  await refresh()
  logsInterval = setInterval(loadLogs, 5000)
})

onUnmounted(() => { 
  destroyMap() 
  if (logsInterval) clearInterval(logsInterval)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
:deep(.leaflet-container) { z-index: 0 !important; }

/* Custom Vehicle Markers Styles */
:deep(.custom-vehicle-marker) { position: relative; display: flex; flex-direction: column; align-items: center; }
:deep(.marker-pin) { width: 32px; height: 32px; border-radius: 50% 50% 50% 0; background: var(--marker-color); position: absolute; transform: rotate(-45deg); left: 50%; top: 50%; margin: -24px 0 0 -16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; transition: all 0.2s ease; }
:deep(.marker-pin svg) { transform: rotate(45deg); width: 18px; height: 18px; }
:deep(.marker-label) { position: absolute; top: 12px; background: white; color: #1e293b; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; white-space: nowrap; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; pointer-events: none; opacity: 0; transform: translateY(5px); transition: all 0.2s ease; }
:deep(.custom-vehicle-marker:hover .marker-label) { opacity: 1; transform: translateY(0); }
:deep(.marker-pulse-red .marker-pin) { animation: pulse-red 2s infinite; }
@keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
:deep(.custom-cluster) { width: 40px; height: 40px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 50%; border: 3px solid white; color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.5); }
:deep(.cluster-icon-parent) { background: transparent !important; border: none !important; }
</style>
