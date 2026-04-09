<script setup lang="ts">
import PublicSidebar from "@/components/PublicSidebar.vue";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider :default-open="false">
    <PublicSidebar />
    <SidebarInset>
      <SidebarTrigger />
      <div class="container-wrap grow"><RouterView /></div>
    </SidebarInset>
  </SidebarProvider>
</template>
