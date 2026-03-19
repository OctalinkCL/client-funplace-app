import type { SpaceType, PlaceResult } from '@/types'

// ============================================================
// Labels en español para tipos de espacio
// ============================================================
export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  casa: 'Casa',
  sala: 'Sala',
  estudio: 'Estudio',
  oficina: 'Oficina',
  galeria: 'Galería',
  otro: 'Otro',
}

export const SPACE_TYPE_LIST = (Object.entries(SPACE_TYPE_LABELS) as [SpaceType, string][]).map(
  ([key, label]) => ({ key, label }),
)

// ============================================================
// Google Places
// ============================================================
export function extractPlaceData(place: PlaceResult): {
  region: string | null
  city: string | null
  address: string
  lat: number
  lng: number
} {
  const get = (type: string) =>
    place.addressComponents.find(c => c.types.includes(type))

  const region = get('administrative_area_level_1')?.longText ?? null
  const city = get('administrative_area_level_2')?.longText ?? null

  return { region, city, address: place.formattedAddress, lat: place.lat, lng: place.lng }
}

// ============================================================
// Utilidades
// ============================================================
export function generateSlug(title: string, suffix?: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return suffix ? `${base}-${suffix}` : base
}
