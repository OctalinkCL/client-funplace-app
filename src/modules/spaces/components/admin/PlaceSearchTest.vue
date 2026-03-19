<template>
  <div>
    <label class="text-sm font-medium text-gray-700 block mb-1">Buscar dirección</label>
    <div ref="containerRef" class="w-full" />
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
    <p v-if="!ready && !error" class="text-xs text-gray-400 mt-1">Cargando API de Google...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const ready = ref(false)
const error = ref<string | null>(null)

function loadGoogleMapsApi(): Promise<void> {
  const win = window as any

  if (win.google?.maps?.places?.PlaceAutocompleteElement) {
    return Promise.resolve()
  }

  if (!win.__googleMapsLoaderPromise) {
    win.__googleMapsLoaderPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=beta&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('No se pudo cargar Google Maps API'))
      document.head.appendChild(script)
    })
  }

  return win.__googleMapsLoaderPromise
}

onMounted(async () => {
  try {
    await loadGoogleMapsApi()

    const google = (window as any).google
    const autocomplete = new google.maps.places.PlaceAutocompleteElement()
    containerRef.value!.appendChild(autocomplete)
    ready.value = true

    autocomplete.addEventListener('gmp-placeselect', async (event: any) => {
      const place = event.place
      await place.fetchFields([
        'displayName',
        'formattedAddress',
        'location',
        'addressComponents',
      ])

      console.debug('🗺️ [Widget] Place data:', {
        displayName: place.displayName,
        formattedAddress: place.formattedAddress,
        lat: place.location?.lat(),
        lng: place.location?.lng(),
        addressComponents: place.addressComponents,
      })
    })
  } catch (e: any) {
    error.value = e.message ?? 'Error al inicializar Google Places'
  }
})
</script>
