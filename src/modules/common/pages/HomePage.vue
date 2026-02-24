<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 text-white flex flex-col items-center justify-center px-4">
    <header class="w-full max-w-4xl mx-auto pt-16 pb-8 flex flex-col items-center">
      <h1 class="text-5xl font-extrabold tracking-tight text-center drop-shadow-lg mb-4" style="font-family: 'SF Pro Display', 'Inter', sans-serif;">Gestiona tu flota<br><span class="text-indigo-400">en tiempo real</span></h1>
      <p class="text-xl text-gray-300 text-center max-w-2xl mb-8">Visualiza, reserva y gestiona vehículos fácilmente. Experiencia moderna, rápida y segura para usuarios y empresas.</p>
      <button @click="openMap" class="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg hover:scale-105 transition-transform text-lg font-semibold">Ver mapa interactivo</button>
    </header>

    <section class="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
      <div class="flex-1 bg-gray-800/80 rounded-3xl shadow-2xl border border-white/10 overflow-hidden min-h-[24rem] flex flex-col justify-center">
        <div ref="miniMap" class="w-full h-80 md:h-96 cursor-pointer"></div>
      </div>
      <div class="flex-1 flex flex-col gap-4">
        <h2 class="text-2xl font-bold mb-2">Vehículos cercanos disponibles</h2>
        <div v-if="nearbyAvailable.length === 0" class="text-gray-400">No hay vehículos disponibles cerca.</div>
        <div v-else class="flex flex-col gap-3">
          <div v-for="v in nearbyAvailable" :key="v.id" class="bg-gray-900/80 rounded-xl p-4 shadow flex items-center gap-4 hover:bg-gray-800/90 transition">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
              <span>{{ v.plate.slice(-3) }}</span>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-lg">{{ v.brand }} {{ v.model }}</div>
              <div class="text-gray-400 text-sm">{{ v.plate }}</div>
              <div class="text-xs text-gray-400 mt-1">A {{ v.distanceMeters ? v.distanceMeters.toFixed(0) : '-' }} m</div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800" v-if="!v.mongo_active">Disponible</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800" v-else>Ocupado</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ventajas -->
    <section class="w-full max-w-4xl mx-auto mb-16">
      <h2 class="text-2xl font-bold mb-6 text-center">¿Por qué elegir SIMS?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-800/80 rounded-2xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform">
          <svg class="w-10 h-10 mb-3 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>
          <div class="font-semibold text-lg mb-1">Gestión en tiempo real</div>
          <div class="text-gray-400 text-center">Visualiza y controla tu flota al instante desde cualquier dispositivo.</div>
        </div>
        <div class="bg-gray-800/80 rounded-2xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform">
          <svg class="w-10 h-10 mb-3 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          <div class="font-semibold text-lg mb-1">Reservas fáciles</div>
          <div class="text-gray-400 text-center">Reserva vehículos en segundos, sin papeleo ni complicaciones.</div>
        </div>
        <div class="bg-gray-800/80 rounded-2xl p-6 flex flex-col items-center shadow hover:scale-105 transition-transform">
          <svg class="w-10 h-10 mb-3 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
          <div class="font-semibold text-lg mb-1">Soporte 24/7</div>
          <div class="text-gray-400 text-center">Nuestro equipo está siempre disponible para ayudarte en lo que necesites.</div>
        </div>
      </div>
    </section>

    <!-- Opiniones -->
    <section class="w-full max-w-4xl mx-auto mb-16">
      <h2 class="text-2xl font-bold mb-6 text-center">Opiniones de usuarios</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-900/80 rounded-2xl p-6 shadow flex flex-col items-center">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" class="w-14 h-14 rounded-full mb-3 border-2 border-indigo-400" alt="Usuario 1" />
          <div class="italic text-gray-300 text-center mb-2">“Reservar un coche nunca fue tan fácil. La app es rápida y el soporte excelente.”</div>
          <div class="font-semibold text-indigo-300">Carlos M.</div>
        </div>
        <div class="bg-gray-900/80 rounded-2xl p-6 shadow flex flex-col items-center">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" class="w-14 h-14 rounded-full mb-3 border-2 border-indigo-400" alt="Usuario 2" />
          <div class="italic text-gray-300 text-center mb-2">“Puedo ver todos los vehículos disponibles en tiempo real. ¡Muy recomendable!”</div>
          <div class="font-semibold text-indigo-300">Lucía G.</div>
        </div>
        <div class="bg-gray-900/80 rounded-2xl p-6 shadow flex flex-col items-center">
          <img src="https://randomuser.me/api/portraits/men/65.jpg" class="w-14 h-14 rounded-full mb-3 border-2 border-indigo-400" alt="Usuario 3" />
          <div class="italic text-gray-300 text-center mb-2">“La gestión de flota para empresas es perfecta. Todo centralizado y seguro.”</div>
          <div class="font-semibold text-indigo-300">Jordi P.</div>
        </div>
      </div>
    </section>

    <footer class="w-full max-w-4xl mx-auto text-center text-sm text-gray-500 pb-8 pt-4 opacity-80">
      Última actualización: 2026-02-24 22:34
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMap } from '@/modules/map/composables/useMap'

const router = useRouter()
const openMap = () => router.push('/vehicles/map')

const { map, mapContainer, initMap, destroyMap, fetchVehicles, addVehicleMarkers, rawVehicles } = useMap()
const miniMap = ref<HTMLElement | null>(null)
const nearbyAvailable = ref<any[]>([])

function computeDistancesAndFilter() {
  if (!map.value) return
  const center = map.value.getCenter()
  const R = 6371000
  const toRad = (x: number) => (x * Math.PI) / 180
  nearbyAvailable.value = rawVehicles.value
    .map(v => {
      if (v.latitude == null || v.longitude == null) return null
      const dLat = toRad(v.latitude - center.lat)
      const dLon = toRad(v.longitude - center.lng)
      const lat1 = toRad(center.lat)
      const lat2 = toRad(v.latitude)
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const d = R * c
      return { ...v, distanceMeters: d }
    })
    .filter(Boolean)
    .filter(v => !v.mongo_active) // available means postgres not occupied (based on icon logic)
    .sort((a, b) => a?.distanceMeters - b?.distanceMeters)
    .slice(0, 10)
}

onMounted(async () => {
  if (!miniMap.value) return
  mapContainer.value = miniMap.value
  initMap()
  try {
    await fetchVehicles('/vehicles/map')
    addVehicleMarkers()
    // compute after markers added
    setTimeout(() => computeDistancesAndFilter(), 400)
  } catch (e) {
    console.error(e)
  }
  if (map.value) {
    map.value.on('click', () => openMap())
    map.value.on('moveend', () => computeDistancesAndFilter())
  }
})

onUnmounted(() => destroyMap())
</script>

<style scoped>
[ref="miniMap"] { display: block; }
</style>
