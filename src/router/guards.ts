import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // Garantizar que la sesión esté cargada antes de verificar
    await auth.initialize()

    // Rutas solo para no autenticados (ej. /auth/*)
    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { name: 'admin-bookings' }
    }

    if (!to.meta.requiresAuth) return true

    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (!auth.profile) {
      await auth.fetchProfile()
    }

    if (!auth.isAdmin) {
      return { path: '/' }
    }

    return true
  })
}
