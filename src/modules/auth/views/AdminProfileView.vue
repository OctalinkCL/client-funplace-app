<template>
  <div class="max-w-xl">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Mi Perfil</h1>
      <p class="text-sm text-muted-foreground mt-1">Gestiona tu información personal y datos de contacto.</p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <!-- Información básica -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Información básica</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <Label for="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              v-model="form.full_name"
              type="text"
              placeholder="Tu nombre"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Datos de contacto -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Datos de contacto</CardTitle>
          <CardDescription>
            Estos datos son solo para ti. Puedes usarlos como plantilla al configurar el contacto de cada espacio.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <Label for="contactEmail">Email de contacto</Label>
            <Input
              id="contactEmail"
              v-model="form.contact_email"
              type="email"
              placeholder="email@ejemplo.com"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="contactPhone">Teléfono</Label>
            <Input
              id="contactPhone"
              v-model="form.contact_phone"
              type="tel"
              placeholder="+56 9 1234 5678"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="contactWhatsapp">WhatsApp</Label>
            <Input
              id="contactWhatsapp"
              v-model="form.contact_whatsapp"
              type="tel"
              placeholder="+56 9 1234 5678"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Feedback -->
      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <p v-if="success" class="text-sm text-green-600">Perfil actualizado correctamente.</p>

      <!-- Botón -->
      <div class="flex justify-end">
        <Button type="submit" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const auth = useAuthStore()

const form = reactive({
  full_name: '',
  contact_email: '',
  contact_phone: '',
  contact_whatsapp: '',
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

onMounted(() => {
  const p = auth.profile
  if (p) {
    form.full_name = p.full_name ?? ''
    form.contact_email = p.contact_email ?? ''
    form.contact_phone = p.contact_phone ?? ''
    form.contact_whatsapp = p.contact_whatsapp ?? ''
  }
})

async function handleSubmit() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    await auth.updateProfile({
      full_name: form.full_name || null,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
      contact_whatsapp: form.contact_whatsapp || null,
    })
    success.value = true
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al guardar el perfil.'
  } finally {
    loading.value = false
  }
}
</script>
