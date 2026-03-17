<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="item in AMENITY_LIST"
      :key="item.key"
      class="flex items-center gap-2"
    >
      <Checkbox
        :id="item.key"
        :checked="modelValue.includes(item.key)"
        @update:checked="toggle(item.key)"
      />
      <Label :for="item.key" class="cursor-pointer font-normal">{{ item.label }}</Label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AMENITY_LIST } from '@/constants/spaces'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { Amenity } from '@/types'

const props = defineProps<{ modelValue: Amenity[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Amenity[]] }>()

function toggle(key: Amenity) {
  const updated = props.modelValue.includes(key)
    ? props.modelValue.filter(a => a !== key)
    : [...props.modelValue, key]
  emit('update:modelValue', updated)
}
</script>
