<template>
  <div class="grid gap-3">
    <!-- Región -->
    <div>
      <div
        v-if="loading"
        class="h-9 w-full animate-pulse rounded-md bg-muted"
      />
      <Select
        v-else
        class="mb-0!"
        :model-value="region || undefined"
        @update:model-value="onRegionChange(($event as string) ?? '')"
      >
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Selecciona una región" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="r in regions" :key="r" :value="r">{{
            r
          }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Ciudad -->
    <div>
      <div
        v-if="loading"
        class="h-9 w-full animate-pulse rounded-md bg-muted"
      />
      <Select
        v-else
        :disabled="!region"
        :model-value="city || undefined"
        @update:model-value="$emit('update:city', ($event as string) ?? '')"
      >
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Todas las ciudades" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="c in availableCities" :key="c" :value="c">{{
            c
          }}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { computed, onMounted } from "vue";
import { useLocationFilters } from "../../composables/useLocationFilters";

const props = defineProps<{
  region: string;
  city: string;
}>();

const emit = defineEmits<{
  "update:region": [value: string];
  "update:city": [value: string];
}>();

const { regions, citiesForRegion, loading, fetchLocations } =
  useLocationFilters();

onMounted(fetchLocations);

const availableCities = computed(() => {
  if (!props.region) return [];
  return citiesForRegion(props.region);
});

function onRegionChange(value: string) {
  emit("update:region", value);
  emit("update:city", "");
}
</script>
