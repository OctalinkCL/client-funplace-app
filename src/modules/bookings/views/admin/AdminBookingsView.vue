<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Reservas</h1>
    </div>

    <!-- Métricas -->
    <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div
        class="rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        :class="{ 'ring-2 ring-ring': filterStatus === '' }"
        @click="filterStatus = ''"
      >
        <p class="text-2xl font-bold">{{ totalCount }}</p>
        <p class="text-xs text-muted-foreground mt-0.5">Total</p>
      </div>

      <div
        class="rounded-lg border p-4 cursor-pointer hover:bg-orange-50 transition-colors bg-orange-50/40"
        :class="{ 'ring-2 ring-orange-400': filterStatus === 'PENDING' }"
        @click="filterStatus = filterStatus === 'PENDING' ? '' : 'PENDING'"
      >
        <p class="text-2xl font-bold text-orange-600">{{ pendingCount }}</p>
        <p class="text-xs text-orange-600/80 mt-0.5">Pendientes</p>
      </div>

      <div
        class="rounded-lg border p-4 cursor-pointer hover:bg-green-50 transition-colors"
        :class="{ 'ring-2 ring-green-500': filterStatus === 'CONFIRMED' }"
        @click="filterStatus = filterStatus === 'CONFIRMED' ? '' : 'CONFIRMED'"
      >
        <p class="text-2xl font-bold text-green-600">{{ confirmedCount }}</p>
        <p class="text-xs text-green-600/80 mt-0.5">Confirmadas</p>
      </div>

      <div
        class="rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        :class="{ 'ring-2 ring-ring': filterStatus === 'CANCELLED' }"
        @click="filterStatus = filterStatus === 'CANCELLED' ? '' : 'CANCELLED'"
      >
        <p class="text-2xl font-bold text-muted-foreground">{{ cancelledCount }}</p>
        <p class="text-xs text-muted-foreground mt-0.5">Canceladas</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-3 mb-6">
      <select
        v-model="filterSpaceId"
        class="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Todos los espacios</option>
        <option v-for="s in adminSpaces" :key="s.id" :value="s.id">{{ s.title }}</option>
      </select>

      <select
        v-model="filterStatus"
        class="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Todos los estados</option>
        <option value="PENDING">Pendiente</option>
        <option value="CONFIRMED">Confirmado</option>
        <option value="CANCELLED">Cancelado</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <p class="text-muted-foreground">Cargando...</p>
    </div>

    <!-- Error -->
    <p v-else-if="error" class="text-sm text-destructive">{{ error }}</p>

    <!-- Empty -->
    <div v-else-if="filteredBookings.length === 0" class="py-20 text-center">
      <p class="text-muted-foreground">No hay reservas que mostrar.</p>
    </div>

    <!-- Lista -->
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="booking in filteredBookings"
        :key="booking.id"
        class="rounded-lg border p-4 space-y-3"
        :class="{
          'border-orange-200 bg-orange-50/50': booking.status === 'PENDING',
          'opacity-60': booking.status === 'CANCELLED',
        }"
      >
        <!-- Fila 1: espacio + badge estado -->
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <p class="font-semibold text-sm">{{ booking.spaces?.title ?? '—' }}</p>
          <Badge :class="statusBadgeClass(booking.status)">
            {{ STATUS_LABELS[booking.status] }}
          </Badge>
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
        <div v-if="booking.status !== 'CANCELLED'" class="flex gap-2 pt-1">
          <Button
            v-if="booking.status === 'PENDING'"
            size="sm"
            @click="openConfirm('Confirmar reserva', 'Se notificará al cliente que su reserva fue confirmada.', () => handleStatus(booking.id, 'CONFIRMED'))"
          >
            Confirmar
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="text-destructive border-destructive/30 hover:bg-destructive/5"
            @click="openConfirm('Cancelar reserva', 'Esta acción no se puede deshacer. Se notificará al cliente.', () => handleStatus(booking.id, 'CANCELLED'))"
          >
            Cancelar
          </Button>
        </div>
        <div v-else class="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            @click="openConfirm('Reactivar reserva', 'Se volverá a poner como pendiente. Solo es posible si el horario sigue libre.', () => handleStatus(booking.id, 'PENDING'))"
          >
            Reactivar
          </Button>
        </div>
      </div>
    </div>
  </div>

  <AlertDialog :open="confirmDialog.open" @update:open="val => confirmDialog.open = val">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ confirmDialog.title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ confirmDialog.description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction @click="executeConfirm">Confirmar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookings } from '../../composables/useBookings'
import { spacesService } from '@/modules/spaces/services/spaces.service'
import { useAuthStore } from '@/stores/auth.store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Space, BookingStatus } from '@/types'

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
}

const STATUS_ORDER: Record<BookingStatus, number> = { PENDING: 0, CONFIRMED: 1, CANCELLED: 2 }

const authStore = useAuthStore()
const { bookings, loading, error, fetchByAdmin, updateStatus } = useBookings()

const confirmDialog = ref<{ open: boolean; title: string; description: string; action: (() => void) | null }>({
  open: false, title: '', description: '', action: null,
})

function openConfirm(title: string, description: string, action: () => void) {
  confirmDialog.value = { open: true, title, description, action }
}

function executeConfirm() {
  confirmDialog.value.action?.()
  confirmDialog.value.open = false
}

const adminSpaces = ref<Space[]>([])
const filterSpaceId = ref('')
const filterStatus = ref('')

const totalCount = computed(() => bookings.value.length)
const pendingCount = computed(() => bookings.value.filter(b => b.status === 'PENDING').length)
const confirmedCount = computed(() => bookings.value.filter(b => b.status === 'CONFIRMED').length)
const cancelledCount = computed(() => bookings.value.filter(b => b.status === 'CANCELLED').length)

const filteredBookings = computed(() => {
  let list = [...bookings.value]
  if (filterSpaceId.value) list = list.filter(b => b.space_id === filterSpaceId.value)
  if (filterStatus.value) list = list.filter(b => b.status === filterStatus.value)
  // PENDING primero, luego CONFIRMED, luego CANCELLED; dentro de cada grupo por fecha desc
  return list.sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    if (statusDiff !== 0) return statusDiff
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
})

function statusBadgeClass(status: BookingStatus) {
  if (status === 'PENDING') return 'bg-orange-100 text-orange-700 border-orange-200'
  if (status === 'CONFIRMED') return 'bg-green-100 text-green-700 border-green-200'
  return 'bg-muted text-muted-foreground'
}

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return `${d} ${MONTHS_ES[m - 1]} ${y}`
}

async function handleStatus(bookingId: string, status: BookingStatus) {
  await updateStatus(bookingId, status)
}

onMounted(async () => {
  await fetchByAdmin()
  if (authStore.user?.id) {
    adminSpaces.value = await spacesService.getByAdmin(authStore.user.id)
  }
})
</script>
