import { createRouter, createWebHistory } from 'vue-router'
import { publicRoutes } from './public.routes'
import { authRoutes } from './auth.routes'
import { adminRoutes } from './admin.routes'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'instant' }
  },
  routes: [
    ...publicRoutes,
    ...authRoutes,
    ...adminRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/modules/error/views/NotFoundView.vue') },
  ],
})

setupGuards(router)

export default router
