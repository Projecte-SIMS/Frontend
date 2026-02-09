<template>
  <!-- Contenedor principal del mapa -->
  <div class="relative min-h-[100dvh] bg-gray-800">
    <div ref="mapContainer" class="absolute inset-0" style="height: calc(100vh - 4rem);"></div>
    <div class="map-controls absolute top-4 right-4 lg:right-20 bg-white/95 dark:bg-gray-900/95 text-sm p-4 rounded-lg shadow w-80 backdrop-blur">

      <details class="map-legend-details bg-transparent">
        <summary class="font-semibold mb-1 cursor-pointer">Legend ▾</summary>
        <div class="mt-2 space-y-2">
          <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff"></span><span>Available (Postgres)</span></div>
          <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff"></span><span>Occupied (Postgres)</span></div>
          <div class="flex items-center gap-2"><span style="width:14px;height:14px;border-radius:50%;background:#ffffff;display:inline-block;border:3px solid #ef4444"></span><span>Running (Mongo)</span></div>
        </div>
      </details>

      <details class="map-legend-details bg-transparent mt-3 p-3 rounded border border-white/5">
        <summary class="font-semibold mb-1 cursor-pointer">Nearby available vehicles ▾</summary>
        <div class="mt-2">
          <div v-if="nearbyAvailable.length === 0" class="text-sm text-gray-400">No nearby available vehicles found.</div>
          <ul v-else class="space-y-2">
            <li v-for="v in nearbyAvailable" :key="v.id" class="flex items-center justify-between p-2 bg-white/3 rounded cursor-pointer hover:bg-white/6" @click="onNearbyClick(v)">
              <div>
                <div class="font-medium">{{ v.plate }}</div>
                <div class="text-xs text-gray-300">{{ v.brand }} {{ v.model }}</div>
              </div>
              <div class="text-sm text-gray-300">{{ (v.distanceMeters/1000).toFixed(2) }} km</div>
            </li>
          </ul>
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
const { mapContainer, map, vehicles, initMap, fetchVehicles, setUserLocation, addVehicleMarkers, destroyMap, rawVehicles, userLocation, _internal, centerOnVehicle } = useMap()
let userMarker: any = null

const nearbyAvailable = ref<any[]>([])

const refresh = () => fetchVehicles('/vehicles-map')
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
    .filter(v => !v.mongo_active)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
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
        fetchVehicles('/vehicles-map').catch(err => console.error(err))
        // try to grab userMarker via exposed internal function
        try { userMarker = _internal?.getUserMarker?.() ?? null } catch { userMarker = null }
        // compute nearby from user location
        setTimeout(() => computeNearbyAvailable(), 400)
      },
      (err) => {
        console.warn('Geolocation failed or denied', err)
        // fallback to default behavior
        if (route.path === '/vehicles-map' || view === 'all') {
          fetchVehicles('/vehicles-map').catch(err => console.error(err))
        } else {
          fetchVehicles('/vehicles-map').catch(err => console.error(err))
        }
        setTimeout(() => computeNearbyAvailable(), 600)
      },
      { enableHighAccuracy: true }
    )
  } else {
    // if geolocation not available, fallback to current logic
    if (route.path === '/vehicles-map' || view === 'all') {
      fetchVehicles('/vehicles-map').catch(err => console.error(err))
    } else {
      fetchVehicles('/vehicles-map').catch(err => console.error(err))
    }
    setTimeout(() => computeNearbyAvailable(), 600)
  }

  // compute when map moves
  if (map.value) {
    map.value.on('moveend', () => computeNearbyAvailable())
  }
})

function onNearbyClick(v: any) {
  // center on vehicle and open popup
  centerOnVehicle(v)
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
</style>
