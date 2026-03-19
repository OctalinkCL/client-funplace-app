import type { SpaceType, PlaceResult } from '@/types'

// ============================================================
// Regiones y ciudades de Chile
// ============================================================
export const REGIONS_AND_CITIES = {
  'Región Metropolitana de Santiago': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'La Florida', 'San Bernardo', 'Puente Alto'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio'],
  'Bío Bío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chillán'],
  'La Araucanía': ['Temuco', 'Villarrica', 'Pucón'],
  'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro', 'Puerto Varas'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle'],
  "Libertador General Bernardo O'Higgins": ['Rancagua', 'San Fernando'],
  'Maule': ['Talca', 'Curicó', 'Linares'],
  'Los Ríos': ['Valdivia', 'La Unión'],
  'Antofagasta': ['Antofagasta', 'Calama'],
  'Atacama': ['Copiapó', 'Vallenar'],
  'Tarapacá': ['Iquique', 'Alto Hospicio'],
  'Arica y Parinacota': ['Arica'],
  'Magallanes y la Antártica Chilena': ['Punta Arenas'],
  'Aysén del General Carlos Ibáñez del Campo': ['Coyhaique'],
  'Ñuble': ['Chillán'],
} as const

export const REGIONS = Object.keys(REGIONS_AND_CITIES)

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
// Utilidades
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
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
