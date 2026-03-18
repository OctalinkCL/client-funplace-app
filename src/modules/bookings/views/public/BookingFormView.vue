<template>
  <div class="max-w-lg mx-auto px-6 py-10 space-y-8">
    <!-- Volver -->
    <RouterLink
      :to="{ name: 'space-detail', params: { slug } }"
      class="text-sm text-muted-foreground hover:text-foreground"
    >
      ← Volver al espacio
    </RouterLink>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="h-8 bg-muted animate-pulse rounded w-1/2" />
      <div class="h-28 bg-muted animate-pulse rounded-lg" />
    </div>

    <!-- Slot no disponible -->
    <div v-else-if="slotUnavailable" class="py-10 text-center space-y-3">
      <p class="text-muted-foreground">Este bloque ya no está disponible.</p>
      <RouterLink
        :to="{ name: 'space-detail', params: { slug } }"
        class="text-sm underline"
      >
        Volver a elegir fecha
      </RouterLink>
    </div>

    <!-- Confirmación post-envío -->
    <div v-else-if="submitted" class="py-10 text-center space-y-4">
      <div class="text-4xl">✅</div>
      <h2 class="text-xl font-semibold">¡Solicitud enviada!</h2>
      <p class="text-muted-foreground text-sm leading-relaxed">
        Tu solicitud de reserva fue recibida. El administrador se pondrá en contacto contigo
        por email o teléfono para coordinar el pago y confirmar la reserva.
      </p>
      <RouterLink to="/" class="text-sm underline text-muted-foreground">
        Volver al inicio
      </RouterLink>
    </div>

    <!-- Formulario -->
    <template v-else-if="space && slot">
      <div>
        <h1 class="text-2xl font-semibold">Solicitar reserva</h1>
      </div>

      <!-- Resumen -->
      <div class="rounded-lg border bg-muted/40 px-5 py-4 space-y-1.5 text-sm">
        <p class="font-semibold text-base">{{ space.title }}</p>
        <p class="text-muted-foreground">📅 {{ formattedDate }}</p>
        <p class="text-muted-foreground">🕐 {{ slot.blockName }} · {{ slot.startTime }} – {{ slot.endTime }}</p>
      </div>

      <!-- Datos del cliente -->
      <form class="space-y-4" @submit.prevent="submitBooking">
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Nombre completo *</label>
          <Input v-model="form.name" placeholder="Juan Pérez" required />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Email *</label>
          <Input v-model="form.email" type="email" placeholder="juan@email.com" required />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Teléfono *</label>
          <Input v-model="form.phone" type="tel" placeholder="+56 9 1234 5678" required />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium">Notas (opcional)</label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="¿Algo que debamos saber? Ej: necesito acceso desde las 8am"
            class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        <p v-if="submitError" class="text-sm text-destructive">{{ submitError }}</p>

        <Button type="submit" class="w-full" :disabled="submitting">
          {{ submitting ? 'Enviando...' : 'Enviar solicitud de reserva' }}
        </Button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { spacesService } from '@/modules/spaces/services/spaces.service'
import { bookingsService } from '../../services/bookings.service'
import { getSlotsForDate } from '@/modules/bookings/composables/useSlots'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Space, SimpleSlot } from '@/types'

const route = useRoute()
const slug = route.params.slug as string
const date = route.query.date as string
const blockId = route.query.blockId as string

const space = ref<Space | null>(null)
const slot = ref<SimpleSlot | null>(null)
const loading = ref(false)
const slotUnavailable = ref(false)
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref<string | null>(null)

const form = reactive({ name: '', email: '', phone: '', notes: '' })

const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

const formattedDate = computed(() => {
  if (!date) return ''
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${DAYS_ES[dt.getDay()]} ${d} de ${MONTHS_ES[m - 1]} ${y}`
})

async function submitBooking() {
  if (!space.value || !slot.value) return
  submitting.value = true
  submitError.value = null
  try {
    await bookingsService.create({
      space_id: space.value.id,
      block_id: slot.value.blockId,
      date,
      start_time: slot.value.startTime,
      end_time: slot.value.endTime,
      block_name: slot.value.blockName,
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone || null,
      notes: form.notes || null,
    })
    submitted.value = true
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Error al enviar la solicitud. Intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!date || !blockId) { slotUnavailable.value = true; return }
  loading.value = true
  try {
    space.value = await spacesService.getBySlug(slug)
    const slots = await getSlotsForDate(space.value.id, date)
    const found = slots.find(s => s.blockId === blockId && s.status === 'AVAILABLE')
    if (!found) { slotUnavailable.value = true; return }
    slot.value = found
  } catch {
    slotUnavailable.value = true
  } finally {
    loading.value = false
  }
})
</script>
