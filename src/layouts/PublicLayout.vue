<script setup lang="ts">
import PublicSidebar from "@/components/PublicSidebar.vue";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider>
    <PublicSidebar />
    <SidebarInset>
      <main>
        <SidebarTrigger />
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
