import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { spacesService } from '@/modules/spaces/services/spaces.service'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, title: 'Funplace - Admin' },
    redirect: '/admin/reservas',
    children: [
      {
        path: 'reservas',
        name: 'admin-bookings',
        component: () => import('@/modules/bookings/views/admin/AdminBookingsView.vue'),
      },
      {
        path: 'calendario',
        name: 'admin-calendar-index',
        beforeEnter: async (_to, _from, next) => {
          const auth = useAuthStore()
          if (!auth.profile?.id) return next('/admin/espacios')
          const spaces = await spacesService.getByAdmin(auth.profile.id).catch(() => [])
          next(spaces.length
            ? { name: 'admin-calendar', params: { spaceId: spaces[0].id }, replace: true }
            : '/admin/espacios',
          )
        },
        component: { template: '<div />' },
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
