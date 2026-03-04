<template>
  <div class="space-y-8 font-sans">
    <!-- Header with System Status -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 shadow-2xl">
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-black text-white tracking-tight">Panel de Control</h1>
          <p class="mt-2 text-indigo-100 font-medium opacity-90">
            Bienvenido al centro de mando de SIMS. Estado del sistema: 
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/20">
              <span class="size-2 rounded-full bg-green-400 animate-pulse"></span>
              Operativo
            </span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="refreshData" 
            :disabled="loadingStats"
            class="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 group active:scale-95 disabled:opacity-50"
          >
            <ArrowPathIcon class="size-6" :class="{'animate-spin': loadingStats}" />
          </button>
          <div class="h-10 w-[1px] bg-white/10 mx-2 hidden md:block"></div>
          <div class="hidden md:flex flex-col items-end">
            <p class="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Última actualización</p>
            <p class="text-sm font-bold text-white">{{ lastUpdate }}</p>
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute left-1/4 bottom-0 -mb-12 h-48 w-48 rounded-full bg-purple-500/20 blur-2xl"></div>
    </div>

    <!-- Main Stats Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.name" class="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-gray-900 p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1">
        <div class="flex items-center gap-5">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110" :class="stat.bgClass">
            <component :is="stat.icon" class="h-7 w-7" :class="stat.iconClass" />
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">{{ stat.name }}</p>
            <div class="flex items-baseline gap-2">
              <p class="text-3xl font-black text-gray-900 dark:text-white">{{ stat.value }}</p>
              <span v-if="stat.trend" class="text-xs font-bold" :class="stat.trend > 0 ? 'text-green-500' : 'text-gray-400'">
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}
              </span>
            </div>
          </div>
        </div>
        <div class="absolute right-0 bottom-0 h-16 w-16 rounded-tl-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" :class="stat.bgClass"></div>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Quick Actions Sidebar -->
      <div class="space-y-6">
        <h2 class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2">Acciones Prioritarias</h2>
        <div class="grid gap-4">
          <RouterLink
            v-for="item in primaryActions"
            :key="item.name"
            :to="item.to"
            class="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-md"
          >
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors" :class="item.bgClass">
              <component :is="item.icon" class="h-6 w-6" :class="item.iconClass" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 dark:text-white text-sm truncate">{{ item.name }}</h3>
              <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">{{ item.description }}</p>
            </div>
            <ChevronRightIcon class="h-5 w-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </RouterLink>
        </div>

        <!-- IoT Status Widget -->
        <div class="rounded-[2rem] bg-white dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                <CpuChipIcon class="size-5" />
              </div>
              <h3 class="font-black text-gray-900 dark:text-white uppercase tracking-tight">Estado IoT</h3>
            </div>
            <span :class="iotOnline ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-current opacity-70">
              {{ iotOnline ? 'Conectado' : 'Offline' }}
            </span>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Online</span>
              <span class="text-sm font-black text-green-600">{{ iotDevices.online }} <span class="text-[10px] text-gray-400 font-bold">/ {{ iotDevices.total }}</span></span>
            </div>
            <div v-if="iotDevices.unlinked > 0" class="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
              <span class="text-xs font-bold text-amber-700 dark:text-amber-400">Por vincular</span>
              <span class="text-sm font-black text-amber-700 dark:text-amber-400">{{ iotDevices.unlinked }}</span>
            </div>
          </div>
          
          <RouterLink to="/admin/iot-devices" class="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 py-3 rounded-xl transition-colors">
            Configurar Dispositivos
            <ArrowRightIcon class="size-3" />
          </RouterLink>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Fleet Health Overview -->
        <div class="rounded-[2.5rem] bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                <HeartIcon class="size-6" />
              </div>
              <div>
                <h3 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Salud de la Flota</h3>
                <p class="text-xs text-gray-500 font-medium">Resumen técnico de las unidades activas</p>
              </div>
            </div>
            <RouterLink to="/admin/fleet-health" class="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Ver detalles</RouterLink>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Disponibles</p>
              <p class="text-2xl font-black text-gray-900 dark:text-white">{{ fleetStats.available }}</p>
              <div class="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-green-500 transition-all duration-1000" :style="{ width: fleetStats.total ? (fleetStats.available / fleetStats.total * 100) + '%' : '0%' }"></div>
              </div>
            </div>
            
            <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Temp. Alta</p>
              <p class="text-2xl font-black text-red-600">{{ fleetHealth.criticalTemp }}</p>
              <div class="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-red-500 transition-all duration-1000" :style="{ width: fleetStats.total ? (fleetHealth.criticalTemp / fleetStats.total * 100) + '%' : '0%' }"></div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Batería Baja</p>
              <p class="text-2xl font-black text-amber-600">{{ fleetHealth.lowBattery }}</p>
              <div class="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 transition-all duration-1000" :style="{ width: fleetStats.total ? (fleetHealth.lowBattery / fleetStats.total * 100) + '%' : '0%' }"></div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Offline</p>
              <p class="text-2xl font-black text-gray-400">{{ fleetHealth.offline }}</p>
              <div class="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gray-400 transition-all duration-1000" :style="{ width: fleetStats.total ? (fleetHealth.offline / fleetStats.total * 100) + '%' : '0%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity / Bookings -->
        <div class="rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Reservas Recientes</h3>
            <RouterLink to="/admin/bookings" class="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Gestionar todas</RouterLink>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <tr>
                  <th class="px-8 py-4">Usuario / Vehículo</th>
                  <th class="px-8 py-4">Estado</th>
                  <th class="px-8 py-4">Fecha</th>
                  <th class="px-8 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
                <tr v-for="b in recentBookings" :key="b.id" class="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                  <td class="px-8 py-4">
                    <div class="flex items-center gap-3">
                      <div class="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                        {{ b.user?.name?.charAt(0) || 'U' }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ b.user?.name || 'Usuario #' + b.user_id }}</p>
                        <p class="text-[10px] text-gray-400 font-bold uppercase truncate">{{ b.vehicle?.license_plate || 'Sin matrícula' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-4">
                    <span :class="getStatusClasses(b.status)" class="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-current opacity-80">
                      {{ translateStatus(b.status) }}
                    </span>
                  </td>
                  <td class="px-8 py-4">
                    <p class="text-[10px] font-bold text-gray-500">{{ formatDate(b.created_at) }}</p>
                  </td>
                  <td class="px-8 py-4 text-right">
                    <p class="text-xs font-black text-gray-900 dark:text-white">{{ formatCurrency(b.total_price || 0) }}</p>
                  </td>
                </tr>
                <tr v-if="recentBookings.length === 0">
                  <td colspan="4" class="px-8 py-10 text-center text-gray-400 text-xs italic">No hay reservas recientes</td>
                </tr>
              </tbody>
            </table>
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
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'
import apiClient from '@/services/api'
import iotService from '@/services/iotService'
import { useUsers } from '@/modules/admin/modules/users/composables/useUsers'
import { useVehicles } from '@/modules/admin/modules/vehicles/composables/useVehicles'
import { useBookings } from '@/modules/admin/bookings/composables/useBookings'

const { users, pagination: usersPagination, getUsers } = useUsers()
const { vehicles, pagination: vehiclesPagination, getVehicles } = useVehicles()
const { bookings, getBookings } = useBookings()

const ticketsCount = ref(0)
const iotOnline = ref(false)
const iotDevices = ref({ total: 0, online: 0, unlinked: 0 })
const fleetHealth = ref({ criticalTemp: 0, lowBattery: 0, offline: 0 })
const lastUpdate = ref(new Date().toLocaleTimeString())
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
    lastUpdate.value = new Date().toLocaleTimeString()
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
  {
    name: 'Usuarios',
    value: usersPagination.value.total || users.value.length,
    icon: UsersIcon,
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    iconClass: 'text-blue-600 dark:text-blue-400',
    trend: 0
  },
  {
    name: 'Vehículos',
    value: vehiclesPagination.value.total || vehicles.value.length,
    icon: TruckIcon,
    bgClass: 'bg-orange-50 dark:bg-orange-900/20',
    iconClass: 'text-orange-600 dark:text-orange-400',
    trend: 0
  },
  {
    name: 'Reservas Activas',
    value: bookings.value.filter(b => b.status === 'active').length,
    icon: CalendarDaysIcon,
    bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    trend: 0
  },
  {
    name: 'Tickets',
    value: ticketsCount.value,
    icon: TicketIcon,
    bgClass: 'bg-rose-50 dark:bg-rose-900/20',
    iconClass: 'text-rose-600 dark:text-rose-400',
    trend: 0
  },
])

const primaryActions = [
  {
    name: 'Registrar Vehículo',
    description: 'Añadir nueva unidad a la flota',
    to: '/admin/vehicles/create',
    icon: PlusIcon,
    bgClass: 'bg-indigo-50 text-indigo-600',
    iconClass: 'text-indigo-600',
  },
  {
    name: 'Mapa en Vivo',
    description: 'Seguimiento GPS tiempo real',
    to: '/admin/map',
    icon: MapIcon,
    bgClass: 'bg-blue-50 text-blue-600',
    iconClass: 'text-blue-600',
  },
  {
    name: 'Salud de Flota',
    description: 'Revisar alertas mecánicas',
    to: '/admin/fleet-health',
    icon: HeartIcon,
    bgClass: 'bg-rose-50 text-rose-600',
    iconClass: 'text-rose-600',
  },
  {
    name: 'Gestionar Usuarios',
    description: 'Aprobaciones y roles',
    to: '/admin/users',
    icon: UsersIcon,
    bgClass: 'bg-emerald-50 text-emerald-600',
    iconClass: 'text-emerald-600',
  },
]

const fleetStats = computed(() => {
  const total = vehiclesPagination.value.total || vehicles.value.length
  const available = vehicles.value.filter((v: any) => !v.active).length
  return {
    total,
    available,
  }
})

const recentBookings = computed(() => {
  return [...bookings.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val)
}

const getStatusClasses = (s: string) => {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    expired: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return map[s] || 'bg-gray-100 text-gray-700 border-gray-200'
}

const translateStatus = (s: string) => {
  const map: Record<string, string> = {
    active: 'Activa',
    completed: 'Finalizada',
    cancelled: 'Cancelada',
    pending: 'Pendiente',
    expired: 'Expirada',
  }
  return map[s] || s
}
</script>
