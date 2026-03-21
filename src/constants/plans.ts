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
