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
        meta: { title: 'Funplace - Iniciar sesión' },
        component: () => import('@/modules/auth/views/LoginView.vue'),
      },
      {
        path: 'update-password',
        name: 'update-password',
        meta: { guestOnly: false, requiresRecovery: true, title: 'Funplace - Cambiar contraseña' },
        component: () => import('@/modules/auth/views/UpdatePasswordView.vue'),
      },
      {
        path: 'setup-account',
        name: 'setup-account',
        meta: { guestOnly: false, requiresRecovery: true, title: 'Funplace - Configurar cuenta' },
        component: () => import('@/modules/auth/views/SetupAccountView.vue'),
      },
    ],
  },
]
