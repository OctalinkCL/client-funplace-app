<template>
  <Button variant="ghost" size="sm" :disabled="loading" @click="handleLogout">
    {{ loading ? 'Saliendo...' : 'Cerrar sesión' }}
  </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)

async function handleLogout() {
  loading.value = true
  await auth.logout()
  router.push({ name: 'login' })
}
</script>
