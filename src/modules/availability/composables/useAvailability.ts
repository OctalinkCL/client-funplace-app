import { ref } from 'vue'
import { availabilityService } from '../services/availability.service'
import type { FormBlock, FormDayConfig } from '../services/availability.service'

const DAY_COUNT = 7

function initDayConfigs(): FormDayConfig[] {
  return Array.from({ length: DAY_COUNT }, (_, i) => ({
    day_of_week: i,
    enabled: false,
    blockTempIds: [],
  }))
}

export function useAvailability() {
  const blocks = ref<FormBlock[]>([])
  const dayConfigs = ref<FormDayConfig[]>(initDayConfigs())
  const editingTempId = ref<string | null>(null)
  const loading = ref(false)
  const savingBlocks = ref(false)
  const savingDays = ref(false)
  const savedBlocks = ref(false)
  const savedDays = ref(false)
  const blocksError = ref<string | null>(null)
  const daysError = ref<string | null>(null)

  async function loadSchedule(spaceId: string) {
    loading.value = true
    blocksError.value = null
    daysError.value = null
    try {
      const schedule = await availabilityService.getBySpaceId(spaceId)
      if (!schedule) {
        blocks.value = []
        dayConfigs.value = initDayConfigs()
        return
      }

      const sortedBlocks = [...(schedule.time_blocks ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order,
      )
      blocks.value = sortedBlocks.map(b => ({
        tempId: b.id,
        name: b.name,
        start_time: b.start_time.slice(0, 5),
        end_time: b.end_time.slice(0, 5),
        sort_order: b.sort_order,
      }))

      const configs = initDayConfigs()
      for (const dc of schedule.day_schedule_configs ?? []) {
        const assignedIds = (dc.day_block_assignments ?? []).map(a => a.block_id)
        configs[dc.day_of_week] = {
          day_of_week: dc.day_of_week,
          enabled: dc.enabled,
          blockTempIds: assignedIds,
        }
      }
      dayConfigs.value = configs
    } catch (e) {
      blocksError.value = e instanceof Error ? e.message : 'Error al cargar la disponibilidad.'
    } finally {
      loading.value = false
    }
  }

  function addBlock(name: string, start_time: string, end_time: string) {
    blocks.value.push({
      tempId: crypto.randomUUID(),
      name,
      start_time,
      end_time,
      sort_order: blocks.value.length,
    })
  }

  function startEdit(tempId: string) {
    editingTempId.value = tempId
  }

  function cancelEdit() {
    editingTempId.value = null
  }

  function updateBlock(tempId: string, name: string, start_time: string, end_time: string) {
    const i = blocks.value.findIndex(b => b.tempId === tempId)
    if (i !== -1) blocks.value[i] = { ...blocks.value[i], name, start_time, end_time }
    editingTempId.value = null
  }

  function removeBlock(tempId: string) {
    blocks.value = blocks.value.filter(b => b.tempId !== tempId)
    dayConfigs.value = dayConfigs.value.map(d => ({
      ...d,
      blockTempIds: d.blockTempIds.filter(id => id !== tempId),
    }))
  }

  function updateDayConfig(updated: FormDayConfig) {
    const i = dayConfigs.value.findIndex(d => d.day_of_week === updated.day_of_week)
    if (i !== -1) dayConfigs.value[i] = updated
  }

  async function saveBlocks(spaceId: string) {
    savingBlocks.value = true
    savedBlocks.value = false
    blocksError.value = null
    try {
      // Guarda bloques + preserva asignaciones de días actuales
      await availabilityService.saveSchedule(spaceId, blocks.value, dayConfigs.value)
      // Recarga para refrescar IDs reales desde DB
      await loadSchedule(spaceId)
      savedBlocks.value = true
    } catch (e) {
      blocksError.value = e instanceof Error ? e.message : 'Error al guardar los bloques.'
    } finally {
      savingBlocks.value = false
    }
  }

  async function saveDays(spaceId: string) {
    savingDays.value = true
    savedDays.value = false
    daysError.value = null
    try {
      await availabilityService.saveDaysOnly(spaceId, dayConfigs.value)
      savedDays.value = true
    } catch (e) {
      daysError.value = e instanceof Error ? e.message : 'Error al guardar el horario.'
    } finally {
      savingDays.value = false
    }
  }

  return {
    blocks,
    dayConfigs,
    editingTempId,
    loading,
    savingBlocks,
    savingDays,
    savedBlocks,
    savedDays,
    blocksError,
    daysError,
    loadSchedule,
    addBlock,
    startEdit,
    cancelEdit,
    updateBlock,
    removeBlock,
    updateDayConfig,
    saveBlocks,
    saveDays,
  }
}
