<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mis Reservas</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Historial de tus viajes y reservas activas.</p>
      </div>
      <router-link
        to="/vehicles/map"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
      >
        <MapIcon class="size-5" />
        Nueva Reserva
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <ArrowPathIcon class="size-10 text-indigo-500 animate-spin mb-4" />
      <p class="text-gray-500 font-medium tracking-wide">Cargando tus reservas...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="bookings.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center px-6">
      <div class="size-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
        <CalendarDaysIcon class="size-10 text-indigo-500" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No tienes reservas todavía</h3>
      <p class="text-gray-500 max-w-sm mb-8">¿Listo para tu primer viaje? Encuentra un vehículo disponible en el mapa y reserva ahora.</p>
      <router-link
        to="/vehicles/map"
        class="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
      >
        Ir al mapa
      </router-link>
    </div>

    <!-- Bookings List -->
    <div v-else class="space-y-8">
      <!-- Active/Pending Bookings -->
      <section v-if="activeBookings.length > 0">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Reservas Actuales</h2>
        <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div 
            v-for="booking in activeBookings" 
            :key="booking.id"
            class="bg-white dark:bg-gray-900 rounded-3xl border-2 border-indigo-500/20 p-6 shadow-xl shadow-indigo-500/5 relative overflow-hidden"
          >
            <div class="absolute top-0 right-0 p-4">
              <span :class="getStatusClass(booking.status)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                {{ booking.status }}
              </span>
            </div>

            <div class="flex items-center gap-6 mb-6">
              <div class="size-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                <TruckIcon class="size-10" />
              </div>
              <div class="text-left">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ booking.vehicle?.brand }} {{ booking.vehicle?.model }}</h3>
                <p class="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{{ booking.vehicle?.license_plate }}</p>
                <div class="mt-2 space-y-1">
                  <div class="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <ClockIcon class="size-4" />
                    Inicio: {{ formatDateTime(booking.scheduled_start) }}
                  </div>
                  <div v-if="booking.status === 'pending' && (booking.remaining_seconds ?? 0) > 0" class="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-bold animate-pulse">
                    <ExclamationCircleIcon class="size-4" />
                    Expira en: {{ formatRemainingTime(booking.remaining_seconds) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
              <button 
                v-if="booking.status === 'pending'"
                @click="handleActivate(booking.id)"
                class="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-500/20"
              >
                Activar Vehículo
              </button>
              <button 
                v-if="booking.status === 'active'"
                @click="handleFinish(booking.id)"
                class="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/20"
              >
                Terminar Viaje
              </button>
              <button 
                v-if="booking.status === 'pending'"
                @click="handleCancel(booking.id)"
                class="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- History Section -->
      <section v-if="pastBookings.length > 0">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Historial de Viajes</h2>
        <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                  <th class="px-6 py-4">Vehículo</th>
                  <th class="px-6 py-4">Fecha y Hora</th>
                  <th class="px-6 py-4">Duración / Coste</th>
                  <th class="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-800 text-sm">
                <tr v-for="booking in pastBookings" :key="booking.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="size-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <TruckIcon class="size-4" />
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 dark:text-white">{{ booking.vehicle?.model }}</p>
                        <p class="text-[10px] font-mono font-bold text-gray-400">{{ booking.vehicle?.license_plate }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(booking.scheduled_start) }}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{{ formatTime(booking.scheduled_start) }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="booking.trip" class="space-y-0.5">
                      <p class="text-indigo-600 dark:text-indigo-400 font-bold">{{ booking.trip.total_amount }}€</p>
                      <p class="text-[10px] text-gray-400 font-medium">{{ booking.trip.minutes_driven }} min</p>
                    </div>
                    <span v-else class="text-gray-300">-</span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="getStatusClass(booking.status)" class="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {{ booking.status }}
                    </span>
                  </td>
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
import { onMounted, onUnmounted, computed } from 'vue'
import useBookingsUser from './composables/useBookingsUser'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import {
  MapIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const { bookings, loading, error, getBookings } = useBookingsUser()

const activeBookings = computed(() => 
  bookings.value.filter(b => ['pending', 'active'].includes(b.status))
)

const pastBookings = computed(() => 
  bookings.value.filter(b => !['pending', 'active'].includes(b.status))
)

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'expired': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatTime = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (date?: string) => {
  if (!date) return '-'
  return `${formatDate(date)} ${formatTime(date)}`
}

const formatRemainingTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

let timerInterval: any = null

const handleActivate = async (id: number) => {
  try {
    await apiClient.post(`/reservations/${id}/activate`)
    showToast('Vehículo activado correctamente', 'success')
    getBookings()
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al activar', 'error')
  }
}

const handleFinish = async (id: number) => {
  try {
    const res = await apiClient.post(`/reservations/${id}/finish`)
    showToast(`Viaje finalizado. Coste: ${res.data.cost}`, 'success')
    getBookings()
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al finalizar', 'error')
  }
}

const handleCancel = async (id: number) => {
  try {
    await apiClient.post(`/reservations/${id}/cancel`)
    showToast('Reserva cancelada', 'success')
    getBookings()
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al cancelar', 'error')
  }
}

onMounted(() => {
  getBookings()
  timerInterval = setInterval(() => {
    bookings.value.forEach((b: any) => {
      if (b.status === 'pending' && b.remaining_seconds > 0) {
        b.remaining_seconds--
      } else if (b.status === 'pending' && b.remaining_seconds <= 0) {
        b.status = 'expired'
      }
    })
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
