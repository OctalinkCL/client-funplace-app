<template>
  <Card class="shadow-none border-none bg-gray-100 p-1.5 rounded-3xl gap-3">
    <div class="bg-white rounded-[18px] p-3.5 lg:p-6">
      <div class="grid grid-cols-2 items-center gap-4">
        <div class="grid gap-1">
          <h5 class="text-xl font-semibold">{{ title }}</h5>
          <p class="font-medium text-black/70 text-base/5 wrap-break-word">
            {{ subtitle }}
          </p>
        </div>
        <div class="flex justify-end gap-1 items-baseline">
          <span class="text-2xl font-bold">${{ price }}</span>
          <span class="font-medium text-black/70">/mes</span>
        </div>
      </div>
      <Button
        class="w-full mt-4 rounded-full h-10 hover:bg-violet-800 hover:shadow-lg shadow-violet-500/50 cursor-pointer"
        as-child
      >
        <a :href="whatsappUrl" target="_blank">Comenzar Ahora</a>
      </Button>
    </div>

    <div class="px-4 pb-4 grid gap-2">
      <p class="text-sm text-black/60 font-medium">
        Características incluidas:
      </p>
      <ul class="list-disc ps-5">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="font-medium"
        >
          {{ feature }}
        </li>
      </ul>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  features: {
    type: Array,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const whatsappUrl = computed(() => {
  return `https://wa.me/56932393772?text=${props.message}`;
});
</script>
