<template>
  <div class="space-y-4">
    <h2 class="text-base font-semibold">Días disponibles</h2>
    <Separator />

    <div v-if="disabled" class="rounded-md border border-dashed px-4 py-6 text-center">
      <p class="text-sm text-muted-foreground">
        Guarda al menos un bloque horario para configurar los días disponibles.
      </p>
    </div>

    <template v-else>
      <div>
        <DayConfigRow
          v-for="({ dayOfWeek, label }) in DISPLAY_DAYS"
          :key="dayOfWeek"
          :day-label="label"
          :model-value="dayConfigs[dayOfWeek]"
          :blocks="blocks"
          @update:model-value="$emit('update-day', $event)"
        />
      </div>

      <div class="flex items-center gap-4 pt-2">
        <Button :disabled="saving" @click="$emit('save')">
          {{ saving ? 'Guardando...' : 'Guardar horario' }}
        </Button>
        <p v-if="saved" class="text-sm text-green-600">Horario guardado.</p>
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import DayConfigRow from './DayConfigRow.vue'
import type { FormBlock, FormDayConfig } from '../services/availability.service'

defineProps<{
  blocks: FormBlock[]
  dayConfigs: FormDayConfig[]
  disabled: boolean
  saving: boolean
  saved: boolean
  error: string | null
}>()

defineEmits<{
  'update-day': [config: FormDayConfig]
  'save': []
}>()

const DISPLAY_DAYS = [
  { dayOfWeek: 1, label: 'Lunes' },
  { dayOfWeek: 2, label: 'Martes' },
  { dayOfWeek: 3, label: 'Miércoles' },
  { dayOfWeek: 4, label: 'Jueves' },
  { dayOfWeek: 5, label: 'Viernes' },
  { dayOfWeek: 6, label: 'Sábado' },
  { dayOfWeek: 0, label: 'Domingo' },
]
</script>
