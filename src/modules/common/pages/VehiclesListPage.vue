<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Flota de Vehículos</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Explora los vehículos disponibles cerca de ti.</p>
      </div>
      <div class="flex gap-2">
        <router-link
          to="/vehicles/map"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-bold text-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
        >
          <MapIcon class="size-5 text-indigo-500" />
          Ver en Mapa
        </router-link>
      </div>
    </div>

    <!-- Active Booking Warning -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="hasActiveBooking" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-4 flex items-center gap-4">
        <div class="size-10 rounded-xl bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
          <ExclamationTriangleIcon class="size-6" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">Ya tienes una reserva activa</p>
          <p class="text-xs text-amber-700 dark:text-amber-400 font-medium">Debes finalizar tu viaje actual antes de poder realizar una nueva reserva.</p>
        </div>
        <router-link to="/bookings" class="px-4 py-2 bg-amber-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
          Ver mi reserva
        </router-link>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <ArrowPathIcon class="size-10 text-indigo-500 animate-spin mb-4" />
      <p class="text-gray-500 font-medium tracking-wide">Buscando vehículos disponibles...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="vehicles.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center px-6">
      <div class="size-20 rounded-full bg-amber-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
        <TruckIcon class="size-10 text-amber-500" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay vehículos disponibles ahora</h3>
      <p class="text-gray-500 max-w-sm mb-8">Lo sentimos, parece que todos nuestros vehículos están en uso o reservados. Vuelve a intentarlo en unos minutos.</p>
      <button
        @click="fetchVehicles"
        class="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
      >
        Actualizar lista
      </button>
    </div>

    <!-- Vehicles Grid -->
    <div v-else class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div 
        v-for="vehicle in sortedVehicles" 
        :key="vehicle.id"
        class="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
      >
        <!-- Vehicle Image & Badges -->
        <div class="relative mb-5 aspect-[16/9] rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img 
            :src="vehicle.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'" 
            class="size-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Vehículo"
          />
          <div class="absolute top-3 left-3 flex gap-2">
            <span v-if="vehicle.is_mine" class="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
              Tu Reserva
            </span>
            <span v-else class="px-2.5 py-1 rounded-lg bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
              Disponible
            </span>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-4 flex-grow">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">{{ vehicle.brand }} {{ vehicle.model }}</h3>
              <p class="text-indigo-600 dark:text-indigo-400 font-mono font-bold tracking-tighter">{{ vehicle.license_plate }}</p>
            </div>
            <div v-if="vehicle.distanceMeters != null" class="text-right">
              <p class="text-sm font-black text-gray-900 dark:text-white">
                {{ formatDistance(vehicle.distanceMeters) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4 text-xs font-bold text-gray-400 border-t border-gray-50 dark:border-gray-800 pt-4">
            <div class="flex items-center gap-1.5">
              <BoltIcon class="size-4 text-amber-500" />
              <span>Eléctrico</span>
            </div>
            <div class="flex items-center gap-1.5">
              <CurrencyEuroIcon class="size-4 text-green-500" />
              <span>{{ vehicle.price_per_minute || '0.15' }}€/min</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button 
            @click="viewDetail(vehicle)"
            class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
          >
            Detalles
          </button>
          <button 
            @click="openConfirm(vehicle)"
            :disabled="vehicle.is_mine || hasActiveBooking"
            :class="[hasActiveBooking ? 'grayscale opacity-50 cursor-not-allowed' : '']"
            class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {{ vehicle.is_mine ? 'Ya reservado' : (hasActiveBooking ? 'Límite alcanzado' : 'Reservar') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <ReservationConfirmModal 
      :is-open="isConfirmOpen"
      :vehicle="selectedVehicle"
      :loading="isReserving"
      @close="isConfirmOpen = false"
      @confirm="handleReserve"
    />

    <!-- Detail Slide-over -->
    <div v-if="isDetailOpen" class="fixed inset-0 z-[60] flex justify-end pointer-events-none">
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm pointer-events-auto" @click="isDetailOpen = false"></div>
      <div class="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl pointer-events-auto flex flex-col h-full animate-slide-in">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Detalles del Vehículo</h2>
          <button @click="isDetailOpen = false" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <XMarkIcon class="size-6 text-gray-400" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-8 space-y-8">
          <div class="aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img :src="'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'" class="size-full object-cover" />
          </div>
          <div class="space-y-6 text-left">
            <div>
              <h3 class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ selectedVehicle?.brand }} {{ selectedVehicle?.model }}</h3>
              <p class="text-indigo-600 dark:text-indigo-400 font-mono font-black text-lg mt-2 uppercase tracking-widest">{{ selectedVehicle?.license_plate }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Precio</p>
                <p class="text-xl font-black text-gray-900 dark:text-white">0.15€<span class="text-xs text-gray-500">/min</span></p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Energía</p>
                <p class="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <BoltIcon class="size-5 text-amber-500" /> 100%
                </p>
              </div>
            </div>

            <div class="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/30">
              <h4 class="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-3">Información Adicional</h4>
              <ul class="space-y-3 text-sm text-indigo-700/80 dark:text-indigo-400/80 font-medium">
                <li class="flex items-center gap-2"><CheckCircleIcon class="size-4" /> Apertura por app</li>
                <li class="flex items-center gap-2"><CheckCircleIcon class="size-4" /> Seguro incluido</li>
                <li class="flex items-center gap-2"><CheckCircleIcon class="size-4" /> Aparcamiento gratuito en zona azul/verde</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-100 dark:border-gray-800">
          <button 
            @click="openConfirm(selectedVehicle)"
            :disabled="selectedVehicle?.is_mine || hasActiveBooking"
            class="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {{ selectedVehicle?.is_mine ? 'Vehículo ya reservado' : (hasActiveBooking ? 'Finaliza tu reserva actual' : 'Reservar ahora') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import ReservationConfirmModal from '@/modules/common/components/ReservationConfirmModal.vue'
import useBookingsUser from '@/modules/bookings/composables/useBookingsUser'
import {
  MapIcon,
  ArrowPathIcon,
  TruckIcon,
  MapPinIcon,
  BoltIcon,
  CurrencyEuroIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const vehicles = ref<any[]>([])
const loading = ref(true)
const isConfirmOpen = ref(false)
const isReserving = ref(false)
const isDetailOpen = ref(false)
const selectedVehicle = ref<any>(null)

// Usar el composable de reservas para bloquear el botón
const { getBookings, hasActiveBooking } = useBookingsUser()

const sortedVehicles = computed(() => {
  return [...vehicles.value].sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity))
})

const formatDistance = (meters?: number) => {
  if (meters == null) return '-'
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters/1000).toFixed(1)} km`
}

const fetchVehicles = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/vehicles')
    vehicles.value = Array.isArray(res.data) ? res.data : (res.data.data ?? [])
  } catch (e) {
    console.error('Error fetching vehicles:', e)
    showToast('Error al cargar la lista de vehículos', 'error')
    vehicles.value = []
  } finally {
    loading.value = false
  }
}

const viewDetail = (vehicle: any) => {
  selectedVehicle.value = vehicle
  isDetailOpen.value = true
}

const openConfirm = (vehicle: any) => {
  selectedVehicle.value = vehicle
  isConfirmOpen.value = true
  isDetailOpen.value = false
}

const handleReserve = async () => {
  if (!selectedVehicle.value) return
  isReserving.value = true
  try {
    const payload = {
      vehicle_id: selectedVehicle.value.id,
      scheduled_start: new Date().toISOString()
    }
    const response = await apiClient.post('/reservations', payload)
    showToast(response.data.message || '¡Vehículo reservado!', 'success')
    router.push('/bookings')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al reservar', 'error')
  } finally {
    isReserving.value = false
    isConfirmOpen.value = false
  }
}

onMounted(() => {
  fetchVehicles()
  getBookings() // Cargar reservas para verificar estado
})
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>
