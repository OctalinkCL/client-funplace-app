import { reactive, ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { spacesService } from '../services/spaces.service'
import { imagesService } from '../services/images.service'
import type { CompressionMeta } from '../services/images.service'
import { generateSlug, extractPlaceData, MAX_IMAGES } from '@/constants/spaces'
import type { SpaceImage, SpaceKind, SpaceType, PlaceResult } from '@/types'

export function useSpaceForm(spaceId?: string) {
  const auth = useAuthStore()

  const isEditMode = computed(() => !!spaceId)
  const slugSuffix = isEditMode.value ? undefined : Date.now().toString(36)

  const form = reactive({
    title: '',
    slug: '',
    kind: 'space' as SpaceKind,
    space_type: null as SpaceType | null,
    description: '',
    capacity: null as number | null,
    size_m2: null as number | null,
    region: null as string | null,
    city: null as string | null,
    address: '',
    lat: null as number | null,
    lng: null as number | null,
    is_published: false,
    contact_email: null as string | null,
    contact_phone: null as string | null,
    contact_whatsapp: null as string | null,
  })

  const selectedAmenities = ref<string[]>([])
  const existingImages = ref<SpaceImage[]>([])
  const pendingFiles = ref<File[]>([])
  const pendingPreviews = ref<string[]>([])
  const pendingCompressionMetas = ref<CompressionMeta[]>([])
  let claimedSlots = 0
  const initialSnapshot = ref<{ form: Record<string, unknown>; amenities: string[] } | null>(null)
  const uploadingCount = ref(0)
  const loading = ref(false)
  const loadingSpace = ref(false)
  const error = ref<string | null>(null)

  // Auto-generate slug from title (only in create mode)
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

  async function loadSpace(id: string) {
    loadingSpace.value = true
    try {
      const space = await spacesService.getById(id)
      form.title = space.title
      form.slug = space.slug
      form.kind = space.kind
      form.space_type = space.space_type
      form.description = space.description ?? ''
      form.capacity = space.capacity
      form.size_m2 = space.size_m2
      form.region = space.region
      await nextTick() // allow region watcher to fire before setting city
      form.city = space.city
      form.address = space.address ?? ''
      form.lat = space.lat
      form.lng = space.lng
      form.is_published = space.is_published
      form.contact_email = space.contact_email ?? null
      form.contact_phone = space.contact_phone ?? null
      form.contact_whatsapp = space.contact_whatsapp ?? null
      selectedAmenities.value = (space.space_amenities ?? []).map(a => a.amenity_id)
      existingImages.value = space.space_images ?? []
      initialSnapshot.value = {
        form: { ...form },
        amenities: [...selectedAmenities.value].sort(),
      }
    } finally {
      loadingSpace.value = false
    }
  }

  const isDirty = computed(() => {
    if (!isEditMode.value) return true
    if (!initialSnapshot.value) return false

    const snap = initialSnapshot.value
    for (const key of Object.keys(snap.form)) {
      if ((form as Record<string, unknown>)[key] !== snap.form[key]) return true
    }

    const current = [...selectedAmenities.value].sort()
    if (current.length !== snap.amenities.length) return true
    if (current.some((id, i) => id !== snap.amenities[i])) return true

    return false
  })

  function validateFile(file: File): string | null {
    if (file.size > 5 * 1024 * 1024) return 'La imagen no puede superar 5MB.'
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Solo se aceptan imágenes JPEG, PNG o WebP.'
    }
    if (pendingFiles.value.length + existingImages.value.length + claimedSlots >= MAX_IMAGES) {
      return `Máximo ${MAX_IMAGES} imágenes por espacio.`
    }
    return null
  }

  async function addPendingFile(file: File): Promise<string | null> {
    const validationError = validateFile(file)
    if (validationError) return validationError

    claimedSlots++
    try {
      const { blob, meta } = await imagesService.compress(file)
      const compressedFile = new File([blob], file.name, { type: 'image/jpeg' })
      pendingFiles.value.push(compressedFile)
      pendingPreviews.value.push(URL.createObjectURL(blob))
      pendingCompressionMetas.value.push(meta)
    } catch {
      return 'Error al procesar la imagen.'
    } finally {
      claimedSlots--
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
    if (!spaceId) return null
    const validationError = validateFile(file)
    if (validationError) return validationError

    uploadingCount.value++
    try {
      const { image } = await imagesService.upload(spaceId, file, existingImages.value.length)
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
      error.value = 'El nombre del espacio es obligatorio.'
      return null
    }
    if (!isEditMode.value && !form.address) {
      error.value = 'Debes buscar y seleccionar una dirección.'
      return null
    }
    loading.value = true
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        kind: form.kind,
        space_type: form.space_type,
        description: form.description || null,
        capacity: form.capacity,
        size_m2: form.size_m2,
        region: form.region,
        city: form.city,
        address: form.address || null,
        lat: form.lat,
        lng: form.lng,
        is_published: form.is_published,
        contact_email: form.contact_email || null,
        contact_phone: form.contact_phone || null,
        contact_whatsapp: form.contact_whatsapp || null,
      }

      if (isEditMode.value && spaceId) {
        await spacesService.update(spaceId, payload)
        await spacesService.setAmenities(spaceId, selectedAmenities.value)
        return spaceId
      } else {
        const space = await spacesService.create({
          ...payload,
          admin_id: auth.user!.id,
        })
        await spacesService.setAmenities(space.id, selectedAmenities.value)

        const imageErrors: string[] = []
        for (let i = 0; i < pendingFiles.value.length; i++) {
          try {
            // Files are already compressed from addPendingFile
            await imagesService.upload(space.id, pendingFiles.value[i], i)
          } catch {
            imageErrors.push(pendingFiles.value[i].name)
          }
        }
        cleanupPreviews()

        if (imageErrors.length > 0) {
          error.value = `Espacio creado, pero estas imágenes no se subieron: ${imageErrors.join(', ')}`
        }

        return space.id
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al guardar el espacio.'
      if (msg.includes('23505') || msg.includes('duplicate')) {
        error.value = 'Ya existe un espacio con ese nombre. Intenta un título diferente.'
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
    selectedAmenities,
    existingImages,
    pendingFiles,
    pendingPreviews,
    pendingCompressionMetas,
    uploadingCount,
    loading,
    loadingSpace,
    error,
    isEditMode,
    isDirty,
    applyPlaceData,
    loadSpace,
    addPendingFile,
    removePendingFile,
    addImageInEditMode,
    removeExistingImage,
    submit,
  }
}
