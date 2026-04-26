<template>
  <div class="py-6 border-b">
    <!-- Read state -->
    <div v-if="!editing" class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <h3 class="font-semibold">Zona de cobertura</h3>
        <p class="text-sm text-muted-foreground">
          {{ space.service_area || 'Sin zona de cobertura definida' }}
        </p>
      </div>
      <Button variant="link" class="shrink-0 px-0" @click="startEdit">Editar</Button>
    </div>

    <!-- Edit state -->
    <div v-else class="space-y-4">
      <h3 class="font-semibold">Zona de cobertura</h3>
      <div class="space-y-1.5">
        <Label for="service-area">Área de cobertura</Label>
        <p class="text-xs text-muted-foreground">Área geográfica donde prestas el servicio.</p>
        <Input
          id="service-area"
          v-model="localArea"
          placeholder="Ej: Gran Concepción"
        />
      </div>

      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <div class="flex gap-3 justify-end">
        <Button variant="link" class="px-0" :disabled="loading" @click="cancel">Cancelar</Button>
        <Button :disabled="loading" @click="save">
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { spacesService } from '../../../services/spaces.service'
import type { Space } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{ space: Space }>()
const emit = defineEmits<{ updated: [space: Space] }>()

const editing = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const localArea = ref('')

function startEdit() {
  localArea.value = props.space.service_area ?? ''
  error.value = null
  editing.value = true
}

function cancel() {
  editing.value = false
  error.value = null
}

async function save() {
  loading.value = true
  error.value = null
  try {
    const updated = await spacesService.update(props.space.id, {
      service_area: localArea.value || null,
    })
    emit('updated', updated)
    editing.value = false
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al guardar.'
  } finally {
    loading.value = false
  }
}
</script>
