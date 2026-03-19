<template>
  <div class="relative">
    <Label>Dirección</Label>
    <div class="relative mt-1.5">
      <input
        v-model="query"
        type="text"
        placeholder="Busca la dirección del espacio..."
        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        autocomplete="off"
        @input="onInput"
        @keydown.escape="suggestions = []"
      />
      <span v-if="searching" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        Buscando...
      </span>
    </div>

    <p v-if="error" class="text-xs text-destructive mt-1">{{ error }}</p>

    <ul
      v-if="suggestions.length"
      class="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-y-auto"
    >
      <li
        v-for="(s, i) in suggestions"
        :key="i"
        class="px-3 py-2 cursor-pointer hover:bg-accent text-sm"
        @mousedown.prevent="select(s)"
      >
        <span class="font-medium">{{ s.placePrediction.structuredFormat.mainText.text }}</span>
        <span class="text-muted-foreground ml-1">{{ s.placePrediction.structuredFormat.secondaryText?.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Label } from '@/components/ui/label'
import type { PlaceResult } from '@/types'

const props = defineProps<{ initialValue?: string }>()
const emit = defineEmits<{ 'place-selected': [data: PlaceResult] }>()

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const BASE = 'https://places.googleapis.com/v1'

const query = ref(props.initialValue ?? '')
const suggestions = ref<any[]>([])
const searching = ref(false)
const error = ref<string | null>(null)

watch(() => props.initialValue, (val) => {
  if (val && val !== query.value) query.value = val
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  suggestions.value = []
  if (!query.value.trim()) return
  debounceTimer = setTimeout(fetchSuggestions, 300)
}

async function fetchSuggestions() {
  searching.value = true
  error.value = null
  try {
    const res = await fetch(`${BASE}/places:autocomplete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': API_KEY },
      body: JSON.stringify({ input: query.value, languageCode: 'es' }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    suggestions.value = (data.suggestions ?? []).filter((s: any) => s.placePrediction)
  } catch (e: unknown) {
    console.error('Google Places error:', e)
    error.value = 'No se pudieron cargar sugerencias. Inténtalo de nuevo.'
  } finally {
    searching.value = false
  }
}

async function select(suggestion: any) {
  suggestions.value = []
  query.value = suggestion.placePrediction.text?.text ?? ''

  const placeId = suggestion.placePrediction.placeId
  try {
    const res = await fetch(`${BASE}/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'displayName,formattedAddress,location,addressComponents',
      },
    })
    const place = await res.json()
    if (place.error) throw new Error(place.error.message)

    if (!place.location?.latitude || !place.location?.longitude) {
      error.value = 'No se pudieron obtener coordenadas. Intenta con otra dirección.'
      return
    }

    emit('place-selected', {
      displayName: place.displayName?.text ?? '',
      formattedAddress: place.formattedAddress ?? query.value,
      lat: place.location.latitude,
      lng: place.location.longitude,
      addressComponents: place.addressComponents ?? [],
    })
  } catch (e: unknown) {
    console.error('Google Places error:', e)
    error.value = 'No se pudieron cargar los datos. Inténtalo de nuevo.'
  }
}
</script>
