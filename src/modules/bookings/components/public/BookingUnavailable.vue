<template>
  <div class="py-10 text-center space-y-3">
    <p class="text-muted-foreground">Este bloque ya no está disponible.</p>
    <RouterLink
      :to="{ name: 'space-detail', params: { slug } }"
      class="text-sm underline"
    >
      Volver a elegir fecha
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  slug: string
}>()
</script>
