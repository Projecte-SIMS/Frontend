<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
    <div class="text-center">
      <ArrowPathIcon class="size-12 animate-spin text-indigo-600 mx-auto mb-4" />
      <p class="text-gray-500 font-medium">Cargando detalles...</p>
    </div>
  </div>

  <div v-else-if="vehicle" class="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 font-sans px-4 sm:px-6 lg:px-8">
    <!-- Header with Breadcrumbs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <nav class="flex mb-2" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400">
            <li><router-link to="/admin/vehicles" class="hover:text-indigo-600">Vehículos</router-link></li>
            <li><ChevronRightIcon class="size-3" /></li>
            <li class="text-indigo-600">{{ vehicle.license_plate }}</li>
          </ol>
        </nav>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          {{ vehicle.brand }} {{ vehicle.model }}
        </h1>
      </div>
      <div class="flex items-center gap-3">
        <router-link
          :to="`/admin/vehicles/${vehicleId}/control`"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
        >
          <CommandLineIcon class="size-4" />
          Consola
        </router-link>
        <router-link
          :to="`/admin/vehicles/${vehicleId}/edit`"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
        >
          <PencilIcon class="size-4" />
          Editar
        </router-link>
        <router-link
          to="/admin/vehicles"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
        >
          <ArrowLeftIcon class="size-4" />
          Volver
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Image and Main Info -->
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div class="aspect-video rounded-3xl bg-gray-50 dark:bg-gray-800 mb-6 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-800">
            <img 
              :src="getVehicleImage(vehicle.brand, vehicle.model)" 
              class="size-full object-cover" 
              :alt="vehicle.brand + ' ' + vehicle.model"
            />
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matrícula</span>
              <span class="text-sm font-black text-gray-900 dark:text-white font-mono">{{ vehicle.license_plate }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</span>
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest',
                  !vehicle.active 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                ]"
              >
                {{ !vehicle.active ? 'Disponible' : 'En Uso' }}
              </span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio/min</span>
              <span class="text-sm font-black text-indigo-600 dark:text-indigo-400">{{ vehicle.price_per_minute }}€</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Full Details -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white dark:bg-gray-900 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-sm h-full">
          <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10">Información del Sistema</h3>
          
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div class="space-y-1">
              <dt class="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID de Registro</dt>
              <dd class="text-lg font-bold text-gray-900 dark:text-white font-mono">#{{ vehicle.id }}</dd>
            </div>
            
            <div class="space-y-1">
              <dt class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identidad IoT</dt>
              <dd class="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {{ vehicle.iot_device_id || 'No vinculado' }}
              </dd>
            </div>

            <div class="space-y-1">
              <dt class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha de Alta</dt>
              <dd class="text-sm font-bold text-gray-600 dark:text-gray-300">
                {{ formatDate(vehicle.created_at) }}
              </dd>
            </div>

            <div class="space-y-1">
              <dt class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Última Actualización</dt>
              <dd class="text-sm font-bold text-gray-600 dark:text-gray-300">
                {{ formatDate(vehicle.updated_at) }}
              </dd>
            </div>
          </dl>

          <!-- System Status Bar -->
          <div class="mt-16 p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 flex items-center gap-6">
            <div class="size-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
              <CpuChipIcon class="size-6 text-indigo-600" />
            </div>
            <div class="flex-1">
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Diagnóstico Rápido</h4>
              <p class="text-xs font-bold text-gray-700 dark:text-gray-300">
                {{ !vehicle.active ? 'El sistema está operativo y visible para los usuarios.' : 'El vehículo se encuentra en modo ocupado o mantenimiento.' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="!loading" class="text-center py-20">
    <ExclamationCircleIcon class="size-16 text-red-500 mx-auto mb-4" />
    <h2 class="text-2xl font-black text-gray-900 uppercase">Vehículo no encontrado</h2>
    <router-link to="/admin/vehicles" class="mt-4 inline-block text-indigo-600 font-bold hover:underline">Volver al listado</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicles } from '../composables/useVehicles'
import type { Vehicle } from '../interfaces/vehicle.interface'
import StatusBadge from '@/modules/admin/components/StatusBadge.vue'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import {
  ChevronRightIcon,
  CommandLineIcon,
  PencilIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CpuChipIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { getVehicle, loading, error } = useVehicles()

const vehicleId = Number(route.params.id)
const vehicle = ref<any>(null)

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

onMounted(async () => {
  try {
    vehicle.value = await getVehicle(vehicleId)
  } catch {
    router.push('/admin/vehicles')
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
