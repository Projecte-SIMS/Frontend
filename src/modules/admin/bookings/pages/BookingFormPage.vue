<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading
      :title="isEditMode ? 'Editar Reserva' : 'Nueva Reserva'"
      description="Gestiona la asignación de vehículos y tiempos de reserva."
    >
      <template #actions>
        <router-link
          to="/admin/bookings"
          class="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <span class="material-icons text-base text-slate-400">arrow_back</span>
          Volver al Listado
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loading || dataLoading"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-20 text-center flex flex-col items-center gap-4"
    >
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary-600"></div>
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando información de reserva...</p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <!-- Lado Izquierdo: Formulario -->
      <div class="lg:col-span-2 space-y-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Asignación -->
          <div class="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Asignación de Recursos</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField label="CLIENTE ASIGNADO">
                <FormSelect v-model="form.user_id" placeholder="Seleccionar un cliente">
                  <option v-for="u in usersList" :key="u.id" :value="u.id">
                    {{ u.name }} ({{ u.email }})
                  </option>
                </FormSelect>
              </FormField>

              <FormField label="VEHÍCULO">
                <FormSelect v-model="form.vehicle_id" placeholder="Seleccionar un vehículo">
                  <option v-for="v in vehiclesList" :key="v.id" :value="v.id">
                    {{ v.license_plate }} · {{ v.brand }} {{ v.model }}
                  </option>
                </FormSelect>
              </FormField>
            </div>
          </div>

          <!-- Tiempos y Estado -->
          <div class="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Control de Tiempo y Estado</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField label="INICIO PROGRAMADO">
                <input
                  v-model="form.scheduled_start"
                  type="datetime-local"
                  required
                  class="block w-full rounded-xl border-0 px-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-brand-primary-600 text-sm font-medium outline-none transition-all"
                />
              </FormField>

              <FormField label="ESTADO DE LA RESERVA">
                <FormSelect v-model="form.status">
                  <option value="pending">PENDIENTE (POR ACTIVAR)</option>
                  <option value="active">ACTIVA (EN CURSO)</option>
                  <option value="completed">COMPLETADA (FINALIZADA)</option>
                  <option value="cancelled">CANCELADA</option>
                  <option value="expired">EXPIRADA</option>
                </FormSelect>
              </FormField>
            </div>
          </div>

          <!-- Notas -->
          <div class="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Observaciones de Administración</h3>
            <FormField label="NOTAS INTERNAS">
              <textarea
                v-model="form.notes"
                rows="4"
                placeholder="Añade comentarios sobre esta reserva o cambios realizados..."
                class="block w-full rounded-xl border-0 px-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-brand-primary-600 text-sm font-medium outline-none transition-all"
              ></textarea>
            </FormField>
          </div>

          <!-- Acciones -->
          <div class="flex items-center justify-end gap-4 p-4 border-t border-slate-100 dark:border-slate-800">
            <router-link
              to="/admin/bookings"
              class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Cancelar
            </router-link>
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center gap-2 rounded-xl bg-brand-primary-600 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary-200 dark:shadow-none hover:bg-brand-primary-700 transition-all active:scale-95 disabled:opacity-50"
            >
              <span v-if="saving" class="material-icons text-sm animate-spin">autorenew</span>
              <span>{{ saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Lado Derecho: Info Side -->
      <div class="space-y-8">
        <div class="p-6 bg-brand-primary-600 rounded-3xl text-white shadow-xl shadow-brand-primary-200 dark:shadow-none relative overflow-hidden">
          <div class="relative z-10">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-4">Información de Seguridad</h4>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="material-icons text-brand-primary-200 text-lg">info</span>
                <p class="text-xs font-medium leading-relaxed">
                  Modificar una reserva activa puede afectar la telemetría del viaje en curso. Procede con precaución.
                </p>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-icons text-brand-primary-200 text-lg">schedule</span>
                <p class="text-xs font-medium leading-relaxed">
                  Si cambias el inicio programado, el límite de activación se recalculará automáticamente (+10 min).
                </p>
              </div>
            </div>
          </div>
          <div class="absolute -right-4 -bottom-4 size-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div v-if="isEditMode && currentBooking?.trip" class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Detalles del Viaje Asociado</h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500 uppercase">Minutos</span>
              <span class="text-sm font-black text-slate-900 dark:text-white">{{ currentBooking.trip.minutes_driven }} min</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500 uppercase">Coste</span>
              <span class="text-sm font-black text-brand-primary-600 dark:text-brand-primary-400">{{ formatCurrency(currentBooking.trip.total_amount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormField from '@/modules/admin/components/FormField.vue'
import FormSelect from '@/modules/admin/components/FormSelect.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import { useBookings } from '../composables/useBookings'
import { useUsers } from '@/modules/admin/modules/users/composables/useUsers'
import { useVehicles } from '@/modules/admin/modules/vehicles/composables/useVehicles'
import type { BookingCreatePayload } from '../interfaces/booking.interface'
import { useToast } from '@/modules/common/composables/useToast'

const route = useRoute()
const router = useRouter()
const { getBooking, updateBooking, currentBooking, loading } = useBookings()
const { getUsers, users: usersList } = useUsers()
const { getVehicles, vehicles: vehiclesList } = useVehicles()
const { success: toastSuccess, error: toastError } = useToast()

const bookingId = computed(() => (route.params.id ? Number(route.params.id) : null))
const isEditMode = computed(() => !!bookingId.value)

const dataLoading = ref(true)
const saving = ref(false)

const form = reactive({
  user_id: '' as string | number,
  vehicle_id: '' as string | number,
  scheduled_start: '',
  status: 'pending' as any,
  notes: ''
})

onMounted(async () => {
  try {
    dataLoading.value = true
    // Cargar listas para los selectores
    await Promise.all([
      getUsers(),
      getVehicles()
    ])

    if (bookingId.value) {
      const booking = await getBooking(bookingId.value)
      if (booking) {
        form.user_id = booking.user_id || ''
        form.vehicle_id = booking.vehicle_id || ''
        form.status = booking.status || 'pending'
        form.notes = (booking as any).notes || ''
        
        if (booking.scheduled_start) {
          // Formatear para datetime-local (YYYY-MM-DDTHH:mm)
          const date = new Date(booking.scheduled_start)
          const offset = date.getTimezoneOffset() * 60000
          const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16)
          form.scheduled_start = localISOTime
        }
      }
    }
  } catch (e) {
    toastError('Error al cargar la información necesaria')
    router.push('/admin/bookings')
  } finally {
    dataLoading.value = false
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (value: number | null | undefined) => {
  const amount = value ?? 0
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const handleSubmit = async () => {
  if (!bookingId.value) return

  try {
    saving.value = true

    const payload: BookingCreatePayload = {
      vehicle_id: Number(form.vehicle_id),
      scheduled_start: form.scheduled_start,
      user_id: Number(form.user_id),
      status: form.status,
      notes: form.notes
    }

    await updateBooking(bookingId.value, payload)
    toastSuccess('Reserva actualizada con éxito')
    router.push('/admin/bookings')
  } catch (e: any) {
    toastError(e?.response?.data?.message || 'Error al guardar la reserva')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
