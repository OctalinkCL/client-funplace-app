import type { Amenity, SpaceType } from '@/types'

// ============================================================
// Regiones y ciudades de Chile
// ============================================================
export const REGIONS_AND_CITIES = {
  'Región Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'La Florida', 'San Bernardo', 'Puente Alto'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio'],
  'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chillán'],
  'La Araucanía': ['Temuco', 'Villarrica', 'Pucón'],
  'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro', 'Puerto Varas'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle'],
  "O'Higgins": ['Rancagua', 'San Fernando'],
  'Maule': ['Talca', 'Curicó', 'Linares'],
  'Los Ríos': ['Valdivia', 'La Unión'],
  'Antofagasta': ['Antofagasta', 'Calama'],
  'Atacama': ['Copiapó', 'Vallenar'],
  'Tarapacá': ['Iquique', 'Alto Hospicio'],
  'Arica y Parinacota': ['Arica'],
  'Magallanes': ['Punta Arenas'],
  'Aysén': ['Coyhaique'],
  'Ñuble': ['Chillán'],
} as const

export const REGIONS = Object.keys(REGIONS_AND_CITIES)

// ============================================================
// Labels en español para amenities
// ============================================================
export const AMENITY_LABELS: Record<Amenity, string> = {
  wifi: 'WiFi',
  tv_monitor: 'TV / Monitor',
  projector: 'Proyector',
  kitchen: 'Cocina',
  oven: 'Horno',
  refrigerator: 'Refrigerador',
  air_conditioning: 'Aire Acondicionado',
  heating: 'Calefacción',
  parking: 'Estacionamiento',
  garden: 'Jardín',
  pool: 'Piscina',
  bbq: 'Parrilla / BBQ',
  sound_system: 'Sistema de Sonido',
  bicycle_parking: 'Bicicletero',
  bathrooms: 'Baños',
  disability_access: 'Acceso para discapacitados',
}

export const AMENITY_LIST = (Object.entries(AMENITY_LABELS) as [Amenity, string][]).map(
  ([key, label]) => ({ key, label }),
)

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
