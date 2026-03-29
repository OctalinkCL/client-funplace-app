<template>
  <div>
    <div v-if="loading" class="flex justify-center py-20">
      <p class="text-muted-foreground">Cargando...</p>
    </div>

    <template v-else-if="space">
      <!-- Banner post-creación -->
      <div
        v-if="isNew"
        class="mb-6 flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
      >
        <p>
          <span class="font-medium">{{ space.kind === 'service' ? 'Servicio creado.' : 'Espacio creado.' }}</span>
          Completá los detalles para poder publicarlo.
        </p>
        <button type="button" class="shrink-0 text-green-600 hover:text-green-800" @click="isNew = false">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Header -->
      <div class="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-semibold">{{ space.title }}</h1>
          <p class="text-sm text-muted-foreground mt-1">
            {{ space.kind === 'service' ? 'Servicio' : 'Espacio' }}
            <span v-if="space.city"> · {{ space.city }}</span>
          </p>
        </div>
        <Button
          v-if="space.kind === 'space'"
          variant="outline"
          @click="router.push({ name: 'admin-availability', params: { id: space.id } })"
        >
          Disponibilidad
        </Button>
      </div>

      <!-- Secciones -->
      <div class="divide-y divide-border">
        <BasicInfoSection :space="space" @updated="space = $event" />
        <PriceSection :space="space" @updated="space = $event" />
        <LocationSection :space="space" @updated="space = $event" />
        <CoverageSection v-if="space.kind === 'service'" :space="space" @updated="space = $event" />
        <AmenitiesSection v-if="space.kind === 'space'" :space="space" @updated="space = $event" />
        <PhotosSection :space="space" />
        <PublishSection :space="space" @updated="space = $event" />
      </div>
    </template>

    <p v-else class="text-muted-foreground">Espacio no encontrado.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import { spacesService } from '../../services/spaces.service'
import type { Space } from '@/types'
import { Button } from '@/components/ui/button'
import BasicInfoSection from '../../components/admin/sections/BasicInfoSection.vue'
import PriceSection from '../../components/admin/sections/PriceSection.vue'
import LocationSection from '../../components/admin/sections/LocationSection.vue'
import CoverageSection from '../../components/admin/sections/CoverageSection.vue'
import AmenitiesSection from '../../components/admin/sections/AmenitiesSection.vue'
import PhotosSection from '../../components/admin/sections/PhotosSection.vue'
import PublishSection from '../../components/admin/sections/PublishSection.vue'

const route = useRoute()
const router = useRouter()

const space = ref<Space | null>(null)
const loading = ref(false)
const isNew = ref(route.query.new === '1')

onMounted(async () => {
  loading.value = true
  try {
    space.value = await spacesService.getById(route.params.id as string)
  } finally {
    loading.value = false
  }
})
</script>
