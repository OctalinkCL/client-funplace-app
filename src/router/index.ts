import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    requiresRecovery?: boolean
    module?: string
  }
}
import { publicRoutes } from './public.routes'
import { authRoutes } from './auth.routes'
import { adminRoutes } from './admin.routes'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...authRoutes,
    ...adminRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/modules/error/views/NotFoundView.vue') },
  ],
})

setupGuards(router)

export default router
