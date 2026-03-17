<template>
  <div v-if="loadingSpace" class="flex items-center justify-center py-20">
    <p class="text-muted-foreground">Cargando...</p>
  </div>

  <form v-else class="space-y-8" @submit.prevent="handleSubmit">
    <!-- Información básica -->
    <section class="space-y-4">
      <h2 class="text-base font-semibold">Información básica</h2>
      <Separator />

      <div class="space-y-1.5">
        <Label for="title">Nombre del espacio *</Label>
        <Input id="title" v-model="form.title" required placeholder="Casa LimaLimón" />
        <p v-if="form.slug" class="text-xs text-muted-foreground">URL: /espacios/{{ form.slug }}</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="space-y-1.5">
          <Label>Tipo de espacio</Label>
          <Select v-model="form.space_type">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in SPACE_TYPE_LIST" :key="item.key" :value="item.key">
                {{ item.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label for="capacity">Capacidad (personas)</Label>
          <Input id="capacity" v-model.number="form.capacity" type="number" min="1" placeholder="50" />
        </div>

        <div class="space-y-1.5">
          <Label for="size_m2">Superficie (m²)</Label>
          <Input id="size_m2" v-model.number="form.size_m2" type="number" min="1" placeholder="120" />
        </div>
      </div>

      <div class="space-y-1.5">
        <Label for="description">Descripción</Label>
        <Textarea
          id="description"
          v-model="form.description"
          placeholder="Describe el espacio, sus características y qué lo hace especial..."
          rows="4"
        />
      </div>
    </section>

    <!-- Ubicación -->
    <section class="space-y-4">
      <h2 class="text-base font-semibold">Ubicación</h2>
      <Separator />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="space-y-1.5">
          <Label>Región</Label>
          <Select v-model="form.region">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar región" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="region in REGIONS" :key="region" :value="region">
                {{ region }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label>Ciudad</Label>
          <Select v-model="form.city" :disabled="!form.region">
            <SelectTrigger>
              <SelectValue :placeholder="form.region ? 'Seleccionar ciudad' : 'Primero elige región'" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="city in availableCities" :key="city" :value="city">
                {{ city }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label for="address">Dirección referencial</Label>
          <Input id="address" v-model="form.address" placeholder="Av. Providencia 1234" />
        </div>
      </div>
    </section>

    <!-- Facilidades -->
    <section class="space-y-4">
      <h2 class="text-base font-semibold">Facilidades</h2>
      <Separator />
      <AmenitiesSelector v-model="selectedAmenities" />
    </section>

    <!-- Imágenes -->
    <section class="space-y-4">
      <h2 class="text-base font-semibold">Imágenes</h2>
      <Separator />
      <ImageUploader
        :existing-images="existingImages"
        :pending-previews="pendingPreviews"
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
        <Switch id="is_published" v-model:checked="form.is_published" />
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
      <Button type="submit" :disabled="loading || !form.title">
        {{ loading ? 'Guardando...' : isEditMode ? 'Guardar cambios' : 'Crear espacio' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpaceForm } from '../../composables/useSpaceForm'
import { SPACE_TYPE_LIST, REGIONS } from '@/constants/spaces'
import AmenitiesSelector from './AmenitiesSelector.vue'
import ImageUploader from './ImageUploader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { SpaceImage } from '@/types'

const props = defineProps<{ spaceId?: string }>()
const emit = defineEmits<{ saved: [spaceId: string] }>()

const router = useRouter()

const {
  form, selectedAmenities, existingImages, pendingPreviews,
  loading, loadingSpace, error, isEditMode, availableCities,
  loadSpace, addPendingFile, removePendingFile, addImageInEditMode,
  removeExistingImage, submit,
} = useSpaceForm(props.spaceId)

onMounted(() => {
  if (props.spaceId) loadSpace(props.spaceId)
})

function handleAddFile(file: File) {
  if (isEditMode.value) {
    addImageInEditMode(file)
  } else {
    const err = addPendingFile(file)
    if (err) error.value = err
  }
}

async function handleSubmit() {
  const savedId = await submit()
  if (savedId) emit('saved', savedId)
}
</script>
