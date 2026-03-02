<template>
  <div class="fixed inset-0 lg:left-72 z-0 overflow-hidden font-sans bg-gray-50 dark:bg-gray-950">
    <!-- Offset for mobile header (h-16) -->
    <div class="absolute inset-0 top-16 lg:top-0">
      <div ref="mapContainer" class="absolute inset-0 z-0"></div>
    </div>

    <!-- UI Overlay Layer -->
    <div class="absolute inset-0 pointer-events-none z-10 p-4 sm:p-6 flex flex-col">
      
      <!-- Top Area: Search & Stats -->
      <div class="flex flex-col lg:flex-row items-start justify-between gap-4 pointer-events-auto w-full">
        <!-- Search & Filter Bar -->
        <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div class="relative w-full sm:w-80 group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500">
              <MagnifyingGlassIcon class="size-4" />
            </div>
            <input 
              v-model="search" 
              type="text" 
              placeholder="Buscar por matrícula o modelo..." 
              class="block w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-0 shadow-2xl shadow-gray-900/5 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none ring-1 ring-gray-900/5 dark:ring-white/10"
            />
          </div>
          <button 
            @click="refresh" 
            class="p-2.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl text-gray-600 dark:text-gray-300 shadow-lg ring-1 ring-gray-900/5 hover:bg-white active:scale-95 transition-all"
            title="Actualizar flota"
          >
            <ArrowPathIcon class="size-5" :class="{'animate-spin': isRefreshing}" />
          </button>
        </div>

        <!-- Quick Stats -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 shrink-0">
            <div class="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{{ stats.available }} Libres</span>
          </div>
          <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 shrink-0">
            <div class="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{{ stats.reserved }} Reservados</span>
          </div>
          <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 shrink-0 border-2 border-red-500/20">
            <div class="size-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{{ stats.running }} En ruta</span>
          </div>
        </div>
      </div>

      <!-- Center Area -->
      <div class="flex-1 relative mt-4">
        <!-- Fleet Management Side Panel -->
        <div class="absolute top-0 right-0 bottom-0 w-full max-w-sm pointer-events-auto flex flex-col gap-4">
          <div class="flex-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800 flex flex-col overflow-hidden">
            <div class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div class="flex items-center justify-between mb-1">
                <h2 class="text-xs font-black text-indigo-500 uppercase tracking-[0.2em]">Gestión de Flota</h2>
                <span class="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-lg">{{ filteredVehicles.length }} vehículos</span>
              </div>
            </div>

            <!-- Vehicle List -->
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
                      <p class="text-xs font-black text-gray-900 dark:text-white truncate">{{ v.plate }}</p>
                      <p class="text-[10px] text-gray-400 font-bold uppercase truncate">{{ v.brand }} {{ v.model }}</p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div v-if="v.mongo_active" class="flex flex-col items-end">
                      <p class="text-[10px] font-black text-red-500 uppercase">En ruta</p>
                      <p class="text-[9px] font-bold text-gray-400">{{ v.speed?.toFixed(0) }} km/h · {{ v.rpm }} rpm</p>
                    </div>
                    <span v-else :class="v.postgres_active ? 'text-amber-500' : 'text-green-500'" class="text-[10px] font-black uppercase tracking-widest">
                      {{ v.postgres_active ? 'Reservado' : 'Libre' }}
                    </span>
                  </div>
                </div>
                
                <!-- Expanded Control Panel -->
                <div v-if="selectedVehicle?.id === v.id" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-fade-in">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="bg-white dark:bg-gray-950 rounded-xl p-2 border border-gray-100 dark:border-gray-800">
                      <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Motor</p>
                      <div class="flex items-center gap-1.5 font-black text-xs" :class="v.online ? 'text-blue-500' : 'text-gray-400'">
                        <CpuChipIcon class="size-3" />
                        {{ v.online ? 'Conectado' : 'Offline' }}
                      </div>
                    </div>
                    <div class="bg-white dark:bg-gray-950 rounded-xl p-2 border border-gray-100 dark:border-gray-800">
                      <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Temperatura</p>
                      <div class="flex items-center gap-1.5 font-black text-xs text-gray-900 dark:text-white">
                        <FireIcon class="size-3 text-orange-500" />
                        {{ v.engine_temp?.toFixed(1) }}°C
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button 
                      v-if="v.online"
                      @click.stop="turnOnVehicle(v)"
                      :disabled="commandLoading === v.device_id"
                      class="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-green-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-50"
                    >
                      <PlayIcon v-if="commandLoading !== v.device_id" class="size-3" />
                      <ArrowPathIcon v-else class="size-3 animate-spin" />
                      Encender
                    </button>
                    <button 
                      v-if="v.online"
                      @click.stop="turnOffVehicle(v)"
                      :disabled="commandLoading === v.device_id"
                      class="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                    >
                      <PowerIcon v-if="commandLoading !== v.device_id" class="size-3" />
                      <ArrowPathIcon v-else class="size-3 animate-spin" />
                      Apagar
                    </button>
                    <div v-else class="w-full py-2 text-center rounded-xl bg-gray-100 dark:bg-gray-800 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      Comandos no disponibles (Offline)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="translate-y-full opacity-0"
    >
      <div v-if="toast.show" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
        <div :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'" class="px-6 py-3 rounded-2xl shadow-2xl text-white flex items-center gap-3 border border-white/10">
          <CheckCircleIcon v-if="toast.type === 'success'" class="size-5" />
          <XCircleIcon v-else class="size-5" />
          <span class="text-sm font-black uppercase tracking-widest">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, reactive, watch } from 'vue'
import { useMap } from '@/modules/map/composables/useMap'
import iotService from '@/services/iotService'
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TruckIcon,
  CpuChipIcon,
  FireIcon,
  PlayIcon,
  PowerIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const { mapContainer, markers, map, initMap, fetchVehicles, centerOnVehicle, destroyMap, setSearchQuery, selectedVehicle, rawVehicles } = useMap()

const search = ref('')
const isRefreshing = ref(false)
const commandLoading = ref<string | null>(null)

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

// Stats for the top bar
const stats = computed(() => {
  return {
    available: rawVehicles.value.filter(v => v.status === 'available').length,
    reserved: rawVehicles.value.filter(v => v.status === 'reserved').length,
    running: rawVehicles.value.filter(v => v.status === 'running').length,
  }
})

const filteredVehicles = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return rawVehicles.value
  return rawVehicles.value.filter(v => 
    v.plate.toLowerCase().includes(q) || 
    v.brand.toLowerCase().includes(q) || 
    v.model.toLowerCase().includes(q)
  )
})

watch(search, (newVal) => {
  setSearchQuery(newVal)
})

const onVehicleClick = (v: any) => {
  selectedVehicle.value = v
  centerOnVehicle(v)
}

const refresh = async () => {
  isRefreshing.value = true
  try {
    await fetchVehicles('/admin/vehicles/map')
  } finally {
    isRefreshing.value = false
  }
}

const turnOnVehicle = async (vehicle: any) => {
  if (!vehicle.device_id) return
  commandLoading.value = vehicle.device_id
  try {
    const result = await iotService.turnOn(vehicle.device_id)
    if (result.success) {
      showToast(`Encendido enviado a ${vehicle.plate}`, 'success')
      setTimeout(refresh, 1000)
    } else {
      showToast(result.error || 'Error al enviar comando', 'error')
    }
  } catch (error) {
    showToast('Error de conexión con IoT', 'error')
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
      showToast(`Apagado enviado a ${vehicle.plate}`, 'success')
      setTimeout(refresh, 1000)
    } else {
      showToast(result.error || 'Error al enviar comando', 'error')
    }
  } catch (error) {
    showToast('Error de conexión con IoT', 'error')
  } finally {
    commandLoading.value = null
  }
}

onMounted(async () => {
  initMap()
  await fetchVehicles('/admin/vehicles/map')
})

onUnmounted(() => {
  destroyMap()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

:deep(.leaflet-container) { z-index: 0 !important; border-radius: 0 !important; height: 100% !important; width: 100% !important; }
:deep(.leaflet-control-container) { z-index: 5 !important; }
:deep(.leaflet-bottom.leaflet-left) { bottom: 2rem !important; left: 1.5rem !important; }
:deep(.leaflet-bar) { border: none !important; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; border-radius: 1rem !important; overflow: hidden; }
:deep(.leaflet-bar a) { background-color: rgba(255, 255, 255, 0.9) !important; color: #4f46e5 !important; width: 36px !important; height: 36px !important; line-height: 36px !important; font-weight: bold !important; border-bottom: 1px solid #f3f4f6 !important; }
.dark :deep(.leaflet-bar a) { background-color: rgba(17, 24, 39, 0.9) !important; color: #818cf8 !important; border-bottom: 1px solid #374151 !important; }

/* Custom Vehicle Markers Styles */
:deep(.custom-vehicle-marker) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.marker-pin) {
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  background: var(--marker-color);
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -24px 0 0 -16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  border: 2px solid white;
  transition: all 0.2s ease;
}

:deep(.marker-pin svg) {
  transform: rotate(45deg);
  width: 18px;
  height: 18px;
}

:deep(.marker-label) {
  position: absolute;
  top: 12px;
  background: white;
  color: #1e293b;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  pointer-events: none;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.2s ease;
}

:deep(.custom-vehicle-marker:hover .marker-label) {
  opacity: 1;
  transform: translateY(0);
}

:deep(.custom-vehicle-marker:hover .marker-pin) {
  transform: rotate(-45deg) scale(1.1);
  z-index: 1000;
}

/* Animations for Running Vehicles */
:deep(.marker-pulse-red .marker-pin) {
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

/* Cluster Styling */
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
