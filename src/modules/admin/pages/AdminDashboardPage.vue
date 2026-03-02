<template>
  <div class="space-y-8">
    <!-- Header con stats rápidas -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-xl">
      <div class="relative z-10">
        <h1 class="text-3xl font-bold text-white">Panel de Administración</h1>
        <p class="mt-2 text-indigo-100">
          Bienvenido al centro de control de SIMS
        </p>
      </div>
      <div class="absolute right-0 top-0 -mt-4 -mr-4 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
      <div class="absolute left-1/2 bottom-0 -mb-8 h-32 w-32 rounded-full bg-purple-400/20 blur-xl"></div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.name" class="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl" :class="stat.bgClass">
            <component :is="stat.icon" class="h-6 w-6" :class="stat.iconClass" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.name }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
        <div class="absolute right-0 bottom-0 h-16 w-16 rounded-tl-full" :class="stat.bgClass + ' opacity-20'"></div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones rápidas</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="item in quickActions"
          :key="item.name"
          :to="item.to"
          class="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 hover:ring-2 hover:ring-indigo-500 transition-all duration-200"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110" :class="item.bgClass">
              <component :is="item.icon" class="h-6 w-6" :class="item.iconClass" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
            </div>
            <svg class="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- IoT Status -->
      <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Estado IoT</h2>
          <span :class="iotOnline ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'" class="px-3 py-1 rounded-full text-xs font-medium">
            {{ iotOnline ? '● Conectado' : '○ Desconectado' }}
          </span>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span class="text-sm text-gray-600 dark:text-gray-400">Dispositivos totales</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ iotDevices.total }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span class="text-sm text-gray-600 dark:text-gray-400">En línea</span>
            <span class="font-semibold text-green-600">{{ iotDevices.online }}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Sin vincular</span>
            <span class="font-semibold text-yellow-600">{{ iotDevices.unlinked }}</span>
          </div>
        </div>
        <RouterLink to="/admin/iot-devices" class="mt-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Gestionar dispositivos
          <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>

      <!-- Quick Stats -->
      <div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen de flota</h2>
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Vehículos disponibles</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ fleetStats.available }} / {{ fleetStats.total }}</span>
            </div>
            <div class="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div class="h-full rounded-full bg-green-500" :style="{ width: fleetStats.total ? (fleetStats.available / fleetStats.total * 100) + '%' : '0%' }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Reservas activas</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ fleetStats.activeBookings }}</span>
            </div>
            <div class="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div class="h-full rounded-full bg-indigo-500" :style="{ width: fleetStats.total ? (fleetStats.activeBookings / fleetStats.total * 100) + '%' : '0%' }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Tickets abiertos</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ fleetStats.openTickets }}</span>
            </div>
            <div class="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div class="h-full rounded-full bg-yellow-500" :style="{ width: Math.min(fleetStats.openTickets * 10, 100) + '%' }"></div>
            </div>
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
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
  TicketIcon,
  MapIcon,
  CpuChipIcon,
} from '@heroicons/vue/24/outline'
import apiClient from '@/services/api'
import iotService from '@/services/iotService'
import { useUsers } from '@/modules/admin/modules/users/composables/useUsers'
import { useVehicles } from '@/modules/admin/modules/vehicles/composables/useVehicles'
import { useRoles } from '@/modules/admin/modules/roles/composables/useRoles'
import { useBookings } from '@/modules/admin/bookings/composables/useBookings'

const { users, pagination: usersPagination, getUsers } = useUsers()
const { vehicles, pagination: vehiclesPagination, getVehicles } = useVehicles()
const { roles, pagination: rolesPagination, getRoles } = useRoles()
const { bookings, pagination: bookingsPagination, getBookings } = useBookings()

const ticketsCount = ref(0)
const iotOnline = ref(false)
const iotDevices = ref({ total: 0, online: 0, unlinked: 0 })

const loadingStats = ref(false)

onMounted(async () => {
  loadingStats.value = true
  try {
    await Promise.all([
      getUsers(1).catch((e) => console.error('Error loading users stats', e)),
      getVehicles(1).catch((e) => console.error('Error loading vehicles stats', e)),
      getRoles(1).catch((e) => console.error('Error loading roles stats', e)),
      getBookings(1).catch((e) => console.error('Error loading bookings stats', e)),
      (async () => {
        try {
          const res = await apiClient.get('/tickets')
          const arr = (res.data && (res.data.data ?? res.data)) || []
          ticketsCount.value = Array.isArray(arr) ? arr.filter((t: any) => t.active).length : 0
        } catch (err) {
          console.error('Error loading tickets stats', err)
        }
      })(),
      (async () => {
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
      })(),
    ])
  } catch (e) {
    console.error('Error loading admin stats', e)
  } finally {
    loadingStats.value = false
  }
})

const stats = computed(() => [
  {
    name: 'Usuarios',
    value: usersPagination.value.total || users.value.length,
    icon: UsersIcon,
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Vehículos',
    value: vehiclesPagination.value.total || vehicles.value.length,
    icon: TruckIcon,
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    iconClass: 'text-orange-600 dark:text-orange-400',
  },
  {
    name: 'Reservas',
    value: bookingsPagination.value.total || bookings.value.length,
    icon: CalendarDaysIcon,
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Tickets abiertos',
    value: ticketsCount.value,
    icon: TicketIcon,
    bgClass: 'bg-rose-100 dark:bg-rose-900/30',
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
])

const quickActions = computed(() => [
  {
    name: 'Mapa en vivo',
    description: 'Ver ubicación de vehículos',
    to: '/admin/map',
    icon: MapIcon,
    bgClass: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconClass: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    name: 'Dispositivos IoT',
    description: 'Gestionar Raspberry Pi',
    to: '/admin/iot-devices',
    icon: CpuChipIcon,
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    iconClass: 'text-purple-600 dark:text-purple-400',
  },
  {
    name: 'Usuarios',
    description: 'Gestionar cuentas',
    to: '/admin/users',
    icon: UsersIcon,
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Vehículos',
    description: 'Gestionar flota',
    to: '/admin/vehicles',
    icon: TruckIcon,
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    iconClass: 'text-orange-600 dark:text-orange-400',
  },
  {
    name: 'Reservas',
    description: 'Ver todas las reservas',
    to: '/admin/bookings',
    icon: CalendarDaysIcon,
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Tickets',
    description: 'Soporte al cliente',
    to: '/admin/tickets',
    icon: TicketIcon,
    bgClass: 'bg-rose-100 dark:bg-rose-900/30',
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
])

const fleetStats = computed(() => {
  const total = vehiclesPagination.value.total || vehicles.value.length
  const available = vehicles.value.filter((v: any) => !v.active).length
  const activeBookings = bookings.value.filter((b: any) => b.status === 'active').length
  return {
    total,
    available,
    activeBookings,
    openTickets: ticketsCount.value
  }
})
</script>
