<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-56 border-r flex flex-col gap-1 p-4 shrink-0">
      <p class="font-semibold mb-4">Funplace Admin</p>
      <RouterLink
        to="/admin/reservas"
        class="px-3 py-2 rounded-md text-sm hover:bg-accent"
        active-class="bg-accent font-medium"
      >
        Reservas
      </RouterLink>
      <RouterLink
        to="/admin/espacios"
        class="px-3 py-2 rounded-md text-sm hover:bg-accent"
        active-class="bg-accent font-medium"
      >
        {{ sidebarLabel }}
      </RouterLink>
      <RouterLink
        to="/admin/perfil"
        class="px-3 py-2 rounded-md text-sm hover:bg-accent"
        active-class="bg-accent font-medium"
      >
        Mi Perfil
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
import { getSidebarLabel } from '@/constants/plans'

const auth = useAuthStore()
const sidebarLabel = computed(() => getSidebarLabel(auth.profile?.plan))
</script>
