<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-900">
    <div @click="goToMap" class="w-full max-w-4xl h-96 bg-gray-800 rounded-lg shadow-lg cursor-pointer flex items-center justify-center border-2 border-white/10 hover:border-indigo-600">
      <div class="text-center text-gray-200">
        <div class="text-2xl font-semibold">Open Map</div>
        <div class="text-sm text-gray-400 mt-2">Click anywhere on the map to open the full vehicles map</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goToMap = () => router.push('/vehicles-map')
</script>

<style scoped>
/* Simple placeholder styling; actual map is on the vehicles-map page */
</style>
