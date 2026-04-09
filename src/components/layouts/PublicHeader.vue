<script setup lang="ts">
import AppLogo from "@/components/layouts/AppLogo.vue";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@vueuse/core";
import { useAuthStore } from "@/stores/auth.store";
import { UserRoundIcon } from "lucide-vue-next";

const isMobile = useMediaQuery("(max-width: 768px)");
const store = useAuthStore();
</script>

<template>
  <header class="sticky top-0 z-50 bg-white">
    <div class="container-wrap py-4 lg:py-8">
      <nav class="flex items-center">
        <AppLogo :width="isMobile ? 100 : 150" />
        <!-- Actions -->
        <div class="flex items-center ml-auto gap-3">
          <SidebarTrigger v-if="isMobile" />

          <template v-if="!store.isAuthenticated && !isMobile">
            <Button size="lg" class="rounded-full"> Iniciar Sesión </Button>

            <Button size="icon-lg" class="rounded-full">
              <UserRoundIcon />
            </Button>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>
