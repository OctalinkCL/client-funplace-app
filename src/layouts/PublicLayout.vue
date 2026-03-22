<template>
  <div class="min-h-screen flex flex-col">
    <!-- ── NAV ── -->
    <nav
      class="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
      :class="scrolled ? 'bg-white shadow-sm' : 'bg-transparent'"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <!-- Logo -->
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
          <AppLogo :height="24" :color="scrolled ? '#0a0a0a' : '#fff'" />
        </RouterLink>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-6 text-sm text-neutral-500">
          <RouterLink
            :to="{ name: 'spaces-list' }"
            class="hover:text-neutral-950 transition-colors"
            >Explorar</RouterLink
          >
          <a href="#ciudades" class="hover:text-neutral-950 transition-colors"
            >Ciudades</a
          >
          <a
            href="#anfitriones"
            class="hover:text-neutral-950 transition-colors"
            >Anfitriones</a
          >
        </div>

        <!-- Desktop CTAs -->
        <div class="hidden md:flex items-center gap-2">
          <Button variant="ghost" as-child>
            <RouterLink :to="{ name: 'login' }">Ingresar</RouterLink>
          </Button>
          <Button>Listar espacio</Button>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden p-2 text-neutral-950"
          @click="mobileMenuOpen = true"
        >
          <Menu class="size-5" />
        </button>
      </div>

      <!-- Mobile overlay -->
      <div
        v-show="mobileMenuOpen"
        class="fixed inset-0 z-50 bg-white flex flex-col p-6 md:hidden"
      >
        <div class="flex items-center justify-between mb-8">
          <AppLogo :height="20" color="#0a0a0a" />
          <button class="p-1" @click="mobileMenuOpen = false">
            <X class="size-5" />
          </button>
        </div>
        <div class="flex flex-col gap-5 text-lg text-neutral-500">
          <RouterLink
            :to="{ name: 'spaces-list' }"
            @click="mobileMenuOpen = false"
            class="hover:text-neutral-950"
            >Explorar</RouterLink
          >
          <a
            href="#ciudades"
            @click="mobileMenuOpen = false"
            class="hover:text-neutral-950"
            >Ciudades</a
          >
          <a
            href="#anfitriones"
            @click="mobileMenuOpen = false"
            class="hover:text-neutral-950"
            >Anfitriones</a
          >
        </div>
        <div class="mt-auto flex flex-col gap-3">
          <Button variant="outline" as-child>
            <RouterLink :to="{ name: 'login' }" @click="mobileMenuOpen = false"
              >Ingresar</RouterLink
            >
          </Button>
          <Button @click="mobileMenuOpen = false">Listar espacio</Button>
        </div>
      </div>
    </nav>
    <!-- /NAV -->

    <main class="flex-1">
      <RouterView />
    </main>

    <!-- ── FOOTER ── -->
    <footer class="border-t px-4 sm:px-6 lg:px-8 py-6">
      <div
        class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
          <AppLogo :height="20" color="#0a0a0a" />
        </RouterLink>
        <div class="flex items-center gap-4 text-xs text-neutral-400">
          <a href="#" class="hover:text-neutral-950 transition-colors"
            >Privacidad</a
          >
          <a href="#" class="hover:text-neutral-950 transition-colors"
            >Términos</a
          >
          <span>© 2026 Funplace</span>
        </div>
      </div>
    </footer>
    <!-- /FOOTER -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Menu, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import AppLogo from "@/components/AppLogo.vue";

const route = useRoute();
const mobileMenuOpen = ref(false);
const scrolled = ref(false);

watch(
  () => route.name,
  (name) => {
    scrolled.value = name !== "home" || window.scrollY > 40;
  },
  { immediate: true }
);

const onScroll = () => {
  if (route.name === "home") scrolled.value = window.scrollY > 40;
};

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>
