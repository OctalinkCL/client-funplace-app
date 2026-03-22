<template>
  <SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset>
      <AppHeader />
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import AppHeader from "@/components/AppHeader.vue";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
</script>
