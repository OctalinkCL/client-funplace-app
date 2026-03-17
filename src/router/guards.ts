import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    if (!to.meta.requiresAuth) return true

    const auth = useAuthStore()

    // Si no hay sesión activa → redirigir a login
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Si hay sesión pero no se cargó el perfil todavía → cargarlo
    if (!auth.profile) {
      await auth.fetchProfile()
    }

    // Verificar que tenga rol admin o superadmin
    if (!auth.isAdmin) {
      return { path: '/' }
    }

    return true
  })
}
