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
