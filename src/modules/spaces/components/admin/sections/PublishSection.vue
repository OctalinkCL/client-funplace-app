<template>
  <div class="py-6">
    <div class="flex items-center justify-between gap-4">
      <div class="space-y-1">
        <h3 class="font-semibold">Publicación</h3>
        <p class="text-sm text-muted-foreground">
          {{ space.is_published
            ? 'Publicado — visible para clientes en el sitio'
            : 'Borrador — solo visible para ti' }}
        </p>
      </div>
      <Switch
        :model-value="space.is_published"
        :disabled="loading"
        @update:model-value="handleToggle"
      />
    </div>
    <p v-if="error" class="text-sm text-destructive mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { spacesService } from '../../../services/spaces.service'
import type { Space } from '@/types'
import { Switch } from '@/components/ui/switch'

const props = defineProps<{ space: Space }>()
const emit = defineEmits<{ updated: [space: Space] }>()

const loading = ref(false)
const error = ref<string | null>(null)

async function handleToggle(value: boolean) {
  loading.value = true
  error.value = null
  try {
    await spacesService.togglePublish(props.space.id, value)
    emit('updated', { ...props.space, is_published: value })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al cambiar estado de publicación.'
  } finally {
    loading.value = false
  }
}
</script>
