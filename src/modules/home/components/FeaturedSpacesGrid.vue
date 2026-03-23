<template>
  <div class="space-y-12">
    <!-- Espacios Destacados -->
    <div>
      <h3 class="text-xl font-semibold mb-6">Espacios Destacados</h3>
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          v-for="n in 4"
          :key="n"
          class="rounded-xl border bg-neutral-100 animate-pulse aspect-4/3"
        />
      </div>
      <div
        v-else-if="espacios.length"
        class="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch"
      >
        <SpaceCard v-for="space in espacios" :key="space.id" :space="space" />
      </div>
    </div>

    <!-- Servicios Destacados -->
    <div v-if="!loading && servicios.length">
      <h3 class="text-xl font-semibold mb-6">Servicios Destacados</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
        <SpaceCard
          v-for="service in servicios"
          :key="service.id"
          :space="service"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { spacesService } from "@/modules/spaces/services/spaces.service";
import SpaceCard from "@/modules/spaces/components/public/SpaceCard.vue";
import type { Space } from "@/types";

const espacios = ref<Space[]>([]);
const servicios = ref<Space[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const [spaces, services] = await Promise.all([
      spacesService.getFeaturedSpaces({ kind: "space", limit: 1 }),
      spacesService.getFeaturedSpaces({ kind: "service", limit: 4 }),
    ]);
    espacios.value = spaces;
    servicios.value = services;
  } catch {
    // falla silenciosamente — las secciones simplemente no renderizan
  } finally {
    loading.value = false;
  }
});
</script>
