<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <RouterLink to="/admin">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutDashboard class="size-4" />
              </div>
              <span class="font-semibold truncate">Funplace Admin</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.to">
              <SidebarMenuButton as-child :is-active="isActive(item.to)">
                <RouterLink :to="item.to">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <LogoutButton />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { CalendarDays, Building2, User, LayoutDashboard } from 'lucide-vue-next'
import LogoutButton from '@/modules/auth/components/LogoutButton.vue'
import { useAuthStore } from '@/stores/auth.store'
import { getSidebarLabel } from '@/constants/plans'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const auth = useAuthStore()
const route = useRoute()
const sidebarLabel = computed(() => getSidebarLabel(auth.profile?.plan))

const navItems = computed(() => [
  { to: '/admin/reservas', label: 'Reservas', icon: CalendarDays },
  { to: '/admin/espacios', label: sidebarLabel.value, icon: Building2 },
  { to: '/admin/perfil', label: 'Mi Perfil', icon: User },
])

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>
