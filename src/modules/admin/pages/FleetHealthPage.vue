<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Profesional y Refinado -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeading
        title="Centro de Diagnóstico de Flota"
        description="Monitoreo de telemetría en tiempo real y salud mecánica del sistema"
      >
        <template #actions>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-500">
              Última Sincronización: {{ lastCheck }}
            </div>
            <button @click="loadData" class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50 shadow-sm">
              <ArrowPathIcon class="size-5" :class="{'animate-spin': loading}" />
            </button>
          </div>
        </template>
      </PageHeading>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <!-- Sección de Alertas Críticas (Prioridad Máxima) -->
      <section>
        <div class="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
          <div class="flex items-end justify-between">
            <div>
              <h2 class="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Atención Inmediata Requerida</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Listado de unidades que presentan anomalías críticas en su telemetría.</p>
            </div>
            <span v-if="alertVehicles.length > 0" class="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200">
              {{ alertVehicles.length }} Alertas Activas
            </span>
          </div>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="h-48 rounded-2xl bg-slate-50 dark:bg-slate-900/50 animate-pulse border border-slate-100 dark:border-slate-800"></div>
        </div>
        <div v-else-if="alertVehicles.length === 0" class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 mb-4">
            <CheckBadgeIcon class="size-8" />
          </div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Sistemas Nominales</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">No se detectan anomalías en la flota activa.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="v in alertVehicles" :key="v.id" class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-rose-200 dark:border-rose-800 shadow-xl shadow-rose-500/10 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div class="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-sm font-bold text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700">
                    {{ v.plate.substring(0,2) }}
                  </div>
                  <div>
                    <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ v.plate }}</h3>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">{{ v.brand }} {{ v.model }}</p>
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <div v-if="(v.engine_temp || 0) > 100" class="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800">
                  <div class="flex items-center gap-3"><FireIcon class="size-5 text-rose-500" /><span class="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-widest">Motor Crítico</span></div>
                  <span class="text-sm font-black text-rose-700 dark:text-rose-400 tabular-nums">{{ v.engine_temp.toFixed(1) }}°C</span>
                </div>
                <div v-if="(v.battery_voltage || 12.6) < 11.8" class="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                  <div class="flex items-center gap-3"><Battery0Icon class="size-5 text-amber-600" /><span class="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Voltaje Bajo</span></div>
                  <span class="text-sm font-black text-amber-700 dark:text-amber-400 tabular-nums">{{ v.battery_voltage.toFixed(1) }}V</span>
                </div>
                <div v-if="!v.online" class="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div class="flex items-center gap-3"><NoSymbolIcon class="size-5 text-slate-400" /><span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sin Conexión</span></div>
                  <span class="text-[10px] font-black text-slate-400 uppercase">Offline</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 mt-6">
              <router-link :to="`/admin/map?select=${v.id}`" class="flex-1 text-center px-4 py-2.5 rounded-lg text-indigo-600 bg-indigo-50 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">Localizar</router-link>
              <button class="flex-1 px-4 py-2.5 rounded-lg text-slate-600 bg-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Diagnosticar</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Telemetría Completa -->
      <section>
        <div class="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
          <h2 class="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Telemetría Completa de la Flota</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Listado con los datos en tiempo real de todas las unidades activas.</p>
        </div>
        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th class="px-6 py-5">Unidad</th>
                  <th class="px-6 py-5">Temperatura Motor</th>
                  <th class="px-6 py-5">Voltaje Batería</th>
                  <th class="px-6 py-5">RPM / Velocidad</th>
                  <th class="px-6 py-5 text-center">Conexión</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="v in vehicles" :key="v.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td class="px-6 py-4"><div class="flex items-center gap-3"><TruckIcon class="size-5 text-slate-400" /><span class="text-sm font-bold text-slate-900 dark:text-white font-mono tracking-wider">{{ v.plate }}</span></div></td>
                  <td class="px-6 py-4"><div class="flex items-center gap-3"><div class="flex-1 h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div class="h-full transition-all duration-500 rounded-full" :class="(v.engine_temp || 0) > 100 ? 'bg-rose-500' : 'bg-indigo-500'" :style="{ width: Math.min((v.engine_temp || 0) / 1.5, 100) + '%' }"></div></div><span class="text-sm font-mono font-bold w-12 text-right" :class="(v.engine_temp || 0) > 100 ? 'text-rose-600' : 'text-slate-600 dark:text-slate-400'">{{ v.engine_temp?.toFixed(0) || 0 }}°</span></div></td>
                  <td class="px-6 py-4"><div class="flex items-center gap-2 text-sm font-mono font-bold" :class="(v.battery_voltage || 12.6) < 11.8 ? 'text-amber-600' : 'text-slate-600 dark:text-slate-400'"><Battery50Icon class="size-5" />{{ v.battery_voltage?.toFixed(1) || '12.6' }}V</div></td>
                  <td class="px-6 py-4"><div class="text-sm font-medium text-slate-500"><span class="font-bold text-slate-900 dark:text-white tabular-nums">{{ v.rpm || 0 }}</span> rpm <span class="mx-1 opacity-20">|</span> <span class="font-bold text-slate-900 dark:text-white tabular-nums">{{ v.speed?.toFixed(0) || 0 }}</span> km/h</div></td>
                  <td class="px-6 py-4 text-center"><div class="inline-flex items-center gap-2"><div class="size-2 rounded-full" :class="v.online ? 'bg-emerald-500' : 'bg-slate-300'"></div><span class="text-[10px] font-black uppercase tracking-widest" :class="v.online ? 'text-emerald-600' : 'text-slate-400'">{{ v.online ? 'Online' : 'Offline' }}</span></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/services/api'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import {
  FireIcon, Battery0Icon, Battery50Icon, SignalIcon, CheckBadgeIcon, ArrowPathIcon, TruckIcon,
  MapIcon, NoSymbolIcon, BoltIcon, CircleStackIcon
} from '@heroicons/vue/24/outline'

const vehicles = ref<any[]>([])
const loading = ref(false)
const lastCheck = ref(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))

const onlineCount = computed(() => vehicles.value.filter(v => v.online).length)
const criticalTempCount = computed(() => vehicles.value.filter(v => (v.engine_temp || 0) > 100).length)
const lowBatteryCount = computed(() => vehicles.value.filter(v => (v.battery_voltage || 12.6) < 11.8).length)
const alertVehicles = computed(() => vehicles.value.filter(v => !v.online || (v.engine_temp || 0) > 100 || (v.battery_voltage || 12.6) < 11.8))

const healthMetrics = computed(() => [
  { label: 'Unidades con Alerta', value: alertVehicles.value.length, icon: FireIcon, bg: 'bg-rose-50 dark:bg-rose-900/20', color: 'text-rose-600 dark:text-rose-400' },
  { label: 'Baterías Bajas', value: lowBatteryCount.value, icon: Battery0Icon, bg: 'bg-amber-50 dark:bg-amber-900/20', color: 'text-amber-600 dark:text-amber-400' },
  { label: 'Conexión IoT', value: `${onlineCount.value}/${vehicles.value.length}`, icon: SignalIcon, bg: 'bg-indigo-50 dark:bg-indigo-900/20', color: 'text-indigo-600 dark:text-indigo-400' },
  { label: 'Estado General', value: 'Nominal', icon: CheckBadgeIcon, bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-600 dark:text-emerald-400' }
])

const loadData = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/admin/vehicles/map')
    vehicles.value = res.data
    lastCheck.value = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  } catch (e) { console.error(e) } 
  finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
