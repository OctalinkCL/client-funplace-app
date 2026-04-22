import { supabase } from '@/lib/supabase'
import type { Booking, BookingStatus, CreateBookingPayload } from '@/types'

async function sendBookingEmail(bookingId: string, event: 'created' | 'confirmed' | 'cancelled'): Promise<boolean> {
  try {
    await supabase.functions.invoke('send-booking-email', {
      body: { bookingId, event },
      headers: { 'x-internal-secret': import.meta.env.VITE_INTERNAL_SECRET },
    })
    return true
  } catch (err) {
    console.error('Email notification failed:', err)
    return false
  }
}

function monthRange(year: number, month: number): { start: string; end: string } {
  const pad = (n: number) => String(n).padStart(2, '0')
  const lastDay = new Date(year, month + 1, 0).getDate()
  return {
    start: `${year}-${pad(month + 1)}-01`,
    end: `${year}-${pad(month + 1)}-${pad(lastDay)}`,
  }
}

function today(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const bookingsService = {
  async create(payload: CreateBookingPayload): Promise<string> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(payload)
      .select('id')
      .single()
    if (error) throw error
    sendBookingEmail(data.id, 'created')
    return data.id
  },

  // Tab 1: "Por atender" — todos los PENDING, sin filtro de fecha
  async getPendingByAdmin(spaceId?: string): Promise<Booking[]> {
    let query = supabase
      .from('bookings')
      .select('*, spaces(id, title, slug)')
      .eq('status', 'PENDING')
      .order('date', { ascending: true })

    if (spaceId) query = query.eq('space_id', spaceId)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Tab 2: "Próximas" — CONFIRMED desde hoy en adelante, filtrado por mes
  async getConfirmedUpcomingByAdmin(year: number, month: number, spaceId?: string): Promise<Booking[]> {
    const { start, end } = monthRange(year, month)
    const todayStr = today()
    const from = start < todayStr ? todayStr : start

    let query = supabase
      .from('bookings')
      .select('*, spaces(id, title, slug)')
      .eq('status', 'CONFIRMED')
      .gte('date', from)
      .lte('date', end)
      .order('date', { ascending: true })

    if (spaceId) query = query.eq('space_id', spaceId)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Tab 3: "Historial" — CONFIRMED pasadas + todos los CANCELLED, filtrado por mes
  async getHistoryByAdmin(year: number, month: number, spaceId?: string): Promise<Booking[]> {
    const { start, end } = monthRange(year, month)
    const todayStr = today()

    // Supabase no soporta OR entre columnas distintas directamente en el SDK tipado,
    // usamos or() con filtros de texto
    let query = supabase
      .from('bookings')
      .select('*, spaces(id, title, slug)')
      .gte('date', start)
      .lte('date', end)
      .or(`status.eq.CANCELLED,and(status.eq.CONFIRMED,date.lt.${todayStr})`)
      .order('date', { ascending: false })

    if (spaceId) query = query.eq('space_id', spaceId)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async updateStatus(bookingId: string, status: BookingStatus): Promise<{ emailSent: boolean }> {
    const { data: current, error: fetchError } = await supabase
      .from('bookings')
      .select('status, space_id, block_id, date')
      .eq('id', bookingId)
      .single()
    if (fetchError || !current) throw new Error('Reserva no encontrada.')

    if (current.status === 'CANCELLED' && status === 'CONFIRMED') {
      throw new Error('No se puede confirmar una reserva cancelada directamente. Primero reactívala.')
    }

    if (current.status === 'CANCELLED' && status === 'PENDING') {
      const { data: conflict } = await supabase
        .from('bookings')
        .select('id')
        .eq('space_id', current.space_id)
        .eq('block_id', current.block_id)
        .eq('date', current.date)
        .neq('status', 'CANCELLED')
        .maybeSingle()
      if (conflict) throw new Error('Este horario ya tiene una reserva activa. No se puede reactivar.')
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
    if (error) throw error

    let emailSent = true
    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      emailSent = await sendBookingEmail(bookingId, status === 'CONFIRMED' ? 'confirmed' : 'cancelled')
    }
    return { emailSent }
  },

  // Cancela en bulk los PENDINGs cuya fecha ya pasó (sin email — nadie los lee)
  async cancelExpiredPending(bookingIds: string[]): Promise<void> {
    if (bookingIds.length === 0) return
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
      .in('id', bookingIds)
    if (error) throw error
  },
}
