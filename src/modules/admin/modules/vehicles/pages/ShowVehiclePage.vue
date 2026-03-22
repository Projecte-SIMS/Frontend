<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading
      v-if="vehicle"
      :title="`${vehicle.brand} ${vehicle.model}`"
      :description="`Details for vehicle with license plate ${vehicle.license_plate}`"
    >
      <template #actions>
        <router-link
          :to="`/admin/vehicles/${vehicleId}/edit`"
          class="flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <span>Edit Vehicle</span>
        </router-link>
        <router-link
          to="/admin/vehicles"
          class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>Back to List</span>
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loading"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Loading vehicle data...</p>
    </div>

    <div
      v-else-if="vehicle"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="aspect-[4/3] rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden">
            <img
              :src="getVehicleImage(vehicle.brand, vehicle.model)"
              :alt="`${vehicle.brand} ${vehicle.model}`"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="lg:col-span-2">
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">License Plate</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ vehicle.license_plate }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Brand & Model</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ vehicle.brand }} {{ vehicle.model }}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                      vehicle.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    ]"
                  >
                    {{ vehicle.active ? 'Active' : 'Inactive' }}
                  </span>
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Connectivity</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  <span
                    class="flex items-center gap-2"
                    :class="vehicle.online ? 'text-green-600' : 'text-gray-400'"
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="vehicle.online ? 'bg-green-500' : 'bg-gray-300'"
                    ></span>
                    {{ vehicle.online ? 'Online' : 'Offline' }}
                  </span>
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(vehicle.created_at) }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(vehicle.updated_at) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center p-8">
      <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Vehicle not found</h2>
      <p class="mt-2 text-sm text-gray-500">
        The requested vehicle does not exist or could not be loaded.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicles } from '../composables/useVehicles'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import {
  ChevronRightIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { getVehicle, loading } = useVehicles()

const vehicleId = Number(route.params.id)
const vehicle = ref<any>(null)

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

onMounted(async () => {
  try {
    vehicle.value = await getVehicle(vehicleId)
  } catch (err) {
    console.error('Failed to load vehicle:', err)
    // Optionally, navigate away or show a more permanent error state
  }
})
</script>
