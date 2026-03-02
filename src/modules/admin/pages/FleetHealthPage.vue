<template>
  <div class="px-4 sm:px-6 lg:px-8 font-sans">
    <PageHeading title="Salud de la Flota" description="Estado técnico y alertas de mantenimiento en tiempo real" />

    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Summary Cards -->
      <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <FireIcon class="size-6" />
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sobrecalentamiento</p>
            <p class="text-2xl font-black text-gray-900 dark:text-white">{{ criticalTempCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
            <Battery50Icon class="size-6" />
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Batería Baja</p>
            <p class="text-2xl font-black text-gray-900 dark:text-white">{{ lowBatteryCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400">
            <WifiIcon class="size-6" />
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Desconectados</p>
            <p class="text-2xl font-black text-gray-900 dark:text-white">{{ offlineCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            <CheckBadgeIcon class="size-6" />
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operativos</p>
            <p class="text-2xl font-black text-gray-900 dark:text-white">{{ onlineCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Table -->
    <div class="mt-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Vehículos con Incidencias</h3>
        <button @click="loadData" class="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
          <ArrowPathIcon class="size-5 text-gray-400" :class="{'animate-spin': loading}" />
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <tr>
              <th class="px-8 py-4">Vehículo</th>
              <th class="px-8 py-4">Estado</th>
              <th class="px-8 py-4">Alertas Activas</th>
              <th class="px-8 py-4">Telemetría</th>
              <th class="px-8 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
            <tr v-for="v in alertVehicles" :key="v.id" class="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="size-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    <TruckIcon class="size-5" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-gray-900 dark:text-white">{{ v.plate }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase">{{ v.brand }} {{ v.model }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <span :class="v.online ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'" class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  {{ v.online ? 'Conectado' : 'Offline' }}
                </span>
              </td>
              <td class="px-8 py-5">
                <div class="flex flex-wrap gap-2">
                  <span v-if="(v.engine_temp || 0) > 100" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest border border-red-100">
                    <FireIcon class="size-3" /> Calor
                  </span>
                  <span v-if="(v.battery_voltage || 12.6) < 11.8" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">
                    <Battery50Icon class="size-3" /> Batería
                  </span>
                  <span v-if="!v.online" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-widest border border-gray-100">
                    <WifiIcon class="size-3" /> Sin Señal
                  </span>
                </div>
              </td>
              <td class="px-8 py-5 text-sm font-mono font-bold text-gray-500">
                {{ v.engine_temp?.toFixed(1) }}°C / {{ v.battery_voltage?.toFixed(1) || 12.6 }}V
              </td>
              <td class="px-8 py-5 text-right">
                <router-link :to="`/admin/map?select=${v.id}`" class="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:underline">Gestionar</router-link>
              </td>
            </tr>
            <tr v-if="alertVehicles.length === 0">
              <td colspan="5" class="px-8 py-12 text-center text-gray-400 font-medium italic">No hay alertas activas en la flota</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/services/api'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import {
  FireIcon, Battery50Icon, WifiIcon, CheckBadgeIcon, ArrowPathIcon, TruckIcon
} from '@heroicons/vue/24/outline'

const vehicles = ref<any[]>([])
const loading = ref(false)

const onlineCount = computed(() => vehicles.value.filter(v => v.online).length)
const offlineCount = computed(() => vehicles.value.filter(v => !v.online).length)
const criticalTempCount = computed(() => vehicles.value.filter(v => (v.engine_temp || 0) > 100).length)
const lowBatteryCount = computed(() => vehicles.value.filter(v => (v.battery_voltage || 12.6) < 11.8).length)

const alertVehicles = computed(() => {
  return vehicles.value.filter(v => !v.online || (v.engine_temp || 0) > 100 || (v.battery_voltage || 12.6) < 11.8)
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/admin/vehicles/map')
    vehicles.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
