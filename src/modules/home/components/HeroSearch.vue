<template>
  <div
    class="w-full relative pb-18 bg-linear-to-t from-white via-violet-300 to-white"
  >
    <div
      class="relative z-10 px-[32px] pt-[90px] lg:max-w-4xl lg:mx-auto lg:pt-[116px] lg:pb-[90px]"
    >
      <div class="text-center">
        <h1 class="text-4xl font-semibold lg:text-7xl lg:font-bold">
          El espacio perfecto para tu próximo evento
        </h1>
        <p class="text-lg mt-2 lg:text-2xl">
          Explora casas, salas y estudios disponibles para arriendo. Sin
          intermediarios, sin complicaciones.
        </p>
      </div>
      <Card
        class="p-2 mt-6 border-4 border-indigo-500/60 shadow-none rounded-4xl lg:mt-12 lg:rounded-full"
      >
        <div class="grid grid-cols-1 md:grid-cols-5 gap-2">
          <Select v-model="searchRegion">
            <SelectTrigger class="w-full h-12! md:col-span-2 rounded-full">
              <SelectValue placeholder="Región" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="r in regions" :key="r" :value="r">{{
                r
              }}</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="searchCity" :disabled="!searchRegion">
            <SelectTrigger class="w-full h-12! md:col-span-2 rounded-full">
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
          <Button
            class="gap-1 w-full h-12 cursor-pointer rounded-full"
            @click="handleSearch"
          >
            ¡Vamos!
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
