<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <button
          class="text-sm text-muted-foreground hover:text-foreground mb-1"
          @click="router.push({ name: 'admin-spaces' })"
        >
          ← Mis espacios
        </button>
        <h1 class="text-2xl font-semibold">
          Disponibilidad{{ spaceName ? ` — ${spaceName}` : '' }}
        </h1>
      </div>
    </div>

    <!-- Loading inicial -->
    <div v-if="loading" class="flex justify-center py-20">
      <p class="text-muted-foreground">Cargando...</p>
    </div>

    <template v-else>
      <div class="space-y-10">
        <BlocksManager
          :blocks="blocks"
          :editing-temp-id="editingTempId"
          :saving="savingBlocks"
          :saved="savedBlocks"
          :error="blocksError"
          @add-block="({ name, start_time, end_time }) => addBlock(name, start_time, end_time)"
          @start-edit="startEdit"
          @cancel-edit="cancelEdit"
          @update-block="updateBlock"
          @remove-block="removeBlock"
          @save="saveBlocks(spaceId)"
        />

        <WeeklyScheduleEditor
          :blocks="blocks"
          :day-configs="dayConfigs"
          :disabled="blocks.length === 0"
          :saving="savingDays"
          :saved="savedDays"
          :error="daysError"
          @update-day="updateDayConfig"
          @save="saveDays(spaceId)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAvailability } from '../../composables/useAvailability'
import { spacesService } from '@/modules/spaces/services/spaces.service'
import BlocksManager from '../../components/BlocksManager.vue'
import WeeklyScheduleEditor from '../../components/WeeklyScheduleEditor.vue'

const route = useRoute()
const router = useRouter()
const spaceId = route.params.id as string

const spaceName = ref<string | null>(null)

const {
  blocks, dayConfigs, editingTempId,
  loading, savingBlocks, savingDays, savedBlocks, savedDays, blocksError, daysError,
  loadSchedule, addBlock, startEdit, cancelEdit, updateBlock, removeBlock, updateDayConfig,
  saveBlocks, saveDays,
} = useAvailability()

onMounted(async () => {
  await Promise.all([
    loadSchedule(spaceId),
    spacesService.getById(spaceId)
      .then(s => { spaceName.value = s.title })
      .catch(() => {}),
  ])
})
</script>
