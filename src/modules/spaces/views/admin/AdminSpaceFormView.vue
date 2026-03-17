<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">
      {{ spaceId ? 'Editar espacio' : 'Nuevo espacio' }}
    </h1>
    <SpaceForm :space-id="spaceId" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SpaceForm from '../../components/admin/SpaceForm.vue'

const route = useRoute()
const router = useRouter()

const spaceId = computed(() => route.params.id as string | undefined)

function onSaved() {
  router.push({ name: 'admin-spaces' })
}
</script>
