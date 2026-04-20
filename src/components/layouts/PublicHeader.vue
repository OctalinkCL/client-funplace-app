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
        class="container-wrap flex flex-col text-center gap-1 py-3 md:flex-row md:justify-between text-xs md:py-2"
      >
        <span>¿Tienes un espacio para eventos? Publícalo gratis</span>
        <a
          href="https://wa.me/56932393772?text=Hola%2C%20me%20interesa%20publicar%20mi%20espacio%20en%20Funplace"
          target="_blank"
          rel="noopener noreferrer"
          class="underline font-medium whitespace-nowrap"
          >Hablemos por WhatsApp</a
        >
      </div>
    </div>

    <!-- header_main -->
    <div>
      <div class="container-wrap py-4">
        <div class="flex items-center">
          <!-- logo -->
          <RouterLink to="/">
            <AppLogo
              :width="isMobile ? 109 : 150"
              color="var(--color-violet-700)"
            />
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
