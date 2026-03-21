<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-56 border-r flex flex-col gap-1 p-4 shrink-0">
      <p class="font-semibold mb-4">Funplace Admin</p>
      <RouterLink
        v-for="item in visibleNavItems"
        :key="item.to"
        :to="item.to"
        class="px-3 py-2 rounded-md text-sm hover:bg-accent"
        active-class="bg-accent font-medium"
      >
        {{ item.label }}
      </RouterLink>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">
      <header class="border-b px-6 py-3 flex items-center justify-end">
        <LogoutButton />
      </header>
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LogoutButton from '@/modules/auth/components/LogoutButton.vue'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()

const NAV_ITEMS = [
  { to: '/admin/reservas', label: 'Reservas',     module: null },
  { to: '/admin/espacios', label: 'Mis Espacios', module: 'spaces' },
  { to: '/admin/perfil',   label: 'Mi Perfil',    module: null },
]

const visibleNavItems = computed(() =>
  NAV_ITEMS.filter(item => !item.module || auth.hasModule(item.module))
)
</script>
