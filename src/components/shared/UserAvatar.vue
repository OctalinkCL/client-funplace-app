<script setup lang="ts">
import { computed } from "vue";
import { UserRound } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const props = withDefaults(defineProps<{ size?: number }>(), { size: 32 });

const store = useAuthStore();

const avatarUrl = computed(() => store.user?.user_metadata?.avatar_url ?? null);

const initials = computed(() => {
  const name = store.profile?.full_name;
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
});
</script>

<template>
  <Avatar :style="{ width: `${props.size}px`, height: `${props.size}px` }">
    <AvatarImage
      v-if="store.isAuthenticated && avatarUrl"
      :src="avatarUrl"
      :alt="store.profile?.full_name ?? ''"
    />
    <AvatarFallback class="text-xs font-medium bg-violet-100">
      <template v-if="store.isAuthenticated">{{ initials }}</template>
      <UserRound v-else class="size-4" />
    </AvatarFallback>
  </Avatar>
</template>
