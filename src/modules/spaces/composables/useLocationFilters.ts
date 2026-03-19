import { ref, computed } from 'vue'
import { spacesService } from '../services/spaces.service'

export function useLocationFilters() {
  const locations = ref<{ region: string; city: string | null }[]>([])
  const loading = ref(false)

  async function fetchLocations() {
    loading.value = true
    try {
      locations.value = await spacesService.getAvailableLocations()
    } catch {
      // silently fail — filters simply won't show options
    } finally {
      loading.value = false
    }
  }

  const regions = computed(() => {
    const seen = new Set<string>()
    return locations.value
      .map(l => l.region)
      .filter(r => { if (seen.has(r)) return false; seen.add(r); return true })
  })

  function citiesForRegion(region: string): string[] {
    const seen = new Set<string>()
    return locations.value
      .filter(l => l.region === region && l.city)
      .map(l => l.city as string)
      .filter(c => { if (seen.has(c)) return false; seen.add(c); return true })
      .sort()
  }

  return { regions, citiesForRegion, loading, fetchLocations }
}
