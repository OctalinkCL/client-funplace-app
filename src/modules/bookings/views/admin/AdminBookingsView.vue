<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Reservas</h1>
    </div>

    <p v-if="emailWarning" class="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
      {{ emailWarning }}
    </p>
    <p v-if="error" class="mb-4 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-3">
      {{ error }}
    </p>

    <!-- Stats -->
    <BookingStats />

    <!-- Filtro por espacio (persiste entre tabs) -->
    <div class="mb-5">
      <Select v-model="filterSpaceId" @update:model-value="onSpaceChange">
        <SelectTrigger class="w-56">
          <SelectValue placeholder="Todos los espacios" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los espacios</SelectItem>
          <SelectItem v-for="s in adminSpaces" :key="s.id" :value="s.id">{{ s.title }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Tabs v-model="activeTab" @update:model-value="onTabChange">
      <TabsList class="mb-5">
        <TabsTrigger value="pending" class="gap-1.5">
          Por atender
          <span
            v-if="pendingBookings.length > 0"
            class="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-semibold bg-orange-500 text-white"
          >
            {{ pendingBookings.length }}
          </span>
        </TabsTrigger>
        <TabsTrigger value="upcoming">Próximas</TabsTrigger>
        <TabsTrigger value="historial">Historial</TabsTrigger>
      </TabsList>

      <!-- ────────────────────────── TAB: POR ATENDER ────────────────────────── -->
      <TabsContent value="pending">
        <div v-if="loadingPending" class="flex justify-center py-20">
          <p class="text-muted-foreground">Cargando...</p>
        </div>

        <template v-else>
          <!-- Pendientes futuras -->
          <div v-if="activePending.length > 0" class="flex flex-col gap-3">
            <BookingCard
              v-for="booking in activePending"
              :key="booking.id"
              :booking="booking"
              @confirm="openConfirm('Confirmar reserva', 'Se notificará al cliente que su reserva fue confirmada.', () => handleStatus(booking.id, 'CONFIRMED', 'pending'))"
              @cancel="openConfirm('Cancelar reserva', 'Esta acción no se puede deshacer. Se notificará al cliente.', () => handleStatus(booking.id, 'CANCELLED', 'pending'))"
            />
          </div>

          <!-- Vencidas -->
          <template v-if="expiredPending.length > 0">
            <div class="flex items-center gap-3 my-5">
              <div class="h-px flex-1 bg-border" />
              <span class="text-xs text-muted-foreground font-medium uppercase tracking-wide">Vencidas</span>
              <div class="h-px flex-1 bg-border" />
            </div>
            <div class="flex justify-end mb-3">
              <Button
                variant="outline"
                size="sm"
                class="text-destructive border-destructive/30 hover:bg-destructive/5"
                @click="openConfirm('Cancelar todas las vencidas', `Se cancelarán ${expiredPending.length} reservas cuya fecha ya pasó. Esta acción no se puede deshacer.`, handleCancelExpired)"
              >
                Cancelar todas las vencidas ({{ expiredPending.length }})
              </Button>
            </div>
            <div class="flex flex-col gap-3">
              <BookingCard
                v-for="booking in expiredPending"
                :key="booking.id"
                :booking="booking"
                expired
                @cancel="openConfirm('Cancelar reserva', 'Esta acción no se puede deshacer.', () => handleStatus(booking.id, 'CANCELLED', 'pending'))"
              />
            </div>
          </template>

          <div v-if="activePending.length === 0 && expiredPending.length === 0" class="py-20 text-center">
            <p class="text-muted-foreground">No hay reservas pendientes.</p>
          </div>
        </template>
      </TabsContent>

      <!-- ────────────────────────── TAB: PRÓXIMAS ────────────────────────── -->
      <TabsContent value="upcoming">
        <div class="flex items-center justify-between mb-5">
          <MonthNavigator :year="upcomingYear" :month="upcomingMonth" @change="onUpcomingMonthChange" />
        </div>

        <div v-if="loadingUpcoming" class="flex justify-center py-20">
          <p class="text-muted-foreground">Cargando...</p>
        </div>
        <div v-else-if="upcomingBookings.length === 0" class="py-20 text-center">
          <p class="text-muted-foreground">No hay reservas confirmadas para este mes.</p>
        </div>
        <div v-else class="flex flex-col gap-3">
          <BookingCard
            v-for="booking in upcomingBookings"
            :key="booking.id"
            :booking="booking"
            @cancel="openConfirm('Cancelar reserva', 'Esta acción no se puede deshacer. Se notificará al cliente.', () => handleStatus(booking.id, 'CANCELLED', 'upcoming'))"
          />
        </div>
      </TabsContent>

      <!-- ────────────────────────── TAB: HISTORIAL ────────────────────────── -->
      <TabsContent value="historial">
        <div class="flex items-center justify-between mb-5">
          <MonthNavigator :year="historyYear" :month="historyMonth" @change="onHistoryMonthChange" />
        </div>

        <div v-if="loadingHistory" class="flex justify-center py-20">
          <p class="text-muted-foreground">Cargando...</p>
        </div>
        <div v-else-if="historyBookings.length === 0" class="py-20 text-center">
          <p class="text-muted-foreground">No hay registros para este mes.</p>
        </div>
        <div v-else class="flex flex-col gap-3">
          <BookingCard
            v-for="booking in historyBookings"
            :key="booking.id"
            :booking="booking"
            @reactivate="openConfirm('Reactivar reserva', 'Se volverá a poner como pendiente. Solo es posible si el horario sigue libre.', () => handleStatus(booking.id, 'PENDING', 'history'))"
          />
        </div>
      </TabsContent>
    </Tabs>
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
import { ref, onMounted } from 'vue'
import { useBookings } from '../../composables/useBookings'
import { spacesService } from '@/modules/spaces/services/spaces.service'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import MonthNavigator from '../../components/admin/MonthNavigator.vue'
import BookingCard from '../../components/admin/BookingCard.vue'
import BookingStats from '../../components/admin/BookingStats.vue'
import type { Space, BookingStatus } from '@/types'

const authStore = useAuthStore()
const {
  pendingBookings, upcomingBookings, historyBookings,
  activePending, expiredPending,
  loadingPending, loadingUpcoming, loadingHistory,
  error, emailWarning,
  fetchPending, fetchUpcoming, fetchHistory,
  updateStatus, cancelExpiredPending,
} = useBookings()

// ── Estado ──────────────────────────────────────────────────────────────────
const adminSpaces = ref<Space[]>([])
const filterSpaceId = ref('all')
const activeTab = ref('pending')

const now = new Date()
const upcomingYear = ref(now.getFullYear())
const upcomingMonth = ref(now.getMonth())
const historyYear = ref(now.getFullYear())
const historyMonth = ref(now.getMonth())

// Qué tabs ya se cargaron al menos una vez
const loadedTabs = ref(new Set<string>())

// ── Confirm dialog ───────────────────────────────────────────────────────────
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

// ── Fetches ──────────────────────────────────────────────────────────────────
function spaceFilter() {
  return filterSpaceId.value === 'all' ? undefined : filterSpaceId.value
}

async function loadPending() {
  await fetchPending(spaceFilter())
  loadedTabs.value.add('pending')
}

async function loadUpcoming() {
  await fetchUpcoming(upcomingYear.value, upcomingMonth.value, spaceFilter())
  loadedTabs.value.add('upcoming')
}

async function loadHistory() {
  await fetchHistory(historyYear.value, historyMonth.value, spaceFilter())
  loadedTabs.value.add('historial')
}

// ── Handlers ──────────────────────────────────────────────────────────────────
function onTabChange(tab: string | number) {
  const t = String(tab)
  if (t === 'pending' && !loadedTabs.value.has('pending')) loadPending()
  if (t === 'upcoming' && !loadedTabs.value.has('upcoming')) loadUpcoming()
  if (t === 'historial' && !loadedTabs.value.has('historial')) loadHistory()
}

function onSpaceChange() {
  // Re-fetch todos los tabs que ya se habían cargado
  loadedTabs.value.clear()
  if (activeTab.value === 'pending') loadPending()
  else if (activeTab.value === 'upcoming') loadUpcoming()
  else loadHistory()
}

function onUpcomingMonthChange(y: number, m: number) {
  upcomingYear.value = y
  upcomingMonth.value = m
  loadUpcoming()
}

function onHistoryMonthChange(y: number, m: number) {
  historyYear.value = y
  historyMonth.value = m
  loadHistory()
}

async function handleStatus(bookingId: string, status: BookingStatus, tab: 'pending' | 'upcoming' | 'history') {
  await updateStatus(bookingId, status, tab)
}

async function handleCancelExpired() {
  await cancelExpiredPending()
}

onMounted(async () => {
  // Cargar el tab inicial + espacios del admin en paralelo
  await Promise.all([
    loadPending(),
    authStore.user?.id
      ? spacesService.getByAdmin(authStore.user.id).then(s => { adminSpaces.value = s })
      : Promise.resolve(),
  ])
})
</script>
