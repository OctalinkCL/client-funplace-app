<template>
  <div v-if="loadingService" class="flex items-center justify-center py-20">
    <p class="text-muted-foreground">Cargando...</p>
  </div>

  <form v-else class="space-y-8" @submit.prevent="handleSubmit">
    <!-- Información básica -->
    <section class="space-y-4">
      <h2 class="text-base font-semibold">Información básica</h2>
      <Separator />

      <div class="space-y-1.5">
        <Label for="title">Nombre del servicio *</Label>
        <Input id="title" v-model="form.title" required placeholder="Ej: Catering Los Pinos" />
        <p v-if="form.slug" class="text-xs text-muted-foreground">URL: /espacios/{{ form.slug }}</p>
      </div>

      <div class="space-y-1.5">
        <Label>Tipo de servicio *</Label>
        <Select v-model="form.space_type">
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in SERVICE_TYPES" :key="item.value" :value="item.value">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-1.5">
        <Label for="description">Descripción</Label>
        <Textarea id="description" v-model="form.description"
          placeholder="Describe el servicio, qué incluye y qué lo hace especial..." rows="4" />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-1.5">
          <Label for="service_area">Zona de cobertura</Label>
          <Input id="service_area" v-model="form.service_area" placeholder="Ej: Gran Concepción" />
          <p class="text-xs text-muted-foreground">Área geográfica donde prestas el servicio.</p>
        </div>

        <div class="space-y-1.5">
          <Label for="price_from">Precio desde (CLP)</Label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input id="price_from" v-model="priceModel" type="number" min="0" step="1000"
              placeholder="80000" class="pl-7" />
          </div>
          <p class="text-xs text-muted-foreground">Precio mínimo referencial.</p>
        </div>
      </div>
    </section>

    <!-- Ubicación -->
    <section class="space-y-4">
      <h2 class="text-base font-semibold">Ubicación base</h2>
      <Separator />

      <!-- Región / Ciudad -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-1.5">
          <Label>Región</Label>
          <Select v-model="form.region" @update:modelValue="onRegionChange">
            <SelectTrigger>
              <SelectValue placeholder="Selecciona región" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="r in CHILE_REGIONS" :key="r.name" :value="r.name">
                {{ r.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="space-y-1.5">
          <Label>Ciudad / Comuna</Label>
          <Select v-model="form.city" :disabled="!form.region">
            <SelectTrigger>
              <SelectValue placeholder="Selecciona ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="c in communesForSelectedRegion" :key="c" :value="c">
                {{ c }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Dirección -->
      <PlaceSearchInput @place-selected="applyPlaceData" />
      <LocationMapPicker
        :lat="form.lat"
        :lng="form.lng"
        @update:lat="form.lat = $event"
        @update:lng="form.lng = $event"
      />
    </section>

    <!-- Imágenes -->
    <section class="space-y-4">
      <h2 class="text-base font-semibold">Imágenes</h2>
      <Separator />
      <ImageUploader
        :existing-images="existingImages"
        :pending-previews="pendingPreviews"
        :pending-compression-metas="pendingCompressionMetas"
        :is-edit-mode="isEditMode"
        :uploading="loading"
        @add-file="handleAddFile"
        @remove-existing="removeExistingImage"
        @remove-pending="removePendingFile"
      />
    </section>

    <!-- Publicación -->
    <section class="space-y-4">
      <h2 class="text-base font-semibold">Publicación</h2>
      <Separator />
      <div class="flex items-center gap-3">
        <Switch id="is_published" v-model="form.is_published" />
        <Label for="is_published" class="cursor-pointer">
          {{ form.is_published ? 'Publicado — visible para clientes' : 'Borrador — solo visible para ti' }}
        </Label>
      </div>
    </section>

    <!-- Error global -->
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

    <!-- Acciones -->
    <div class="flex items-center gap-3 justify-end pt-2">
      <Button type="button" variant="outline" @click="router.back()">Cancelar</Button>
      <Button type="submit" :disabled="loading || !form.title || !form.space_type || !isDirty">
        {{ loading ? 'Guardando...' : isEditMode ? 'Guardar cambios' : 'Crear servicio' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useServiceForm } from '../../composables/useServiceForm'
import { SERVICE_TYPES } from '@/constants/plans'
import { CHILE_REGIONS } from '@/constants/regions'
import ImageUploader from './ImageUploader.vue'
import PlaceSearchInput from './PlaceSearchInput.vue'
import LocationMapPicker from '@/components/LocationMapPicker.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const props = defineProps<{ serviceId?: string }>()
const emit = defineEmits<{ saved: [serviceId: string] }>()

const router = useRouter()

const {
  form, existingImages, pendingPreviews, pendingCompressionMetas,
  loading, loadingService, error, isEditMode, isDirty,
  applyPlaceData, loadService,
  addPendingFile, removePendingFile, addImageInEditMode,
  removeExistingImage, submit,
} = useServiceForm(props.serviceId)

const communesForSelectedRegion = computed(() =>
  CHILE_REGIONS.find(r => r.name === form.region)?.communes ?? []
)

const priceModel = computed({
  get: () => form.price_from ?? undefined,
  set: (v: string | number | undefined) => { form.price_from = Number(v) || null },
})

function onRegionChange() {
  form.city = null
}

onMounted(() => {
  if (props.serviceId) loadService(props.serviceId)
})

async function handleAddFile(file: File) {
  if (isEditMode.value) {
    addImageInEditMode(file)
  } else {
    const err = await addPendingFile(file)
    if (err) error.value = err
  }
}

async function handleSubmit() {
  const savedId = await submit()
  if (savedId) emit('saved', savedId)
}
</script>
