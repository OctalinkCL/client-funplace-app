import { supabase } from '@/lib/supabase'
import type { AmenityRecord } from '@/types'

export const amenitiesService = {
  async getAll(): Promise<AmenityRecord[]> {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('sort_order')
    if (error) throw error
    return data
  },
}
