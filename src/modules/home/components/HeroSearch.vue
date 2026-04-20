<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "@vueuse/core";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useLocationFilters } from "@/modules/spaces/composables/useLocationFilters";

const router = useRouter();
const { regions, citiesForRegion, fetchLocations } = useLocationFilters();
const isMobile = useMediaQuery("(max-width: 768px)");
const marqueeItems = ref([
  "Busqueda por fecha",
  "Reserva al instante",
  "Espacios verificados",
  "Disponibilidad en tiempo real",
  "Sin intermediarios",
  "Busqueda por fecha",
  "Reserva al instante",
  "Espacios verificados",
  "Disponibilidad en tiempo real",
  "Sin intermediarios",
]);

const searchRegion = ref("");
const searchCity = ref("");

watch(searchRegion, () => {
  searchCity.value = "";
});

onMounted(fetchLocations);

function handleSearch() {
  const query: Record<string, string> = {};
  if (searchRegion.value) query.region = searchRegion.value;
  if (searchCity.value) query.city = searchCity.value;
  router.push({ name: "spaces-list", query });
}
</script>

<template>
  <div class="bg-neutral-50">
    <div class="container-wrap pt-6 pb-12 lg:max-w-4xl! lg:pt-12 lg:pb-16">
      <!-- text -->
      <div class="text-center">
        <h1 class="text-4xl lg:text-6xl font-medium">
          El espacio
          <span class="text-violet-700 italic font-serif font-semibold"
            >perfecto</span
          >
          para tu próximo
          <span class="text-violet-700 font-semibold italic font-serif"
            >evento</span
          >.
        </h1>
        <p class="mt-2 lg:text-xl lg:mt-9 text-neutral-500">
          Descubre casas, salones y estudios disponibles para arriendo. Sin
          intermediarios, sin complicaciones.
        </p>
      </div>
      <!-- form -->
      <div class="grid gap-3 mt-6 lg:px-12">
        <Card class="rounded-full p-0 md:p-2 shadow-none">
          <div class="grid grid-cols-2 md:grid-cols-5 items-center">
            <!-- region -->
            <Select v-model="searchRegion">
              <SelectTrigger
                class="col-span-1 w-full ring-0! border-0! shadow-none h-12! md:col-span-2"
              >
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="r in regions" :key="r" :value="r">{{
                  r
                }}</SelectItem>
              </SelectContent>
            </Select>
            <!-- city -->
            <Select v-model="searchCity" :disabled="!searchRegion">
              <SelectTrigger
                class="col-span-1 h-12! w-full ring-0! border-0! shadow-none border-l! border-neutral-300 rounded-none md:col-span-2"
              >
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="c in citiesForRegion(searchRegion)"
                  :key="c"
                  :value="c"
                  >{{ c }}</SelectItem
                >
              </SelectContent>
            </Select>
            <!-- button -->
            <Button
              v-if="!isMobile"
              class="md:col-span-1 h-12 rounded-full"
              @click="handleSearch"
            >
              ¡Vamos!
            </Button>
          </div>
        </Card>
        <Button v-if="isMobile" @click="handleSearch" class="h-12 rounded-full">
          ¡Vamos!
        </Button>
      </div>
    </div>
    <div class="border-y p-4 overflow-hidden">
      <div
        style="animation: scroll 10s linear infinite"
        class="flex items-center gap-12 text-nowrap font-serif font-medium text-xl"
      >
        <span
          v-for="(item, index) in marqueeItems"
          :key="index"
          class="flex gap-12 items-center"
          ><span>{{ item }}</span
          ><span class="text-violet-700 text-2xl">✦</span></span
        >
      </div>
    </div>
  </div>
</template>

<style>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
