import { supabase } from '@/lib/supabase'
import type { Booking, BookingStatus, CreateBookingPayload } from '@/types'

async function sendBookingEmail(bookingId: string, event: 'created' | 'confirmed' | 'cancelled') {
  try {
    await supabase.functions.invoke('send-booking-email', {
      body: { bookingId, event },
    })
  } catch (err) {
    // fire-and-forget: email failure must not block the main operation
    console.error('Email notification failed:', err)
  }
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

  // RLS filtra automáticamente a espacios del admin autenticado
  async getByAdmin(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, spaces(id, title, slug)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async updateStatus(bookingId: string, status: BookingStatus): Promise<void> {
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

    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      sendBookingEmail(bookingId, status === 'CONFIRMED' ? 'confirmed' : 'cancelled')
    }
  },
}
