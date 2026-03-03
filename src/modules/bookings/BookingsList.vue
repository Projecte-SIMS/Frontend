<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
      <div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Mis Reservas</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">Historial de tus viajes y reservas activas.</p>
      </div>
      <router-link
        to="/vehicles/map"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
      >
        <MapIcon class="size-4" />
        Nueva Reserva
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
      <ArrowPathIcon class="size-10 text-indigo-500 animate-spin mb-4 opacity-20" />
      <p class="text-gray-400 text-xs font-black uppercase tracking-widest">Sincronizando viajes...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="bookings.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm text-center px-6">
      <div class="size-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
        <CalendarDaysIcon class="size-10 text-indigo-500" />
      </div>
      <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Sin actividad reciente</h3>
      <p class="text-gray-500 text-sm max-w-xs mb-8 font-medium">¿Listo para tu primer viaje? Encuentra un vehículo disponible en el mapa y reserva ahora.</p>
      <router-link
        to="/vehicles/map"
        class="px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
      >
        Buscar Vehículo
      </router-link>
    </div>

    <!-- Bookings List -->
    <div v-else class="space-y-10">
      <!-- Active/Pending Bookings -->
      <section v-if="activeBookings.length > 0" class="space-y-6">
        <h2 class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] ml-4">En curso</h2>
        <div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div 
            v-for="booking in activeBookings" 
            :key="booking.id"
            class="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl shadow-indigo-500/5 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <!-- Background Decoration -->
            <div class="absolute -right-10 -top-10 size-40 rounded-full bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>

            <div class="absolute top-6 right-6">
              <span :class="getStatusClass(booking.status)" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                {{ translateStatus(booking.status) }}
              </span>
            </div>

            <div class="flex items-start gap-6 mb-8 relative z-10">
              <div class="size-20 rounded-3xl bg-gray-50 dark:bg-gray-800 overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-inner">
                <img :src="getVehicleImage(booking.vehicle?.brand, booking.vehicle?.model)" class="size-full object-cover" alt="Vehículo" />
              </div>
              <div class="text-left flex-1 min-w-0">
                <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate leading-none mb-2">{{ booking.vehicle?.brand }} {{ booking.vehicle?.model }}</h3>
                <p class="text-indigo-600 dark:text-indigo-400 font-mono font-black text-sm uppercase tracking-tighter">{{ booking.vehicle?.license_plate }}</p>
                
                <!-- Countdown for Pending -->
                <div v-if="booking.status === 'pending' && (booking.remaining_seconds ?? 0) > 0" class="mt-4 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <div class="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                    <ClockIcon class="size-4 animate-pulse" />
                  </div>
                  <span class="text-xs font-black uppercase tracking-widest">Expira en: {{ formatRemainingTime(booking.remaining_seconds) }}</span>
                </div>

                <!-- Simple Status for Active -->
                <div v-if="booking.status === 'active'" class="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div class="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30">
                    <PlayIcon class="size-4" />
                  </div>
                  <span class="text-xs font-black uppercase tracking-widest">Viaje en curso</span>
                </div>
              </div>
            </div>

            <!-- Control Buttons (Simplified for Bookings Page) -->
            <div class="grid grid-cols-1 gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 relative z-10">
              <!-- Pending: Only Activate or Cancel -->
              <template v-if="booking.status === 'pending'">
                <div class="flex gap-3">
                  <button 
                    @click="handleActivate(booking.id)"
                    class="flex-1 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/30"
                  >
                    Activar Vehículo
                  </button>
                  <button 
                    @click="handleCancel(booking.id)"
                    class="px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                </div>
              </template>

              <!-- Active: Only shortcut to control panel -->
              <template v-if="booking.status === 'active'">
                <router-link 
                  to="/active-vehicle"
                  class="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-green-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-700 transition-all active:scale-95 shadow-xl shadow-green-500/30"
                >
                  <AdjustmentsHorizontalIcon class="size-4" />
                  Consola de Mando
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- History Section -->
      <section v-if="pastBookings.length > 0" class="space-y-6">
        <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-4">Historial de Viajes</h2>
        <div class="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th class="px-8 py-5">Vehículo</th>
                  <th class="px-8 py-5">Fecha</th>
                  <th class="px-8 py-5 text-right">Duración / Coste</th>
                  <th class="px-8 py-5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-800 text-sm">
                <tr v-for="booking in pastBookings" :key="booking.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-4 text-left">
                      <div class="size-10 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden">
                        <img :src="getVehicleImage(booking.vehicle?.brand, booking.vehicle?.model)" class="size-full object-cover" alt="Vehículo" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-black text-gray-900 dark:text-white truncate">{{ booking.vehicle?.model }}</p>
                        <p class="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-tighter">{{ booking.vehicle?.license_plate }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-5 text-left">
                    <p class="text-gray-900 dark:text-white font-bold">{{ formatDate(booking.scheduled_start) }}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ formatTime(booking.scheduled_start) }}</p>
                  </td>
                  <td class="px-8 py-5 text-right min-w-[140px]">
                    <div v-if="booking.trip" class="space-y-0.5">
                      <p class="text-indigo-600 dark:text-indigo-400 font-black text-base">{{ booking.trip.total_amount }}€</p>
                      <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">{{ booking.trip.minutes_driven }} min</p>
                    </div>
                    <span v-else class="text-gray-300">-</span>
                  </td>
                  <td class="px-8 py-5 text-center">
                    <span :class="getStatusClass(booking.status)" class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {{ translateStatus(booking.status) }}
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
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import {
  MapIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  TruckIcon,
  ClockIcon,
  PlayIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/vue/24/outline'

const { bookings, loading, getBookings } = useBookingsUser()

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
    default: return 'bg-gray-100 text-gray-600'
  }
}

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    completed: 'Completado',
    cancelled: 'Cancelado',
    expired: 'Expirado',
    pending: 'Pendiente',
    active: 'Activo'
  }
  return map[status] || status
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatTime = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
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
    showToast('¡Buen viaje! Vehículo activado.', 'success')
    // Al activar, el layout detectará el cambio y mostrará el botón de "En viaje"
    // Pero forzamos un reload de la lista para limpiar la vista actual
    getBookings()
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al activar', 'error')
  }
}

const handleCancel = async (id: number) => {
  if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return
  try {
    await apiClient.post(`/reservations/${id}/cancel`)
    showToast('Reserva cancelada correctamente', 'success')
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
      }
    })
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
