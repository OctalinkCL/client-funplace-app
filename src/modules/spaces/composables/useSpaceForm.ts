import { reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { spacesService } from '../services/spaces.service'
import { generateSlug, extractPlaceData } from '@/constants/spaces'
import type { SpaceKind, SpaceType, PlaceResult } from '@/types'

export function useSpaceForm() {
  const auth = useAuthStore()
  const slugSuffix = Date.now().toString(36)

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
      error.value = 'El nombre del espacio es obligatorio.'
      return null
    }
    if (form.capacity !== null && form.capacity < 1) {
      error.value = 'La capacidad debe ser mayor a 0.'
      return null
    }
    if (form.size_m2 !== null && form.size_m2 < 1) {
      error.value = 'La superficie debe ser mayor a 0.'
      return null
    }
    loading.value = true
    try {
      const space = await spacesService.create({
        admin_id: auth.user!.id,
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
      })
      return space.id
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

  return { form, loading, error, applyPlaceData, submit }
}
