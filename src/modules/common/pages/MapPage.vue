<template>
  <!-- Contenedor principal del mapa -->
  <div class="relative min-h-[100dvh] bg-gray-800">
    <div ref="mapContainer" class="absolute inset-0" style="height: calc(100vh - 4rem);"></div>
    <div class="map-controls absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 text-sm p-3 rounded shadow w-72">
      <div class="font-semibold mb-2">Buscar vehículos</div>
      <div class="space-y-2">
        <input v-model="query" @input="onSearch" placeholder="Placa, marca o modelo" class="w-full px-2 py-1 rounded border" />
        <div class="flex gap-2 items-center">
          <label class="flex items-center gap-2"><input type="checkbox" v-model="operativeOnly" @change="onToggleOperative" /> Solo operativos</label>
        </div>
        <div class="flex gap-2 items-center">
          <input type="number" v-model.number="radiusKm" @input="onRadiusChange" placeholder="Radio (km)" class="w-1/2 px-2 py-1 rounded border" />
          <button class="ml-auto px-2 py-1 bg-indigo-600 text-white rounded" @click="locateMe">Mi ubicación</button>
        </div>
      </div>
      <hr class="my-2" />
      <div class="font-semibold mb-1">Leyenda</div>
      <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff"></span><span>Available (Postgres)</span></div>
      <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff"></span><span>Occupied (Postgres)</span></div>
      <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#ffffff;display:inline-block;border:3px solid #ef4444"></span><span>Running (Mongo)</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMap } from '@/modules/common/composables/useMap'

const route = useRoute()
const { mapContainer, map, vehicles, initMap, fetchVehicles, setSearchQuery, setShowOperativeOnly, setUserLocation, setRadiusMeters, addVehicleMarkers, destroyMap } = useMap()

const query = ref('')
const operativeOnly = ref(false)
const radiusKm = ref<number | null>(null)

const onSearch = () => setSearchQuery(query.value)
const onToggleOperative = () => setShowOperativeOnly(operativeOnly.value)
const onRadiusChange = () => setRadiusMeters(radiusKm.value ? radiusKm.value * 1000 : null)

const locateMe = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude
    setUserLocation(lat, lng)
    if (map.value) {
      map.value.setView([lat, lng], 13)
      if ((window as any).L?.marker) (window as any).L.marker([lat, lng]).addTo(map.value).bindPopup('<b>You are here</b>').openPopup()
    }
  }, err => console.warn('Geolocation failed', err))
}

onMounted(() => {
  initMap()
  const view = route.query.view?.toString()
  if (route.path === '/vehicles-map' || view === 'all') {
    fetchVehicles('/vehicles-map').catch(err => console.error(err))
  } else {
    // allow locating user and then fetch vehicles within radius
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setUserLocation(lat, lng)
          if (map.value) {
            map.value.setView([lat, lng], 15)
          }
          fetchVehicles('/vehicles-map').catch(err => console.error(err))
        },
        (err) => {
          console.warn('Geolocation failed or denied', err)
        },
        { enableHighAccuracy: true }
      )
    } else {
      fetchVehicles('/vehicles-map').catch(err => console.error(err))
    }
  }
})

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
</style>
