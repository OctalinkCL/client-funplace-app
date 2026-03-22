<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton size="lg">
        <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold shrink-0">
          {{ initials }}
        </div>
        <div class="flex flex-col flex-1 min-w-0 text-left">
          <span class="text-sm font-semibold truncate">{{ displayName }}</span>
          <span class="text-xs text-muted-foreground truncate">{{ email }}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-4 shrink-0" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="top" align="end" class="w-56">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col gap-1">
          <span class="font-semibold truncate">{{ displayName }}</span>
          <span class="text-xs text-muted-foreground truncate">{{ email }}</span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <RouterLink to="/admin/perfil">
          <User class="size-4" />
          Mi Perfil
        </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem :disabled="loading" @click="handleLogout">
        <LogOut class="size-4" />
        {{ loading ? 'Saliendo...' : 'Cerrar sesión' }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronsUpDown, User, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)

const displayName = computed(() => auth.profile?.full_name ?? auth.user?.email ?? '—')
const email = computed(() => auth.user?.email ?? '')
const initials = computed(() => {
  const name = auth.profile?.full_name
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()
})

async function handleLogout() {
  loading.value = true
  await auth.logout()
  router.push({ name: 'login' })
}
</script>
