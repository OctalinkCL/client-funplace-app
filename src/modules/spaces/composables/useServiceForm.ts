import { reactive, ref, computed, watch, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { spacesService } from '../services/spaces.service'
import { imagesService } from '../services/images.service'
import type { CompressionMeta } from '../services/images.service'
import { generateSlug, extractPlaceData } from '@/constants/spaces'
import type { SpaceImage, SpaceType, PlaceResult } from '@/types'

export function useServiceForm(serviceId?: string) {
  const auth = useAuthStore()

  const isEditMode = computed(() => !!serviceId)
  const slugSuffix = isEditMode.value ? undefined : Date.now().toString(36)

  const form = reactive({
    title: '',
    slug: '',
    space_type: null as SpaceType | null,
    description: '',
    address: '',
    lat: null as number | null,
    lng: null as number | null,
    region: null as string | null,
    city: null as string | null,
    service_area: '',
    price_from: null as number | null,
    is_published: false,
    contact_email: null as string | null,
    contact_phone: null as string | null,
    contact_whatsapp: null as string | null,
  })

  const existingImages = ref<SpaceImage[]>([])
  const pendingFiles = ref<File[]>([])
  const pendingPreviews = ref<string[]>([])
  const pendingCompressionMetas = ref<CompressionMeta[]>([])
  const uploadingCount = ref(0)
  const loading = ref(false)
  const loadingService = ref(false)
  const error = ref<string | null>(null)

  watch(() => form.title, (title) => {
    if (!isEditMode.value) {
      form.slug = generateSlug(title, slugSuffix)
    }
  })

  function applyPlaceData(place: PlaceResult) {
    const { region, city, address, lat, lng } = extractPlaceData(place)
    form.region = region
    form.city = city
    form.address = address
    form.lat = lat
    form.lng = lng
  }

  function copyContactFromProfile() {
    form.contact_email = auth.profile?.contact_email ?? null
    form.contact_phone = auth.profile?.contact_phone ?? null
    form.contact_whatsapp = auth.profile?.contact_whatsapp ?? null
  }

  async function loadService(id: string) {
    loadingService.value = true
    try {
      const space = await spacesService.getById(id)
      form.title = space.title
      form.slug = space.slug
      form.space_type = space.space_type
      form.description = space.description ?? ''
      form.address = space.address ?? ''
      form.lat = space.lat
      form.lng = space.lng
      form.region = space.region
      form.city = space.city
      form.service_area = space.service_area ?? ''
      form.price_from = space.price_from
      form.is_published = space.is_published
      form.contact_email = space.contact_email ?? null
      form.contact_phone = space.contact_phone ?? null
      form.contact_whatsapp = space.contact_whatsapp ?? null
      existingImages.value = space.space_images ?? []
    } finally {
      loadingService.value = false
    }
  }

  function validateFile(file: File): string | null {
    if (file.size > 5 * 1024 * 1024) return 'La imagen no puede superar 5MB.'
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Solo se aceptan imágenes JPEG, PNG o WebP.'
    }
    if (pendingFiles.value.length + existingImages.value.length >= 10) {
      return 'Máximo 10 imágenes por servicio.'
    }
    return null
  }

  async function addPendingFile(file: File): Promise<string | null> {
    const validationError = validateFile(file)
    if (validationError) return validationError
    try {
      const { blob, meta } = await imagesService.compress(file)
      const compressedFile = new File([blob], file.name, { type: 'image/jpeg' })
      pendingFiles.value.push(compressedFile)
      pendingPreviews.value.push(URL.createObjectURL(blob))
      pendingCompressionMetas.value.push(meta)
    } catch {
      return 'Error al procesar la imagen.'
    }
    return null
  }

  function removePendingFile(index: number) {
    URL.revokeObjectURL(pendingPreviews.value[index])
    pendingFiles.value.splice(index, 1)
    pendingPreviews.value.splice(index, 1)
    pendingCompressionMetas.value.splice(index, 1)
  }

  async function addImageInEditMode(file: File): Promise<string | null> {
    if (!serviceId) return null
    const validationError = validateFile(file)
    if (validationError) return validationError
    uploadingCount.value++
    try {
      const { image } = await imagesService.upload(serviceId, file, existingImages.value.length)
      existingImages.value.push(image)
    } catch (e) {
      return e instanceof Error ? e.message : 'Error al subir la imagen.'
    } finally {
      uploadingCount.value--
    }
    return null
  }

  async function removeExistingImage(image: SpaceImage) {
    existingImages.value = existingImages.value.filter(i => i.id !== image.id)
    try {
      await imagesService.delete(image)
    } catch (e) {
      existingImages.value.push(image)
      error.value = e instanceof Error ? e.message : 'Error al eliminar la imagen.'
    }
  }

  function cleanupPreviews() {
    pendingPreviews.value.forEach(url => URL.revokeObjectURL(url))
  }

  onUnmounted(cleanupPreviews)

  async function submit(): Promise<string | null> {
    error.value = null
    if (!form.title.trim()) {
      error.value = 'El nombre del servicio es obligatorio.'
      return null
    }
    if (!form.space_type) {
      error.value = 'El tipo de servicio es obligatorio.'
      return null
    }
    loading.value = true
    try {
      const payload = {
        kind: 'service' as const,
        title: form.title,
        slug: form.slug,
        space_type: form.space_type,
        description: form.description || null,
        capacity: null,
        size_m2: null,
        address: form.address || null,
        lat: form.lat,
        lng: form.lng,
        region: form.region,
        city: form.city,
        service_area: form.service_area || null,
        price_from: form.price_from,
        is_published: form.is_published,
        contact_email: form.contact_email || null,
        contact_phone: form.contact_phone || null,
        contact_whatsapp: form.contact_whatsapp || null,
      }

      if (isEditMode.value && serviceId) {
        await spacesService.update(serviceId, payload)
        return serviceId
      } else {
        const space = await spacesService.create({
          ...payload,
          admin_id: auth.user!.id,
        })

        const imageErrors: string[] = []
        for (let i = 0; i < pendingFiles.value.length; i++) {
          try {
            await imagesService.upload(space.id, pendingFiles.value[i], i)
          } catch {
            imageErrors.push(pendingFiles.value[i].name)
          }
        }
        cleanupPreviews()

        if (imageErrors.length > 0) {
          error.value = `Servicio creado, pero estas imágenes no se subieron: ${imageErrors.join(', ')}`
        }

        return space.id
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al guardar el servicio.'
      if (msg.includes('23505') || msg.includes('duplicate')) {
        error.value = 'Ya existe un servicio con ese nombre. Intenta un título diferente.'
      } else {
        error.value = msg
      }
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    existingImages,
    pendingFiles,
    pendingPreviews,
    pendingCompressionMetas,
    uploadingCount,
    loading,
    loadingService,
    error,
    isEditMode,
    applyPlaceData,
    copyContactFromProfile,
    loadService,
    addPendingFile,
    removePendingFile,
    addImageInEditMode,
    removeExistingImage,
    submit,
  }
}
