<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <PageHeading
      title="Vehículos"
      description="Gestión de vehículos de la flota"
    >
      <template #actions>
        <router-link
          to="/admin/vehicles/create"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Añadir vehículo
        </router-link>
      </template>
    </PageHeading>

    <!-- Filters and Stats -->
    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap items-center gap-3">
        <input
          v-model="filters.search"
          @input="handleSearch"
          type="text"
          placeholder="Buscar por matrícula, marca o modelo..."
          class="block w-full sm:w-72 rounded-lg border-0 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
        />
        <select
          v-model="filters.status"
          @change="handleStatusChange"
          class="rounded-lg border-0 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700"
        >
          <option value="">Todos los estados</option>
          <option value="active">En uso</option>
          <option value="available">Disponible</option>
        </select>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ pagination.total }} vehículos
      </p>
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

      <tr v-for="vehicle in vehicles" :key="vehicle.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <AdminTd first variant="muted">
          {{ vehicle.id }}
        </AdminTd>
        <AdminTd variant="primary">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              <img 
                v-if="vehicle.image_url" 
                :src="vehicle.image_url" 
                :alt="vehicle.brand + ' ' + vehicle.model"
                class="h-full w-full object-cover"
              />
              <span v-else class="material-icons text-gray-400">directions_car</span>
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ vehicle.brand }} {{ vehicle.model }}</div>
              <div class="text-xs font-mono text-gray-500 dark:text-gray-400">{{ vehicle.license_plate }}</div>
            </div>
          </div>
        </AdminTd>
        <AdminTd variant="muted">
          <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {{ vehicle.type || 'Estándar' }}
          </span>
        </AdminTd>
        <AdminTd variant="muted">
          <div class="flex items-center gap-2">
            <span class="material-icons text-sm" :class="getBatteryColor(vehicle.battery_level)">battery_full</span>
            <span>{{ vehicle.battery_level ?? '-' }}%</span>
          </div>
        </AdminTd>
        <AdminTd variant="muted">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
              vehicle.active 
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            ]"
          >
            {{ vehicle.active ? 'En uso' : 'Disponible' }}
          </span>
        </AdminTd>
        <AdminTd variant="actions">
          <div class="flex gap-2">
            <router-link
              :to="`/admin/vehicles/${vehicle.id}`"
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              title="Ver"
            >
              <span class="material-icons text-xl">visibility</span>
              <span class="sr-only">Ver, {{ vehicle.license_plate }}</span>
            </router-link>
            <router-link
              :to="`/admin/vehicles/${vehicle.id}/edit`"
              class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
              title="Editar"
            >
              <span class="material-icons text-xl">edit</span>
              <span class="sr-only">Editar, {{ vehicle.license_plate }}</span>
            </router-link>
            <button
              @click="confirmDelete(vehicle)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              title="Eliminar"
            >
              <span class="material-icons text-xl">delete</span>
              <span class="sr-only">Eliminar, {{ vehicle.license_plate }}</span>
            </button>
          </div>
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

    <!-- Delete confirmation -->
    <ConfirmDialog
      :visible="showDeleteDialog"
      title="Eliminar vehículo"
      :message="`¿Estás seguro de que quieres eliminar el vehículo ${vehicleToDelete?.license_plate}?`"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVehicles } from '../composables/useVehicles'
import type { Vehicle, VehicleFilters } from '../interfaces/vehicle.interface'
import AdminsTable from '@/modules/admin/components/AdminsTable.vue'
import AdminTd from '@/modules/admin/components/AdminTd.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import ConfirmDialog from '@/modules/admin/components/ConfirmDialog.vue'

const { vehicles, loading, error, pagination, getVehicles, deleteVehicle } = useVehicles()

// Delete state
const showDeleteDialog = ref(false)
const vehicleToDelete = ref<Vehicle | null>(null)

function confirmDelete(vehicle: Vehicle) {
  vehicleToDelete.value = vehicle
  showDeleteDialog.value = true
}

async function handleDelete() {
  if (!vehicleToDelete.value) return
  try {
    await deleteVehicle(vehicleToDelete.value.id)
    showDeleteDialog.value = false
    vehicleToDelete.value = null
    loadVehicles()
  } catch {
    showDeleteDialog.value = false
  }
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'vehicle', label: 'Vehículo' },
  { key: 'type', label: 'Tipo' },
  { key: 'battery', label: 'Batería' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Acciones', srOnly: true }
]

const filters = ref<VehicleFilters>({
  search: '',
  status: ''
})

const getBatteryColor = (level?: number) => {
  if (!level) return 'text-gray-400'
  if (level > 60) return 'text-green-500'
  if (level > 30) return 'text-amber-500'
  return 'text-red-500'
}

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

const handleStatusChange = () => {
  pagination.value.current_page = 1
  loadVehicles()
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadVehicles()
}
</script>
