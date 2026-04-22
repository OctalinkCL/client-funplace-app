<template>
  <div class="rounded-lg border mb-6">
    <!-- Header colapsable -->
    <button
      class="w-full flex items-center justify-between px-5 py-4 text-left"
      @click="open = !open"
    >
      <span class="text-sm font-semibold">Resumen</span>
      <svg
        class="w-4 h-4 text-muted-foreground transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="open">
      <div class="border-t" />

      <!-- Skeleton -->
      <div v-if="loading" class="p-5 space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="h-16 rounded-md bg-muted animate-pulse" />
          <div class="h-16 rounded-md bg-muted animate-pulse" />
        </div>
        <div class="h-24 rounded-md bg-muted animate-pulse" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="px-5 py-4 text-sm text-muted-foreground">
        No se pudo cargar el resumen.
      </div>

      <!-- Sin datos -->
      <div v-else-if="stats.total === 0" class="px-5 py-8 text-center text-sm text-muted-foreground">
        Aún no hay solicitudes de reserva registradas.
      </div>

      <!-- Contenido -->
      <template v-else>
        <!-- KPIs -->
        <div class="grid grid-cols-2 divide-x border-b">
          <div class="px-5 py-4">
            <p class="text-3xl font-bold">{{ stats.total }}</p>
            <p class="text-xs text-muted-foreground mt-1">Solicitudes históricas</p>
          </div>
          <div class="px-5 py-4">
            <p class="text-3xl font-bold">{{ currentMonthCount }}</p>
            <p class="text-xs text-muted-foreground mt-1">Este mes</p>
          </div>
        </div>

        <!-- Gráfico de barras CSS -->
        <div class="px-5 py-4">
          <p class="text-xs text-muted-foreground mb-3">Solicitudes por mes — {{ year }}</p>
          <div class="flex items-end gap-1 h-20">
            <div
              v-for="m in months"
              :key="m.index"
              class="flex-1 flex flex-col items-center gap-1 h-full"
            >
              <div class="flex-1 w-full flex items-end">
                <div
                  class="w-full rounded-t-sm transition-all duration-500"
                  :class="m.count > 0 ? 'bg-primary' : 'bg-transparent'"
                  :style="{ height: m.count > 0 ? `${Math.max((m.count / maxCount) * 100, 8)}%` : '0%' }"
                  :title="`${m.label}: ${m.count}`"
                />
              </div>
              <span class="text-[10px] text-muted-foreground leading-none">{{ m.label }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { bookingsService } from '../../services/bookings.service'

const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

const year = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1 // 1-indexed

const open = ref(true)
const loading = ref(false)
const error = ref(false)
const stats = ref<{ total: number; monthly: { month: number; count: number }[] }>({
  total: 0,
  monthly: [],
})

const months = computed(() =>
  MONTHS_SHORT.map((label, i) => ({
    index: i + 1,
    label,
    count: stats.value.monthly.find(m => m.month === i + 1)?.count ?? 0,
  }))
)

const maxCount = computed(() => Math.max(...months.value.map(m => m.count), 1))

const currentMonthCount = computed(
  () => stats.value.monthly.find(m => m.month === currentMonth)?.count ?? 0
)

onMounted(async () => {
  loading.value = true
  try {
    stats.value = await bookingsService.getStats(year)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
