import { ref } from 'vue'
import api from '@/services/api'
import type { Booking, BookingFilters, BookingPagination, BookingCreatePayload } from '../interfaces/booking.interface'

export function useBookings() {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  const getBookings = async (page = 1, filters: BookingFilters = {}) => {
    loading.value = true
    error.value = null

    try {
      const params: Record<string, any> = { page, per_page: pagination.value.per_page }
      if (filters.search) params.search = filters.search
      if (filters.status) params.status = filters.status
      // Laravel admin reservations index
      const response = await api.get<BookingPagination>('/admin/reservations', { params })

      bookings.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      }
    } catch (err: any) {
      console.error(err)
      error.value = err?.response?.data?.message || 'Error loading bookings'
    } finally {
      loading.value = false
    }
  }

  const forceFinishBooking = async (id: number) => {
    try {
      await api.post(`/admin/reservations/${id}/force-finish`)
    } catch (err: any) {
      throw err?.response?.data?.message || 'Error finishing booking'
    }
  }

  const deleteBooking = async (id: number) => {
    try {
      await api.delete(`/admin/reservations/${id}`)
    } catch (err: any) {
      throw err?.response?.data?.message || 'Error deleting booking'
    }
  }

  const createBooking = async (payload: BookingCreatePayload) => {
    try {
      // The backend exposes creation at POST /reservations (user operations)
      // Desde admin usamos el mismo endpoint pero podemos pasar user_id opcionalmente.
      const response = await api.post<{ data: Booking }>('/reservations', payload)
      return response.data.data
    } catch (err: any) {
      throw err?.response?.data?.message || 'Error creating booking'
    }
  }

  return {
    bookings,
    loading,
    error,
    pagination,
    getBookings,
    forceFinishBooking,
    deleteBooking,
    createBooking,
  }
}
