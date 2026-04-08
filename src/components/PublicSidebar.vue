<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Home, Search } from 'lucide-vue-next'
import { useSidebar } from '@/components/ui/sidebar/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'

const route = useRoute()
const { setOpenMobile } = useSidebar()

const navItems = [
  { to: '/', label: 'Inicio', icon: Home, exact: true },
  { to: '/espacios', label: 'Explorar espacios', icon: Search, exact: false },
]

function isActive(item: { to: string; exact: boolean }) {
  return item.exact ? route.path === item.to : route.path.startsWith(item.to)
}

function closeOnNavigate() {
  setOpenMobile(false)
}
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <RouterLink to="/" @click="closeOnNavigate">
              <span class="font-semibold text-base">Funplace</span>
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
              <SidebarMenuButton as-child :is-active="isActive(item)">
                <RouterLink :to="item.to" @click="closeOnNavigate">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
