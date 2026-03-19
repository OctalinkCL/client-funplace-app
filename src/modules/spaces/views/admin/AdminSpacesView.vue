<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Mis Espacios</h1>
      <Button @click="showCreateModal = true">Nuevo espacio</Button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <p class="text-muted-foreground">Cargando...</p>
    </div>

    <!-- Error -->
    <p v-else-if="error" class="text-sm text-destructive">{{ error }}</p>

    <!-- Empty state -->
    <div v-else-if="spaces.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
      <p class="text-muted-foreground">Aún no tienes espacios creados.</p>
      <Button @click="showCreateModal = true">Crear tu primer espacio</Button>
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
            </div>
            <p class="text-sm text-muted-foreground mt-0.5">
              {{ SPACE_TYPE_LABELS[space.space_type as SpaceType] ?? '' }}
              <span v-if="space.city">· {{ space.city }}</span>
            </p>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm"
              @click="router.push({ name: 'admin-space-edit', params: { id: space.id } })">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpaces } from '../../composables/useSpaces'
import { SPACE_TYPE_LABELS } from '@/constants/spaces'
import type { Space, SpaceType } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SpaceCreateModal from '../../components/admin/SpaceCreateModal.vue'
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
const { spaces, loading, error, fetchSpaces, deleteSpace, togglePublish } = useSpaces()

const showCreateModal = ref(false)

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

onMounted(fetchSpaces)

function handleDelete(space: Space) {
  openConfirm(
    `Eliminar "${space.title}"`,
    'Esta acción es permanente y eliminará todas las reservas y disponibilidad asociadas.',
    () => deleteSpace(space.id),
  )
}

function onSpaceCreated(id: string) {
  router.push({ name: 'admin-space-edit', params: { id }, query: { new: '1' } })
}
</script>
