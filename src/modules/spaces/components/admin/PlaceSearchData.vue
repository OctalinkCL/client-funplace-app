<template>
  <div class="relative">
    <label class="text-sm font-medium text-gray-700 block mb-1">Buscar dirección (Data API)</label>
    <input
      v-model="inputValue"
      type="text"
      placeholder="Escribe una dirección..."
      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      @input="onInput"
      @keydown.escape="suggestions = []"
    />
    <p v-if="loading" class="text-xs text-gray-400 mt-1">Buscando...</p>

    <!-- Dropdown de sugerencias -->
    <ul
      v-if="suggestions.length"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      <li
        v-for="(s, i) in suggestions"
        :key="i"
        class="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm"
        @mousedown.prevent="selectPlace(s)"
      >
        <span class="font-medium">{{ s.placePrediction.mainText.toString() }}</span>
        <span class="text-gray-500 ml-1">{{ s.placePrediction.secondaryText?.toString() }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputValue = ref('')
const suggestions = ref<any[]>([])
const loading = ref(false)
const sessionToken = ref<any>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function loadGoogleMapsApi(): Promise<void> {
  const win = window as any
  if (win.google?.maps?.places?.AutocompleteSuggestion) return Promise.resolve()
  if (!win.__googleMapsLoaderPromise) {
    win.__googleMapsLoaderPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=beta&libraries=places`
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('No se pudo cargar Google Maps API'))
      document.head.appendChild(script)
    })
  }
  return win.__googleMapsLoaderPromise
}

function resetSessionToken() {
  const google = (window as any).google
  sessionToken.value = new google.maps.places.AutocompleteSessionToken()
}

onMounted(async () => {
  await loadGoogleMapsApi()
  resetSessionToken()
})

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!inputValue.value.trim()) {
    suggestions.value = []
    return
  }
  debounceTimer = setTimeout(fetchSuggestions, 300)
}

async function fetchSuggestions() {
  const google = (window as any).google
  loading.value = true
  try {
    const { suggestions: results } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: inputValue.value,
      sessionToken: sessionToken.value,
      language: 'es',
    })
    suggestions.value = results ?? []
  } catch (e) {
    console.error('Error fetching suggestions:', e)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

async function selectPlace(suggestion: any) {
  suggestions.value = []
  inputValue.value = suggestion.placePrediction.text.toString()

  const place = suggestion.placePrediction.toPlace()
  await place.fetchFields(['displayName', 'formattedAddress', 'location', 'addressComponents'])

  console.debug('🗺️ [Data API] Place data:', {
    displayName: place.displayName,
    formattedAddress: place.formattedAddress,
    lat: place.location?.lat(),
    lng: place.location?.lng(),
    addressComponents: place.addressComponents,
  })

  // Resetear session token para la próxima búsqueda
  resetSessionToken()
}
</script>
