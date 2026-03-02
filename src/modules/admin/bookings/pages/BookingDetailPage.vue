<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <router-link
        to="/admin/bookings"
        class="inline-flex items-center text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a reservas
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <svg class="animate-spin h-8 w-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Cargando reserva...
      </div>
    </div>

    <div v-else-if="error" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="booking" class="bg-white dark:bg-gray-900 shadow rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="px-6 py-6 sm:px-8 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-black leading-6 text-gray-900 dark:text-white uppercase tracking-tight">
            Reserva #{{ booking.id }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Detalles completos de la reserva
          </p>
        </div>
        <div class="flex gap-3">
          <router-link
            :to="`/admin/bookings/${booking.id}/edit`"
            class="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Editar
          </router-link>
        </div>
      </div>

      <div class="border-t border-gray-100 dark:border-gray-800 px-6 py-8 sm:px-8">
        <dl class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <div class="sm:col-span-1">
            <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Usuario</dt>
            <dd class="mt-1 text-sm font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div class="size-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center text-xs">
                {{ getUserInitials(booking.user?.name) }}
              </div>
              <div v-if="booking.user" class="min-w-0">
                <p class="truncate">{{ booking.user.name }}</p>
                <p class="text-xs font-medium text-gray-500">{{ booking.user.email }}</p>
              </div>
              <span v-else>Usuario #{{ booking.user_id ?? '-' }}</span>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Vehículo</dt>
            <dd class="mt-1 text-sm font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div class="size-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                <TruckIcon class="size-4" />
              </div>
              <div v-if="booking.vehicle" class="min-w-0">
                <p class="truncate">{{ booking.vehicle.brand }} {{ booking.vehicle.model }}</p>
                <p class="text-xs font-mono text-indigo-500">{{ booking.vehicle.license_plate }}</p>
              </div>
              <span v-else>Vehículo #{{ booking.vehicle_id ?? '-' }}</span>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Estado</dt>
            <dd class="mt-1">
              <span
                :class="[
                  'inline-flex rounded-xl px-3 py-1 text-xs font-black uppercase tracking-widest',
                  getStatusClasses(booking.status),
                ]"
              >
                {{ translateStatus(booking.status) }}
              </span>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Horario Programado</dt>
            <dd class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
              <div v-if="booking.scheduled_start" class="flex items-center gap-2">
                <ClockIcon class="size-4 text-gray-400" />
                {{ formatDateTime(booking.scheduled_start) }}
              </div>
              <div v-else class="text-gray-400">-</div>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Coste Total</dt>
            <dd class="mt-1 text-xl font-black text-gray-900 dark:text-white">
              <span v-if="getTotal(booking) != null">{{ formatCurrency(getTotal(booking)) }}</span>
              <span v-else class="text-gray-400 text-sm">-</span>
            </dd>
          </div>

          <div class="sm:col-span-1" v-if="booking.trip">
            <dt class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Detalles del Viaje</dt>
            <dd class="mt-1 text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ArrowTrendingUpIcon class="size-4 text-green-500" />
              {{ booking.trip.minutes_driven }} minutos conducidos
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookings } from '../composables/useBookings'
import type { Booking } from '../interfaces/booking.interface'
import { 
  TruckIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { currentBooking, getBooking, loading, error } = useBookings()

const booking = computed<Booking | null>(() => currentBooking.value)
const bookingId = ref<number>(Number(route.params.id))

onMounted(async () => {
  if (bookingId.value) {
    try {
      await getBooking(bookingId.value)
    } catch (e) {
      // error state is handled by composable
    }
  }
})

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

const getUserInitials = (name?: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getStatusClasses = (s: string) => {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    expired: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  }
  return map[s] || 'bg-gray-100 text-gray-800'
}

const translateStatus = (s: string) => {
  const map: Record<string, string> = {
    active: 'Activo',
    completed: 'Completado',
    cancelled: 'Cancelado',
    pending: 'Pendiente',
    expired: 'Expirado',
  }
  return map[s] || s
}

const getTotal = (booking: Booking) =>
  booking.total_price ?? booking.trip?.total_amount ?? 0
</script>
