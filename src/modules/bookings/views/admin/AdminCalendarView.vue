<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <button
          class="text-sm text-muted-foreground hover:text-foreground mb-1"
          @click="router.push({ name: 'admin-spaces' })"
        >
          ← Mis espacios
        </button>
        <h1 class="text-2xl font-semibold">
          Calendario{{ spaceName ? ` — ${spaceName}` : '' }}
        </h1>
      </div>
    </div>

    <!-- Loading inicial -->
    <div v-if="loadingInit" class="flex justify-center py-20">
      <p class="text-muted-foreground">Cargando...</p>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <!-- Calendario -->
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

        <!-- Grilla de días -->
        <div class="grid grid-cols-7 gap-1">
          <div v-for="n in firstDayOffset" :key="`e-${n}`" />
          <button
            v-for="day in daysInMonth"
            :key="day"
            class="h-10 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring relative"
            :class="dayClass(day)"
            @click="selectDay(day)"
          >
            {{ day }}
            <span
              v-if="hasPending(day) && !isSelected(day)"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
            />
          </button>
        </div>

        <!-- Leyenda -->
        <div class="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-green-100 border border-green-300 inline-block" />
            Disponible
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-orange-100 border border-orange-300 inline-block" />
            Con reservas pendientes
          </span>
        </div>
      </div>

      <!-- Panel del día -->
      <div class="space-y-4">
        <div v-if="!selectedDate" class="py-10 text-center text-sm text-muted-foreground">
          Selecciona un día para ver sus slots
        </div>

        <template v-else>
          <div>
            <h2 class="font-semibold text-base">{{ formatSelectedDate }}</h2>
          </div>
          <Separator />

          <!-- Loading slots -->
          <div v-if="loadingSlots" class="space-y-2">
            <div v-for="n in 2" :key="n" class="h-20 rounded-lg bg-muted animate-pulse" />
          </div>

          <!-- Sin slots -->
          <p v-else-if="slots.length === 0" class="text-sm text-muted-foreground">
            No hay slots configurados para este día.
          </p>

          <!-- Lista de slots -->
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="slot in slots"
              :key="slot.blockId"
              class="rounded-lg border p-3 space-y-2"
              :class="{
                'border-orange-200 bg-orange-50/50': slot.status === 'PENDING',
                'border-green-200 bg-green-50/30': slot.status === 'CONFIRMED',
                'opacity-60 bg-muted/30': slot.status === 'CANCELLED',
              }"
            >
              <!-- Fila: bloque + badge -->
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="font-medium text-sm">{{ slot.blockName }}</p>
                  <p class="text-xs text-muted-foreground">{{ slot.startTime }} – {{ slot.endTime }}</p>
                </div>
                <Badge :class="slotBadgeClass(slot.status)" class="shrink-0">
                  {{ SLOT_STATUS_LABELS[slot.status] }}
                </Badge>
              </div>

              <!-- Datos del cliente (si hay booking) -->
              <div v-if="slot.booking" class="text-xs text-muted-foreground space-y-0.5 border-t pt-2">
                <p class="font-medium text-foreground">{{ slot.booking.customer_name }}</p>
                <p>✉️ {{ slot.booking.customer_email }}</p>
                <p v-if="slot.booking.customer_phone">📞 {{ slot.booking.customer_phone }}</p>
                <p v-if="slot.booking.notes" class="italic">"{{ slot.booking.notes }}"</p>
              </div>

              <!-- Form inline crear reserva (AVAILABLE) -->
              <div
                v-if="slot.status === 'AVAILABLE' && bookingFormSlotId === slot.blockId"
                class="border-t pt-3 space-y-2"
              >
                <p class="text-xs font-medium text-muted-foreground">Nueva reserva</p>
                <div class="space-y-2">
                  <Input
                    v-model="bookingForm.name"
                    placeholder="Nombre completo *"
                    class="h-8 text-sm"
                    required
                  />
                  <Input
                    v-model="bookingForm.email"
                    type="email"
                    placeholder="Email *"
                    class="h-8 text-sm"
                    required
                  />
                  <Input
                    v-model="bookingForm.phone"
                    type="tel"
                    placeholder="Teléfono"
                    class="h-8 text-sm"
                  />
                  <textarea
                    v-model="bookingForm.notes"
                    rows="2"
                    placeholder="Notas (opcional)"
                    class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
                <p v-if="bookingError" class="text-xs text-destructive">{{ bookingError }}</p>
                <div class="flex gap-2">
                  <Button
                    size="sm"
                    class="h-7 text-xs"
                    :disabled="bookingSubmitting || !bookingForm.name || !bookingForm.email"
                    @click="submitAdminBooking(slot)"
                  >
                    {{ bookingSubmitting ? 'Guardando...' : 'Guardar reserva' }}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 text-xs"
                    @click="cancelBookingForm"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>

              <!-- Acciones -->
              <div v-if="bookingFormSlotId !== slot.blockId" class="flex gap-2 pt-1 flex-wrap">
                <!-- AVAILABLE: bloquear + crear reserva -->
                <template v-if="slot.status === 'AVAILABLE'">
                  <Button
                    variant="outline"
                    size="sm"
                    class="h-7 text-xs"
                    :disabled="actionLoading === slot.blockId"
                    @click="blockSlot(slot)"
                  >
                    Bloquear
                  </Button>
                  <Button
                    size="sm"
                    class="h-7 text-xs"
                    @click="openBookingForm(slot.blockId)"
                  >
                    Crear reserva
                  </Button>
                </template>

                <!-- BLOCKED: desbloquear -->
                <Button
                  v-if="slot.status === 'BLOCKED'"
                  variant="outline"
                  size="sm"
                  class="h-7 text-xs"
                  :disabled="actionLoading === slot.blockId"
                  @click="unblockSlot(slot)"
                >
                  Desbloquear
                </Button>

                <!-- PENDING: confirmar + cancelar -->
                <Button
                  v-if="slot.status === 'PENDING'"
                  size="sm"
                  class="h-7 text-xs"
                  :disabled="actionLoading === slot.blockId"
                  @click="updateBookingStatus(slot, 'CONFIRMED')"
                >
                  Confirmar
                </Button>

                <!-- PENDING o CONFIRMED: cancelar -->
                <Button
                  v-if="slot.status === 'PENDING' || slot.status === 'CONFIRMED'"
                  variant="outline"
                  size="sm"
                  class="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
                  :disabled="actionLoading === slot.blockId"
                  @click="updateBookingStatus(slot, 'CANCELLED')"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { spacesService } from '@/modules/spaces/services/spaces.service'
import { availabilityService } from '@/modules/availability/services/availability.service'
import { bookingsService } from '../../services/bookings.service'
import { getSlotsForDate, clearSlotsCache } from '../../composables/useSlots'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import type { WeeklySchedule, SimpleSlot, BookingStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const spaceId = route.params.spaceId as string

const spaceName = ref<string | null>(null)
const schedule = ref<WeeklySchedule | null>(null)
const loadingInit = ref(true)

const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth())

const pendingDates = ref<Set<string>>(new Set())
const selectedDate = ref('')
const slots = ref<SimpleSlot[]>([])
const loadingSlots = ref(false)
const actionLoading = ref<string | null>(null)

// Form inline para crear reserva como admin
const bookingFormSlotId = ref<string | null>(null)
const bookingForm = reactive({ name: '', email: '', phone: '', notes: '' })
const bookingSubmitting = ref(false)
const bookingError = ref<string | null>(null)

const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const MONTHS_ES_LOWER = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

const SLOT_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  BLOCKED: 'Bloqueado',
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
}

const daysInMonth = computed(() => new Date(year.value, month.value + 1, 0).getDate())
const firstDayOffset = computed(() => (new Date(year.value, month.value, 1).getDay() + 6) % 7)
const isPrevMonthDisabled = computed(
  () => year.value === today.getFullYear() && month.value === today.getMonth(),
)

function dateStr(day: number): string {
  return `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function todayStr(): string {
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function isEnabled(day: number): boolean {
  if (!schedule.value) return false
  const dow = new Date(year.value, month.value, day).getDay()
  const cfg = schedule.value.day_schedule_configs?.find(dc => dc.day_of_week === dow)
  return !!cfg?.enabled
}

function hasPending(day: number): boolean {
  return pendingDates.value.has(dateStr(day))
}

function isSelected(day: number): boolean {
  return dateStr(day) === selectedDate.value
}

function dayClass(day: number): string {
  const enabled = isEnabled(day)
  const selected = isSelected(day)
  const isT = dateStr(day) === todayStr()
  const pending = hasPending(day)

  if (selected) return 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
  if (!enabled) return 'text-muted-foreground/40 cursor-default'
  const ring = isT ? ' ring-1 ring-primary ring-offset-1' : ''
  if (pending) return `bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 cursor-pointer${ring}`
  return `bg-green-50 text-green-800 border border-green-200 hover:bg-green-100 cursor-pointer${ring}`
}

function slotBadgeClass(status: string): string {
  if (status === 'PENDING') return 'bg-orange-100 text-orange-700 border-orange-200'
  if (status === 'CONFIRMED') return 'bg-green-100 text-green-700 border-green-200'
  if (status === 'BLOCKED') return 'bg-red-100 text-red-700 border-red-200'
  return 'bg-muted text-muted-foreground'
}

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const [y, m, d] = selectedDate.value.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${DAYS_ES[dt.getDay()]} ${d} de ${MONTHS_ES_LOWER[m - 1]} ${y}`
})

function selectDay(day: number) {
  if (!isEnabled(day)) return
  selectedDate.value = dateStr(day)
  cancelBookingForm()
}

async function loadPendingDates() {
  const start = `${year.value}-${String(month.value + 1).padStart(2, '0')}-01`
  const end = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(daysInMonth.value).padStart(2, '0')}`
  const { data } = await supabase
    .from('bookings')
    .select('date')
    .eq('space_id', spaceId)
    .eq('status', 'PENDING')
    .gte('date', start)
    .lte('date', end)
  pendingDates.value = new Set((data ?? []).map((r: { date: string }) => r.date))
}

async function loadSlotsForDate(date: string) {
  loadingSlots.value = true
  clearSlotsCache()
  try {
    slots.value = await getSlotsForDate(spaceId, date)
  } finally {
    loadingSlots.value = false
  }
}

async function refreshDay() {
  if (!selectedDate.value) return
  clearSlotsCache()
  slots.value = await getSlotsForDate(spaceId, selectedDate.value)
}

async function blockSlot(slot: SimpleSlot) {
  if (!selectedDate.value) return
  actionLoading.value = slot.blockId
  try {
    await supabase.from('blocked_slots').insert({
      space_id: spaceId,
      date: selectedDate.value,
      block_id: slot.blockId,
    })
    await refreshDay()
  } finally {
    actionLoading.value = null
  }
}

async function unblockSlot(slot: SimpleSlot) {
  if (!slot.blockedSlotId) return
  actionLoading.value = slot.blockId
  try {
    await supabase.from('blocked_slots').delete().eq('id', slot.blockedSlotId)
    await refreshDay()
  } finally {
    actionLoading.value = null
  }
}

async function updateBookingStatus(slot: SimpleSlot, status: BookingStatus) {
  if (!slot.booking) return
  actionLoading.value = slot.blockId
  try {
    await bookingsService.updateStatus(slot.booking.id, status)
    await refreshDay()
    await loadPendingDates()
  } finally {
    actionLoading.value = null
  }
}

function openBookingForm(blockId: string) {
  bookingFormSlotId.value = blockId
  bookingForm.name = ''
  bookingForm.email = ''
  bookingForm.phone = ''
  bookingForm.notes = ''
  bookingError.value = null
}

function cancelBookingForm() {
  bookingFormSlotId.value = null
  bookingError.value = null
}

async function submitAdminBooking(slot: SimpleSlot) {
  if (!selectedDate.value || !bookingForm.name || !bookingForm.email) return
  bookingSubmitting.value = true
  bookingError.value = null
  try {
    await bookingsService.create({
      space_id: spaceId,
      block_id: slot.blockId,
      date: selectedDate.value,
      start_time: slot.startTime + ':00',
      end_time: slot.endTime + ':00',
      block_name: slot.blockName,
      customer_name: bookingForm.name,
      customer_email: bookingForm.email,
      customer_phone: bookingForm.phone || null,
      notes: bookingForm.notes || null,
    })
    cancelBookingForm()
    await refreshDay()
    await loadPendingDates()
  } catch (e) {
    bookingError.value = e instanceof Error ? e.message : 'Error al crear la reserva.'
  } finally {
    bookingSubmitting.value = false
  }
}

watch([year, month], async () => {
  selectedDate.value = ''
  slots.value = []
  cancelBookingForm()
  await loadPendingDates()
})

watch(selectedDate, (date) => {
  if (date) loadSlotsForDate(date)
})

function prevMonth() {
  if (isPrevMonthDisabled.value) return
  if (month.value === 0) { year.value--; month.value = 11 }
  else month.value--
}

function nextMonth() {
  if (month.value === 11) { year.value++; month.value = 0 }
  else month.value++
}

onMounted(async () => {
  try {
    const [s] = await Promise.all([
      availabilityService.getBySpaceId(spaceId),
      spacesService.getById(spaceId).then(sp => { spaceName.value = sp.title }).catch(() => {}),
      loadPendingDates(),
    ])
    schedule.value = s
  } finally {
    loadingInit.value = false
  }
})
</script>
