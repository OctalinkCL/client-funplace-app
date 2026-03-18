<template>
  <div v-if="displayAmenities.length" class="grid grid-cols-2 gap-2 sm:grid-cols-3">
    <div
      v-for="item in displayAmenities"
      :key="item.id"
      class="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <component :is="LUCIDE_ICON_MAP[item.icon]" class="h-4 w-4 shrink-0" />
      <span>{{ item.name }}</span>
    </div>
  </div>
  <p v-else class="text-sm text-muted-foreground">Sin facilidades registradas.</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LUCIDE_ICON_MAP } from '@/constants/icons'
import type { Space, AmenityRecord } from '@/types'

const props = defineProps<{
  spaceAmenities: NonNullable<Space['space_amenities']>
  amenityList: AmenityRecord[]
}>()

const displayAmenities = computed(() => {
  const ids = new Set(props.spaceAmenities.map(a => a.amenity_id))
  return props.amenityList.filter(a => ids.has(a.id))
})
</script>
