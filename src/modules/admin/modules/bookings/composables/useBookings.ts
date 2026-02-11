import { ref } from 'vue'
import api from '@/services/api'
import type { Booking, BookingFilters, PaginationData } from '../components/booking.interface'

export function useBookings() {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const pagination = ref<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  const getBookings = async (filters: BookingFilters = {}) => {
    loading.value = true
    error.value = null

    try {
      // Laravel: Route::prefix('admin')->group(...) -> GET 'reservations'
      const response = await api.get('/admin/reservations', { params: filters })

      bookings.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      }
    } catch (e: any) {
      console.error(e)
      error.value = e?.response?.data?.message || 'Error al cargar reservas'
    } finally {
      loading.value = false
    }
  }

  const forceFinishBooking = async (id: number) => {
    try {
      // Laravel: POST admin/reservations/{id}/force-finish
      await api.post(`/admin/reservations/${id}/force-finish`)
      return true
    } catch (e: any) {
      throw e?.response?.data?.message || 'Error al finalizar reserva'
    }
  }

  const deleteBooking = async (id: number) => {
    try {
      // Laravel: DELETE admin/reservations/{id}
      await api.delete(`/admin/reservations/${id}`)
      return true
    } catch (e: any) {
      throw e?.response?.data?.message || 'Error al eliminar reserva'
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
  }
}
