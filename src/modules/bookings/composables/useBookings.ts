import { ref, computed } from 'vue'
import { bookingsService } from '../services/bookings.service'
import type { Booking, BookingStatus } from '@/types'

export function useBookings() {
  const pendingBookings = ref<Booking[]>([])
  const upcomingBookings = ref<Booking[]>([])
  const historyBookings = ref<Booking[]>([])

  const loadingPending = ref(false)
  const loadingUpcoming = ref(false)
  const loadingHistory = ref(false)

  const error = ref<string | null>(null)
  const emailWarning = ref<string | null>(null)

  const todayStr = (() => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  })()

  const expiredPending = computed(() =>
    pendingBookings.value.filter(b => b.date < todayStr)
  )
  const activePending = computed(() =>
    pendingBookings.value.filter(b => b.date >= todayStr)
  )

  async function fetchPending(spaceId?: string) {
    loadingPending.value = true
    error.value = null
    try {
      pendingBookings.value = await bookingsService.getPendingByAdmin(spaceId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar las reservas pendientes.'
    } finally {
      loadingPending.value = false
    }
  }

  async function fetchUpcoming(year: number, month: number, spaceId?: string) {
    loadingUpcoming.value = true
    error.value = null
    try {
      upcomingBookings.value = await bookingsService.getConfirmedUpcomingByAdmin(year, month, spaceId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar las próximas reservas.'
    } finally {
      loadingUpcoming.value = false
    }
  }

  async function fetchHistory(year: number, month: number, spaceId?: string) {
    loadingHistory.value = true
    error.value = null
    try {
      historyBookings.value = await bookingsService.getHistoryByAdmin(year, month, spaceId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar el historial.'
    } finally {
      loadingHistory.value = false
    }
  }

  async function updateStatus(bookingId: string, status: BookingStatus, currentTab: 'pending' | 'upcoming' | 'history') {
    error.value = null
    emailWarning.value = null
    try {
      const { emailSent } = await bookingsService.updateStatus(bookingId, status)

      // Actualizar el array del tab activo localmente para evitar re-fetch
      if (currentTab === 'pending') {
        if (status === 'CANCELLED') {
          pendingBookings.value = pendingBookings.value.filter(b => b.id !== bookingId)
        } else {
          const i = pendingBookings.value.findIndex(b => b.id === bookingId)
          if (i !== -1) pendingBookings.value[i] = { ...pendingBookings.value[i], status }
        }
      } else if (currentTab === 'upcoming') {
        const i = upcomingBookings.value.findIndex(b => b.id === bookingId)
        if (i !== -1) upcomingBookings.value[i] = { ...upcomingBookings.value[i], status }
      } else {
        const i = historyBookings.value.findIndex(b => b.id === bookingId)
        if (i !== -1) historyBookings.value[i] = { ...historyBookings.value[i], status }
      }

      if (!emailSent) {
        emailWarning.value = 'Reserva actualizada. No se pudo enviar el email de notificación al cliente.'
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar la reserva.'
    }
  }

  async function cancelExpiredPending() {
    error.value = null
    const ids = expiredPending.value.map(b => b.id)
    try {
      await bookingsService.cancelExpiredPending(ids)
      pendingBookings.value = pendingBookings.value.filter(b => !ids.includes(b.id))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cancelar las reservas vencidas.'
    }
  }

  return {
    pendingBookings,
    upcomingBookings,
    historyBookings,
    activePending,
    expiredPending,
    loadingPending,
    loadingUpcoming,
    loadingHistory,
    error,
    emailWarning,
    fetchPending,
    fetchUpcoming,
    fetchHistory,
    updateStatus,
    cancelExpiredPending,
  }
}
