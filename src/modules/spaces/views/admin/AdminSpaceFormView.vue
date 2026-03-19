<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Editar espacio</h1>

    <!-- Banner de espacio recién creado -->
    <div
      v-if="isNewSpace"
      class="flex items-start justify-between gap-3 mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
    >
      <p>
        <span class="font-medium">Espacio creado.</span>
        Ahora agrega imágenes y facilidades para completar tu ficha.
      </p>
      <button type="button" class="shrink-0 text-blue-600 hover:text-blue-800 transition-colors" @click="isNewSpace = false">
        <X class="w-4 h-4" />
      </button>
    </div>

    <SpaceForm :space-id="spaceId" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import SpaceForm from '../../components/admin/SpaceForm.vue'

const route = useRoute()
const router = useRouter()

const spaceId = computed(() => route.params.id as string | undefined)
const isNewSpace = ref(route.query.new === '1')

function onSaved() {
  router.push({ name: 'admin-spaces' })
}
</script>
