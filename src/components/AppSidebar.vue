<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div class="pt-3"><AppLogo :width="120" /></div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.to">
              <SidebarMenuButton as-child :is-active="isActive(item.to)">
                <RouterLink :to="item.to" @click="handleNavClick" class="py-5">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="border-t">
      <AppNavUser />
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { CalendarDays, Calendar, Building2, User } from "lucide-vue-next";
import AppNavUser from "@/components/AppNavUser.vue";
import { useAuthStore } from "@/stores/auth.store";
import { getSidebarLabel } from "@/constants/plans";
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
  useSidebar,
} from "@/components/ui/sidebar";
import AppLogo from "../components/layouts/AppLogo.vue";

const auth = useAuthStore();
const route = useRoute();
const { isMobile, setOpenMobile } = useSidebar();
const sidebarLabel = computed(() => getSidebarLabel(auth.profile?.plan));

function handleNavClick() {
  if (isMobile.value) setOpenMobile(false);
}

const navItems = computed(() => [
  { to: "/admin/reservas", label: "Reservas", icon: CalendarDays },
  { to: "/admin/espacios", label: sidebarLabel.value, icon: Building2 },
  { to: "/admin/calendario", label: "Calendario", icon: Calendar },
  { to: "/admin/perfil", label: "Mi Perfil", icon: User },
]);

function isActive(path: string) {
  return route.path.startsWith(path);
}
</script>
