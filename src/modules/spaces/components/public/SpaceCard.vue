<template>
  <RouterLink
    :to="{ name: 'space-detail', params: { slug: space.slug } }"
    class="group block rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
  >
    <!-- Imagen -->
    <div class="aspect-4/3 overflow-hidden bg-muted">
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="space.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
        Sin imagen
      </div>
    </div>

    <!-- Info -->
    <div class="p-4 space-y-1">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-base leading-tight line-clamp-1">{{ space.title }}</h3>
        <Badge v-if="space.space_type" variant="secondary" class="shrink-0 text-xs">
          {{ SPACE_TYPE_LABELS[space.space_type] ?? space.space_type }}
        </Badge>
      </div>

      <p class="text-sm text-muted-foreground">
        {{ [space.city, space.region].filter(Boolean).join(', ') || 'Sin ubicación' }}
      </p>

      <p v-if="space.capacity" class="text-xs text-muted-foreground">
        Hasta {{ space.capacity }} personas
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { SPACE_TYPE_LABELS } from '@/constants/spaces'
import type { Space } from '@/types'

const props = defineProps<{ space: Space }>()

const coverImage = computed(() => {
  const images = props.space.space_images
  if (!images || images.length === 0) return null
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
  return sorted[0].url
})
</script>
