<template>
  <div
    class="rounded-lg border p-4 space-y-3"
    :class="{
      'border-orange-200 bg-orange-50/50': booking.status === 'PENDING' && !expired,
      'border-muted bg-muted/20': expired,
      'opacity-60': booking.status === 'CANCELLED',
    }"
  >
    <!-- Fila 1: espacio + badges -->
    <div class="flex items-center justify-between gap-2 flex-wrap">
      <p class="font-semibold text-sm">{{ booking.spaces?.title ?? '—' }}</p>
      <div class="flex items-center gap-1.5">
        <Badge v-if="expired" class="bg-red-100 text-red-600 border-red-200 text-xs">Vencida</Badge>
        <Badge :class="statusBadgeClass(booking.status)">{{ STATUS_LABELS[booking.status] }}</Badge>
      </div>
    </div>

    <!-- Fila 2: fecha + bloque -->
    <p class="text-sm text-muted-foreground">
      📅 {{ formatDate(booking.date) }} &nbsp;·&nbsp; 🕐 {{ booking.block_name }} {{ booking.start_time.slice(0, 5) }} – {{ booking.end_time.slice(0, 5) }}
    </p>

    <!-- Fila 3: cliente -->
    <div class="text-sm space-y-0.5">
      <p>👤 <span class="font-medium">{{ booking.customer_name }}</span></p>
      <p class="text-muted-foreground">✉️ {{ booking.customer_email }}</p>
      <p v-if="booking.customer_phone" class="text-muted-foreground">📞 {{ booking.customer_phone }}</p>
      <p v-if="booking.notes" class="text-muted-foreground italic">💬 "{{ booking.notes }}"</p>
    </div>

    <!-- Acciones -->
    <div class="flex gap-2 pt-1">
      <template v-if="booking.status === 'PENDING'">
        <Button size="sm" @click="emit('confirm')">Confirmar</Button>
        <Button
          variant="outline"
          size="sm"
          class="text-destructive border-destructive/30 hover:bg-destructive/5"
          @click="emit('cancel')"
        >
          Cancelar
        </Button>
      </template>

      <template v-else-if="booking.status === 'CONFIRMED'">
        <Button
          variant="outline"
          size="sm"
          class="text-destructive border-destructive/30 hover:bg-destructive/5"
          @click="emit('cancel')"
        >
          Cancelar
        </Button>
      </template>

      <template v-else-if="booking.status === 'CANCELLED'">
        <Button variant="outline" size="sm" @click="emit('reactivate')">Reactivar</Button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Booking, BookingStatus } from '@/types'

defineProps<{
  booking: Booking
  expired?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
  reactivate: []
}>()

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
}

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return `${d} ${MONTHS_ES[m - 1]} ${y}`
}

function statusBadgeClass(status: BookingStatus) {
  if (status === 'PENDING') return 'bg-orange-100 text-orange-700 border-orange-200'
  if (status === 'CONFIRMED') return 'bg-green-100 text-green-700 border-green-200'
  return 'bg-muted text-muted-foreground'
}
</script>
