import { ref } from 'vue'
import { amenitiesService } from '../services/amenities.service'
import type { AmenityRecord } from '@/types'

export function useAmenities() {
  const amenities = ref<AmenityRecord[]>([])
  const loading = ref(false)

  async function fetchAmenities() {
    loading.value = true
    try {
      amenities.value = await amenitiesService.getAll()
    } finally {
      loading.value = false
    }
  }

  return { amenities, loading, fetchAmenities }
}
