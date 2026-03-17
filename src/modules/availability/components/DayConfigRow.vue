<template>
  <div class="flex items-start gap-4 py-3 border-b last:border-b-0">
    <!-- Switch + nombre del día -->
    <div class="flex items-center gap-2 w-32 shrink-0 pt-0.5">
      <Switch
        :id="`day-${modelValue.day_of_week}`"
        :model-value="modelValue.enabled"
        @update:model-value="toggleEnabled"
      />
      <Label :for="`day-${modelValue.day_of_week}`" class="cursor-pointer font-medium">
        {{ dayLabel }}
      </Label>
    </div>

    <!-- Bloques disponibles -->
    <div v-if="modelValue.enabled" class="flex flex-wrap gap-4">
      <div
        v-for="block in blocks"
        :key="block.tempId"
        class="flex items-center gap-1.5"
      >
        <Checkbox
          :id="`day-${modelValue.day_of_week}-block-${block.tempId}`"
          :model-value="modelValue.blockTempIds.includes(block.tempId)"
          @update:model-value="(val) => toggleBlock(block.tempId, Boolean(val))"
        />
        <Label
          :for="`day-${modelValue.day_of_week}-block-${block.tempId}`"
          class="cursor-pointer font-normal text-sm"
        >
          {{ block.name }}
          <span class="text-muted-foreground ml-1">{{ block.start_time }} – {{ block.end_time }}</span>
        </Label>
      </div>
      <p v-if="blocks.length === 0" class="text-sm text-muted-foreground">
        Agrega bloques horarios primero.
      </p>
    </div>
    <p v-else class="text-sm text-muted-foreground pt-0.5">No disponible</p>
  </div>
</template>

<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { FormBlock, FormDayConfig } from '../services/availability.service'

const props = defineProps<{
  dayLabel: string
  modelValue: FormDayConfig
  blocks: FormBlock[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: FormDayConfig] }>()

function toggleEnabled(enabled: boolean) {
  emit('update:modelValue', {
    ...props.modelValue,
    enabled,
    blockTempIds: enabled ? props.modelValue.blockTempIds : [],
  })
}

function toggleBlock(tempId: string, checked: boolean) {
  const ids = checked
    ? [...props.modelValue.blockTempIds, tempId]
    : props.modelValue.blockTempIds.filter(id => id !== tempId)
  emit('update:modelValue', { ...props.modelValue, blockTempIds: ids })
}
</script>
