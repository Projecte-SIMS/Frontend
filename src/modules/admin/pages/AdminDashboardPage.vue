<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Unificado -->
    <PageHeading
      title="Panel de Control"
      description="Resumen operativo del sistema inteligente de movilidad"
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Sistema Online</span>
          </div>
          
          <button 
            @click="refreshData" 
            :disabled="loadingStats"
            class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50 shadow-sm"
          >
            <ArrowPathIcon class="size-5" :class="{'animate-spin': loadingStats}" />
          </button>
        </div>
      </template>
    </PageHeading>

    <!-- Grid de KPIs -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.name" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ stat.name }}</p>
            <p class="mt-2 text-3xl font-black text-slate-900 dark:text-white tabular-nums">{{ stat.value }}</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-900/20 transition-colors">
            <component :is="stat.icon" class="size-6" />
          </div>
        </div>
        <div v-if="stat.trend !== undefined" class="mt-4 flex items-center gap-2">
          <span 
            class="text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-tighter"
            :class="stat.trend >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'"
          >
            {{ stat.trend > 0 ? '↑' : '' }}{{ stat.trend }}%
          </span>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">vs mes anterior</span>
        </div>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Columna Principal -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Diagnóstico de Flota -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600">
                <HeartIcon class="size-5" />
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white">Diagnóstico de Flota</h3>
            </div>
            <RouterLink to="/admin/fleet-health" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
              Detalles →
            </RouterLink>
          </div>

          <div class="p-6 grid sm:grid-cols-2 gap-8">
            <div v-for="(val, label) in healthMetrics" :key="label" class="space-y-3">
              <div class="flex justify-between items-end">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ label }}</span>
                <span class="text-lg font-black text-slate-900 dark:text-white tabular-nums">{{ val.count }} <span class="text-xs font-bold text-slate-400">/ {{ fleetStats.total }}</span></span>
              </div>
              <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000" 
                  :class="val.color" 
                  :style="{ width: fleetStats.total ? (val.count / fleetStats.total * 100) + '%' : '0%' }"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Últimos Movimientos -->
        <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 class="font-bold text-slate-900 dark:text-white">Últimos Movimientos</h3>
            <RouterLink to="/admin/bookings" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
              Ver Historial
            </RouterLink>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th class="px-6 py-4">Usuario / Unidad</th>
                  <th class="px-6 py-4 text-center">Estado</th>
                  <th class="px-6 py-4">Fecha</th>
                  <th class="px-6 py-4 text-right">Importe</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="b in recentBookings" :key="b.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="size-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                        {{ b.user?.name?.charAt(0) || 'U' }}
                      </div>
                      <div>
                        <p class="text-sm font-bold text-slate-900 dark:text-white">{{ b.user?.name || 'Usuario #' + b.user_id }}</p>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ b.vehicle?.license_plate || 'S/N' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span :class="getStatusClasses(b.status)" class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border">
                      {{ translateStatus(b.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-xs font-medium text-slate-600 dark:text-slate-400">{{ formatDate(b.created_at) }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="text-sm font-black text-slate-900 dark:text-white tabular-nums">{{ formatCurrency(b.total_price || 0) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Barra Lateral -->
      <div class="space-y-6">
        <!-- Widget IoT -->
        <div class="rounded-2xl bg-indigo-600 p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <CpuChipIcon class="size-5 text-indigo-200" />
                <h3 class="font-bold text-sm tracking-tight">Estado Red IoT</h3>
              </div>
              <span class="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <span class="text-xs font-bold text-indigo-100 uppercase tracking-widest">Dispositivos</span>
                <span class="text-sm font-black">{{ iotDevices.online }} <span class="opacity-50">/ {{ iotDevices.total }}</span></span>
              </div>
              <p class="text-[10px] leading-relaxed text-indigo-100 opacity-80">
                Todos los sistemas de telemetría están operando dentro de los rangos normales.
              </p>
            </div>
            
            <RouterLink to="/admin/iot-devices" class="mt-6 flex w-full items-center justify-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-indigo-600 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
              Configurar Red
            </RouterLink>
          </div>
          <div class="absolute -right-10 -bottom-10 size-40 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-all"></div>
        </div>

        <!-- Acciones Directas -->
        <div class="space-y-3">
          <h3 class="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Accesos Rápidos</h3>
          <div class="grid gap-2">
            <RouterLink
              v-for="item in primaryActions"
              :key="item.name"
              :to="item.to"
              class="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-600 hover:shadow-sm transition-all group"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 text-slate-400 group-hover:text-indigo-600 transition-colors">
                <component :is="item.icon" class="h-5 w-5" />
              </div>
              <div class="flex-1">
                <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ item.name }}</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ item.description }}</p>
              </div>
              <ChevronRightIcon class="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  CalendarDaysIcon,
  TruckIcon,
  UsersIcon,
  TicketIcon,
  MapIcon,
  CpuChipIcon,
  ArrowPathIcon,
  HeartIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import apiClient from '@/services/api'
import iotService from '@/services/iotService'
import { useUsers } from '@/modules/admin/modules/users/composables/useUsers'
import { useVehicles } from '@/modules/admin/modules/vehicles/composables/useVehicles'
import { useBookings } from '@/modules/admin/bookings/composables/useBookings'
import PageHeading from '@/modules/admin/components/PageHeading.vue'

const { users, pagination: usersPagination, getUsers } = useUsers()
const { vehicles, pagination: vehiclesPagination, getVehicles } = useVehicles()
const { bookings, getBookings } = useBookings()

const ticketsCount = ref(0)
const iotOnline = ref(false)
const iotDevices = ref({ total: 0, online: 0, unlinked: 0 })
const fleetHealth = ref({ criticalTemp: 0, lowBattery: 0, offline: 0 })
const loadingStats = ref(false)

const refreshData = async () => {
  loadingStats.value = true
  try {
    await Promise.all([
      getUsers(1),
      getVehicles(1),
      getBookings(1),
      loadTicketsCount(),
      loadIoTStats(),
      loadFleetHealth(),
    ])
  } catch (e) {
    console.error('Error refreshing admin stats', e)
  } finally {
    loadingStats.value = false
  }
}

const loadTicketsCount = async () => {
  try {
    const res = await apiClient.get('/tickets')
    const arr = (res.data && (res.data.data ?? res.data)) || []
    ticketsCount.value = Array.isArray(arr) ? arr.filter((t: any) => t.active).length : 0
  } catch (err) {
    console.error('Error loading tickets stats', err)
  }
}

const loadIoTStats = async () => {
  try {
    const health = await iotService.healthCheck()
    iotOnline.value = health.ok
    if (health.ok) {
      const devices = await iotService.getDevices()
      iotDevices.value = {
        total: devices.length,
        online: devices.filter(d => d.online).length,
        unlinked: devices.filter(d => d.license_plate?.startsWith('AUTO-')).length
      }
    }
  } catch (err) {
    console.error('Error loading IoT stats', err)
  }
}

const loadFleetHealth = async () => {
  try {
    const res = await apiClient.get('/admin/vehicles/map')
    const allVehicles = res.data || []
    fleetHealth.value = {
      criticalTemp: allVehicles.filter((v: any) => (v.engine_temp || 0) > 100).length,
      lowBattery: allVehicles.filter((v: any) => (v.battery_voltage || 12.6) < 11.8).length,
      offline: allVehicles.filter((v: any) => !v.online).length,
    }
  } catch (err) {
    console.error('Error loading Fleet Health', err)
  }
}

onMounted(refreshData)

const stats = computed(() => [
  { name: 'Usuarios', value: usersPagination.value.total || users.value.length, icon: UsersIcon, trend: 12 },
  { name: 'Flota', value: vehiclesPagination.value.total || vehicles.value.length, icon: TruckIcon, trend: 0 },
  { name: 'Activas', value: bookings.value.filter(b => b.status === 'active').length, icon: CalendarDaysIcon, trend: 5 },
  { name: 'Tickets', value: ticketsCount.value, icon: TicketIcon, trend: -2 },
])

const healthMetrics = computed(() => ({
  'Disponibles': { count: fleetStats.value.available, color: 'bg-emerald-500' },
  'Temp. Crítica': { count: fleetHealth.value.criticalTemp, color: 'bg-rose-500' },
  'Batería Baja': { count: fleetHealth.value.lowBattery, color: 'bg-amber-500' },
  'Unidades Offline': { count: fleetHealth.value.offline, color: 'bg-slate-400' },
}))

const primaryActions = [
  { name: 'Nueva Unidad', description: 'Registrar vehículo', to: '/admin/vehicles/create', icon: PlusIcon },
  { name: 'Mapa en Vivo', description: 'Seguimiento GPS', to: '/admin/map', icon: MapIcon },
  { name: 'Gestión Usuarios', description: 'Admin cuentas', to: '/admin/users', icon: UsersIcon },
]

const fleetStats = computed(() => {
  const total = vehiclesPagination.value.total || vehicles.value.length
  const available = vehicles.value.filter((v: any) => !v.active).length
  return { total, available }
})

const recentBookings = computed(() => {
  return [...bookings.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val)
}

const getStatusClasses = (s: string) => {
  const map: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    completed: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
    pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  }
  return map[s] || 'bg-slate-50 text-slate-700 border-slate-200'
}

const translateStatus = (s: string) => {
  const map: Record<string, string> = { active: 'Activa', completed: 'Finalizada', cancelled: 'Cancelada', pending: 'Pendiente' }
  return map[s] || s
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
