import { ref } from 'vue'
import { imagesService } from '../services/images.service'
import { MAX_IMAGES } from '@/constants/spaces'
import type { SpaceImage } from '@/types'

export function useSpaceImages(spaceId: string, initialImages: SpaceImage[]) {
  const images = ref<SpaceImage[]>([...initialImages])
  const uploadingCount = ref(0)
  const error = ref<string | null>(null)

  function validateFile(file: File): string | null {
    if (file.size > 5 * 1024 * 1024) return 'La imagen no puede superar 5MB.'
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Solo se aceptan imágenes JPEG, PNG o WebP.'
    }
    if (images.value.length >= MAX_IMAGES) {
      return `Máximo ${MAX_IMAGES} imágenes por espacio.`
    }
    return null
  }

  async function addImage(file: File): Promise<void> {
    error.value = null
    const validationError = validateFile(file)
    if (validationError) {
      error.value = validationError
      return
    }
    uploadingCount.value++
    try {
      const { image } = await imagesService.upload(spaceId, file, images.value.length)
      images.value.push(image)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al subir la imagen.'
    } finally {
      uploadingCount.value--
    }
  }

  async function removeImage(image: SpaceImage): Promise<void> {
    error.value = null
    images.value = images.value.filter(i => i.id !== image.id)
    try {
      await imagesService.delete(image)
    } catch (e) {
      images.value.push(image)
      error.value = e instanceof Error ? e.message : 'Error al eliminar la imagen.'
    }
  }

  return { images, uploadingCount, error, addImage, removeImage }
}
