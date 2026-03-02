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

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <ArrowPathIcon class="size-10 text-indigo-500 animate-spin mb-4" />
      <p class="text-gray-500 font-medium tracking-wide">Buscando vehículos disponibles...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="vehicles.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center px-6">
      <div class="size-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-6">
        <TruckIcon class="size-10 text-amber-500" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay vehículos disponibles ahora</h3>
      <p class="text-gray-500 max-w-sm mb-8">Lo sentimos, parece que todos nuestros vehículos están en uso en este momento. Vuelve a intentarlo en unos minutos.</p>
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
            <span class="px-2.5 py-1 rounded-lg bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
              Disponible
            </span>
            <span v-if="vehicle.type" class="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
              {{ vehicle.type }}
            </span>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-4 flex-grow">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ vehicle.brand }} {{ vehicle.model }}</h3>
              <p class="text-indigo-600 dark:text-indigo-400 font-mono font-bold tracking-tighter">{{ vehicle.license_plate }}</p>
            </div>
            <div v-if="vehicle.distanceMeters != null" class="text-right">
              <div class="flex items-center gap-1 justify-end text-gray-400 text-xs font-bold uppercase tracking-tighter">
                <MapPinIcon class="size-3" />
                Distancia
              </div>
              <p class="text-sm font-black text-gray-900 dark:text-white">
                {{ vehicle.distanceMeters < 1000 ? Math.round(vehicle.distanceMeters) + ' m' : (vehicle.distanceMeters/1000).toFixed(2) + ' km' }}
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
        <div class="mt-6">
          <button 
            @click="handleReserve(vehicle)"
            class="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-900 dark:bg-indigo-600 text-white font-bold text-sm hover:bg-gray-800 dark:hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            Reservar ahora
            <ArrowRightIcon class="size-4" />
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
import {
  MapIcon,
  ArrowPathIcon,
  TruckIcon,
  MapPinIcon,
  BoltIcon,
  CurrencyEuroIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const vehicles = ref<any[]>([])
const loading = ref(true)

// El backend ya filtra por disponibilidad (active=false y mongo_active=false) para no-admins
const sortedVehicles = computed(() => {
  return [...vehicles.value].sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity))
})

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

const handleReserve = (vehicle: any) => {
  // Redirigir al mapa con el vehículo seleccionado para confirmar reserva
  router.push({ path: '/vehicles/map', query: { select: vehicle.id } })
}

onMounted(fetchVehicles)
</script>
