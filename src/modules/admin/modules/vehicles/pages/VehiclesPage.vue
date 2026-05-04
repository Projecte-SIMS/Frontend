<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Profesional -->
    <PageHeading
      title="Gestión de Flota"
      description="Control integral de unidades, estado operativo y telemetría de vehículos"
    >
      <template #actions>
        <router-link
          to="/admin/vehicles/create"
          class="inline-flex items-center gap-2 rounded-xl bg-brand-primary-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary-200 dark:shadow-none hover:bg-brand-primary-700 transition-all active:scale-95"
        >
          <PlusIcon class="size-4" />
          Registrar Unidad
        </router-link>
      </template>
    </PageHeading>

    <!-- Barra de Herramientas -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex flex-1 flex-col sm:flex-row items-center gap-3 max-w-4xl">
        <div class="relative flex-1 w-full">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <span class="material-icons text-lg">search</span>
          </span>
          <input
            v-model="filters.search"
            @input="handleSearch"
            type="text"
            placeholder="BUSCAR POR MATRÍCULA O MODELO..."
            class="block w-full rounded-xl border-0 bg-slate-50 dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary-600 text-[10px] font-bold uppercase tracking-widest transition-all"
          />
        </div>
        <select
          v-model="filters.status"
          @change="handleStatusChange"
          class="w-full sm:w-auto rounded-xl border-0 px-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-brand-primary-600 text-[10px] font-bold uppercase tracking-widest dark:bg-slate-950 transition-all cursor-pointer"
        >
          <option value="">TODOS LOS ESTADOS</option>
          <option value="available">DISPONIBLE</option>
          <option value="reserved">RESERVADO</option>
          <option value="running">EN RUTA</option>
          <option value="offline">FUERA DE SERVICIO (OFFLINE)</option>
        </select>
      </div>
      <div class="flex items-center justify-end gap-3">
        <!-- Contador de Límite por Plan -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
          <div class="flex flex-col items-end">
            <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">Capacidad de Flota</span>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-black text-slate-900 dark:text-white">{{ pagination.total }}</span>
              <span class="text-[10px] font-bold text-slate-400">/</span>
              <span v-if="vehicleLimit === Infinity" class="text-[9px] font-black text-brand-primary-600 uppercase tracking-widest">Ilimitado</span>
              <span v-else class="text-xs font-black text-slate-500">{{ vehicleLimit }}</span>
            </div>
          </div>
          <div 
            class="size-8 rounded-lg flex items-center justify-center"
            :class="isPro ? 'bg-brand-primary-50 text-brand-primary-600' : 'bg-slate-100 text-slate-400'"
          >
            <span class="material-icons text-lg">{{ isPro ? 'auto_awesome' : 'inventory_2' }}</span>
          </div>
        </div>

        <button 
          @click="loadVehicles" 
          class="p-2 text-slate-400 hover:text-brand-primary-600 transition-colors"
          title="Refrescar datos"
        >
          <ArrowPathIcon class="size-5" :class="{'animate-spin': loading}" />
        </button>
      </div>
    </div>

    <!-- Leyenda de estados -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="grid gap-3 md:grid-cols-2">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Estado Operativo (uso del vehículo)</p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <span :class="getStatusClasses('available')" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border">Disponible</span>
            <span :class="getStatusClasses('reserved')" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border">Reservado</span>
            <span :class="getStatusClasses('running')" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border">En Ruta</span>
            <span :class="getStatusClasses('offline')" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border">Offline</span>
          </div>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Estado Admin (disponibilidad en sistema)</p>
          <div class="mt-2 flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="size-1.5 rounded-full bg-emerald-500"></span>
              <span class="text-[10px] font-black uppercase tracking-widest text-emerald-600">Habilitado</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-1.5 rounded-full bg-rose-500"></span>
              <span class="text-[10px] font-black uppercase tracking-widest text-rose-600">Mantenimiento</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-6 text-center rounded-2xl bg-rose-50 border border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/20">
      <p class="text-[10px] font-black text-rose-600 uppercase tracking-widest">{{ error }}</p>
    </div>

    <!-- Tabla Maestra de Flota -->
    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th class="px-6 py-5">Vehículo / ID</th>
              <th class="px-6 py-5">Identificación</th>
              <th class="px-6 py-5 text-center">Tarifa</th>
              <th class="px-6 py-5 text-center">Estado Operativo</th>
              <th class="px-6 py-5 text-center">Estado Admin</th>
              <th class="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="vehicle in vehicles" :key="vehicle.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 shadow-inner group-hover:scale-105 transition-transform">
                    <img 
                      v-if="vehicle.brand"
                      :src="getVehicleImage(vehicle.brand, vehicle.model)" 
                      :alt="vehicle.brand"
                      class="h-full w-full object-cover"
                    />
                    <TruckIcon v-else class="size-6" />
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ vehicle.brand }} {{ vehicle.model }}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref: #{{ vehicle.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span class="text-xs font-black text-slate-700 dark:text-slate-300 font-mono tracking-wider">{{ vehicle.license_plate }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="text-xs font-black text-slate-900 dark:text-white">{{ formatCurrency(vehicle.price_per_minute) }}</div>
                <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">/ minuto</div>
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="getStatusClasses(vehicle.status)" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all">
                  {{ translateStatus(vehicle.status) }}
                </span>
                <p class="mt-1 text-[10px] font-semibold text-slate-400">
                  {{ getOperationalStatusHint(vehicle.status) }}
                </p>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <span class="size-1.5 rounded-full" :class="vehicle.active ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'"></span>
                  <span class="text-[10px] font-black uppercase tracking-widest" :class="vehicle.active ? 'text-rose-600' : 'text-emerald-600'">
                    {{ vehicle.active ? 'MANTENIMIENTO' : 'HABILITADO' }}
                  </span>
                </div>
                <p class="mt-1 text-[10px] font-semibold text-slate-400">
                  {{ vehicle.active ? 'No se asigna a nuevos viajes' : 'Puede ser asignado y reservado' }}
                </p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-1">
                  <router-link
                    :to="`/admin/map?select=${vehicle.id}`"
                    class="p-2 text-slate-400 hover:text-brand-primary-600 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/20 rounded-lg transition-all"
                    title="Seguimiento GPS"
                  >
                    <MapIcon class="size-5" />
                  </router-link>
                  <router-link
                    :to="`/admin/vehicles/${vehicle.id}/edit`"
                    class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                    title="Configurar"
                  >
                    <PencilSquareIcon class="size-5" />
                  </router-link>
                  <button
                    @click="confirmDelete(vehicle)"
                    class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <TrashIcon class="size-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty/Loading States -->
        <div v-if="vehicles.length === 0 && !loading" class="py-20 text-center">
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
            <span class="material-icons text-3xl text-slate-200">no_transport</span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No se encontraron unidades</p>
        </div>
        
        <div v-if="loading" class="py-20 flex flex-col items-center gap-4">
          <ArrowPathIcon class="size-8 animate-spin text-brand-primary-600/30" />
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando telemetría...</span>
        </div>
      </div>
    </div>

    <!-- Paginación Consistente -->
    <div class="mt-6">
      <AdminPagination
        v-if="pagination.total > 0"
        :page="pagination.current_page"
        :per-page="pagination.per_page"
        :total="pagination.total"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Modal de Eliminación -->
    <ConfirmDialog 
      :visible="showDeleteDialog"
      title="Eliminar Unidad"
      :message="`¿Estás seguro de eliminar el vehículo ${vehicleToDelete?.license_plate}? Esta acción es irreversible y se perderá su historial.`"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVehicles } from '../composables/useVehicles'
import { usePlan } from '@/modules/common/composables/usePlan'
import { getVehicleImage } from '@/modules/common/utils/vehicleImages'
import { useToast } from '@/modules/common/composables/useToast'
import type { Vehicle, VehicleFilters } from '../interfaces/vehicle.interface'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import ConfirmDialog from '@/modules/admin/components/ConfirmDialog.vue'
import {
  PlusIcon,
  ArrowPathIcon,
  MapIcon,
  PencilSquareIcon,
  TrashIcon,
  TruckIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const { vehicles, loading, error, pagination, getVehicles, deleteVehicle } = useVehicles()
const { vehicleLimit, isPro, fetchCurrentPlan } = usePlan()
const toast = useToast()

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
    toast.success('Vehículo eliminado correctamente')
    showDeleteDialog.value = false
    vehicleToDelete.value = null
    loadVehicles()
  } catch {
    showDeleteDialog.value = false
  }
}

const filters = ref<VehicleFilters>({
  search: '',
  status: ''
})

let searchTimeout: any = null

onMounted(() => {
  loadVehicles()
  fetchCurrentPlan()
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

const formatCurrency = (value?: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value ?? 0)
}

const getStatusClasses = (s?: string) => {
  const map: Record<string, string> = {
    running: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    reserved: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    available: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    offline: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700',
  }
  return map[s || ''] || 'bg-slate-50 text-slate-600 border-slate-200'
}

const translateStatus = (s?: string) => {
  const map: Record<string, string> = {
    running: 'En Ruta',
    reserved: 'Reservado',
    available: 'Disponible',
    offline: 'Sin Conexión',
  }
  return map[s || ''] || s || 'N/D'
}

const getOperationalStatusHint = (s?: string) => {
  const map: Record<string, string> = {
    running: 'Vehículo actualmente en uso',
    reserved: 'Apartado para una reserva activa',
    available: 'Listo para nueva reserva',
    offline: 'Dispositivo IoT desconectado o sin señal',
  }
  return map[s || ''] || 'Sin telemetría de estado'
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
