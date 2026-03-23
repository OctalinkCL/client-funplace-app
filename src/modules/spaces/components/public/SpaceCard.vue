<template>
  <RouterLink
    :to="{ name: 'space-detail', params: { slug: space.slug } }"
    class="group"
  >
    <Card
      class="p-1.5 h-full bg-gray-100 border-0 shadow-none gap-2 group-hover:shadow-xl shadow-violet-400/20 transition-shadow duration-300"
    >
      <!-- Imagen -->
      <div class="aspect-4/3 overflow-hidden bg-muted rounded-lg relative">
        <img
          v-if="coverImage"
          :src="coverImage"
          :alt="space.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-muted-foreground text-sm"
        >
          Sin imagen
        </div>

        <div class="absolute top-2 left-2">
          <Badge
            v-if="space.space_type"
            :class="{ 'bg-violet-700/70': space.kind === 'space' }"
          >
            <span class="font-semibold">{{
              SPACE_TYPE_LABELS[space.space_type] ?? space.space_type
            }}</span>
          </Badge>
        </div>
      </div>

      <div class="bg-white rounded-lg p-2 flex-1 flex flex-col">
        <div class="flex justify-between items-start">
          <h4 class="font-semibold text-base">{{ space.title }}</h4>
          <Badge variant="outline">
            <UsersIcon class="w-4 h-4 mr-1" />
            {{ space.capacity }}
          </Badge>
        </div>
        <p class="text-sm text-muted-foreground mb-3">
          {{
            [space.city, space.region].filter(Boolean).join(", ") ||
            "Sin ubicación"
          }}
        </p>
        <p v-if="space.address" class="text-xs text-muted-foreground mt-auto">
          {{ space.address }}
        </p>
      </div>
    </Card>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SPACE_TYPE_LABELS } from "@/constants/spaces";
import type { Space } from "@/types";
import { UsersIcon } from "lucide-vue-next";

const props = defineProps<{ space: Space }>();

const coverImage = computed(() => {
  const images = props.space.space_images;
  if (!images || images.length === 0) return null;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return sorted[0].url;
});
</script>
