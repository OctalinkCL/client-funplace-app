import { createRouter, createWebHistory } from 'vue-router'
import { publicRoutes } from './public.routes'
import { adminRoutes } from './admin.routes'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...adminRoutes,
  ],
})

setupGuards(router)

export default router
