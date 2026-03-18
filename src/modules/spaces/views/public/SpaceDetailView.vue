<template>
  <div class="max-w-4xl mx-auto px-6 py-10 space-y-8">
    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="rounded-xl bg-muted animate-pulse aspect-video" />
      <div class="h-8 bg-muted animate-pulse rounded w-1/2" />
    </div>

    <!-- Error / No encontrado -->
    <div v-else-if="error" class="py-20 text-center">
      <p class="text-muted-foreground">{{ error }}</p>
      <RouterLink to="/" class="text-sm underline mt-2 inline-block">Volver al listado</RouterLink>
    </div>

    <template v-else-if="space">
      <!-- Galería de imágenes -->
      <div v-if="space.space_images && space.space_images.length > 0" class="space-y-2">
        <div class="rounded-xl overflow-hidden aspect-video bg-muted">
          <img :src="activeImage" :alt="space.title" class="w-full h-full object-cover" />
        </div>
        <div v-if="space.space_images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="img in space.space_images"
            :key="img.id"
            class="shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors"
            :class="activeImage === img.url ? 'border-primary' : 'border-transparent'"
            @click="activeImage = img.url"
          >
            <img :src="img.url" :alt="space.title" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
      <div v-else class="rounded-xl bg-muted aspect-video flex items-center justify-center text-muted-foreground">
        Sin imágenes
      </div>

      <!-- Info principal -->
      <div class="space-y-2">
        <div class="flex items-start gap-3 flex-wrap">
          <h1 class="text-3xl font-semibold flex-1">{{ space.title }}</h1>
          <Badge v-if="space.space_type" variant="secondary">
            {{ SPACE_TYPE_LABELS[space.space_type] ?? space.space_type }}
          </Badge>
        </div>
        <p class="text-muted-foreground">
          {{ [space.city, space.region].filter(Boolean).join(', ') }}
        </p>
        <div class="flex gap-4 text-sm text-muted-foreground flex-wrap">
          <span v-if="space.capacity">👥 Hasta {{ space.capacity }} personas</span>
          <span v-if="space.size_m2">📐 {{ space.size_m2 }} m²</span>
          <span v-if="space.address">📍 {{ space.address }}</span>
        </div>
      </div>

      <Separator />

      <!-- Descripción -->
      <div v-if="space.description" class="space-y-2">
        <h2 class="text-lg font-semibold">Descripción</h2>
        <p class="text-muted-foreground leading-relaxed whitespace-pre-line">{{ space.description }}</p>
      </div>

      <!-- Facilidades -->
      <div v-if="space.space_amenities && space.space_amenities.length > 0" class="space-y-3">
        <h2 class="text-lg font-semibold">Facilidades</h2>
        <SpaceAmenities :space-amenities="space.space_amenities ?? []" :amenity-list="amenityList" />
      </div>

      <Separator />

      <!-- Sección de reserva -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold">Reservar</h2>

        <div class="grid gap-8 md:grid-cols-[1fr_auto]">
          <!-- Calendario -->
          <AvailabilityCalendar
            :space-id="space.id"
            :selected-date="selectedDate"
            @select-date="onDateSelect"
          />

          <!-- Selector de bloques -->
          <div v-if="selectedDate" class="min-w-60 space-y-4">
            <p class="text-sm text-muted-foreground">
              {{ formatSelectedDate }}
            </p>
            <SlotSelector
              :space-id="space.id"
              :date="selectedDate"
              :selected-block-id="selectedSlot?.blockId"
              @select-slot="onSlotSelect"
            />

            <Button
              v-if="selectedSlot"
              class="w-full"
              @click="goToBooking"
            >
              Reservar este bloque →
            </Button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { spacesService } from '../../services/spaces.service'
import { SPACE_TYPE_LABELS } from '@/constants/spaces'
import SpaceAmenities from '../../components/public/SpaceAmenities.vue'
import { useAmenities } from '../../composables/useAmenities'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import AvailabilityCalendar from '@/modules/bookings/components/public/AvailabilityCalendar.vue'
import SlotSelector from '@/modules/bookings/components/public/SlotSelector.vue'
import { clearSlotsCache } from '@/modules/bookings/composables/useSlots'
import type { Space, SimpleSlot } from '@/types'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

const { amenities: amenityList, fetchAmenities } = useAmenities()

const space = ref<Space | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const activeImage = ref('')
const selectedDate = ref('')
const selectedSlot = ref<SimpleSlot | null>(null)

const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const [y, m, d] = selectedDate.value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${DAYS_ES[date.getDay()]} ${d} de ${MONTHS_ES[m - 1]} ${y}`
})

function onDateSelect(date: string) {
  selectedDate.value = date
  selectedSlot.value = null
}

function onSlotSelect(slot: SimpleSlot) {
  selectedSlot.value = slot
}

function goToBooking() {
  if (!selectedSlot.value || !selectedDate.value || !space.value) return
  router.push({
    name: 'booking-form',
    params: { slug: space.value.slug },
    query: { date: selectedDate.value, blockId: selectedSlot.value.blockId },
  })
}

onMounted(async () => {
  clearSlotsCache()
  fetchAmenities()
  loading.value = true
  try {
    space.value = await spacesService.getBySlug(slug)
    const images = space.value.space_images
    if (images && images.length > 0) {
      const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
      activeImage.value = sorted[0].url
    }
  } catch {
    error.value = 'Espacio no encontrado.'
  } finally {
    loading.value = false
  }
})
</script>
