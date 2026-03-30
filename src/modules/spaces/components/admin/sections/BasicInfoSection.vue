<template>
  <div class="py-6 border-b">
    <!-- Read state -->
    <div v-if="!editing" class="flex items-start justify-between gap-4">
      <div class="space-y-1 min-w-0">
        <h3 class="font-semibold">Detalles del espacio</h3>
        <p v-if="!space.description && !space.space_type" class="text-sm text-muted-foreground">
          Para poder publicar tu espacio necesitás completar el título y la descripción
        </p>
        <div class="space-y-0.5 text-sm text-muted-foreground mt-1">
          <p v-if="space.space_type">{{ typeLabel }}</p>
          <p v-if="space.description" class="line-clamp-2">{{ space.description }}</p>
          <p v-if="space.kind === 'space' && (space.capacity || space.size_m2)">
            <span v-if="space.capacity">{{ space.capacity }} personas</span>
            <span v-if="space.capacity && space.size_m2"> · </span>
            <span v-if="space.size_m2">{{ space.size_m2 }} m²</span>
          </p>
        </div>
      </div>
      <Button variant="link" class="shrink-0 px-0" @click="startEdit">Editar</Button>
    </div>

    <!-- Edit state -->
    <div v-else class="space-y-4">
      <h3 class="font-semibold">Detalles del espacio</h3>

      <!-- Título -->
      <div class="space-y-1.5">
        <Label for="bi-title">Nombre *</Label>
        <Input id="bi-title" v-model="local.title" required placeholder="Ej: Casa LimaLimón" />
        <p class="text-xs text-muted-foreground">URL: /espacios/{{ space.slug }}</p>
      </div>

      <!-- Tipo -->
      <div class="space-y-1.5">
        <Label>Tipo</Label>
        <Select v-model="local.space_type">
          <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in typeOptions" :key="item.key" :value="item.key">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Capacidad / m² — solo spaces -->
      <div v-if="space.kind === 'space'" class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <Label for="bi-capacity">Capacidad</Label>
          <Input id="bi-capacity" v-model="capacityStr" type="number" min="1" placeholder="50 personas" />
        </div>
        <div class="space-y-1.5">
          <Label for="bi-size">Superficie (m²)</Label>
          <Input id="bi-size" v-model="sizeStr" type="number" min="1" placeholder="120" />
        </div>
      </div>

      <!-- Descripción -->
      <div class="space-y-1.5">
        <Label for="bi-desc">Descripción</Label>
        <p class="text-xs text-muted-foreground">
          Contá todo, no te guardes nada: qué incluye, qué esperar, para qué situaciones es ideal tu espacio, etcétera.
        </p>
        <Textarea
          id="bi-desc"
          v-model="local.description"
          placeholder="Describe el espacio, sus características y qué lo hace especial..."
          rows="5"
          maxlength="2000"
        />
        <p class="text-xs text-muted-foreground text-right">{{ (local.description ?? '').length }}/2000</p>
      </div>

      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <div class="flex gap-3 justify-end">
        <Button variant="link" class="px-0" :disabled="loading" @click="cancel">Cancelar</Button>
        <Button :disabled="loading || !local.title" @click="save">
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { spacesService } from '../../../services/spaces.service'
import { SPACE_TYPE_LIST, SPACE_TYPE_LABELS } from '@/constants/spaces'
import { SERVICE_TYPES } from '@/constants/plans'
import type { Space, SpaceType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const props = defineProps<{ space: Space }>()
const emit = defineEmits<{ updated: [space: Space] }>()

const editing = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const local = ref({ title: '', space_type: null as SpaceType | null, description: '', capacity: null as number | null, size_m2: null as number | null })
const capacityStr = ref('')
const sizeStr = ref('')

watch(capacityStr, v => { local.value.capacity = v === '' ? null : Number(v) || null })
watch(sizeStr, v => { local.value.size_m2 = v === '' ? null : Number(v) || null })

const typeOptions = computed(() =>
  props.space.kind === 'service'
    ? SERVICE_TYPES.map(t => ({ key: t.value, label: t.label }))
    : SPACE_TYPE_LIST.map(t => ({ key: t.key, label: t.label }))
)

const typeLabel = computed(() => {
  if (!props.space.space_type) return ''
  return SPACE_TYPE_LABELS[props.space.space_type] ?? props.space.space_type
})

function startEdit() {
  local.value = {
    title: props.space.title,
    space_type: props.space.space_type,
    description: props.space.description ?? '',
    capacity: props.space.capacity,
    size_m2: props.space.size_m2,
  }
  capacityStr.value = props.space.capacity?.toString() ?? ''
  sizeStr.value = props.space.size_m2?.toString() ?? ''
  error.value = null
  editing.value = true
}

function cancel() {
  editing.value = false
  error.value = null
}

async function save() {
  if (!local.value.title.trim()) return
  if (local.value.capacity !== null && local.value.capacity < 1) {
    error.value = 'La capacidad debe ser mayor a 0.'
    return
  }
  if (local.value.size_m2 !== null && local.value.size_m2 < 1) {
    error.value = 'La superficie debe ser mayor a 0.'
    return
  }
  loading.value = true
  error.value = null
  try {
    const updated = await spacesService.update(props.space.id, {
      title: local.value.title,
      space_type: local.value.space_type,
      description: local.value.description || null,
      capacity: local.value.capacity,
      size_m2: local.value.size_m2,
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
