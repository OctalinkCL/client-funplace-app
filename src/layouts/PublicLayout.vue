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
      <div class="grow"><RouterView /></div>

      <footer class="bg-zinc-800 py-12">
        <div class="container-wrap">
          <p class="text-white text-xs md:text-sm text-center">
            © 2026 Funplace. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </SidebarInset>
  </SidebarProvider>
</template>
