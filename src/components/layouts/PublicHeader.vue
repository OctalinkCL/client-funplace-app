<script setup lang="ts">
import AppLogo from "@/components/layouts/AppLogo.vue";
import { useMediaQuery } from "@vueuse/core";
import { useAuthStore } from "@/stores/auth.store";
import { UserRoundIcon } from "lucide-vue-next";

// ComponentsUI
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            <Avatar v-if="store.isAuthenticated" as-child>
              <RouterLink to="/admin/reservas">
                <AvatarImage src="https://github.com/radix-ui.png" />
                <AvatarFallback>CN</AvatarFallback>
              </RouterLink>
            </Avatar>
            <Button v-else class="rounded-full" as-child>
              <RouterLink to="/auth/login">Inciar Sesión</RouterLink>
            </Button>
          </div>
        </div>

        {{ store.user }}
      </div>
    </div>
  </header>
</template>
