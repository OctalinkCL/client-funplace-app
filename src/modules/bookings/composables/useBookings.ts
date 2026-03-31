import { ref } from 'vue'
import { bookingsService } from '../services/bookings.service'
import type { Booking, BookingStatus } from '@/types'

export function useBookings() {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const emailWarning = ref<string | null>(null)

  async function fetchByAdmin() {
    loading.value = true
    error.value = null
    try {
      bookings.value = await bookingsService.getByAdmin()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar las reservas.'
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(bookingId: string, status: BookingStatus) {
    emailWarning.value = null
    try {
      const { emailSent } = await bookingsService.updateStatus(bookingId, status)
      const i = bookings.value.findIndex(b => b.id === bookingId)
      if (i !== -1) bookings.value[i] = { ...bookings.value[i], status }
      if (!emailSent) {
        emailWarning.value = 'Reserva actualizada. No se pudo enviar el email de notificación al cliente.'
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar la reserva.'
    }
  }

  return { bookings, loading, error, emailWarning, fetchByAdmin, updateStatus }
}
