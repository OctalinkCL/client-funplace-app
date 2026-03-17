import { supabase } from '@/lib/supabase'
import type { Space, SpaceImage, Amenity, CreateSpacePayload, UpdateSpacePayload } from '@/types'

export const spacesService = {
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
      .select('*, space_amenities(amenity), space_images(*)')
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

  async setAmenities(spaceId: string, amenities: Amenity[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('space_amenities')
      .delete()
      .eq('space_id', spaceId)
    if (deleteError) throw deleteError

    if (amenities.length === 0) return

    const { error: insertError } = await supabase
      .from('space_amenities')
      .insert(amenities.map(amenity => ({ space_id: spaceId, amenity })))
    if (insertError) throw insertError
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
