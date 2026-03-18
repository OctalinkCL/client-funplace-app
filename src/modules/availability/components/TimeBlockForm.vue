<template>
  <form class="flex flex-wrap items-end gap-3" @submit.prevent="handleSubmit">
    <div class="space-y-1.5">
      <Label for="block-name">Nombre del bloque</Label>
      <Input
        id="block-name"
        v-model="name"
        placeholder="ej. Mañana"
        class="w-36"
        required
      />
    </div>

    <div class="space-y-1.5">
      <Label for="block-start">Inicio</Label>
      <input
        id="block-start"
        v-model="start_time"
        type="time"
        required
        class="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>

    <div class="space-y-1.5">
      <Label for="block-end">Fin</Label>
      <input
        id="block-end"
        v-model="end_time"
        type="time"
        required
        class="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>

    <Button type="submit" variant="outline" size="sm">+ Agregar bloque</Button>

    <p v-if="validationError" class="w-full text-sm text-destructive">{{ validationError }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const emit = defineEmits<{
  add: [{ name: string; start_time: string; end_time: string }]
}>()

const name = ref('')
const start_time = ref('')
const end_time = ref('')
const validationError = ref<string | null>(null)

function handleSubmit() {
  validationError.value = null
  if (!name.value || !start_time.value || !end_time.value) {
    validationError.value = 'Completa todos los campos.'
    return
  }
  if (end_time.value <= start_time.value) {
    validationError.value = 'La hora de fin debe ser posterior al inicio.'
    return
  }
  emit('add', { name: name.value, start_time: start_time.value, end_time: end_time.value })
  name.value = ''
  start_time.value = ''
  end_time.value = ''
}
</script>
