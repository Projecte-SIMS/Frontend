<template>
  <!-- Contenedor principal del mapa -->
  <div class="relative min-h-[100dvh] bg-gray-800">
    <div ref="mapContainer" class="absolute inset-0" style="height: calc(100vh - 4rem);"></div>
    <div class="map-controls absolute top-4 right-4 lg:right-20 bg-white/95 dark:bg-gray-900/95 text-sm p-4 rounded-lg shadow w-80 backdrop-blur">
      <div class="flex items-center justify-between mb-2">
        <div class="font-semibold text-sm">Nearby vehicles</div>
        <button @click="refresh" class="text-xs text-indigo-600">Refresh</button>
      </div>
      <div>
        <select v-model="selectedVehicleId" @change="onSelectVehicle" class="w-full px-3 py-2 rounded border">
          <option value="">-- Select nearby vehicle --</option>
          <option v-for="v in nearbyVehicles" :key="v.id" :value="v.id">{{ v.plate }} — {{ (v.distanceMeters/1000).toFixed(2) }} km</option>
        </select>
      </div>
      <div class="flex items-center gap-2 mt-2">
        <input type="number" v-model.number="radiusKm" @input="onRadiusChange" placeholder="Radius (km)" class="w-32 px-2 py-1 rounded border" />
      </div>
      <hr class="my-3" />
      <details class="map-legend-details bg-transparent">
        <summary class="font-semibold mb-1 cursor-pointer">Legend ▾</summary>
        <div class="mt-2 space-y-2">
          <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff"></span><span>Available</span></div>
          <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff"></span><span>Occupied</span></div>
          <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#ffffff;display:inline-block;border:3px solid #ef4444"></span><span>Running</span></div>
        </div>
      </details>
    </div>

    <!-- Floating locate button -->
    <button @click="locateMe" aria-label="Go to my location" class="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700">📍</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMap } from '@/modules/common/composables/useMap'

const route = useRoute()
const { mapContainer, map, vehicles, initMap, fetchVehicles, setUserLocation, addVehicleMarkers, destroyMap } = useMap()

const refresh = () => fetchVehicles('/vehicles-map')
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
