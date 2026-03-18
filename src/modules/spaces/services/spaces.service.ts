import { supabase } from '@/lib/supabase'
import type { Space, SpaceImage, CreateSpacePayload, UpdateSpacePayload } from '@/types'

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
      .select('*, space_amenities(amenity_id), space_images(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .order('sort_order', { referencedTable: 'space_images', ascending: true })
      .single()
    if (error) throw error
    return data
  },

  async getByAdmin(adminId: string): Promise<Space[]> {
    const { data, error } = await supabase
      .from('spaces')
      .select('*, space_images(id, url, sort_order)')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })
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

  async uploadImage(spaceId: string, file: File, sortOrder = 0): Promise<SpaceImage> {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const storagePath = `${spaceId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('space-images')
      .upload(storagePath, file)
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('space-images')
      .getPublicUrl(storagePath)

    const { data, error: insertError } = await supabase
      .from('space_images')
      .insert({ space_id: spaceId, url: publicUrl, storage_path: storagePath, sort_order: sortOrder })
      .select()
      .single()
    if (insertError) throw insertError
    return data
  },

  async deleteImage(image: SpaceImage): Promise<void> {
    const { error: storageError } = await supabase.storage
      .from('space-images')
      .remove([image.storage_path])
    if (storageError) throw storageError

    const { error: dbError } = await supabase
      .from('space_images')
      .delete()
      .eq('id', image.id)
    if (dbError) throw dbError
  },
}
