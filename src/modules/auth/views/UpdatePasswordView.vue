<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Crear contraseña</CardTitle>
      <CardDescription>Elige una contraseña para tu cuenta.</CardDescription>
    </CardHeader>

    <CardContent>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-1.5">
          <Label for="password">Nueva contraseña</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
            minlength="8"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            minlength="8"
          />
        </div>

        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

        <Button type="submit" :disabled="loading" class="w-full">
          {{ loading ? 'Guardando...' : 'Guardar contraseña' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const router = useRouter()
const auth = useAuthStore()
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  loading.value = true
  try {
    const { error: err } = await supabase.auth.updateUser({ password: password.value })
    if (err) throw err
    auth.setPasswordRecovery(false)
    router.push({ name: 'admin-bookings' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al guardar la contraseña.'
  } finally {
    loading.value = false
  }
}
</script>
