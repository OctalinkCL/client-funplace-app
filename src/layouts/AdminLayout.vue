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
        Mis Espacios
      </RouterLink>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">
      <header class="border-b px-6 py-3 flex items-center justify-end">
        <button class="text-sm text-muted-foreground hover:text-foreground" @click="logout">
          Cerrar sesión
        </button>
      </header>
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>
