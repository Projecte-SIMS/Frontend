<template>
  <!-- Contenedor principal del mapa -->
  <div class="relative min-h-[100dvh] bg-gray-800">
    <div ref="mapContainer" class="absolute inset-0" style="height: calc(100vh - 4rem);"></div>
    <div class="map-legend absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 text-sm p-2 rounded shadow">
      <div class="font-semibold mb-1">Legend</div>
      <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff"></span><span>Available (Postgres)</span></div>
      <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff"></span><span>Occupied (Postgres)</span></div>
      <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#ffffff;display:inline-block;border:3px solid #ef4444"></span><span>Running (Mongo)</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMap } from '@/composables/useMap'

const route = useRoute()
const { mapContainer, map, vehicles, initMap, fetchVehicles, addVehicleMarkers, destroyMap } = useMap()

onMounted(() => {
  initMap()
  const view = route.query.view?.toString()
  if (route.path === '/vehicles-map' || view === 'all') {
    fetchVehicles('/vehicles-map').catch(err => console.error(err))
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          if (map.value) {
            map.value.setView([lat, lng], 15)
            const youMarker = (window as any).L?.marker ? (window as any).L.marker([lat, lng]).addTo(map.value) : null
            if (youMarker && youMarker.bindPopup) youMarker.bindPopup('<b>You are here</b>').openPopup()
            if ((window as any).L?.circle) (window as any).L.circle([lat, lng], { radius: 50 }).addTo(map.value)
          }
        },
        (err) => {
          console.warn('Geolocation failed or denied', err)
        },
        { enableHighAccuracy: true }
      )
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
