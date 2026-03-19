<template>
  <div class="relative">
    <label class="text-sm font-medium text-gray-700 block mb-1">Buscar dirección</label>
    <input
      v-model="query"
      type="text"
      placeholder="Escribe una dirección..."
      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
      @input="onInput"
      @keydown.escape="suggestions = []"
    />
    <p v-if="loading" class="text-xs text-gray-400 mt-1">Buscando...</p>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>

    <ul
      v-if="suggestions.length"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      <li
        v-for="(s, i) in suggestions"
        :key="i"
        class="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm"
        @mousedown.prevent="select(s)"
      >
        <span class="font-medium">{{ s.placePrediction.structuredFormat.mainText.text }}</span>
        <span class="text-gray-500 ml-1">{{ s.placePrediction.structuredFormat.secondaryText?.text }}</span>
      </li>
    </ul>

    <pre v-if="result" class="text-xs bg-white rounded p-2 mt-2 overflow-auto">{{ JSON.stringify(result, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ 'place-selected': [data: any] }>()

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const BASE = 'https://places.googleapis.com/v1'

const query = ref('')
const suggestions = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const result = ref<any>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  suggestions.value = []
  if (!query.value.trim()) return
  debounceTimer = setTimeout(fetchSuggestions, 300)
}

async function fetchSuggestions() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${BASE}/places:autocomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
      },
      body: JSON.stringify({ input: query.value, languageCode: 'es' }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    suggestions.value = (data.suggestions ?? []).filter((s: any) => s.placePrediction)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
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

    const data = {
      displayName: place.displayName?.text,
      formattedAddress: place.formattedAddress,
      lat: place.location?.latitude,
      lng: place.location?.longitude,
      addressComponents: place.addressComponents,
    }
    result.value = data
    emit('place-selected', data)
  } catch (e: any) {
    error.value = e.message
  }
}
</script>
