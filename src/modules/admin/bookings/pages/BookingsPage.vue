<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Profesional -->
    <PageHeading
      title="Historial de Operaciones"
      description="Seguimiento detallado de reservas, estados de uso y facturación de la flota"
    >
      <template #actions>
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
        >
          <PlusIcon class="size-4" />
          Nueva Reserva
        </button>
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
            placeholder="BUSCAR POR USUARIO O MATRÍCULA..."
            class="block w-full rounded-xl border-0 bg-slate-50 dark:bg-slate-950 pl-11 pr-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 text-[10px] font-bold uppercase tracking-widest transition-all"
          />
        </div>
        <select
          v-model="filters.status"
          @change="handleStatusChange"
          class="w-full sm:w-auto rounded-xl border-0 px-4 py-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-600 text-[10px] font-bold uppercase tracking-widest dark:bg-slate-950 transition-all cursor-pointer"
        >
          <option value="">TODOS LOS ESTADOS</option>
          <option value="active">ACTIVO</option>
          <option value="pending">PENDIENTE</option>
          <option value="completed">COMPLETADO</option>
          <option value="cancelled">CANCELADO</option>
          <option value="expired">EXPIRADO</option>
        </select>
      </div>
      <div class="flex items-center justify-end gap-6 px-2">
        <div class="flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ activeCount }} ACTIVAS</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ pendingCount }} PENDIENTES</span>
        </div>
      </div>
    </div>

    <!-- Tabla Maestra de Reservas -->
    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th class="px-6 py-5">Usuario</th>
              <th class="px-6 py-5">Vehículo</th>
              <th class="px-6 py-5">Programación</th>
              <th class="px-6 py-5">Importe</th>
              <th class="px-6 py-5 text-center">Estado</th>
              <th class="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-[10px] font-black shadow-inner border border-indigo-100/50 dark:border-indigo-800/50">
                    {{ getInitials(booking.user?.name || `U${booking.user_id ?? ''}`) }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {{ booking.user?.name || `Usuario #${booking.user_id ?? '-'}` }}
                    </div>
                    <div class="text-[10px] font-bold text-slate-400 lowercase truncate max-w-[150px]">
                      {{ booking.user?.email || '-' }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div v-if="booking.vehicle" class="flex items-center gap-3">
                  <div class="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img 
                      v-if="getVehicleImg(booking.vehicle)" 
                      :src="getVehicleImg(booking.vehicle)" 
                      class="h-full w-full object-cover"
                    />
                    <TruckIcon v-else class="size-5 text-slate-400" />
                  </div>
                  <div>
                    <div class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {{ booking.vehicle.brand }} {{ booking.vehicle.model }}
                    </div>
                    <div class="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[9px] font-black text-slate-500 font-mono">
                      {{ booking.vehicle.license_plate }}
                    </div>
                  </div>
                </div>
                <div v-else class="text-[10px] font-black text-slate-300 uppercase">Vehículo #{{ booking.vehicle_id ?? '-' }}</div>
              </td>

              <td class="px-6 py-4">
                <div class="text-[10px] font-black uppercase tracking-tight">
                  <div class="text-slate-900 dark:text-white">
                    <span class="text-indigo-600 dark:text-indigo-400">{{ formatDateDay(getStartDate(booking)) }}</span>
                    · {{ formatDateHour(getStartDate(booking)) }}
                  </div>
                  <div class="text-slate-400 mt-0.5 flex items-center gap-1">
                    <span class="material-icons text-[10px]">arrow_forward</span>
                    {{ formatDateDay(getEndDate(booking)) }} · {{ formatDateHour(getEndDate(booking)) }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <span class="text-sm font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {{ formatCurrency(getTotal(booking)) }}
                </span>
              </td>

              <td class="px-6 py-4 text-center">
                <span
                  :class="[
                    'inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border transition-all',
                    getStatusClasses(booking.status),
                  ]"
                >
                  {{ translateStatus(booking.status) }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-1">
                  <button
                    class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    @click="navigateToDetail(booking.id)"
                    title="Detalle de Operación"
                  >
                    <span class="material-icons text-xl">visibility</span>
                  </button>
                  <button
                    class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                    @click="navigateToEdit(booking.id)"
                    title="Modificar"
                  >
                    <span class="material-icons text-xl">edit</span>
                  </button>
                  <button
                    @click="handleDelete(booking.id)"
                    class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                    title="Anular"
                  >
                    <span class="material-icons text-xl">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="bookings.length === 0 && !loading" class="py-20 text-center">
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
            <span class="material-icons text-3xl text-slate-200">receipt_long</span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No se encontraron registros operativos</p>
        </div>
        
        <div v-if="loading" class="py-20 flex flex-col items-center gap-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600/30"></div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando operaciones...</span>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div class="mt-6">
      <AdminPagination
        v-if="pagination.total > 0"
        :page="pagination.current_page"
        :per-page="pagination.per_page"
        :total="pagination.total"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Modal de Creación -->
    <Modal :show="showCreateModal" @close="closeCreateModal" size="md">
      <template #header>
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <PlusIcon class="size-6" />
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Nueva Reserva</h3>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registro manual de operación</p>
          </div>
        </div>
      </template>

      <div class="grid gap-6 sm:grid-cols-2 p-1">
        <FormInput
          v-model="createForm.user_id"
          label="ID DE USUARIO"
          placeholder="EJ. 1"
          type="number"
        />
        <FormInput
          v-model="createForm.vehicle_id"
          label="ID DE VEHÍCULO"
          placeholder="EJ. 3"
          type="number"
        />
        <div class="sm:col-span-2">
          <FormField label="PROGRAMACIÓN DE INICIO (ESTIMADA)">
            <input
              v-model="createForm.scheduled_start"
              type="datetime-local"
              class="block w-full rounded-xl border-0 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white shadow-inner ring-1 ring-inset ring-slate-200 dark:ring-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
            />
          </FormField>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 w-full sm:justify-end">
          <button
            type="button"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
            @click="closeCreateModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            :disabled="creating"
            class="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            @click="handleCreate"
          >
            {{ creating ? 'PROCESANDO...' : 'REGISTRAR RESERVA' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookings } from '../composables/useBookings'
import type { Booking, BookingFilters, BookingCreatePayload } from '../interfaces/booking.interface'
import AdminPagination from '@/modules/admin/components/AdminPagination.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import Modal from '@/modules/admin/components/Modal.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import FormField from '@/modules/admin/components/FormField.vue'
import { useToast } from '@/modules/common/composables/useToast'
import { PlusIcon, TruckIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { bookings, loading, error, pagination, getBookings, deleteBooking, createBooking } = useBookings()
const { success: toastSuccess, error: toastError } = useToast()

const activeCount = computed(() => bookings.value.filter(b => b.status === 'active').length)
const pendingCount = computed(() => bookings.value.filter(b => b.status === 'pending').length)

const filters = ref<BookingFilters>({ search: '', status: '' })
const showCreateModal = ref(false)
const creating = ref(false)
const createForm = ref({ user_id: '', vehicle_id: '', scheduled_start: '' })
let searchTimeout: any = null

const loadBookings = (page = 1) => getBookings(page, filters.value)

onMounted(() => loadBookings())

const openCreateModal = () => { showCreateModal.value = true }
const closeCreateModal = () => { showCreateModal.value = false }

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadBookings()
  }, 500)
}

const handleStatusChange = () => {
  pagination.value.current_page = 1
  loadBookings()
}

const handlePageChange = (page: number) => {
  pagination.value.current_page = page
  loadBookings(page)
}

const handleCreate = async () => {
  if (!createForm.value.vehicle_id || !createForm.value.scheduled_start) {
    toastError('Rellena los campos obligatorios')
    return
  }
  const payload: BookingCreatePayload = {
    vehicle_id: Number(createForm.value.vehicle_id),
    scheduled_start: createForm.value.scheduled_start,
  }
  if (createForm.value.user_id) payload.user_id = Number(createForm.value.user_id)

  creating.value = true
  try {
    await createBooking(payload)
    toastSuccess('Operación registrada')
    createForm.value = { user_id: '', vehicle_id: '', scheduled_start: '' }
    showCreateModal.value = false
    loadBookings(pagination.value.current_page)
  } catch (e: any) {
    toastError(e)
  } finally {
    creating.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('¿Anular este registro operativo?')) return
  try {
    await deleteBooking(id)
    toastSuccess('Registro eliminado')
    loadBookings(pagination.value.current_page)
  } catch (e: any) {
    toastError(e)
  }
}

const getInitials = (name?: string) =>
  name ? name.split(' ').map((x) => x[0]).join('').substring(0, 2).toUpperCase() : '??'

const formatDateDay = (d: string) => d ? new Date(d).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : '-'
const formatDateHour = (d: string) => d ? new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'
const formatCurrency = (v: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)
const getVehicleImg = (v: any) => v.image_url || v.vehicle_image || null

const getStatusClasses = (s: string) => {
  const map: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    completed: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    expired: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  }
  return map[s] || 'bg-slate-50 text-slate-600 border-slate-200'
}

const translateStatus = (s: string) => {
  const map: Record<string, string> = {
    active: 'Activo',
    completed: 'Finalizado',
    cancelled: 'Cancelado',
pending: 'Pendiente',
    expired: 'Expirado',
  }
  return map[s] || s
}

const getStartDate = (booking: Booking) => booking.start_time || booking.scheduled_start || booking.trip?.engine_started_at || ''
const getEndDate = (booking: Booking) => booking.end_time || booking.activation_deadline || booking.trip?.engine_started_at || ''
const getTotal = (booking: Booking) => booking.total_price ?? booking.trip?.total_amount ?? 0

const navigateToDetail = (id: number) => router.push(`/admin/bookings/${id}`)
const navigateToEdit = (id: number) => router.push(`/admin/bookings/${id}/edit`)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
