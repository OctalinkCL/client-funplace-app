<template>
  <div class="grid gap-4">
    <Avatar class="bg-neutral-800 rounded size-10">
      <AvatarFallback class="bg-transparent"
        ><component :is="icon"
      /></AvatarFallback>
    </Avatar>
    <div class="grid gap-2">
      <h6 class="text-xl font-semibold">{{ title }}</h6>
      <p class="text-base font-medium text-neutral-400">{{ subtitle }}</p>
      <Badge v-if="badge">{{ badge }}</Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{
  icon: LucideIcon;
  title: string;
  subtitle: string;
  badge?: string;
}>();
</script>
