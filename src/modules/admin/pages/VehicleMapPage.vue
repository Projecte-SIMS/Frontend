<template>
  <div class="h-full">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Map</h1>
      <p class="text-gray-600 dark:text-gray-400">Real-time fleet location</p>
    </div>
    
    <!-- Map -->
    <!-- Reserve left space for admin sidebar (lg) and reduce height on small screens -->
    <div ref="mapContainer" class="w-full h-[500px] lg:ml-0 lg:pl-0 rounded-lg shadow-lg z-0" style="height: 60vh;"></div>
    <div class="map-legend absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 text-sm p-2 rounded shadow">
      <div class="font-semibold mb-1">Legend</div>
      <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#22c55e;display:inline-block;border:2px solid #ffffff"></span><span>Available (Postgres)</span></div>
      <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#f59e0b;display:inline-block;border:2px solid #ffffff"></span><span>Occupied (Postgres)</span></div>
      <div class="flex items-center gap-2"><span style="width:12px;height:12px;border-radius:50%;background:#ffffff;display:inline-block;border:3px solid #ef4444"></span><span>Running (Mongo)</span></div>
    </div>
    
    <!-- Vehicles list -->
    <div class="mt-4 space-y-3">
      <div v-for="vehicle in vehicles" :key="vehicle.id" class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4" @click="centerOnVehicle(vehicle)">
          <div class="flex flex-col">
            <p class="font-semibold text-gray-900 dark:text-white">{{ vehicle.plate }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.brand }} {{ vehicle.model }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-full" :class="vehicle.postgres_active ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">{{ vehicle.postgres_active ? 'Occupied' : 'Available' }}</span>
            <span class="text-xs px-2 py-1 rounded-full" :class="vehicle.mongo_active ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'">{{ vehicle.mongo_active ? 'Running' : 'Stopped' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="text-sm text-indigo-600 hover:underline" @click.stop="centerOnVehicle(vehicle)">Center</button>
          <button class="text-sm text-gray-600 hover:underline" @click.stop="markers.get(vehicle.id)?.openPopup()">Open popup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useMap } from '@/composables/useMap'

const { mapContainer, vehicles, markers, initMap, fetchVehicles, centerOnVehicle, destroyMap } = useMap()

onMounted(() => {
  initMap()
  fetchVehicles('/vehicles-map-admin').catch(err => console.error(err))
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
