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

      <template v-if="!isEditMode">
        <PlaceSearchInput @place-selected="applyPlaceData" />
        <div v-if="form.address" class="text-xs text-muted-foreground -mt-2">
          <span class="font-medium text-foreground">Región:</span> {{ form.region }}
          <span class="mx-1">·</span>
          <span class="font-medium text-foreground">Ciudad:</span> {{ form.city }}
        </div>
      </template>

      <template v-else>
        <div v-if="!editingLocation" class="space-y-1.5">
          <p class="text-sm text-foreground">{{ form.address || 'Sin dirección' }}</p>
          <div v-if="form.region || form.city" class="text-xs text-muted-foreground">
            <span class="font-medium text-foreground">Región:</span> {{ form.region }}
            <span class="mx-1">·</span>
            <span class="font-medium text-foreground">Ciudad:</span> {{ form.city }}
          </div>
          <Button type="button" variant="outline" size="sm" @click="editingLocation = true">
            Editar dirección
          </Button>
        </div>
        <div v-else class="space-y-2">
          <PlaceSearchInput @place-selected="handlePlaceSelected" />
          <Button type="button" variant="ghost" size="sm" @click="editingLocation = false">
            Cancelar
          </Button>
        </div>
      </template>
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
      <Button type="submit" :disabled="loading || !form.title || !form.space_type">
        {{ loading ? 'Guardando...' : isEditMode ? 'Guardar cambios' : 'Crear servicio' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useServiceForm } from '../../composables/useServiceForm'
import { SERVICE_TYPES } from '@/constants/plans'
import ImageUploader from './ImageUploader.vue'
import PlaceSearchInput from './PlaceSearchInput.vue'
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
  loading, loadingService, error, isEditMode,
  applyPlaceData, loadService,
  addPendingFile, removePendingFile, addImageInEditMode,
  removeExistingImage, submit,
} = useServiceForm(props.serviceId)

const editingLocation = ref(false)

const priceModel = computed({
  get: () => form.price_from ?? undefined,
  set: (v: string | number | undefined) => { form.price_from = Number(v) || null },
})

function handlePlaceSelected(place: import('@/types').PlaceResult) {
  applyPlaceData(place)
  editingLocation.value = false
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
