<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.esc="close">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50" />

        <!-- Panel -->
        <div class="relative z-10 w-full max-w-lg bg-background rounded-xl shadow-xl flex flex-col max-h-[90vh]"
          role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <h2 id="modal-title" class="text-lg font-semibold">Nuevo servicio</h2>
            <button type="button" class="text-muted-foreground hover:text-foreground transition-colors" @click="close">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Form -->
          <form class="overflow-y-auto px-6 py-5 space-y-5" @submit.prevent="handleSubmit">
            <!-- Nombre -->
            <div class="space-y-1.5">
              <Label for="create-title">Nombre del servicio *</Label>
              <Input id="create-title" v-model="form.title" required autofocus placeholder="Ej: Catering Los Pinos" />
              <p v-if="form.slug" class="text-xs text-muted-foreground">
                URL: /espacios/{{ form.slug }}
              </p>
            </div>

            <!-- Tipo -->
            <div class="space-y-1.5">
              <Label>Tipo de servicio *</Label>
              <Select v-model="form.space_type">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="item in SERVICE_TYPES" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Descripción -->
            <div class="space-y-1.5">
              <Label for="create-description">Descripción</Label>
              <Textarea id="create-description" v-model="form.description"
                placeholder="Describe el servicio brevemente..." rows="3" />
            </div>

            <!-- Región / Ciudad -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <Label>Región</Label>
                <Select v-model="form.region" @update:modelValue="form.city = null">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona región" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="r in CHILE_REGIONS" :key="r.name" :value="r.name">
                      {{ r.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label>Ciudad / Comuna</Label>
                <Select v-model="form.city" :disabled="!form.region">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="c in communesForSelectedRegion" :key="c" :value="c">
                      {{ c }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <!-- Dirección -->
            <PlaceSearchInput @place-selected="applyPlaceData" />
            <LocationMapPicker
              :lat="form.lat"
              :lng="form.lng"
              @update:lat="form.lat = $event"
              @update:lng="form.lng = $event"
            />

            <!-- Error -->
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 pt-1">
              <Button type="button" variant="outline" @click="close">Cancelar</Button>
              <Button type="submit" :disabled="loading || !form.title || !form.space_type || !form.address">
                {{ loading ? 'Creando...' : 'Crear servicio' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useServiceForm } from '../../composables/useServiceForm'
import { SERVICE_TYPES } from '@/constants/plans'
import { CHILE_REGIONS } from '@/constants/regions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import PlaceSearchInput from './PlaceSearchInput.vue'
import LocationMapPicker from '@/components/LocationMapPicker.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  created: [serviceId: string]
}>()

const { form, loading, error, applyPlaceData, submit } = useServiceForm()

const communesForSelectedRegion = computed(() =>
  CHILE_REGIONS.find(r => r.name === form.region)?.communes ?? []
)

watch(() => props.open, (val) => {
  if (val) {
    form.title = ''
    form.slug = ''
    form.space_type = null
    form.description = ''
    form.address = ''
    form.lat = null
    form.lng = null
    form.region = null
    form.city = null
    error.value = null
  }
})

function close() {
  if (loading.value) return
  emit('update:open', false)
}

async function handleSubmit() {
  const id = await submit()
  if (id) {
    emit('created', id)
    emit('update:open', false)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
