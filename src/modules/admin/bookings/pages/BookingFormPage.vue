<template>
  <div class="space-y-8 animate-fade-in">
    <PageHeading
      title="Edit Booking"
      description="Update booking details."
    >
      <template #actions>
        <router-link
          to="/admin/bookings"
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
          <span>Back</span>
        </router-link>
      </template>
    </PageHeading>

    <div
      v-if="loading"
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center"
    >
      <p class="text-slate-500 dark:text-slate-400">Loading booking data...</p>
    </div>

    <div
      v-else
      class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <form @submit.prevent="handleSubmit">
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="User ID (optional)">
              <FormInput v-model="form.user_id" type="number" placeholder="e.g., 1" />
            </FormField>

            <FormField label="Vehicle ID">
              <FormInput v-model="form.vehicle_id" type="number" required />
            </FormField>

            <FormField label="Scheduled Start">
              <input
                v-model="form.scheduled_start"
                type="datetime-local"
                required
                class="block w-full rounded-xl border-0 px-4 py-3 bg-slate-50 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-slate-800 dark:text-white dark:ring-slate-700 outline-none transition-all"
              />
            </FormField>
          </div>
        </div>

        <div
          class="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/50 px-8 py-4 flex items-center justify-end gap-3 rounded-b-2xl"
        >
          <router-link
            to="/admin/bookings"
            class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
          >
            <span>Cancel</span>
          </router-link>
          <button
            type="submit"
            :disabled="saving"
            class="flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl"
          >
            <svg
              v-if="saving"
              class="animate-spin h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormField from '@/modules/admin/components/FormField.vue'
import FormInput from '@/modules/admin/components/FormInput.vue'
import PageHeading from '@/modules/admin/components/PageHeading.vue'
import { useBookings } from '../composables/useBookings'
import type { BookingCreatePayload } from '../interfaces/booking.interface'
import { useToast } from '@/modules/common/composables/useToast'

const route = useRoute()
const router = useRouter()
const { getBooking, updateBooking, loading } = useBookings()
const { success: toastSuccess, error: toastError } = useToast()

const bookingId = computed(() => (route.params.id ? Number(route.params.id) : null))

const form = reactive<{
  user_id: string
  vehicle_id: string
  scheduled_start: string
}>(
  {
    user_id: '',
    vehicle_id: '',
    scheduled_start: ''
  }
)

const saving = ref(false)

onMounted(async () => {
  if (bookingId.value) {
    try {
      const booking = await getBooking(bookingId.value)
      if (booking.user_id) form.user_id = String(booking.user_id)
      if (booking.vehicle_id) form.vehicle_id = String(booking.vehicle_id)
      if (booking.scheduled_start) {
        const d = new Date(booking.scheduled_start)
        form.scheduled_start = d.toISOString().slice(0, 16)
      }
    } catch (e) {
      toastError('Error loading booking')
      router.push('/admin/bookings')
    }
  }
})

const handleSubmit = async () => {
  try {
    saving.value = true

    const payload: BookingCreatePayload = {
      vehicle_id: Number(form.vehicle_id),
      scheduled_start: form.scheduled_start
    }

    if (form.user_id) {
      payload.user_id = Number(form.user_id)
    }

    if (!bookingId.value) {
      toastError('Booking ID missing')
      return
    }

    await updateBooking(bookingId.value, payload)
    toastSuccess('Booking updated successfully')

    router.push('/admin/bookings')
  } catch (e: any) {
    toastError(e?.response?.data?.message || 'Error saving booking')
  } finally {
    saving.value = false
  }
}
</script>
