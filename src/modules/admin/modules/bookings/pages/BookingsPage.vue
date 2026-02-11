<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Reservations</h1>
      <p class="text-sm text-gray-500">Manage vehicle bookings and active trips.</p>
    </div>

    <div
      class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center"
    >
      <div class="flex gap-4 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <input
            v-model="filters.search"
            @input="handleSearch"
            type="text"
            placeholder="Search guest, ID or plate..."
            class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <select
          v-model="filters.status"
          @change="loadData(1)"
          class="w-full sm:w-48 py-2 px-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="active">🟢 Active Now</option>
          <option value="pending">🟡 Pending</option>
          <option value="finished">🔵 Finished</option>
          <option value="cancelled">🔴 Cancelled</option>
        </select>
      </div>

      <span class="text-sm text-gray-500 font-medium">{{ pagination.value.total }} bookings</span>
    </div>

    <div v-if="loading.value && !bookings.value.length" class="text-center py-20 text-gray-500">
      Loading...
    </div>

    <div v-else-if="error.value" class="p-4 bg-red-50 text-red-700 rounded-md mb-4">
      {{ error.value }}
    </div>

    <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Guest
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Schedule
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="booking in bookings.value" :key="booking.id" class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm"
                >
                  {{ getInitials(booking.user?.name) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ booking.user?.name || 'Unknown' }}
                  </div>
                  <div class="text-xs text-gray-500">{{ booking.user?.email }}</div>
                </div>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="booking.vehicle">
                <div class="text-sm text-gray-900">
                  {{ booking.vehicle.brand }} {{ booking.vehicle.model }}
                </div>
                <span
                  class="px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-800 border border-gray-200"
                >
                  {{ booking.vehicle.license_plate }}
                </span>
              </div>
              <span v-else class="text-xs text-red-500 italic">Vehicle Deleted</span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 flex items-center gap-2">
                <div>
                  <div class="font-bold">{{ formatDateDay(booking.start_time) }}</div>
                  <div class="text-xs text-gray-500">{{ formatDateHour(booking.start_time) }}</div>
                </div>
                <span class="text-gray-400">→</span>
                <div>
                  <div class="font-bold">{{ formatDateDay(booking.end_time) }}</div>
                  <div class="text-xs text-gray-500">{{ formatDateHour(booking.end_time) }}</div>
                </div>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
              {{ formatCurrency(booking.total_price) }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  getStatusClasses(booking.status),
                ]"
              >
                {{ booking.status }}
              </span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  v-if="booking.status === 'active'"
                  @click="handleForceFinish(booking.id)"
                  class="text-amber-600 hover:text-amber-900"
                  title="Force Finish"
                >
                  Stop
                </button>
                <button
                  @click="handleDelete(booking.id)"
                  class="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="pagination.value.total > 0"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:justify-end gap-2">
          <button
            @click="loadData(pagination.value.current_page - 1)"
            :disabled="pagination.value.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="loadData(pagination.value.current_page + 1)"
            :disabled="pagination.value.current_page >= pagination.value.last_page"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookings } from '../composables/useBookings'
import showToast from '@/modules/common/composables/useToast'

const { bookings, loading, error, pagination, getBookings, forceFinishBooking, deleteBooking } = useBookings()

const filters = ref({ search: '', status: '' })

const loadData = (page = 1) => {
  getBookings({ ...filters.value, page })
}

onMounted(() => {
  loadData()
})

let timeout: ReturnType<typeof setTimeout> | null = null

const handleSearch = () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => loadData(1), 400)
}

const handleForceFinish = async (id: number) => {
  if (!confirm('Are you sure you want to stop this trip?')) return
  try {
    await forceFinishBooking(id)
    showToast('Trip finished successfully')
    loadData(pagination.value.current_page)
  } catch (e: any) {
    showToast(e)
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this reservation?')) return
  try {
    await deleteBooking(id)
    showToast('Reservation deleted')
    loadData(pagination.value.current_page)
  } catch (e: any) {
    showToast(e)
  }
}

const getInitials = (name?: string) =>
  name
    ? name
        .split(' ')
        .map((x) => x[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??'

const formatDateDay = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

const formatDateHour = (d: string) =>
  new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)

const getStatusClasses = (s: string) => {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    finished: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }
  return map[s] || 'bg-gray-100 text-gray-800'
}
</script>
