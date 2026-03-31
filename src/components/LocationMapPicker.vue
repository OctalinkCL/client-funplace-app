<template>
  <div v-if="lat !== null && lng !== null" class="space-y-1.5">
    <p v-if="!readonly" class="text-xs text-muted-foreground">
      Mueve el mapa para ajustar la ubicación exacta del marcador.
    </p>
    <div
      class="relative rounded-md overflow-hidden border"
      style="height: 300px"
    >
      <div ref="mapContainer" class="w-full h-full" />
      <!-- Pin fijo en el centro del mapa (estilo Uber) -->
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
        style="padding-bottom: 28px; z-index: 1000"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="#ef4444"
          stroke="white"
          stroke-width="1"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          />
          <circle cx="12" cy="9" r="2.5" fill="white" stroke="none" />
        </svg>
      </div>
    </div>
    <p v-if="!readonly" class="text-xs text-muted-foreground tabular-nums">
      Coordenadas: {{ displayLat }}, {{ displayLng }}
    </p>
    <a
      v-if="readonly"
      :href="`https://www.google.com/maps?q=${lat},${lng}`"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      Ver en Google Maps
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps<{
  lat: number | null;
  lng: number | null;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  "update:lat": [value: number];
  "update:lng": [value: number];
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: LeafletMap | null = null;

// Flag para evitar emitir cuando movemos el mapa programáticamente
let isExternalUpdate = false;

const displayLat = ref(props.lat?.toFixed(6) ?? "");
const displayLng = ref(props.lng?.toFixed(6) ?? "");

async function initMap() {
  if (!mapContainer.value || props.lat === null || props.lng === null) return;

  const L = (await import("leaflet")).default;

  map = L.map(mapContainer.value, {
    center: [props.lat, props.lng],
    zoom: 16,
    zoomControl: !props.readonly,
    dragging: !props.readonly,
    scrollWheelZoom: !props.readonly,
    doubleClickZoom: !props.readonly,
    touchZoom: !props.readonly,
    keyboard: !props.readonly,
  });

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    },
  ).addTo(map);

  // Solo registrar moveend en modo edición
  if (!props.readonly) {
    map.on("moveend", () => {
      if (isExternalUpdate || !map) return;
      const center = map.getCenter();
      displayLat.value = center.lat.toFixed(6);
      displayLng.value = center.lng.toFixed(6);
      emit("update:lat", center.lat);
      emit("update:lng", center.lng);
    });
  }
}

onMounted(async () => {
  if (props.lat !== null && props.lng !== null) {
    await initMap();
  }
});

// flush: 'post' garantiza que el watch corre DESPUÉS de que Vue actualizó el DOM,
// por lo que mapContainer.value ya existe cuando initMap() lo necesita.
watch(
  () => [props.lat, props.lng] as [number | null, number | null],
  async ([newLat, newLng]) => {
    if (newLat === null || newLng === null) return;

    displayLat.value = newLat.toFixed(6);
    displayLng.value = newLng.toFixed(6);

    if (!map) {
      // Primera vez que tenemos coordenadas — DOM ya actualizado con flush 'post'
      await initMap();
      return;
    }

    // Ya existe el mapa — volar al nuevo centro sin emitir
    isExternalUpdate = true;
    map.setView([newLat, newLng], 16);
    setTimeout(() => {
      isExternalUpdate = false;
    }, 300);
  },
  { flush: "post" },
);

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>
