<script setup lang="ts">
import AppLogo from "@/components/layouts/AppLogo.vue";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMediaQuery } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 768px)");
</script>

<template>
  <header>
    <div class="container-wrap">
      <nav class="flex items-center">
        <AppLogo :width="isMobile ? 100 : 150" />
        <SidebarTrigger v-if="isMobile" />
      </nav>
    </div>
  </header>
</template>
