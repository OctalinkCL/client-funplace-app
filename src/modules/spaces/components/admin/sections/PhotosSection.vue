<template>
  <div class="py-6 border-b">
    <h3 class="font-semibold mb-4">Fotos</h3>

    <!-- Image grid -->
    <div v-if="images.length" class="grid grid-cols-3 gap-2 sm:grid-cols-4 mb-4">
      <div
        v-for="img in images"
        :key="img.id"
        class="relative group aspect-square rounded-md overflow-hidden bg-muted"
      >
        <img :src="img.url" :alt="space.title" class="w-full h-full object-cover" />
        <button
          type="button"
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          @click="handleRemove(img)"
        >
          <X class="w-5 h-5 text-white" />
        </button>
      </div>
    </div>

    <!-- Upload button -->
    <div v-if="images.length < MAX_IMAGES">
      <label
        class="inline-flex items-center gap-2 cursor-pointer text-sm font-medium border rounded-md px-3 py-2 hover:bg-muted transition-colors"
        :class="{ 'opacity-50 pointer-events-none': uploadingCount > 0 }"
      >
        <ImagePlus class="w-4 h-4" />
        {{ uploadingCount > 0 ? 'Subiendo...' : 'Agregar fotos' }}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="sr-only"
          :disabled="uploadingCount > 0"
          @change="handleFileInput"
        />
      </label>
      <p class="text-xs text-muted-foreground mt-1">JPEG, PNG o WebP · Máx. 5MB · {{ images.length }}/{{ MAX_IMAGES }} fotos</p>
    </div>

    <p v-if="error" class="text-sm text-destructive mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { X, ImagePlus } from 'lucide-vue-next'
import { useSpaceImages } from '../../../composables/useSpaceImages'
import { MAX_IMAGES } from '@/constants/spaces'
import type { Space, SpaceImage } from '@/types'

const props = defineProps<{ space: Space }>()

const { images, uploadingCount, error, addImage, removeImage } = useSpaceImages(
  props.space.id,
  props.space.space_images ?? [],
)

function handleFileInput(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  const remaining = MAX_IMAGES - images.value.length
  files.slice(0, remaining).forEach(file => addImage(file))
  input.value = ''
}

async function handleRemove(img: SpaceImage) {
  await removeImage(img)
}
</script>
