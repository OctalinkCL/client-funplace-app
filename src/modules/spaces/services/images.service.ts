import imageCompression from 'browser-image-compression'
import { supabase } from '@/lib/supabase'
import type { SpaceImage } from '@/types'

export interface CompressionMeta {
  originalSize: number   // bytes
  compressedSize: number // bytes
}

export interface UploadResult {
  image: SpaceImage
  compressionMeta: CompressionMeta
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  fileType: 'image/jpeg' as const,
  initialQuality: 0.80,
}

export const imagesService = {
  async compress(file: File): Promise<{ blob: Blob; meta: CompressionMeta }> {
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS)
    return {
      blob: compressed,
      meta: {
        originalSize: file.size,
        compressedSize: compressed.size,
      },
    }
  },

  async upload(spaceId: string, file: File, sortOrder = 0): Promise<UploadResult> {
    const { blob, meta } = await imagesService.compress(file)

    const storagePath = `${spaceId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('space-images')
      .upload(storagePath, blob, { contentType: 'image/jpeg' })
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

    return { image: data, compressionMeta: meta }
  },

  async delete(image: SpaceImage): Promise<void> {
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

  async updateSortOrder(imageId: string, sortOrder: number): Promise<void> {
    const { error } = await supabase
      .from('space_images')
      .update({ sort_order: sortOrder })
      .eq('id', imageId)
    if (error) throw error
  },
}
