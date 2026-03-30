<template>
  <div class="py-6 border-b">
    <!-- Read state -->
    <div v-if="!editing" class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <h3 class="font-semibold">Precio</h3>
        <p class="text-sm text-muted-foreground">
          {{ space.price_from ? `Desde $${space.price_from.toLocaleString('es-CL')}` : 'Sin precio referencial' }}
        </p>
      </div>
      <Button variant="link" class="shrink-0 px-0" @click="startEdit">Editar</Button>
    </div>

    <!-- Edit state -->
    <div v-else class="space-y-4">
      <h3 class="font-semibold">Precio</h3>
      <div class="space-y-1.5">
        <Label for="price-from">Precio desde (CLP)</Label>
        <p class="text-xs text-muted-foreground">Precio mínimo referencial. Opcional.</p>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <Input
            id="price-from"
            v-model="priceStr"
            type="number"
            min="0"
            step="1000"
            placeholder="80000"
            class="pl-7"
          />
        </div>
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
const priceStr = ref('')

function startEdit() {
  priceStr.value = props.space.price_from?.toString() ?? ''
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
      price_from: priceStr.value === '' ? null : Number(priceStr.value) || null,
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
