<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">
      {{ serviceId ? 'Editar servicio' : 'Nuevo servicio' }}
    </h1>
    <ServiceForm :service-id="serviceId" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ServiceForm from '../../components/admin/ServiceForm.vue'

const route = useRoute()
const router = useRouter()

const serviceId = computed(() => route.params.id as string | undefined)

function onSaved() {
  router.push({ name: 'admin-spaces' })
}
</script>
