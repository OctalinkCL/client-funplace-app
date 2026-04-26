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
      <!-- Pin CSS centrado: solo en modo edición (estilo Uber) -->
      <div
        v-if="!readonly"
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      Ver en Google Maps
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import type { Map as MaplibreMap, Marker } from "maplibre-gl";

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
let map: MaplibreMap | null = null;
let marker: Marker | null = null;

const displayLat = ref(props.lat?.toFixed(6) ?? "");
const displayLng = ref(props.lng?.toFixed(6) ?? "");

async function initMap() {
  if (!mapContainer.value || props.lat === null || props.lng === null) return;

  const maplibregl = (await import("maplibre-gl")).default;
  await import("maplibre-gl/dist/maplibre-gl.css");

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: "https://tiles.openfreemap.org/styles/bright",
    center: [props.lng, props.lat],
    zoom: 16,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    attributionControl: false,
    cooperativeGestures: true,
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }));

  map.on("styleimagemissing", (e) => {
    map!.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
  });

  map.addControl(
    new maplibregl.NavigationControl({ showCompass: false }),
    "top-right",
  );

  if (props.readonly) {
    // Marker real fijado en las coordenadas — el usuario puede navegar libremente
    marker = new maplibregl.Marker({ color: "#ef4444" })
      .setLngLat([props.lng, props.lat])
      .addTo(map);
  } else {
    // Pin CSS centrado (Uber-style): moveend actualiza coordenadas
    map.on("moveend", (e) => {
      if (!e.originalEvent || !map) return;
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

watch(
  () => [props.lat, props.lng] as [number | null, number | null],
  async ([newLat, newLng]) => {
    if (newLat === null || newLng === null) return;

    displayLat.value = newLat.toFixed(6);
    displayLng.value = newLng.toFixed(6);

    if (!map) {
      await initMap();
      return;
    }

    // En edición: recentra el mapa (sin emitir, jumpTo no genera originalEvent)
    // En readonly: reposiciona el marker y recentra
    if (marker) marker.setLngLat([newLng, newLat]);
    map.jumpTo({ center: [newLng, newLat] });
  },
  { flush: "post" },
);

onUnmounted(() => {
  marker?.remove();
  marker = null;
  if (map) {
    map.remove();
    map = null;
  }
});
</script>
