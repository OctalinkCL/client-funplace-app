<template>
  <div class="py-6 border-b">
    <!-- Read state -->
    <div v-if="!editing" class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <h3 class="font-semibold">Ubicación</h3>
        <div class="text-sm text-muted-foreground space-y-0.5">
          <p v-if="space.region || space.city">
            <span v-if="space.region">{{ space.region }}</span>
            <span v-if="space.region && space.city"> · </span>
            <span v-if="space.city">{{ space.city }}</span>
          </p>
          <p v-if="space.address">{{ space.address }}</p>
          <p v-if="!space.region && !space.address" class="italic">Sin ubicación definida</p>
        </div>
      </div>
      <Button variant="link" class="shrink-0 px-0" @click="startEdit">Editar</Button>
    </div>

    <!-- Edit state -->
    <div v-else class="space-y-4">
      <h3 class="font-semibold">Ubicación</h3>

      <!-- Región / Ciudad -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-1.5">
          <Label>Región</Label>
          <Select v-model="local.region" @update:modelValue="local.city = null">
            <SelectTrigger><SelectValue placeholder="Selecciona región" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="r in CHILE_REGIONS" :key="r.name" :value="r.name">
                {{ r.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="space-y-1.5">
          <Label>Ciudad / Comuna</Label>
          <Select v-model="local.city" :disabled="!local.region">
            <SelectTrigger><SelectValue placeholder="Selecciona ciudad" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="c in communesForRegion" :key="c" :value="c">
                {{ c }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Dirección con Google Places -->
      <PlaceSearchInput @place-selected="applyPlace" />
      <LocationMapPicker
        :lat="local.lat"
        :lng="local.lng"
        @update:lat="local.lat = $event"
        @update:lng="local.lng = $event"
      />

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
import { ref, computed } from 'vue'
import { spacesService } from '../../../services/spaces.service'
import { extractPlaceData } from '@/constants/spaces'
import { CHILE_REGIONS } from '@/constants/regions'
import type { Space, PlaceResult } from '@/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import PlaceSearchInput from '../PlaceSearchInput.vue'
import LocationMapPicker from '@/components/LocationMapPicker.vue'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const props = defineProps<{ space: Space }>()
const emit = defineEmits<{ updated: [space: Space] }>()

const editing = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const local = ref({
  region: null as string | null,
  city: null as string | null,
  address: '' as string,
  lat: null as number | null,
  lng: null as number | null,
})

const communesForRegion = computed(() =>
  CHILE_REGIONS.find(r => r.name === local.value.region)?.communes ?? []
)

function applyPlace(place: PlaceResult) {
  const { address, lat, lng } = extractPlaceData(place)
  local.value.address = address
  local.value.lat = lat
  local.value.lng = lng
}

function startEdit() {
  local.value = {
    region: props.space.region ?? null,
    city: props.space.city ?? null,
    address: props.space.address ?? '',
    lat: props.space.lat ?? null,
    lng: props.space.lng ?? null,
  }
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
      region: local.value.region,
      city: local.value.city,
      address: local.value.address || null,
      lat: local.value.lat,
      lng: local.value.lng,
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
