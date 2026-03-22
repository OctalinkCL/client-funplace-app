<template>
  <div class="py-10 text-center space-y-4">
    <div class="text-4xl">✅</div>
    <h2 class="text-xl font-semibold">¡Solicitud enviada!</h2>
    <div class="rounded-lg border bg-muted/40 px-5 py-4 space-y-1 text-sm text-left">
      <p class="font-semibold text-base">{{ spaceName }}</p>
      <p class="text-muted-foreground">📅 {{ date }}</p>
      <p class="text-muted-foreground">🕐 {{ blockName }} · {{ timeRange }}</p>
    </div>
    <p class="text-muted-foreground text-sm leading-relaxed">
      Tu solicitud de reserva fue recibida. El administrador se pondrá en contacto contigo
      por email o teléfono para coordinar el pago y confirmar la reserva.
    </p>
    <RouterLink to="/" class="text-sm underline text-muted-foreground">
      Volver al inicio
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  spaceName: string
  date: string
  blockName: string
  timeRange: string
}>()
</script>
