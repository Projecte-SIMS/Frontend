<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Flota de Vehículos</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ filteredVehicles.length }} vehículos disponibles cerca de ti
        </p>
      </div>
      <div class="flex gap-2">
        <button
          @click="fetchVehicles"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-bold text-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50"
        >
          <ArrowPathIcon class="size-5" :class="loading ? 'animate-spin text-indigo-500' : 'text-gray-400'" />
        </button>
        <router-link
          to="/vehicles/map"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
        >
          <MapIcon class="size-5" />
          Ver en Mapa
        </router-link>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por marca, modelo o matrícula..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        
        <!-- Filter: Status -->
        <select
          v-model="filterStatus"
          class="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="all">Todos los estados</option>
          <option value="available">Solo disponibles</option>
          <option value="in_use">En uso</option>
        </select>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="distance">Más cercanos</option>
          <option value="brand">Marca (A-Z)</option>
          <option value="model">Modelo (A-Z)</option>
        </select>
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
    <div v-if="loading && vehicles.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <ArrowPathIcon class="size-10 text-indigo-500 animate-spin mb-4" />
      <p class="text-gray-500 font-medium tracking-wide">Buscando vehículos disponibles...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredVehicles.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center px-6">
      <div class="size-20 rounded-full bg-amber-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
        <TruckIcon class="size-10 text-amber-500" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {{ vehicles.length === 0 ? 'No hay vehículos disponibles' : 'Sin resultados' }}
      </h3>
      <p class="text-gray-500 max-w-sm mb-8">
        {{ vehicles.length === 0 ? 'Lo sentimos, todos nuestros vehículos están en uso. Vuelve a intentarlo en unos minutos.' : 'No se encontraron vehículos con los filtros aplicados.' }}
      </p>
      <button
        v-if="vehicles.length === 0"
        @click="fetchVehicles"
        class="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
      >
        Actualizar lista
      </button>
      <button
        v-else
        @click="clearFilters"
        class="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        Limpiar filtros
      </button>
    </div>

    <!-- Vehicles Grid -->
    <div v-else class="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div 
        v-for="vehicle in filteredVehicles" 
        :key="vehicle.id"
        class="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
      >
        <!-- Vehicle Image & Badges -->
        <div class="relative aspect-[16/10] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img 
            :src="getVehicleImage(vehicle.brand, vehicle.model)" 
            class="size-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Vehículo"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute top-3 left-3 flex gap-2">
            <span 
              v-if="vehicle.online === false"
              class="bg-gray-500 px-2.5 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
            >
              Desconectado
            </span>
            <span 
              v-else
              :class="vehicle.mongo_active ? 'bg-red-500' : (vehicle.is_mine ? 'bg-amber-500' : 'bg-green-500')"
              class="px-2.5 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
            >
              {{ vehicle.mongo_active ? 'En uso' : (vehicle.is_mine ? 'Tu Reserva' : 'Disponible') }}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 right-3">
            <h3 class="text-lg font-black text-white leading-tight drop-shadow-lg">{{ vehicle.brand }} {{ vehicle.model }}</h3>
            <p class="text-indigo-300 font-mono font-bold text-sm tracking-tight">{{ vehicle.license_plate }}</p>
          </div>
          <div v-if="vehicle.distanceMeters != null" class="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <p class="text-xs font-black text-white flex items-center gap-1">
              <MapPinIcon class="size-3" />
              {{ formatDistance(vehicle.distanceMeters) }}
            </p>
          </div>
        </div>

        <!-- Details -->
        <div class="p-4 flex-grow flex flex-col">
          <div class="flex items-center justify-between gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 mb-4">
            <div class="flex items-center gap-1.5">
              <BoltIcon class="size-4 text-amber-500" />
              <span>Eléctrico</span>
            </div>
            <div class="flex items-center gap-1.5">
              <CurrencyEuroIcon class="size-4 text-green-500" />
              <span class="text-green-600 dark:text-green-400 font-black">{{ vehicle.price_per_minute || '0.15' }}€<span class="text-gray-400 font-medium">/min</span></span>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-auto grid grid-cols-2 gap-2">
            <button 
              @click="viewDetail(vehicle)"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
            >
              <EyeIcon class="size-4" />
              Detalles
            </button>
            <button 
              @click="openConfirm(vehicle)"
              :disabled="vehicle.is_mine || vehicle.mongo_active || hasActiveBooking || vehicle.online === false"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              {{ vehicle.online === false ? 'No disponible' : (vehicle.mongo_active ? 'En uso' : (vehicle.is_mine ? 'Ya reservado' : (hasActiveBooking ? 'Límite' : 'Reservar'))) }}
            </button>
          </div>
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
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm pointer-events-auto" @click="isDetailOpen = false"></div>
      <div class="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl pointer-events-auto flex flex-col h-full animate-slide-in">
        <div class="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600">
          <h2 class="text-lg font-black text-white uppercase tracking-widest">Detalles del Vehículo</h2>
          <button @click="isDetailOpen = false" class="p-2 rounded-full hover:bg-white/20 transition-all">
            <XMarkIcon class="size-5 text-white" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <!-- Imagen del vehículo -->
          <div class="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
            <img :src="getVehicleImage(selectedVehicle?.brand, selectedVehicle?.model)" class="size-full object-cover opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-2xl font-black text-white leading-none">{{ selectedVehicle?.brand }} {{ selectedVehicle?.model }}</h3>
              <p class="text-indigo-400 font-mono font-bold text-sm mt-1 uppercase tracking-widest">{{ selectedVehicle?.license_plate }}</p>
            </div>
            <!-- Badge de estado -->
            <div class="absolute top-4 right-4">
              <span v-if="selectedVehicle?.online === false" class="px-3 py-1 rounded-full bg-gray-500/90 text-white text-xs font-bold">Desconectado</span>
              <span v-else-if="selectedVehicle?.mongo_active" class="px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold">En uso</span>
              <span v-else-if="selectedVehicle?.is_mine" class="px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-bold">Tu reserva</span>
              <span v-else class="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold">Disponible</span>
            </div>
          </div>

          <div class="p-6 space-y-5">
            <!-- Mapa con ubicación del vehículo -->
            <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
              <div class="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center gap-2">
                <MapPinIcon class="size-4 text-indigo-500" />
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Ubicación del vehículo</span>
                <span v-if="selectedVehicle?.distanceMeters" class="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  A {{ formatDistance(selectedVehicle.distanceMeters) }} de ti
                </span>
              </div>
              <div ref="detailMapContainer" class="h-44 bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800/50 text-center">
                <CurrencyEuroIcon class="size-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                <p class="text-lg font-black text-emerald-700 dark:text-emerald-300">0.15€</p>
                <p class="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase">/minuto</p>
              </div>
              <div class="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800/50 text-center">
                <BoltIcon class="size-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                <p class="text-lg font-black text-amber-700 dark:text-amber-300">100%</p>
                <p class="text-[10px] font-bold text-amber-600/70 dark:text-amber-400/70 uppercase">Batería</p>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800/50 text-center">
                <MapPinIcon class="size-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p class="text-lg font-black text-blue-700 dark:text-blue-300">{{ formatDistance(selectedVehicle?.distanceMeters) }}</p>
                <p class="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">Distancia</p>
              </div>
            </div>

            <!-- Información adicional -->
            <div class="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30">
              <h4 class="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-3">Incluido en tu reserva</h4>
              <ul class="space-y-2 text-sm text-indigo-700/80 dark:text-indigo-400/80 font-medium">
                <li class="flex items-center gap-2"><CheckCircleIcon class="size-4 text-indigo-500" /> Apertura remota por app</li>
                <li class="flex items-center gap-2"><CheckCircleIcon class="size-4 text-indigo-500" /> Seguro a todo riesgo incluido</li>
                <li class="flex items-center gap-2"><CheckCircleIcon class="size-4 text-indigo-500" /> Aparcamiento gratis en zona azul/verde</li>
                <li class="flex items-center gap-2"><CheckCircleIcon class="size-4 text-indigo-500" /> Asistencia 24h en carretera</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button 
            @click="openConfirm(selectedVehicle)"
            :disabled="selectedVehicle?.is_mine || selectedVehicle?.mongo_active || hasActiveBooking || selectedVehicle?.online === false"
            class="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm uppercase tracking-widest hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          >
            {{ selectedVehicle?.online === false ? 'No disponible' : (selectedVehicle?.mongo_active ? 'Vehículo en uso' : (selectedVehicle?.is_mine ? 'Ya tienes este vehículo' : (hasActiveBooking ? 'Finaliza tu reserva actual' : 'Reservar ahora'))) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import showToast from '@/modules/common/composables/useToast'
import ReservationConfirmModal from '@/modules/common/components/ReservationConfirmModal.vue'
import useBookingsUser from '@/modules/bookings/composables/useBookingsUser'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  MapIcon,
  ArrowPathIcon,
  TruckIcon,
  MapPinIcon,
  BoltIcon,
  CurrencyEuroIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'

const router = useRouter()
const vehicles = ref<any[]>([])
const loading = ref(true)
const isConfirmOpen = ref(false)
const isReserving = ref(false)
const isDetailOpen = ref(false)
const selectedVehicle = ref<any>(null)
const myLocation = ref<{ lat: number; lng: number } | null>(null)
const detailMapContainer = ref<HTMLElement | null>(null)
let detailMap: L.Map | null = null

// Filtros
const searchQuery = ref('')
const filterStatus = ref('all')
const sortBy = ref('distance')

// Usar el composable de reservas para bloquear el botón
const { getBookings, hasActiveBooking } = useBookingsUser()

// Calcular distancia entre dos puntos
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calcular distancias de todos los vehículos
function computeDistances() {
  if (!myLocation.value) return
  vehicles.value = vehicles.value.map(v => {
    if (v.latitude != null && v.longitude != null) {
      v.distanceMeters = calculateDistance(myLocation.value!.lat, myLocation.value!.lng, v.latitude, v.longitude)
    }
    return v
  })
}

const filteredVehicles = computed(() => {
  let result = [...vehicles.value]
  
  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(v => 
      v.brand?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      v.license_plate?.toLowerCase().includes(q)
    )
  }
  
  // Filtrar por estado
  if (filterStatus.value === 'available') {
    result = result.filter(v => !v.mongo_active && !v.is_mine && v.online !== false)
  } else if (filterStatus.value === 'in_use') {
    result = result.filter(v => v.mongo_active)
  }
  
  // Ordenar
  if (sortBy.value === 'distance') {
    result.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity))
  } else if (sortBy.value === 'brand') {
    result.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''))
  } else if (sortBy.value === 'model') {
    result.sort((a, b) => (a.model || '').localeCompare(b.model || ''))
  }
  
  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'all'
  sortBy.value = 'distance'
}

const formatDistance = (meters?: number) => {
  if (meters == null) return '-'
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters/1000).toFixed(1)} km`
}

const fetchVehicles = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/vehicles')
    vehicles.value = Array.isArray(res.data) ? res.data : (res.data.data ?? [])
    computeDistances()
  } catch (e) {
    console.error('Error fetching vehicles:', e)
    showToast('Error al cargar la lista de vehículos', 'error')
    vehicles.value = []
  } finally {
    loading.value = false
  }
}

// Inicializar mapa del detalle cuando se abre
const initDetailMap = () => {
  if (!detailMapContainer.value || !selectedVehicle.value) return
  
  // Destruir mapa anterior si existe
  if (detailMap) {
    detailMap.remove()
    detailMap = null
  }
  
  const lat = selectedVehicle.value.latitude || 41.3851
  const lng = selectedVehicle.value.longitude || 2.1734
  
  detailMap = L.map(detailMapContainer.value, {
    zoomControl: false,
    attributionControl: false
  }).setView([lat, lng], 16)
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(detailMap)
  
  // Marcador del vehículo
  const vehicleIcon = L.divIcon({
    html: `<div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(99,102,241,0.5); border: 3px solid white;">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
    </div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  })
  
  L.marker([lat, lng], { icon: vehicleIcon }).addTo(detailMap)
  
  // Marcador de mi ubicación si existe
  if (myLocation.value) {
    const myIcon = L.divIcon({
      html: `<div style="background: #10b981; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    })
    L.marker([myLocation.value.lat, myLocation.value.lng], { icon: myIcon }).addTo(detailMap)
      .bindPopup('Tu ubicación')
  }
}

// Watch para inicializar el mapa cuando se abre el detalle
watch(isDetailOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    setTimeout(initDetailMap, 100)
  } else if (detailMap) {
    detailMap.remove()
    detailMap = null
  }
})

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
  // Obtener ubicación del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        myLocation.value = { lat: position.coords.latitude, lng: position.coords.longitude }
        fetchVehicles()
      },
      () => {
        fetchVehicles()
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  } else {
    fetchVehicles()
  }
  getBookings()
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
