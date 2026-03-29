<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">{{ pageTitle }}</h1>
      <div class="flex gap-2">
        <Button v-if="auth.hasModule('spaces')" @click="showCreateModal = true">Crear espacio</Button>
        <Button v-if="auth.hasModule('services')" variant="outline"
          @click="showCreateServiceModal = true">Crear servicio</Button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <p class="text-muted-foreground">Cargando...</p>
    </div>

    <!-- Error -->
    <p v-else-if="error" class="text-sm text-destructive">{{ error }}</p>

    <!-- Empty state -->
    <div v-else-if="spaces.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
      <p class="text-muted-foreground">{{ emptyMessage }}</p>
      <div class="flex gap-2">
        <Button v-if="auth.hasModule('spaces')" @click="showCreateModal = true">Crear tu primer espacio</Button>
        <Button v-if="auth.hasModule('services')" variant="outline"
          @click="showCreateServiceModal = true">Crear tu primer servicio</Button>
      </div>
    </div>

    <!-- Lista -->
    <div v-else class="flex flex-col gap-3">
      <Card v-for="space in spaces" :key="space.id">
        <CardContent class="flex items-center gap-4 p-4">
          <!-- Thumbnail -->
          <div class="w-20 h-16 rounded-md overflow-hidden bg-muted shrink-0">
            <img v-if="space.space_images?.[0]?.url" :src="space.space_images[0].url" :alt="space.title"
              class="w-full h-full object-cover" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-medium truncate">{{ space.title }}</p>
              <Badge :variant="space.is_published ? 'default' : 'secondary'">
                {{ space.is_published ? 'Publicado' : 'Borrador' }}
              </Badge>
              <span v-if="space.space_type"
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="getKindBadgeClass(space.kind)">
                {{ getTypeLabel(space.space_type) }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground mt-0.5">
              <span v-if="space.city">{{ space.city }}</span>
            </p>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm"
              @click="router.push({ name: 'admin-space-detail', params: { id: space.id } })">
              Editar
            </Button>
            <Button variant="ghost" size="sm"
              @click="router.push({ name: 'admin-availability', params: { id: space.id } })">
              Disponibilidad
            </Button>
            <Button variant="ghost" size="sm"
              @click="router.push({ name: 'admin-calendar', params: { spaceId: space.id } })">
              Calendario
            </Button>
            <Button variant="ghost" size="sm" @click="togglePublish(space)">
              {{ space.is_published ? 'Despublicar' : 'Publicar' }}
            </Button>
            <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive"
              @click="handleDelete(space)">
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <SpaceCreateModal v-model:open="showCreateModal" @created="onSpaceCreated" />
    <ServiceCreateModal v-model:open="showCreateServiceModal" @created="onServiceCreated" />
  </div>

  <AlertDialog :open="confirmDialog.open" @update:open="val => confirmDialog.open = val">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ confirmDialog.title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ confirmDialog.description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="executeConfirm"
        >
          Eliminar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSpaces } from '../../composables/useSpaces'
import { getSidebarLabel, getTypeLabel, getKindBadgeClass } from '@/constants/plans'
import type { Space, SpaceKind } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SpaceCreateModal from '../../components/admin/SpaceCreateModal.vue'
import ServiceCreateModal from '../../components/admin/ServiceCreateModal.vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const router = useRouter()
const auth = useAuthStore()
const { spaces, loading, error, fetchSpaces, deleteSpace, togglePublish } = useSpaces()

const showCreateModal = ref(false)
const showCreateServiceModal = ref(false)

// Título y mensaje vacío dinámicos según plan
const pageTitle = computed(() => getSidebarLabel(auth.profile?.plan))
const emptyMessage = computed(() => {
  const hasSpaces = auth.hasModule('spaces')
  const hasServices = auth.hasModule('services')
  if (hasSpaces && hasServices) return 'Aún no tienes espacios ni servicios creados.'
  if (hasServices) return 'Aún no tienes servicios creados.'
  return 'Aún no tienes espacios creados.'
})

// Filtro de kind según los módulos del plan
const kindFilter = computed<SpaceKind | undefined>(() => {
  const hasSpaces = auth.hasModule('spaces')
  const hasServices = auth.hasModule('services')
  if (hasSpaces && hasServices) return undefined  // trae todo
  if (hasServices) return 'service'
  return 'space'
})

const confirmDialog = ref<{ open: boolean; title: string; description: string; action: (() => void) | null }>({
  open: false, title: '', description: '', action: null,
})

function openConfirm(title: string, description: string, action: () => void) {
  confirmDialog.value = { open: true, title, description, action }
}

function executeConfirm() {
  confirmDialog.value.action?.()
  confirmDialog.value.open = false
}

onMounted(() => fetchSpaces(kindFilter.value))

function handleDelete(space: Space) {
  openConfirm(
    `Eliminar "${space.title}"`,
    'Esta acción es permanente y eliminará todas las reservas y disponibilidad asociadas.',
    () => deleteSpace(space.id),
  )
}

function onSpaceCreated(id: string) {
  router.push({ name: 'admin-space-detail', params: { id }, query: { new: '1' } })
}

function onServiceCreated(id: string) {
  router.push({ name: 'admin-space-detail', params: { id }, query: { new: '1' } })
}
</script>
