import type { SpaceKind, SpaceType } from '@/types'

/**
 * Mapa explícito de plan → módulos accesibles.
 * Para agregar un módulo nuevo: añadir su key a los planes correspondientes.
 * Para agregar un nuevo plan tier: añadir una nueva entrada a este objeto.
 */
export const PLAN_MODULES: Record<number, string[]> = {
  1:   ['spaces'],
  2:   ['services'],
  100: ['spaces', 'services'],
}

/**
 * Retorna true si el plan dado incluye acceso al módulo indicado.
 * Plan null, undefined o no reconocido → se trata como plan 1 (más restrictivo).
 */
export function planHasModule(plan: number | null | undefined, module: string): boolean {
  const effectivePlan = (plan != null && PLAN_MODULES[plan]) ? plan : 1
  return PLAN_MODULES[effectivePlan].includes(module)
}

/** Label del ítem en el sidebar según plan */
export function getSidebarLabel(plan: number | null | undefined): string {
  const hasSpaces = planHasModule(plan, 'spaces')
  const hasServices = planHasModule(plan, 'services')
  if (hasSpaces && hasServices) return 'Mi oferta'
  if (hasServices) return 'Mis servicios'
  return 'Mis espacios'
}

/** Tipos de inmueble disponibles para el formulario de espacio */
export const SPACE_TYPES: { value: SpaceType; label: string }[] = [
  { value: 'casa',   label: 'Casa de Cumpleaños' },
  { value: 'centro', label: 'Centro de Eventos' },
  { value: 'salon',  label: 'Salón de Eventos' },
]

/** Tipos de servicio disponibles para el formulario de servicio */
export const SERVICE_TYPES: { value: SpaceType; label: string }[] = [
  { value: 'catering',    label: 'Servicios de Catering' },
  { value: 'foodtruck',   label: 'Carros de Comida' },
  { value: 'inflables',   label: 'Inflables' },
  { value: 'musica',      label: 'Música' },
  { value: 'animaciones', label: 'Animaciones' },
  { value: 'fotografia',  label: 'Fotografía' },
]

/** Label legible para un type en badges y listas */
const TYPE_LABELS: Record<SpaceType, string> = {
  casa:        'Casa de Cumpleaños',
  centro:      'Centro de Eventos',
  salon:       'Salón de Eventos',
  catering:    'Servicios de Catering',
  foodtruck:   'Carros de Comida',
  inflables:   'Inflables',
  musica:      'Música',
  animaciones: 'Animaciones',
  fotografia:  'Fotografía',
}

export function getTypeLabel(type: SpaceType | null | undefined): string {
  if (!type) return 'Sin tipo'
  return TYPE_LABELS[type] ?? type
}

/** Clases Tailwind para el badge según kind */
export function getKindBadgeClass(kind: SpaceKind): string {
  return kind === 'service'
    ? 'bg-purple-100 text-purple-700'
    : 'bg-blue-100 text-blue-700'
}
