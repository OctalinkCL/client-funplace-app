<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import AppHeader from "@/components/AppHeader.vue";
import { useMediaQuery } from "@vueuse/core";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const isMobile = useMediaQuery("(max-width: 768px)");
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader v-if="isMobile" />
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
