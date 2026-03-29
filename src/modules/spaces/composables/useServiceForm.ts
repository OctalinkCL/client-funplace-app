import { reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { spacesService } from '../services/spaces.service'
import { generateSlug, extractPlaceData } from '@/constants/spaces'
import type { SpaceType, PlaceResult } from '@/types'

export function useServiceForm() {
  const auth = useAuthStore()
  const slugSuffix = Date.now().toString(36)

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
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  watch(() => form.title, (title) => {
    form.slug = generateSlug(title, slugSuffix)
  })

  function applyPlaceData(place: PlaceResult) {
    const { address, lat, lng } = extractPlaceData(place)
    form.address = address
    form.lat = lat
    form.lng = lng
  }

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
      const space = await spacesService.create({
        admin_id: auth.user!.id,
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
      })
      return space.id
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

  return { form, loading, error, applyPlaceData, submit }
}
