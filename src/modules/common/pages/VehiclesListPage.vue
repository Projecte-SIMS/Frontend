<template>
  <div class="min-h-screen bg-gray-900 p-8">
    <div class="mx-auto max-w-4xl">
      <h2 class="mb-6 text-2xl font-bold text-white">Vehículos disponibles</h2>
      <div v-if="loading" class="text-white">Cargando...</div>
      <div v-else-if="vehicles.length === 0" class="text-gray-300">No hay vehículos disponibles.</div>
      <div v-else class="grid gap-6 md:grid-cols-2">
        <div v-for="vehicle in sortedVehicles" :key="vehicle.id" class="rounded-2xl bg-gray-800/80 p-6 shadow-lg flex flex-col gap-3">
  <div class="flex items-center gap-4 mb-2">
    <img :src="vehicle.image" alt="Vehículo" class="w-20 h-20 rounded-xl object-cover border border-gray-700 bg-gray-700" />
    <div class="flex-1">
      <div class="text-lg font-semibold text-white">{{ vehicle.license_plate }}</div>
      <div class="text-sm text-gray-400">{{ vehicle.brand }} {{ vehicle.model }} <span v-if="vehicle.type" class="ml-2 text-xs bg-indigo-700/20 text-indigo-300 px-2 py-0.5 rounded">{{ vehicle.type }}</span></div>
      <div class="text-xs text-gray-400 mt-1">ID: {{ vehicle.id }}</div>
    </div>
    <span class="inline-block px-3 py-1 rounded-full text-xs font-medium"
          :class="vehicle.active ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'">
      {{ vehicle.active ? 'Ocupado' : 'Disponible' }}
    </span>
  </div>
  <div class="flex items-center justify-between mt-2">
    <div class="text-xs text-gray-300">
      <span v-if="vehicle.distanceMeters != null">
        Distancia: <b>{{ vehicle.distanceMeters < 1000 ? Math.round(vehicle.distanceMeters) + ' m' : (vehicle.distanceMeters/1000).toFixed(2) + ' km' }}</b>
      </span>
    </div>
    <button :disabled="vehicle.active" class="px-4 py-2 rounded bg-indigo-600 text-white font-semibold text-sm shadow hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-400 transition">
      Reservar
    </button>
  </div>
</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/api'

const vehicles = ref<any[]>([])
const loading = ref(true)

import { computed } from 'vue'
const sortedVehicles = computed(() => {
  return [...vehicles.value].sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
});

const fetchVehicles = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/vehicles')
    vehicles.value = Array.isArray(res.data) ? res.data : (res.data.data ?? [])
  } catch (e) {
    vehicles.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchVehicles)
</script>
