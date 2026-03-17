import { supabase } from '@/lib/supabase'
import type { Booking, BookingStatus, CreateBookingPayload } from '@/types'

export const bookingsService = {
  async create(payload: CreateBookingPayload): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .insert(payload)
    if (error) throw error
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
  },
}
