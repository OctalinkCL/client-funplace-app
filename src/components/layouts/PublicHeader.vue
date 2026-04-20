<script setup lang="ts">
import AppLogo from "@/components/layouts/AppLogo.vue";
import UserAvatar from "@/components/shared/UserAvatar.vue";
import { useMediaQuery } from "@vueuse/core";
import { useAuthStore } from "@/stores/auth.store";

const isMobile = useMediaQuery("(max-width: 768px)");
const store = useAuthStore();
</script>

<template>
  <header class="sticky top-0 z-50 bg-neutral-50">
    <!-- header_top -->
    <div class="bg-yellow-300">
      <div
        class="container-wrap flex flex-col text-center gap-2 py-3 md:flex-row md:justify-between text-xs"
      >
        <span>
          You're currently on the buyer/seller platform of Anyone but seem to be
          a real estate agent
        </span>
        <a href="#" class="underline font-medium">Switch to Agent Platform</a>
      </div>
    </div>

    <!-- header_main -->
    <div>
      <div class="container-wrap py-4">
        <div class="flex items-center">
          <!-- logo -->
          <RouterLink to="/">
            <AppLogo :width="isMobile ? 100 : 150" color="black" />
          </RouterLink>
          <!-- user -->
          <div class="ml-auto">
            <RouterLink
              :to="store.isAuthenticated ? '/admin/reservas' : '/auth/login'"
              as-child
            >
              <UserAvatar :size="isMobile ? 32 : 40" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
