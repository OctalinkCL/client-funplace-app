<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="item in amenities"
      :key="item.id"
      class="flex items-center gap-2 cursor-pointer select-none"
      @click="toggle(item.id)"
    >
      <!-- Checkbox visual puro — sin reka-ui para evitar el bug de estado controlado -->
      <div
        class="h-4 w-4 shrink-0 rounded-[4px] border flex items-center justify-center transition-colors"
        :class="modelValue.includes(item.id)
          ? 'bg-primary border-primary text-primary-foreground'
          : 'border-input bg-background'"
      >
        <svg
          v-if="modelValue.includes(item.id)"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-3 w-3"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span class="flex items-center gap-1.5 text-sm font-normal">
        <component :is="LUCIDE_ICON_MAP[item.icon]" class="h-4 w-4 text-muted-foreground shrink-0" />
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LUCIDE_ICON_MAP } from '@/constants/icons'
import type { AmenityRecord } from '@/types'

const props = defineProps<{
  amenities: AmenityRecord[]
  modelValue: string[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

function toggle(id: string) {
  const updated = props.modelValue.includes(id)
    ? props.modelValue.filter(a => a !== id)
    : [...props.modelValue, id]
  emit('update:modelValue', updated)
}
</script>
