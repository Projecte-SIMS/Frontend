<template>
  <div class="min-h-screen bg-gray-900 p-8">
    <div class="mx-auto max-w-4xl">
      <h2 class="mb-6 text-2xl font-bold text-white">Vehículos disponibles</h2>
      <div v-if="loading" class="text-white">Cargando...</div>
      <div v-else-if="vehicles.length === 0" class="text-gray-300">No hay vehículos disponibles.</div>
      <div v-else class="grid gap-6 md:grid-cols-2">
        <div v-for="vehicle in vehicles" :key="vehicle.id" class="rounded-lg bg-gray-800/70 p-6 shadow">
          <div class="flex items-center justify-between mb-2">
            <div>
              <div class="text-lg font-semibold text-white">{{ vehicle.license_plate }}</div>
              <div class="text-sm text-gray-400">{{ vehicle.brand }} {{ vehicle.model }}</div>
            </div>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  :class="vehicle.active ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'">
              {{ vehicle.active ? 'Ocupado' : 'Disponible' }}
            </span>
          </div>
          <div class="text-xs text-gray-400">ID: {{ vehicle.id }}</div>
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
