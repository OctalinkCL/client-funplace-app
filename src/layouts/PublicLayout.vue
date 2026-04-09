<script setup lang="ts">
import PublicSidebar from "@/components/PublicSidebar.vue";
import PublicHeader from "@/components/layouts/PublicHeader.vue";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider :default-open="false">
    <PublicSidebar />
    <SidebarInset>
      <PublicHeader />
      <div class="container-wrap grow"><RouterView /></div>
    </SidebarInset>
  </SidebarProvider>
</template>
