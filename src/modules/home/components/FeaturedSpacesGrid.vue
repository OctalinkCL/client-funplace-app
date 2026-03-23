<template>
  <!-- Loading: 3 skeletons -->
  <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div
      v-for="n in 3"
      :key="n"
      class="rounded-xl border bg-neutral-100 animate-pulse aspect-4/3"
    />
  </div>

  <!-- Espacios reales -->
  <div v-else-if="spaces.length" class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <SpaceCard v-for="space in spaces" :key="space.id" :space="space" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { spacesService } from "@/modules/spaces/services/spaces.service";
import SpaceCard from "@/modules/spaces/components/public/SpaceCard.vue";
import type { Space } from "@/types";

const spaces = ref<Space[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const all = await spacesService.getPublished();
    spaces.value = all.slice(0, 3);
  } catch {
    // falla silenciosamente — la sección simplemente no renderiza
  } finally {
    loading.value = false;
  }
});
</script>
