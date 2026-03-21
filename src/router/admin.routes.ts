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
        meta: { module: 'spaces' },
        component: () => import('@/modules/bookings/views/admin/AdminCalendarView.vue'),
      },
      {
        path: 'espacios',
        name: 'admin-spaces',
        meta: { module: 'spaces' },
        component: () => import('@/modules/spaces/views/admin/AdminSpacesView.vue'),
      },
      {
        path: 'espacios/nuevo',
        name: 'admin-space-new',
        meta: { module: 'spaces' },
        component: () => import('@/modules/spaces/views/admin/AdminSpaceFormView.vue'),
      },
      {
        path: 'espacios/:id/editar',
        name: 'admin-space-edit',
        meta: { module: 'spaces' },
        component: () => import('@/modules/spaces/views/admin/AdminSpaceFormView.vue'),
      },
      {
        path: 'espacios/:id',
        name: 'admin-space-detail',
        meta: { module: 'spaces' },
        component: () => import('@/modules/spaces/views/admin/AdminSpaceDetailView.vue'),
      },
      {
        path: 'espacios/:id/disponibilidad',
        name: 'admin-availability',
        meta: { module: 'spaces' },
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
