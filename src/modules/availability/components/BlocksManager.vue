<template>
  <div class="space-y-4">
    <h2 class="text-base font-semibold">Bloques horarios</h2>
    <Separator />

    <!-- Lista de bloques -->
    <div v-if="blocks.length > 0" class="flex flex-col gap-2">
      <template v-for="block in blocks" :key="block.tempId">
        <!-- Modo edición inline -->
        <div
          v-if="editingTempId === block.tempId"
          class="rounded-md border px-4 py-3 bg-muted/40"
        >
          <form class="flex flex-wrap items-center gap-2" @submit.prevent="submitEdit(block.tempId)">
            <Input v-model="editName" class="w-36 h-8 text-sm" placeholder="Nombre" required />
            <input
              v-model="editStart"
              type="time"
              required
              class="flex h-8 w-28 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <span class="text-muted-foreground text-sm">–</span>
            <input
              v-model="editEnd"
              type="time"
              required
              class="flex h-8 w-28 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p v-if="editError" class="w-full text-xs text-destructive -mt-1">{{ editError }}</p>
            <div class="flex gap-2 ml-auto">
              <Button type="submit" size="sm" class="h-8">Guardar</Button>
              <Button type="button" variant="ghost" size="sm" class="h-8" @click="$emit('cancel-edit')">
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        <!-- Fila normal -->
        <div
          v-else
          class="flex items-center justify-between rounded-md border px-4 py-2"
        >
          <div>
            <span class="font-medium text-sm">{{ block.name }}</span>
            <span class="text-muted-foreground text-sm ml-2">
              {{ block.start_time }} – {{ block.end_time }}
            </span>
          </div>
          <div class="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              class="h-7 px-2 text-sm"
              :disabled="editingTempId !== null"
              @click="beginEdit(block)"
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 px-2 text-sm text-destructive hover:text-destructive"
              :disabled="editingTempId !== null"
              @click="$emit('remove-block', block.tempId)"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </template>
    </div>
    <p v-else class="text-sm text-muted-foreground">
      Aún no hay bloques. Agrega al menos uno para configurar los días.
    </p>

    <!-- Formulario agregar bloque -->
    <TimeBlockForm @add="({ name, start_time, end_time }) => $emit('add-block', { name, start_time, end_time })" />

    <!-- Footer de guardado -->
    <div class="flex items-center gap-4 pt-2">
      <Button :disabled="saving || blocks.length === 0" @click="$emit('save')">
        {{ saving ? 'Guardando...' : 'Guardar bloques' }}
      </Button>
      <p v-if="saved" class="text-sm text-green-600">Bloques guardados.</p>
      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import TimeBlockForm from './TimeBlockForm.vue'
import type { FormBlock } from '../services/availability.service'

const props = defineProps<{
  blocks: FormBlock[]
  editingTempId: string | null
  saving: boolean
  saved: boolean
  error: string | null
}>()

const emit = defineEmits<{
  'add-block': [{ name: string; start_time: string; end_time: string }]
  'start-edit': [tempId: string]
  'cancel-edit': []
  'update-block': [tempId: string, name: string, start_time: string, end_time: string]
  'remove-block': [tempId: string]
  'save': []
}>()

const editName = ref('')
const editStart = ref('')
const editEnd = ref('')
const editError = ref<string | null>(null)

function beginEdit(block: FormBlock) {
  editName.value = block.name
  editStart.value = block.start_time
  editEnd.value = block.end_time
  editError.value = null
  emit('start-edit', block.tempId)
}

function submitEdit(tempId: string) {
  editError.value = null
  if (editEnd.value <= editStart.value) {
    editError.value = 'La hora de fin debe ser posterior al inicio.'
    return
  }
  emit('update-block', tempId, editName.value, editStart.value, editEnd.value)
}

// Limpiar campos cuando se cancela la edición desde el padre
watch(() => props.editingTempId, (val) => {
  if (val === null) {
    editError.value = null
  }
})
</script>
