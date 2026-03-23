<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading
      v-if="booking"
      :title="`Reserva #${booking.id}`"
      description="Información detallada sobre la reserva."
    >
      <template #actions>
        <router-link
          :to="`/admin/bookings/${booking.id}/edit`"
          class="flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <span>Editar Reserva</span>
        </router-link>
        <router-link
          to="/admin/bookings"
          class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Volver a la lista</span>
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loading"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Cargando detalles de la reserva...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800/20 shadow-sm p-6"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <div
      v-else-if="booking"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div class="p-8">
        <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Usuario</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <span v-if="booking.user">{{ booking.user.name }} ({{ booking.user.email }})</span>
              <span v-else class="text-gray-400">-</span>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Vehículo</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <span v-if="booking.vehicle"
                >{{ booking.vehicle.brand }} {{ booking.vehicle.model }} ({{
                  booking.vehicle.license_plate
                }})</span
              >
              <span v-else class="text-gray-400">-</span>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</dt>
            <dd class="mt-1">
              <span
                :class="[
                  'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                  getStatusClasses(booking.status)
                ]"
              >
                {{ translateBookingStatus(booking.status) }}
              </span>
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Inicio Programado</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ formatDateTime(booking.scheduled_start) }}
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Fin Programado</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ formatDateTime(booking.scheduled_end) }}
            </dd>
          </div>

          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Precio Total</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ formatCurrency(booking.total_price) }}
            </dd>
          </div>

          <div v-if="booking.trip" class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Duración del Viaje</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ booking.trip.minutes_driven }} min
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
import PageHeading from '@/modules/admin/components/PageHeading.vue'

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

const translateBookingStatus = (s: string) => {
  const map: Record<string, string> = {
    active: 'Activa',
    completed: 'Completada',
    cancelled: 'Cancelada',
    pending: 'Pendiente',
    expired: 'Expirada'
  }
  return map[s] || s
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

const getStatusClasses = (s: string) => {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    expired: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return map[s] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
