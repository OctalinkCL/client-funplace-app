import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // Garantizar que la sesión esté cargada antes de verificar
    await auth.initialize()

    // Modo recovery/invite: forzar navegación a la página correcta
    if (auth.isPasswordRecovery) {
      const target = auth.isInviteSetup ? 'setup-account' : 'update-password'
      if (to.name !== target) return { name: target }
      return true
    }

    // Rutas solo para no autenticados (ej. /auth/login)
    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { name: 'admin-bookings' }
    }

    // Rutas de recovery: solo accesibles desde el link de Supabase, no manualmente
    if (to.meta.requiresRecovery && auth.isAuthenticated && !auth.isPasswordRecovery) {
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

    const requiredModule = to.meta.module
    if (requiredModule && !auth.hasModule(requiredModule)) {
      return { name: 'admin-bookings' }
    }

    return true
  })
}
