import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    if (!to.meta.requiresAuth) return true

    const auth = useAuthStore()

    // Garantizar que la sesión esté cargada antes de verificar
    await auth.initialize()

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
