import type { SpaceType, SpaceKind, PlaceResult } from '@/types'

export const MAX_IMAGES = 3 // ← cambiar aquí para ajustar el límite global de imágenes por espacio

// ============================================================
// Labels en español para todos los tipos (espacios + servicios)
// Debe ser exhaustivo: incluir todos los valores de SpaceType
// ============================================================
export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  // Espacios
  casa:        'Casa de Cumpleaños',
  centro:      'Centro de Eventos',
  salon:       'Salón de Eventos',
  // Servicios
  catering:    'Servicios de Catering',
  foodtruck:   'Carros de Comida',
  inflables:   'Inflables',
  musica:      'Música',
  animaciones: 'Animaciones',
  fotografia:  'Fotografía',
}

export const SPACE_KIND_LIST: { key: SpaceKind; label: string }[] = [
  { key: 'space',   label: 'Espacio físico' },
  { key: 'service', label: 'Servicio' },
]

// Tipos por kind — para el select en SpaceForm (filtrado según kind seleccionado)
export const SPACE_TYPE_LIST: { key: SpaceType; label: string }[] = [
  { key: 'casa',   label: 'Casa de Cumpleaños' },
  { key: 'centro', label: 'Centro de Eventos' },
  { key: 'salon',  label: 'Salón de Eventos' },
]

export const SERVICE_TYPE_LIST: { key: SpaceType; label: string }[] = [
  { key: 'catering',    label: 'Servicios de Catering' },
  { key: 'foodtruck',   label: 'Carros de Comida' },
  { key: 'inflables',   label: 'Inflables' },
  { key: 'musica',      label: 'Música' },
  { key: 'animaciones', label: 'Animaciones' },
  { key: 'fotografia',  label: 'Fotografía' },
]

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
