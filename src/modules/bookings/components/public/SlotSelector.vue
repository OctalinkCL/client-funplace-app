<template>
  <div class="space-y-3">
    <h3 class="font-semibold">Bloques disponibles</h3>

    <!-- Loading -->
    <div v-if="loading" class="space-y-2">
      <div v-for="n in 2" :key="n" class="h-14 rounded-lg bg-muted animate-pulse" />
    </div>

    <!-- Sin slots -->
    <p v-else-if="slots.length === 0" class="text-sm text-muted-foreground">
      No hay bloques disponibles para este día.
    </p>

    <!-- Lista de slots disponibles -->
    <div v-else class="flex flex-col gap-2">
      <button
        v-for="slot in slots"
        :key="slot.blockId"
        class="flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors"
        :class="
          selectedBlockId === slot.blockId
            ? 'border-primary bg-primary/5'
            : 'hover:bg-muted/50'
        "
        @click="$emit('select-slot', slot)"
      >
        <div>
          <p class="font-medium text-sm">{{ slot.blockName }}</p>
          <p class="text-xs text-muted-foreground">{{ slot.startTime }} – {{ slot.endTime }}</p>
        </div>
        <span
          v-if="selectedBlockId === slot.blockId"
          class="text-xs font-medium text-primary"
        >
          Seleccionado
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getSlotsForDate } from '../../../bookings/composables/useSlots'
import type { SimpleSlot } from '@/types'

const props = defineProps<{
  spaceId: string
  date: string
  selectedBlockId?: string
}>()

const emit = defineEmits<{ 'select-slot': [slot: SimpleSlot] }>()

const slots = ref<SimpleSlot[]>([])
const loading = ref(false)

async function loadSlots() {
  if (!props.date) { slots.value = []; return }
  loading.value = true
  try {
    const all = await getSlotsForDate(props.spaceId, props.date)
    slots.value = all.filter(s => s.status === 'AVAILABLE')
  } finally {
    loading.value = false
  }
}

watch(() => props.date, loadSlots, { immediate: true })
</script>
