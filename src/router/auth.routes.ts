import type { RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/modules/auth/views/LoginView.vue'),
      },
    ],
  },
]
