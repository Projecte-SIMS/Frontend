<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      title="Vehículos"
      description="Gestión de vehículos de la flota"
    >
      <template #actions>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Añadir vehículo
        </button>
      </template>
    </PageHeading>

    <!-- Filters -->
    <div class="mt-6">
      <input
        v-model="filters.search"
        @input="handleSearch"
        type="text"
        placeholder="Buscar por matrícula, marca o modelo..."
        class="block w-full max-w-md rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="mt-8 text-center text-gray-500 dark:text-gray-400">
      Cargando vehículos...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="mt-8 text-center text-red-500">
      {{ error }}
    </div>

    <!-- Table -->
    <AdminsTable
      v-else
      :columns="columns"
      :empty="vehicles.length === 0"
    >
      <template #empty>
        No hay vehículos disponibles
      </template>

      <tr v-for="vehicle in vehicles" :key="vehicle.id">
        <AdminTd first variant="primary">
          {{ vehicle.license_plate }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ vehicle.brand || '-' }}
        </AdminTd>
        <AdminTd variant="muted">
          {{ vehicle.model || '-' }}
        </AdminTd>
        <AdminTd variant="muted">
          <span
            :class="[
              'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
              vehicle.active 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            ]"
          >
            {{ vehicle.active ? 'Activo' : 'Inactivo' }}
          </span>
        </AdminTd>
        <AdminTd variant="actions">
          <button
            class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Ver<span class="sr-only">, {{ vehicle.license_plate }}</span>
          </button>
        </AdminTd>
      </tr>
    </AdminsTable>

    <!-- Pagination -->
    <AdminPagination
      v-if="pagination.total > 0"
      :page="pagination.current_page"
      :per-page="pagination.per_page"
      :total="pagination.total"
      @update:page="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVehicles } from '../composables/useVehicles'
import type { VehicleFilters } from '../interfaces/vehicle.interface'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'

const { vehicles, loading, error, pagination, getVehicles } = useVehicles()

const columns = [
  { key: 'license_plate', label: 'Matrícula' },
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'active', label: 'Estado' },
  { key: 'actions', label: 'Acciones', srOnly: true }
]

const filters = ref<VehicleFilters>({
  search: ''
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadVehicles()
})

const loadVehicles = () => {
  getVehicles(pagination.value.current_page, filters.value)
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadVehicles()
  }, 500)
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadVehicles()
}
</script>
