<template>
  <div class="flex items-center gap-2">
    <button
      class="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      @click="prev"
    >
      ←
    </button>
    <span class="text-sm font-medium w-32 text-center">{{ label }}</span>
    <button
      class="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      @click="next"
    >
      →
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MONTHS_ES } from '@/constants/bookings'

const props = defineProps<{
  year: number
  month: number // 0-indexed
}>()

const emit = defineEmits<{
  change: [year: number, month: number]
}>()

const label = computed(() => `${MONTHS_ES[props.month]} ${props.year}`)

function prev() {
  if (props.month === 0) emit('change', props.year - 1, 11)
  else emit('change', props.year, props.month - 1)
}

function next() {
  if (props.month === 11) emit('change', props.year + 1, 0)
  else emit('change', props.year, props.month + 1)
}
</script>
