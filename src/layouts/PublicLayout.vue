<template>
  <div class="min-h-screen flex flex-col">
    <header v-if="$route.name !== 'home'" class="border-b px-6 py-4 flex items-center justify-between">
      <RouterLink to="/" class="font-semibold text-lg">Funplace</RouterLink>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer v-if="$route.name !== 'home'" class="border-t px-6 py-4 text-sm text-muted-foreground text-center">
      © {{ new Date().getFullYear() }} Funplace
    </footer>
  </div>
</template>
