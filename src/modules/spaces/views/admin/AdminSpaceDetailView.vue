<template>
  <div>
    <div v-if="loading" class="flex justify-center py-20">
      <p class="text-muted-foreground">Cargando...</p>
    </div>

    <template v-else-if="space">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 class="text-2xl font-semibold">{{ space.title }}</h1>
          <p class="text-sm text-muted-foreground mt-1">
            {{ SPACE_TYPE_LABELS[space.space_type as SpaceType] ?? '' }}
            <span v-if="space.city">· {{ space.city }}</span>
          </p>
        </div>
        <div class="flex gap-2 shrink-0">
          <Button variant="outline" @click="router.push({ name: 'admin-space-edit', params: { id: space.id } })">
            Editar
          </Button>
          <Button variant="outline" @click="router.push({ name: 'admin-availability', params: { id: space.id } })">
            Disponibilidad
          </Button>
        </div>
      </div>

      <Card>
        <CardContent class="p-6 space-y-4">
          <!-- Status -->
          <div class="flex items-center gap-2">
            <Badge :variant="space.is_published ? 'default' : 'secondary'">
              {{ space.is_published ? 'Publicado' : 'Borrador' }}
            </Badge>
          </div>

          <!-- Descripción -->
          <p v-if="space.description" class="text-sm">{{ space.description }}</p>

          <!-- Datos -->
          <div class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div v-if="space.capacity">
              <p class="text-muted-foreground">Capacidad</p>
              <p>{{ space.capacity }} personas</p>
            </div>
            <div v-if="space.size_m2">
              <p class="text-muted-foreground">Superficie</p>
              <p>{{ space.size_m2 }} m²</p>
            </div>
            <div v-if="space.address">
              <p class="text-muted-foreground">Dirección</p>
              <p>{{ space.address }}</p>
            </div>
          </div>

          <!-- Amenities -->
          <div v-if="space.space_amenities?.length">
            <p class="text-sm text-muted-foreground mb-2">Facilidades</p>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="a in space.space_amenities"
                :key="a.amenity"
                variant="secondary"
              >
                {{ AMENITY_LABELS[a.amenity] }}
              </Badge>
            </div>
          </div>

          <!-- Imágenes -->
          <div v-if="space.space_images?.length" class="grid grid-cols-3 gap-2 sm:grid-cols-4">
            <div
              v-for="img in space.space_images"
              :key="img.id"
              class="aspect-square rounded-md overflow-hidden"
            >
              <img :src="img.url" :alt="space.title" class="w-full h-full object-cover" />
            </div>
          </div>
        </CardContent>
      </Card>
    </template>

    <p v-else class="text-muted-foreground">Espacio no encontrado.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { spacesService } from '../../services/spaces.service'
import { SPACE_TYPE_LABELS, AMENITY_LABELS } from '@/constants/spaces'
import type { Space, SpaceType } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const route = useRoute()
const router = useRouter()

const space = ref<Space | null>(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    space.value = await spacesService.getById(route.params.id as string)
  } finally {
    loading.value = false
  }
})
</script>
