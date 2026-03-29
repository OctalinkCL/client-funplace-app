<template>
  <div class="py-6 border-b">
    <!-- Read state -->
    <div v-if="!editing" class="flex items-start justify-between gap-4">
      <div class="space-y-2 flex-1 min-w-0">
        <h3 class="font-semibold">Facilidades</h3>
        <div v-if="selectedNames.length" class="flex flex-wrap gap-1.5">
          <span
            v-for="name in selectedNames"
            :key="name"
            class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
          >
            {{ name }}
          </span>
        </div>
        <p v-else class="text-sm text-muted-foreground">Sin facilidades seleccionadas</p>
      </div>
      <Button variant="link" class="shrink-0 px-0" @click="startEdit">Editar</Button>
    </div>

    <!-- Edit state -->
    <div v-else class="space-y-4">
      <h3 class="font-semibold">Facilidades</h3>
      <AmenitiesSelector v-model="localSelected" :amenities="amenities" />

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
import { ref, computed, onMounted } from 'vue'
import { spacesService } from '../../../services/spaces.service'
import { useAmenities } from '../../../composables/useAmenities'
import type { Space } from '@/types'
import { Button } from '@/components/ui/button'
import AmenitiesSelector from '../AmenitiesSelector.vue'

const props = defineProps<{ space: Space }>()
const emit = defineEmits<{ updated: [space: Space] }>()

const editing = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const localSelected = ref<string[]>([])

const { amenities, fetchAmenities } = useAmenities()

onMounted(fetchAmenities)

const currentAmenityIds = computed(() =>
  (props.space.space_amenities ?? []).map(a => a.amenity_id)
)

const selectedNames = computed(() =>
  amenities.value
    .filter(a => currentAmenityIds.value.includes(a.id))
    .map(a => a.name)
)

function startEdit() {
  localSelected.value = [...currentAmenityIds.value]
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
    await spacesService.setAmenities(props.space.id, localSelected.value)
    // Emit updated space with new amenities merged in
    emit('updated', {
      ...props.space,
      space_amenities: localSelected.value.map(amenity_id => ({ amenity_id })),
    })
    editing.value = false
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al guardar facilidades.'
  } finally {
    loading.value = false
  }
}
</script>
