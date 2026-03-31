<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Bienvenido a Funplace</CardTitle>
      <CardDescription>Configura tu nombre y contraseña para activar tu cuenta.</CardDescription>
    </CardHeader>

    <CardContent>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-1.5">
          <Label for="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            v-model="fullName"
            type="text"
            autocomplete="name"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="password">Contraseña</Label>
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
          {{ loading ? 'Configurando...' : 'Activar cuenta' }}
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
const fullName = ref('')
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

  if (password.value.length < 8 || !/[A-Z]/.test(password.value) || !/[0-9]/.test(password.value)) {
    error.value = 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 número.'
    return
  }

  loading.value = true
  try {
    const { error: authError } = await supabase.auth.updateUser({
      password: password.value,
      data: { full_name: fullName.value },
    })
    if (authError) throw authError

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName.value })
      .eq('id', auth.user!.id)
    if (profileError) throw profileError

    await auth.fetchProfile()
    auth.setPasswordRecovery(false)
    auth.setInviteSetup(false)
    router.push({ name: 'admin-bookings' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al configurar la cuenta.'
  } finally {
    loading.value = false
  }
}
</script>
