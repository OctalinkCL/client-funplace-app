import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    redirect: '/admin/reservas',
    children: [
      {
        path: 'reservas',
        name: 'admin-bookings',
        component: () => import('@/modules/bookings/views/admin/AdminBookingsView.vue'),
      },
      {
        path: 'calendario/:spaceId',
        name: 'admin-calendar',
        component: () => import('@/modules/bookings/views/admin/AdminCalendarView.vue'),
      },
      {
        path: 'espacios',
        name: 'admin-spaces',
        component: () => import('@/modules/spaces/views/admin/AdminSpacesView.vue'),
      },
      {
        path: 'espacios/:id',
        name: 'admin-space-detail',
        component: () => import('@/modules/spaces/views/admin/AdminSpaceDetailView.vue'),
      },
      {
        path: 'espacios/:id/disponibilidad',
        name: 'admin-availability',
        component: () => import('@/modules/availability/views/admin/AdminAvailabilityView.vue'),
      },
      {
        path: 'perfil',
        name: 'admin-profile',
        component: () => import('@/modules/auth/views/AdminProfileView.vue'),
      },
    ],
  },
]
