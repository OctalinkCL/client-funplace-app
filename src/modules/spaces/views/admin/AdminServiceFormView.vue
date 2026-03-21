<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Editar servicio</h1>

    <!-- Banner de servicio recién creado -->
    <div
      v-if="isNewService"
      class="flex items-start justify-between gap-3 mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
    >
      <p>
        <span class="font-medium">Servicio creado.</span>
        Ahora agrega imágenes y completa la información de tu servicio.
      </p>
      <button type="button" class="shrink-0 text-blue-600 hover:text-blue-800 transition-colors" @click="isNewService = false">
        <X class="w-4 h-4" />
      </button>
    </div>

    <ServiceForm :service-id="serviceId" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import ServiceForm from '../../components/admin/ServiceForm.vue'

const route = useRoute()
const router = useRouter()

const serviceId = computed(() => route.params.id as string | undefined)
const isNewService = ref(route.query.new === '1')

function onSaved() {
  router.push({ name: 'admin-spaces' })
}
</script>
