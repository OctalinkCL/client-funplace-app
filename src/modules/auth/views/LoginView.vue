<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Iniciar sesión</CardTitle>
      <CardDescription>Ingresa tus credenciales para acceder al panel.</CardDescription>
    </CardHeader>

    <CardContent>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-1.5">
          <Label for="email">Email</Label>
          <Input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@ejemplo.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="password">Contraseña</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>

        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

        <Button type="submit" :disabled="loading" class="w-full">
          {{ loading ? 'Ingresando...' : 'Entrar' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = route.query.redirect as string | undefined
    function isSafeRedirect(r: string): boolean {
      try {
        const url = new URL(r, window.location.origin)
        return url.origin === window.location.origin && url.pathname.startsWith('/admin')
      } catch { return false }
    }
    const safeRedirect = redirect && isSafeRedirect(redirect) ? redirect : undefined
    router.push(safeRedirect ?? { name: 'admin-bookings' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Credenciales incorrectas.'
  } finally {
    loading.value = false
  }
}
</script>
