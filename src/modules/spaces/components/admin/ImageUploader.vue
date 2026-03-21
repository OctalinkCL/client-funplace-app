<template>
  <div class="space-y-3">
    <!-- Image grid -->
    <div v-if="totalCount > 0" class="grid grid-cols-3 gap-3 sm:grid-cols-4">
      <!-- Existing images -->
      <div
        v-for="image in existingImages"
        :key="image.id"
        class="relative group aspect-square rounded-md overflow-hidden border"
      >
        <img :src="image.url" alt="Imagen del espacio" class="w-full h-full object-cover" />
        <button
          type="button"
          class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          @click="emit('remove-existing', image)"
        >
          <Trash2 :size="12" />
        </button>
      </div>

      <!-- Pending images (create mode) -->
      <div
        v-for="(preview, index) in pendingPreviews"
        :key="preview"
        class="relative group aspect-square rounded-md overflow-hidden border border-dashed"
      >
        <img :src="preview" alt="Vista previa" class="w-full h-full object-cover" />

        <!-- Compression badge -->
        <div
          v-if="pendingCompressionMetas?.[index] && hasCompression(pendingCompressionMetas[index])"
          class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center leading-tight"
        >
          {{ formatBytes(pendingCompressionMetas[index].originalSize) }} → {{ formatBytes(pendingCompressionMetas[index].compressedSize) }}
        </div>

        <button
          type="button"
          class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          @click="emit('remove-pending', index)"
        >
          <Trash2 :size="12" />
        </button>
      </div>
    </div>

    <!-- Drag & drop zone -->
    <div
      v-if="totalCount < MAX_IMAGES"
      class="relative border-2 border-dashed rounded-md transition-colors cursor-pointer"
      :class="isDragOver
        ? 'border-primary bg-primary/5'
        : 'border-muted-foreground/30 hover:border-muted-foreground/60'"
      @click="fileInput?.click()"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <!-- Upload in progress overlay -->
      <div
        v-if="uploading"
        class="absolute inset-0 bg-background/70 flex items-center justify-center rounded-md z-10"
      >
        <Loader2 class="animate-spin text-muted-foreground" :size="24" />
      </div>

      <div class="flex flex-col items-center gap-1.5 py-6 px-4 text-center select-none">
        <ImagePlus :size="24" class="text-muted-foreground" />
        <p class="text-sm text-muted-foreground">
          <span class="font-medium text-foreground">Arrastra imágenes aquí</span>
          {{ ' ' }}o haz clic para seleccionar
        </p>
        <p class="text-xs text-muted-foreground">JPEG, PNG o WebP — máx. 5 MB por imagen</p>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        class="hidden"
        @change="handleFiles"
      />
    </div>

    <!-- Counter -->
    <p class="text-xs text-muted-foreground">{{ totalCount }} / {{ MAX_IMAGES }} imágenes</p>

    <!-- Error -->
    <p v-if="uploadError" class="text-sm text-destructive">{{ uploadError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trash2, Loader2, ImagePlus } from 'lucide-vue-next'
import type { SpaceImage } from '@/types'
import type { CompressionMeta } from '../../services/images.service'
import { MAX_IMAGES } from '@/constants/spaces'

const props = defineProps<{
  existingImages: SpaceImage[]
  pendingPreviews: string[]
  pendingCompressionMetas?: CompressionMeta[]
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
const isDragOver = ref(false)

const totalCount = computed(() => props.existingImages.length + props.pendingPreviews.length)

function handleFiles(event: Event) {
  uploadError.value = null
  const input = event.target as HTMLInputElement
  if (!input.files) return
  for (const file of Array.from(input.files)) {
    emit('add-file', file)
  }
  if (fileInput.value) fileInput.value.value = ''
}

function handleDrop(event: DragEvent) {
  isDragOver.value = false
  uploadError.value = null
  const files = Array.from(event.dataTransfer?.files ?? [])
  for (const file of files) {
    emit('add-file', file)
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function hasCompression(meta: CompressionMeta): boolean {
  return meta.originalSize !== meta.compressedSize
}
</script>
