import { supabase } from '@/lib/supabase'
import type { Space, SpaceKind, CreateSpacePayload, UpdateSpacePayload } from '@/types'

export const spacesService = {
  async getPublished(filters?: { region?: string; city?: string }): Promise<Space[]> {
    let query = supabase
      .from('spaces')
      .select('*, space_amenities(amenity_id), space_images(id, url, sort_order)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .order('sort_order', { referencedTable: 'space_images', ascending: true })

    if (filters?.region) query = query.eq('region', filters.region)
    if (filters?.city) query = query.eq('city', filters.city)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getBySlug(slug: string): Promise<Space> {
    const { data, error } = await supabase
      .from('spaces')
      .select('*, space_amenities(amenity_id), space_images(*), profiles!admin_id(contact_email,contact_phone,contact_whatsapp)')
      .eq('slug', slug)
      .eq('is_published', true)
      .order('sort_order', { referencedTable: 'space_images', ascending: true })
      .single()
    if (error) throw error
    return data
  },

  async getByAdmin(adminId: string, kind?: SpaceKind): Promise<Space[]> {
    let query = supabase
      .from('spaces')
      .select('*, space_images(id, url, sort_order)')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })

    if (kind) query = query.eq('kind', kind)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id: string): Promise<Space> {
    const { data, error } = await supabase
      .from('spaces')
      .select('*, space_amenities(amenity_id), space_images(*)')
      .eq('id', id)
      .order('sort_order', { referencedTable: 'space_images', ascending: true })
      .single()
    if (error) throw error
    return data
  },

  async create(payload: CreateSpacePayload): Promise<Space> {
    const { data, error } = await supabase
      .from('spaces')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, payload: UpdateSpacePayload): Promise<Space> {
    const { data, error } = await supabase
      .from('spaces')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    // 1. Obtener paths de imágenes ANTES del cascade
    const { data: images } = await supabase
      .from('space_images')
      .select('storage_path')
      .eq('space_id', id)

    // 2. Borrar archivos de storage (best-effort, no bloquea si falla)
    if (images && images.length > 0) {
      await supabase.storage
        .from('space-images')
        .remove(images.map(img => img.storage_path))
    }

    // 3. Borrar espacio (cascade limpia toda la DB)
    const { error } = await supabase.from('spaces').delete().eq('id', id)
    if (error) throw error
  },

  async togglePublish(id: string, isPublished: boolean): Promise<void> {
    const { error } = await supabase
      .from('spaces')
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async getAvailableLocations(): Promise<{ region: string; city: string | null }[]> {
    const { data, error } = await supabase
      .from('spaces')
      .select('region, city')
      .eq('is_published', true)
      .not('region', 'is', null)
      .order('region')
    if (error) throw error
    return data as { region: string; city: string | null }[]
  },

  async setAmenities(spaceId: string, amenityIds: string[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('space_amenities')
      .delete()
      .eq('space_id', spaceId)
    if (deleteError) throw new Error(`Error al limpiar facilidades: ${deleteError.message}`)

    if (amenityIds.length === 0) return

    const { data, error: insertError } = await supabase
      .from('space_amenities')
      .insert(amenityIds.map(amenity_id => ({ space_id: spaceId, amenity_id })))
      .select()

    if (insertError) throw new Error(`Error al guardar facilidades: ${insertError.message} (${insertError.code})`)
    if (!data || data.length !== amenityIds.length) {
      throw new Error('No se pudieron guardar las facilidades. Verifica los permisos en Supabase (RLS).')
    }
  },

}
