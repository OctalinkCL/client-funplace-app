<template>
  <div class="space-y-3">
    <!-- Cabecera del mes -->
    <div class="flex items-center justify-between">
      <button
        class="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-30"
        :disabled="isPrevMonthDisabled"
        @click="prevMonth"
      >
        ←
      </button>
      <span class="font-semibold text-sm">{{ MONTHS_ES[month] }} {{ year }}</span>
      <button class="p-1.5 rounded-md hover:bg-muted transition-colors" @click="nextMonth">
        →
      </button>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 text-center text-xs text-muted-foreground font-medium">
      <span v-for="d in DAY_LABELS" :key="d">{{ d }}</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-7 gap-1">
      <div
        v-for="n in 35"
        :key="n"
        class="h-9 rounded-md bg-muted animate-pulse"
      />
    </div>

    <!-- Grilla de días -->
    <div v-else class="grid grid-cols-7 gap-1">
      <!-- Celdas vacías al inicio (offset del primer día) -->
      <div v-for="n in firstDayOffset" :key="`empty-${n}`" />

      <!-- Días del mes -->
      <button
        v-for="day in daysInMonth"
        :key="day"
        class="h-9 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        :class="dayClass(day)"
        :disabled="!isDayAvailable(day) || isDayPast(day)"
        @click="selectDay(day)"
      >
        {{ day }}
      </button>
    </div>

    <!-- Leyenda -->
    <div class="flex gap-4 text-xs text-muted-foreground pt-1">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm bg-green-100 border border-green-300 inline-block" />
        Disponible
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm bg-muted inline-block" />
        Sin disponibilidad
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getAvailableDatesInMonth } from '../../../bookings/composables/useSlots'

const props = defineProps<{
  spaceId: string
  selectedDate: string
}>()

const emit = defineEmits<{ 'select-date': [date: string] }>()

const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth()) // 0-indexed
const availableDates = ref<Set<string>>(new Set())
const loading = ref(false)

const daysInMonth = computed(() => new Date(year.value, month.value + 1, 0).getDate())

// Offset para que la semana empiece en lunes (Lu=0 … Do=6)
const firstDayOffset = computed(() => (new Date(year.value, month.value, 1).getDay() + 6) % 7)

const isPrevMonthDisabled = computed(
  () => year.value === today.getFullYear() && month.value === today.getMonth(),
)

function dateStr(day: number): string {
  return `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isDayAvailable(day: number) {
  return availableDates.value.has(dateStr(day))
}

function isDayPast(day: number) {
  const ds = dateStr(day)
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return ds < todayStr
}

function isSelected(day: number) {
  return dateStr(day) === props.selectedDate
}

function dayClass(day: number) {
  if (isDayPast(day)) return 'text-muted-foreground/40 cursor-not-allowed'
  if (isSelected(day)) return 'bg-primary text-primary-foreground hover:bg-primary/90'
  if (isDayAvailable(day)) return 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100'
  return 'text-muted-foreground cursor-not-allowed'
}

function selectDay(day: number) {
  if (!isDayAvailable(day) || isDayPast(day)) return
  emit('select-date', dateStr(day))
}

async function loadMonth() {
  loading.value = true
  try {
    availableDates.value = await getAvailableDatesInMonth(props.spaceId, year.value, month.value)
  } finally {
    loading.value = false
  }
}

function prevMonth() {
  if (isPrevMonthDisabled.value) return
  if (month.value === 0) { year.value--; month.value = 11 }
  else month.value--
}

function nextMonth() {
  if (month.value === 11) { year.value++; month.value = 0 }
  else month.value++
}

watch([year, month], loadMonth)
onMounted(loadMonth)
</script>
