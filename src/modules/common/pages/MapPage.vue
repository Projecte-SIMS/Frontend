<template>
  <!-- Contenedor principal del mapa -->
  <div class="relative min-h-[100dvh] bg-gray-800">
    <div ref="mapContainer" class="absolute inset-0" style="height: calc(100vh - 4rem);"></div>
    <aside v-show="panelOpen" class="map-controls absolute top-4 right-4 lg:right-20 bg-white/95 dark:bg-gray-900/95 text-sm p-6 rounded-2xl shadow-xl w-80 max-w-full backdrop-blur border border-white/10 animate-fade-in">
  <div class="flex items-center justify-between mb-4">
    <div class="font-bold text-lg text-gray-900 dark:text-white">Opciones del mapa</div>
    <button @click="panelOpen = false" class="text-gray-400 hover:text-indigo-500 transition" title="Cerrar panel">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  <div class="mb-3 flex flex-col gap-2">
  <input v-model="search" type="text" placeholder="Buscar por matrícula, marca..." class="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
  <div class="flex gap-2 items-center">
    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" v-model="showAvailableOnly" class="accent-indigo-500" /> Solo disponibles</label>
    <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" v-model="showRunningOnly" class="accent-indigo-500" /> Solo en marcha</label>
  </div>
</div>
<div class="mb-3 flex items-center justify-between">
  <span class="text-xs text-gray-500">Vehículos mostrados: <b>{{ filteredCount }}</b></span>
  <button @click="refresh" class="px-2 py-1 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-700 transition flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 104.582 9.582" /></svg>Actualizar</button>
</div>
<details class="map-legend-details bg-transparent mb-3">
  <summary class="font-semibold mb-1 cursor-pointer">Leyenda ▾</summary>
  <div class="mt-2 space-y-2">
    <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff"></span><span>Disponible</span></div>
    <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff"></span><span>Ocupado</span></div>
    <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#ffffff;display:inline-block;border:3px solid #ef4444"></span><span>En marcha</span></div>
  </div>
</details>
<details class="bg-transparent mb-2">
  <summary class="font-semibold mb-1 cursor-pointer">Ayuda rápida ▾</summary>
  <ul class="text-xs text-gray-500 mt-2 space-y-1 list-disc list-inside">
    <li>Haz clic en un vehículo para centrar el mapa.</li>
    <li>Filtra por estado o busca por matrícula.</li>
    <li>Usa el botón 📍 para centrar en tu ubicación.</li>
    <li>Actualiza para ver cambios en tiempo real.</li>
    <li>Última actualización: 2026-02-24 22:52</li>
  </ul>
</details>
<div class="mb-4">
  <label class="block text-xs text-gray-500 mb-1">Radio de búsqueda (km): <b>{{ nearbyRadiusKm }}</b></label>
  <input type="range" min="1" max="20" step="1" v-model="nearbyRadiusKm" @input="onSliderInput" @change="onRadiusChange" class="w-full accent-indigo-500" />
</div>
<details class="map-legend-details bg-transparent mb-3 rounded border border-white/5 shadow-sm">
  <summary class="flex items-center justify-between font-semibold mb-1 cursor-pointer px-2 py-1">
    <span>Vehículos cercanos</span>
    <span class="text-xs text-gray-400">≤ {{ nearbyRadiusKm }} km</span>
  </summary>
  <div class="mt-2 px-1 py-1">
    <div v-if="nearbyAvailable.length === 0" class="text-sm text-gray-400">No hay vehículos cercanos disponibles.</div>
    <ul v-else class="space-y-2 max-h-48 overflow-y-auto pr-1">
      <li v-for="v in nearbyAvailable.slice(0,6)" :key="v.id" class="flex items-center justify-between gap-3 p-1 rounded-md hover:bg-indigo-50/10 transition-colors cursor-pointer" @click="onNearbyClick(v)">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-8 h-8 rounded-full" :style="{ background: 'linear-gradient(180deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))' }">
            <span :style="{ width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', background: v.mongo_active ? '#ef4444' : (v.postgres_active ? '#f59e0b' : '#22c55e'), border: '2px solid #fff' }"></span>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-medium truncate">{{ v.plate }}</div>
            <div class="text-xs text-gray-400 truncate">{{ v.brand }} {{ v.model }}</div>
          </div>
        </div>
        <div>
          <div class="text-right">
            <div class="text-sm font-semibold text-indigo-400">{{ v.distanceMeters < 1000 ? `${Math.round(v.distanceMeters)} m` : `${(v.distanceMeters/1000).toFixed(2)} km` }}</div>
            <div class="text-xs text-gray-400">{{ v.mongo_active ? 'En marcha' : (v.postgres_active ? 'Ocupado' : 'Disponible') }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</details>
</aside>
<!-- Botón para abrir el panel lateral -->
<button v-if="!panelOpen" @click="panelOpen = true" class="fixed top-20 right-6 z-50 p-3 bg-gray-900 text-indigo-400 rounded-full shadow-lg hover:bg-indigo-500 animate-fade-in" title="Mostrar opciones del mapa">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.5-3.5a7.5 7.5 0 0 1-1.05 3.85l1.6 1.6a1 1 0 0 1-1.42 1.42l-1.6-1.6A7.5 7.5 0 0 1 12 20.5a7.5 7.5 0 0 1-3.85-1.05l-1.6 1.6a1 1 0 0 1-1.42-1.42l1.6-1.6A7.5 7.5 0 0 1 3.5 12a7.5 7.5 0 0 1 1.05-3.85l-1.6-1.6a1 1 0 0 1 1.42-1.42l1.6 1.6A7.5 7.5 0 0 1 12 3.5a7.5 7.5 0 0 1 3.85 1.05l1.6-1.6a1 1 0 0 1 1.42 1.42l-1.6 1.6A7.5 7.5 0 0 1 20.5 12z" />
  </svg>
</button>

    <!-- Floating locate button -->
    <button @click="locateMe" aria-label="Go to my location" class="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700">📍</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMap } from '@/modules/map/composables/useMap'

const route = useRoute()
const { mapContainer, map, vehicles, markers, initMap, fetchVehicles, setUserLocation, addVehicleMarkers, destroyMap, rawVehicles, userLocation, _internal, centerOnVehicle } = useMap()
let userMarker: any = null

const nearbyAvailable = ref<any[]>([])
const nearbyRadiusKm = ref(2)
const panelOpen = ref(false)

function onRadiusChange() {
  computeNearbyAvailable();
}
function onSliderInput() {}
function onFilter() {
  computeNearbyAvailable();
}
function onSearch() {
  computeNearbyAvailable();
}

const refresh = () => fetchVehicles('/vehicles/map')
const locateMe = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude
    setUserLocation(lat, lng)
    if (map.value) {
      map.value.setView([lat, lng], 13)
      // user marker handled by setUserLocation
      setUserLocation(lat, lng)
      userMarker?.openPopup()
    }
  }, err => console.warn('Geolocation failed', err))
}

function computeNearbyAvailable() {
  if (!map.value) return
  // prefer user's location if available, fallback to map center
  const centerPoint = (userLocation.value && userLocation.value.lat && userLocation.value.lng)
    ? { lat: userLocation.value.lat, lng: userLocation.value.lng }
    : map.value.getCenter()
  const R = 6371000
  const toRad = (x: number) => (x * Math.PI) / 180
  nearbyAvailable.value = rawVehicles.value
    .map(v => {
      if (v.latitude == null || v.longitude == null) return null
      const dLat = toRad(v.latitude - centerPoint.lat)
      const dLon = toRad(v.longitude - centerPoint.lng)
      const lat1 = toRad(centerPoint.lat)
      const lat2 = toRad(v.latitude)
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const d = R * c
      return { ...v, distanceMeters: d }
    })
    .filter(Boolean)
    .filter(v => !v.mongo_active && v.distanceMeters <= nearbyRadiusKm.value * 1000)
    .sort((a, b) => a?.distanceMeters - b?.distanceMeters)
    .slice(0, 10)
}

onMounted(() => {
  initMap()
  const view = route.query.view?.toString()

  // Always ask for geolocation when entering the vehicles map to center on user
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setUserLocation(lat, lng)
        if (map.value) {
          map.value.setView([lat, lng], 15)
        }
        fetchVehicles('/vehicles/map').catch(err => console.error(err))
        // try to grab userMarker via exposed internal function
        try { userMarker = _internal?.getUserMarker?.() ?? null } catch { userMarker = null }
        // compute nearby from user location
        setTimeout(() => computeNearbyAvailable(), 400)
      },
      (err) => {
        console.warn('Geolocation failed or denied', err)
        // fallback to default behavior
        if (route.path === '/vehicles/map' || view === 'all') {
          fetchVehicles('/vehicles/map').catch(err => console.error(err))
        } else {
          fetchVehicles('/vehicles/map').catch(err => console.error(err))
        }
        setTimeout(() => computeNearbyAvailable(), 600)
      },
      { enableHighAccuracy: true }
    )
  } else {
    // if geolocation not available, fallback to current logic
    if (route.path === '/vehicles/map' || view === 'all') {
      fetchVehicles('/vehicles/map').catch(err => console.error(err))
    } else {
      fetchVehicles('/vehicles/map').catch(err => console.error(err))
    }
    setTimeout(() => computeNearbyAvailable(), 600)
  }

  // compute when map moves
  if (map.value) {
    map.value.on('moveend', () => computeNearbyAvailable())
  }

  // attach click handlers to markers so clicking a map marker opens the selected panel
  function attachMarkerClicks() {
    if (!markers) return
    try {
      markers.forEach((m, id) => {
        // remove previous handlers
        try { m.off && m.off('click') } catch {}
        try { m.on && m.on('click', () => {
          const v = rawVehicles.value.find(rv => rv.id === id)
          if (v) {
            selectedVehicle.value = v
            showSelectedPanel.value = true
            centerOnVehicle(v)
          }
        }) } catch {}
      })
    } catch (e) {}
  }

  // schedule attaching handlers after markers are likely added
  setTimeout(() => attachMarkerClicks(), 1000)
})

const selectedVehicle = ref<any | null>(null)
const showSelectedPanel = ref(false)

function onNearbyClick(v: any) {
  // center on vehicle and open popup
  centerOnVehicle(v)
  selectedVehicle.value = v
  showSelectedPanel.value = true
}

function closeSelectedPanel() {
  showSelectedPanel.value = false
  selectedVehicle.value = null
}

onUnmounted(() => {
  destroyMap()
})
</script>

<style>
.vehicle-marker {
  background: transparent !important;
  border: none !important;
}
/* Ensure Leaflet map and all its panes stay below the app sidebar */
.leaflet-container,
.leaflet-control-container,
.leaflet-map-pane,
.leaflet-pane,
.leaflet-overlay-pane,
.leaflet-tile-pane,
.leaflet-shadow-pane {
  z-index: 0 !important;
}
/* Legend styling */
.map-legend { z-index: 10001; }
/* Allow sidebar and menus to receive pointer events above the map */
.admin-sidebar,
.app-sidebar,
.fixed-sidebar {
  z-index: 9999 !important;
  position: relative;
}

/* compact legend / nearby list tweaks */
.map-controls .map-legend-details {
  width: 18rem;
  font-size: 0.875rem;
}
.map-controls .map-legend-details summary { padding: 0 }
.map-controls .map-legend-details ul { padding: 0 }
.map-controls .map-legend-details li { padding: 0 }

/* selected panel and transition */
.selected-vehicle-panel { max-width: 18rem; }
.slide-fade-enter-active { transition: all .2s ease; }
.slide-fade-leave-active { transition: all .15s ease; }
.slide-fade-enter-from { transform: translateY(8px); opacity: 0; }
.slide-fade-enter-to { transform: translateY(0); opacity: 1; }
.slide-fade-leave-from { transform: translateY(0); opacity: 1; }
.slide-fade-leave-to { transform: translateY(8px); opacity: 0; }
</style>
