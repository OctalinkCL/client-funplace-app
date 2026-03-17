import type { RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/modules/auth/views/LoginView.vue'),
      },
      {
        path: 'update-password',
        name: 'update-password',
        meta: { guestOnly: false, requiresRecovery: true },
        component: () => import('@/modules/auth/views/UpdatePasswordView.vue'),
      },
    ],
  },
]
