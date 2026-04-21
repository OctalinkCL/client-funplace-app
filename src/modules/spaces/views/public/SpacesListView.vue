<template>
  <div class="container-wrap py-8 grid gap-6 md:gap-8">
    <div>
      <h1 class="text-3xl font-semibold font-heading">Espacios disponibles</h1>
      <p class="text-muted-foreground mt-1">
        Encuentra el espacio ideal para tu evento.
      </p>
    </div>

    <!-- content -->
    <div class="grid gap-4 md:grid-cols-4 md:gap-8">
      <!-- filters -->
      <div class="md:col-span-1">
        <SpaceFilters
          :region="filters.region"
          :city="filters.city"
          @update:region="filters.region = $event"
          @update:city="filters.city = $event"
        />
      </div>
      <!-- items -->
      <div class="md:col-span-3">
        <!-- Sin región seleccionada -->
        <div
          v-if="!filters.region"
          class="py-20 text-center text-muted-foreground"
        >
          <MapPin class="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p>Selecciona una región para ver los espacios disponibles</p>
        </div>

        <!-- Loading -->
        <div
          v-else-if="loading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="n in 3"
            :key="n"
            class="rounded-xl border bg-muted animate-pulse aspect-4/3"
          />
        </div>

        <!-- Error -->
        <p v-else-if="error" class="text-sm text-destructive">{{ error }}</p>

        <!-- Empty -->
        <div v-else-if="spaces.length === 0" class="py-20 text-center">
          <p class="text-muted-foreground">
            No hay espacios disponibles con los filtros seleccionados.
          </p>
        </div>

        <!-- Grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <SpaceCard v-for="space in spaces" :key="space.id" :space="space" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { MapPin } from "lucide-vue-next";
import { spacesService } from "../../services/spaces.service";
import SpaceCard from "../../components/public/SpaceCard.vue";
import SpaceFilters from "../../components/public/SpaceFilters.vue";
import type { Space } from "@/types";

const spaces = ref<Space[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const filters = reactive({ region: "", city: "" });

async function fetchSpaces() {
  loading.value = true;
  error.value = null;
  try {
    spaces.value = await spacesService.getPublished({
      region: filters.region || undefined,
      city: filters.city || undefined,
    });
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Error al cargar los espacios.";
  } finally {
    loading.value = false;
  }
}

const route = useRoute();

watch(filters, () => {
  if (!filters.region) {
    spaces.value = [];
    return;
  }
  fetchSpaces();
});
onMounted(() => {
  if (route.query.region) filters.region = route.query.region as string;
  if (route.query.city) filters.city = route.query.city as string;
  if (filters.region) fetchSpaces();
});
</script>
