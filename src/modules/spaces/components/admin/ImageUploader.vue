<template>
  <div class="space-y-3">
    <!-- Preview grid -->
    <div v-if="totalCount > 0" class="grid grid-cols-3 gap-3 sm:grid-cols-4">
      <!-- Imágenes ya subidas -->
      <div
        v-for="image in existingImages"
        :key="image.id"
        class="relative group aspect-square rounded-md overflow-hidden border"
      >
        <img :src="image.url" :alt="'Imagen'" class="w-full h-full object-cover" />
        <button
          type="button"
          class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          @click="emit('remove-existing', image)"
        >
          ✕
        </button>
      </div>

      <!-- Imágenes pendientes (create mode) -->
      <div
        v-for="(preview, index) in pendingPreviews"
        :key="preview"
        class="relative group aspect-square rounded-md overflow-hidden border border-dashed"
      >
        <img :src="preview" alt="Preview" class="w-full h-full object-cover" />
        <button
          type="button"
          class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          @click="emit('remove-pending', index)"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Upload button -->
    <div class="flex items-center gap-3">
      <label
        v-if="totalCount < 10"
        class="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-accent transition-colors"
        :class="{ 'opacity-50 pointer-events-none': uploading }"
      >
        <span>{{ uploading ? 'Subiendo...' : '+ Agregar imágenes' }}</span>
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="hidden"
          @change="handleFiles"
        />
      </label>
      <span class="text-sm text-muted-foreground">{{ totalCount }} / 10 imágenes</span>
    </div>

    <p v-if="uploadError" class="text-sm text-destructive">{{ uploadError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SpaceImage } from '@/types'

const props = defineProps<{
  existingImages: SpaceImage[]
  pendingPreviews: string[]
  isEditMode: boolean
  uploading?: boolean
}>()

const emit = defineEmits<{
  'add-file': [file: File]
  'remove-existing': [image: SpaceImage]
  'remove-pending': [index: number]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploadError = ref<string | null>(null)

const totalCount = computed(() => props.existingImages.length + props.pendingPreviews.length)

function handleFiles(event: Event) {
  uploadError.value = null
  const input = event.target as HTMLInputElement
  if (!input.files) return

  for (const file of Array.from(input.files)) {
    emit('add-file', file)
  }

  // Reset input so same file can be re-selected
  if (fileInput.value) fileInput.value.value = ''
}
</script>
