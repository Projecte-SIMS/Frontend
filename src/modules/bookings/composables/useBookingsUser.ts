import { ref, computed } from 'vue'
import { useAuth } from '@/modules/auth/composables/useAuth'
import api from '@/services/api'
import type { Booking } from '@/modules/admin/bookings/interfaces/booking.interface'

export default function useBookingsUser() {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { user } = useAuth()

  const hasActiveBooking = computed(() => {
    return bookings.value.some(b => b.status === 'active')
  })

  const getBookings = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/reservations')
      bookings.value = res.data || []
    } catch (e: any) {
      error.value = e.message || 'Error al cargar reservas'
    } finally {
      loading.value = false
    }
  }

  return { bookings, loading, error, getBookings, hasActiveBooking }
}
