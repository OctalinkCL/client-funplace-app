<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @keydown.esc="close"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50" />

        <!-- Panel -->
        <div
          class="relative z-10 w-full max-w-lg bg-background rounded-xl shadow-xl flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <h2 id="modal-title" class="text-lg font-semibold">Nuevo espacio</h2>
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground transition-colors"
              @click="close"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Form -->
          <form class="overflow-y-auto px-6 py-5 space-y-5" @submit.prevent="handleSubmit">
            <!-- Nombre -->
            <div class="space-y-1.5">
              <Label for="create-title">Nombre del espacio *</Label>
              <Input
                id="create-title"
                v-model="form.title"
                required
                autofocus
                placeholder="Casa LimaLimón"
              />
              <p v-if="form.slug" class="text-xs text-muted-foreground">
                URL: /espacios/{{ form.slug }}
              </p>
            </div>

            <!-- Tipo / Capacidad / m² -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="space-y-1.5">
                <Label>Tipo de espacio</Label>
                <Select v-model="form.space_type">
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in SPACE_TYPE_LIST" :key="item.key" :value="item.key">
                      {{ item.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label for="create-capacity">Capacidad</Label>
                <Input
                  id="create-capacity"
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  placeholder="50 personas"
                />
              </div>
              <div class="space-y-1.5">
                <Label for="create-size">Superficie (m²)</Label>
                <Input
                  id="create-size"
                  v-model.number="form.size_m2"
                  type="number"
                  min="1"
                  placeholder="120"
                />
              </div>
            </div>

            <!-- Descripción -->
            <div class="space-y-1.5">
              <Label for="create-description">Descripción</Label>
              <Textarea
                id="create-description"
                v-model="form.description"
                placeholder="Describe el espacio brevemente..."
                rows="3"
              />
            </div>

            <!-- Región / Ciudad / Dirección -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="space-y-1.5">
                <Label>Región</Label>
                <Select v-model="form.region">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="region in REGIONS" :key="region" :value="region">
                      {{ region }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label>Ciudad</Label>
                <Select v-model="form.city" :disabled="!form.region">
                  <SelectTrigger>
                    <SelectValue :placeholder="form.region ? 'Seleccionar' : 'Elige región'" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="city in availableCities" :key="city" :value="city">
                      {{ city }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label for="create-address">Dirección</Label>
                <Input
                  id="create-address"
                  v-model="form.address"
                  placeholder="Av. Providencia 1234"
                />
              </div>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 pt-1">
              <Button type="button" variant="outline" @click="close">Cancelar</Button>
              <Button type="submit" :disabled="loading || !form.title">
                {{ loading ? 'Creando...' : 'Crear espacio' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useSpaceForm } from '../../composables/useSpaceForm'
import { SPACE_TYPE_LIST, REGIONS } from '@/constants/spaces'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  created: [spaceId: string]
}>()

const { form, loading, error, availableCities, submit } = useSpaceForm()

// Reset form when modal opens
watch(() => props.open, (val) => {
  if (val) {
    form.title = ''
    form.slug = ''
    form.space_type = null
    form.description = ''
    form.capacity = null
    form.size_m2 = null
    form.region = null
    form.city = null
    form.address = ''
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
