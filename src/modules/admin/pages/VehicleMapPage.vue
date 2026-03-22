<template>
  <div class="fixed inset-0 lg:left-72 z-0 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <!-- El contenedor del mapa ocupa todo el espacio -->
    <div class="absolute inset-0 top-16 lg:top-0">
      <div ref="mapContainer" class="absolute inset-0 z-0 border-0 outline-none"></div>
    </div>

    <!-- Capa de UI superpuesta -->
    <div class="absolute inset-0 pointer-events-none z-10 p-4 sm:p-6 flex flex-col">
      
      <!-- Área Superior: Búsqueda y Estadísticas -->
      <div class="flex flex-col lg:flex-row items-start justify-between gap-4 pointer-events-auto w-full">
        <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div class="relative w-full sm:w-80 group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-indigo-500">
              <MagnifyingGlassIcon class="size-5" />
            </div>
            <input 
              v-model="search" 
              type="text" 
              placeholder="Buscar por matrícula o modelo..." 
              class="block w-full pl-11 pr-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none uppercase tracking-wider"
            />
          </div>
          <button @click="refresh" class="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-lg hover:bg-white hover:text-indigo-600 active:scale-95 transition-all">
            <ArrowPathIcon class="size-5" :class="{'animate-spin': isRefreshing}" />
          </button>
        </div>

        <!-- Estadísticas de Flota -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar max-w-full">
          <div class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg shrink-0">
            <div class="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span class="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{{ stats.available }} Libres</span>
          </div>
          <div class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg shrink-0">
            <div class="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span class="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{{ stats.reserved }} Reservados</span>
          </div>
          <div class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg shrink-0">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span class="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{{ stats.running }} En Ruta</span>
          </div>
        </div>
      </div>

      <!-- Área Central -->
      <div class="flex-1 relative mt-4">
        <!-- Panel Lateral de Gestión -->
        <div class="absolute top-0 right-0 bottom-0 w-full max-w-sm pointer-events-auto flex flex-col gap-4">
          <div class="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div class="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Control de Flota en Vivo</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <div 
                v-for="v in filteredVehicles" 
                :key="v.id"
                @click="onVehicleClick(v)"
                :class="[selectedVehicle?.id === v.id ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50']"
                class="w-full flex flex-col p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-all cursor-pointer group"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="size-10 rounded-lg flex items-center justify-center shrink-0" :class="getStatusClasses(v.status).bg_icon">
                      <TruckIcon class="size-5" :class="getStatusClasses(v.status).text" />
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{{ v.plate }}</p>
                      </div>
                      <p class="text-xs text-slate-500 font-medium uppercase truncate">{{ v.brand }} {{ v.model }}</p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border" :class="getStatusClasses(v.status).badge">
                      {{ translateStatus(v.status) }}
                    </span>
                  </div>
                </div>
                
                <div v-if="selectedVehicle?.id === v.id" class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Telemetría</p>
                      <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ v.speed?.toFixed(0) }} km/h · {{ v.rpm }} rpm</p>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Conexión</p>
                      <p class="text-xs font-semibold" :class="v.online ? 'text-emerald-600' : 'text-rose-500'">{{ v.online ? 'ONLINE' : 'OFFLINE' }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <button @click.stop="sendCommand(v, 'on')" :disabled="!v.online || commandLoading === v.device_id" class="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition-all shadow-sm">
                      <PlayIcon class="size-3" /> Encender
                    </button>
                    <button @click.stop="sendCommand(v, 'off')" :disabled="!v.online || commandLoading === v.device_id" class="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition-all shadow-sm">
                      <PowerIcon class="size-3" /> Apagar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="translate-y-full opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-full opacity-0">
      <div v-if="toast.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
        <div :class="toast.type === 'success' ? 'bg-slate-900' : 'bg-rose-600'" class="px-6 py-3 rounded-xl shadow-2xl text-white flex items-center gap-3 border border-white/10">
          <CheckCircleIcon v-if="toast.type === 'success'" class="size-5" />
          <XCircleIcon v-else class="size-5" />
          <span class="text-xs font-bold uppercase tracking-widest">{{ toast.message }}</span>
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
  MagnifyingGlassIcon, ArrowPathIcon, TruckIcon, PlayIcon, PowerIcon,
  XCircleIcon, CheckCircleIcon
} from '@heroicons/vue/24/outline'

const { mapContainer, initMap, fetchVehicles, centerOnVehicle, destroyMap, setSearchQuery, selectedVehicle, rawVehicles } = useMap()

const search = ref('')
const isRefreshing = ref(false)
const commandLoading = ref<string | null>(null)

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

const filteredVehicles = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? rawVehicles.value.filter(v => v.plate.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)) : rawVehicles.value
})

watch(search, (v) => setSearchQuery(v))

const getStatusClasses = (s: string) => {
  const map: any = { 
    running: { badge: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400', bg_icon: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600' },
    reserved: { badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400', bg_icon: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600' },
    available: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400', bg_icon: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600' }
  }
  return map[s] || { badge: 'bg-slate-50 text-slate-600 border-slate-200', bg_icon: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500' }
}

const translateStatus = (s: string) => {
  const map: any = { running: 'En ruta', reserved: 'Reservado', available: 'Libre' }
  return map[s] || s
}

const sendCommand = async (vehicle: any, action: string) => {
  if (!vehicle.device_id) return
  commandLoading.value = vehicle.device_id
  try {
    await apiClient.post(`/admin/iot/devices/${vehicle.device_id}/command`, { action, relay: 0 })
    showToast(`Comando ${action.toUpperCase()} enviado`, 'success')
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
  } finally { isRefreshing.value = false }
}

onMounted(async () => {
  initMap()
  await refresh()
})

onUnmounted(() => { 
  destroyMap() 
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* Estilos Profesionales para el Mapa */
:deep(.leaflet-pane) { z-index: 2; }
:deep(.leaflet-top), :deep(.leaflet-bottom) { z-index: 3; pointer-events: auto; }
:deep(.leaflet-control-zoom-in), :deep(.leaflet-control-zoom-out) {
  background: white !important;
  color: #1e293b !important;
  border-radius: 0.75rem !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
}
.dark :deep(.leaflet-control-zoom-in), .dark :deep(.leaflet-control-zoom-out) {
  background: #1e293b !important;
  color: #94a3b8 !important;
  border-color: #334155 !important;
}
:deep(.leaflet-popup-content-wrapper) {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 0;
  border: none;
}
.dark :deep(.leaflet-popup-content-wrapper) {
  background: #1e293b;
}
:deep(.leaflet-popup-content) {
  margin: 0;
  padding: 1rem;
  font-family: inherit;
}
:deep(.leaflet-popup-tip) {
  background: white;
}
.dark :deep(.leaflet-popup-tip) {
  background: #1e293b;
}
:deep(.marker-pin) {
  width: 40px;
  height: 40px;
  border-radius: 50% 50% 50% 0;
  background: var(--marker-color, #4f46e5);
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -32px 0 0 -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border: 3px solid white;
  transition: all 0.2s ease;
}
.dark :deep(.marker-pin) {
  border-color: #334155;
}
:deep(.marker-pin svg) {
  transform: rotate(45deg);
  width: 20px;
  height: 20px;
  color: white;
}
:deep(.marker-pulse-running .marker-pin) {
  animation: pulse-running 2s infinite;
}
@keyframes pulse-running {
  0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(225, 29, 72, 0); }
  100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
}
:deep(.custom-cluster) {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 50%;
  border: 3px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 14px;
  box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.5);
}
:deep(.cluster-icon-parent) {
  background: transparent !important;
  border: none !important;
}

</style>
