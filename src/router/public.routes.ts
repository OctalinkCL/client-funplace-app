import type { RouteRecordRaw } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'spaces-list',
        component: () => import('@/modules/spaces/views/public/SpacesListView.vue'),
      },
      {
        path: 'espacios/:slug',
        name: 'space-detail',
        component: () => import('@/modules/spaces/views/public/SpaceDetailView.vue'),
      },
      {
        path: 'espacios/:slug/reservar',
        name: 'booking-form',
        component: () => import('@/modules/bookings/views/public/BookingFormView.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/modules/auth/views/LoginView.vue'),
      },
    ],
  },
]
