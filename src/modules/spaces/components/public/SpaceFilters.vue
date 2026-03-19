<template>
  <div class="flex flex-wrap gap-3 items-end">
    <!-- Región -->
    <div class="space-y-1">
      <label class="text-sm font-medium">Región</label>
      <div v-if="loading" class="h-9 w-44 animate-pulse rounded-md bg-muted" />
      <select
        v-else
        :value="region"
        class="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        @change="onRegionChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="">Todas las regiones</option>
        <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
      </select>
    </div>

    <!-- Ciudad -->
    <div class="space-y-1">
      <label class="text-sm font-medium">Ciudad</label>
      <div v-if="loading" class="h-9 w-36 animate-pulse rounded-md bg-muted" />
      <select
        v-else
        :value="city"
        :disabled="!region"
        class="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        @change="$emit('update:city', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Todas las ciudades</option>
        <option v-for="c in availableCities" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <!-- Limpiar -->
    <button
      v-if="region || city"
      class="text-sm text-muted-foreground hover:text-foreground underline h-9"
      @click="$emit('clear')"
    >
      Limpiar filtros
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLocationFilters } from '../../composables/useLocationFilters'

const props = defineProps<{
  region: string
  city: string
}>()

const emit = defineEmits<{
  'update:region': [value: string]
  'update:city': [value: string]
  'clear': []
}>()

const { regions, citiesForRegion, loading, fetchLocations } = useLocationFilters()

onMounted(fetchLocations)

const availableCities = computed(() => {
  if (!props.region) return []
  return citiesForRegion(props.region)
})

function onRegionChange(value: string) {
  emit('update:region', value)
  emit('update:city', '')
}
</script>
