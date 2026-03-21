import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { spacesService } from '../services/spaces.service'
import type { Space, SpaceKind } from '@/types'

export function useSpaces() {
  const auth = useAuthStore()
  const spaces = ref<Space[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSpaces(kind?: SpaceKind) {
    if (!auth.user) return
    loading.value = true
    error.value = null
    try {
      spaces.value = await spacesService.getByAdmin(auth.user.id, kind)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar los espacios.'
    } finally {
      loading.value = false
    }
  }

  async function deleteSpace(id: string) {
    const prev = [...spaces.value]
    spaces.value = spaces.value.filter(s => s.id !== id)
    try {
      await spacesService.delete(id)
    } catch (e) {
      spaces.value = prev
      error.value = e instanceof Error ? e.message : 'Error al eliminar el espacio.'
    }
  }

  async function togglePublish(space: Space) {
    const newValue = !space.is_published
    const index = spaces.value.findIndex(s => s.id === space.id)
    if (index !== -1) spaces.value[index].is_published = newValue
    try {
      await spacesService.togglePublish(space.id, newValue)
    } catch (e) {
      if (index !== -1) spaces.value[index].is_published = !newValue
      error.value = e instanceof Error ? e.message : 'Error al actualizar el espacio.'
    }
  }

  return { spaces, loading, error, fetchSpaces, deleteSpace, togglePublish }
}
