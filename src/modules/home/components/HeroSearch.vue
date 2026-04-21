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
  <div class="grid bg-zinc-200 p-2 rounded-4xl gap-2">
    <!-- form -->
    <Card class="ring-0 border-0 shadow-none rounded-full p-0">
      <div class="grid grid-cols-2 md:grid-cols-5 items-center">
        <!-- region -->
        <Select v-model="searchRegion">
          <SelectTrigger
            class="col-span-1 w-full ring-0! border-0! shadow-none h-12! md:col-span-2"
          >
            <SelectValue placeholder="Región" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="r in regions" :key="r" :value="r">
              {{ r }}
            </SelectItem>
          </SelectContent>
        </Select>
        <!-- city -->
        <Select v-model="searchCity" :disabled="!searchRegion">
          <SelectTrigger
            class="col-span-1 h-12! w-full ring-0! border-0! shadow-none border-l-4! border-violet-100 rounded-none md:col-span-2"
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
          class="bg-violet-700 md:col-span-1 h-12 rounded-full"
          @click="handleSearch"
        >
          ¡Vamos!
        </Button>
      </div>
    </Card>
    <!-- mobile_button -->
    <Button
      v-if="isMobile"
      @click="handleSearch"
      class="bg-violet-700 h-12 rounded-full"
    >
      ¡Vamos!
    </Button>
  </div>
</template>
