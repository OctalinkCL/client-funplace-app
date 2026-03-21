<template>
  <div class="min-h-screen bg-white">

    <!-- ── NAV ── -->
    <nav class="fixed top-0 inset-x-0 z-50 bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <!-- Logo -->
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="6" fill="#0a0a0a"/>
            <circle cx="10" cy="14" r="3" fill="white"/>
            <circle cx="18" cy="14" r="3" fill="white"/>
          </svg>
          <span class="font-semibold text-lg tracking-tight text-neutral-950">funplace</span>
        </RouterLink>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-6 text-sm text-neutral-500">
          <RouterLink :to="{ name: 'spaces-list' }" class="hover:text-neutral-950 transition-colors">Explorar</RouterLink>
          <a href="#ciudades" class="hover:text-neutral-950 transition-colors">Ciudades</a>
          <a href="#anfitriones" class="hover:text-neutral-950 transition-colors">Anfitriones</a>
        </div>

        <!-- Desktop CTAs -->
        <div class="hidden md:flex items-center gap-2">
          <Button variant="ghost" as-child>
            <RouterLink :to="{ name: 'login' }">Ingresar</RouterLink>
          </Button>
          <Button>Listar espacio</Button>
        </div>

        <!-- Mobile hamburger -->
        <button class="md:hidden p-2 text-neutral-950" @click="mobileMenuOpen = true">
          <Menu class="size-5" />
        </button>
      </div>

      <!-- Mobile overlay -->
      <div
        v-show="mobileMenuOpen"
        class="fixed inset-0 z-50 bg-white flex flex-col p-6 md:hidden"
      >
        <div class="flex items-center justify-between mb-8">
          <span class="font-semibold text-lg text-neutral-950">funplace</span>
          <button class="p-1" @click="mobileMenuOpen = false">
            <X class="size-5" />
          </button>
        </div>
        <div class="flex flex-col gap-5 text-lg text-neutral-500">
          <RouterLink :to="{ name: 'spaces-list' }" @click="mobileMenuOpen = false" class="hover:text-neutral-950">Explorar</RouterLink>
          <a href="#ciudades" @click="mobileMenuOpen = false" class="hover:text-neutral-950">Ciudades</a>
          <a href="#anfitriones" @click="mobileMenuOpen = false" class="hover:text-neutral-950">Anfitriones</a>
        </div>
        <div class="mt-auto flex flex-col gap-3">
          <Button variant="outline" as-child>
            <RouterLink :to="{ name: 'login' }" @click="mobileMenuOpen = false">Ingresar</RouterLink>
          </Button>
          <Button @click="mobileMenuOpen = false">Listar espacio</Button>
        </div>
      </div>
    </nav>
    <!-- /NAV -->


    <!-- ── HERO ── -->
    <section class="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      <!-- Pill badge -->
      <div class="flex justify-center mb-8">
        <span class="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm text-neutral-500">
          <span class="size-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          48 espacios disponibles — Santiago · Valparaíso · Concepción
        </span>
      </div>

      <!-- H1 -->
      <h1 class="text-center tracking-tighter mb-6 leading-tight">
        <span class="block text-4xl md:text-6xl font-semibold text-neutral-950">El espacio perfecto</span>
        <span class="block text-4xl md:text-6xl font-light text-neutral-400">para tu próximo evento</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-center text-lg font-light text-neutral-500 mb-10 max-w-xl mx-auto">
        Explora casas, salas y estudios disponibles para arriendo. Sin intermediarios, sin complicaciones.
      </p>

      <!-- Search box -->
      <div class="max-w-3xl mx-auto bg-white border rounded-2xl shadow-sm p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <!-- Región -->
          <Select v-model="searchRegion">
            <SelectTrigger>
              <SelectValue placeholder="Región" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="r in regions" :key="r" :value="r">{{ r }}</SelectItem>
            </SelectContent>
          </Select>
          <!-- Ciudad (deshabilitado hasta elegir región) -->
          <Select v-model="searchCity" :disabled="!searchRegion">
            <SelectTrigger>
              <SelectValue placeholder="Ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="c in citiesForRegion(searchRegion)" :key="c" :value="c">{{ c }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex justify-end">
          <Button class="gap-1" @click="handleSearch">
            Buscar <ArrowRight class="size-4" />
          </Button>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="max-w-3xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 border rounded-xl overflow-hidden">
        <div class="px-6 py-5 text-center">
          <p class="text-2xl font-semibold text-neutral-950">48</p>
          <p class="text-xs text-neutral-400 mt-0.5">Espacios activos</p>
        </div>
        <div class="px-6 py-5 text-center border-l">
          <p class="text-2xl font-semibold text-neutral-950">3</p>
          <p class="text-xs text-neutral-400 mt-0.5">Ciudades</p>
        </div>
        <div class="px-6 py-5 text-center border-t md:border-t-0 md:border-l">
          <p class="text-2xl font-semibold text-neutral-950">+200</p>
          <p class="text-xs text-neutral-400 mt-0.5">Eventos realizados</p>
        </div>
        <div class="px-6 py-5 text-center border-t md:border-t-0 border-l">
          <p class="text-2xl font-semibold text-neutral-950">&lt;4h</p>
          <p class="text-xs text-neutral-400 mt-0.5">Tiempo de respuesta</p>
        </div>
      </div>
    </section>
    <!-- /HERO -->


    <!-- ── ESPACIOS DESTACADOS ── -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">Destacados</p>
          <h2 class="text-3xl font-semibold tracking-tighter text-neutral-950">Espacios populares</h2>
        </div>
        <RouterLink
          :to="{ name: 'spaces-list' }"
          class="text-sm text-neutral-500 hover:text-neutral-950 flex items-center gap-1 transition-colors"
        >
          Ver todos <ArrowRight class="size-4" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Card 1 -->
        <Card class="overflow-hidden">
          <div class="aspect-4/3 bg-neutral-100 relative flex items-center justify-center">
            <span class="text-xs text-neutral-400 uppercase tracking-widest">Foto del espacio</span>
            <Badge class="absolute top-3 left-3 bg-green-100 text-green-700 border-0 hover:bg-green-100">Disponible</Badge>
          </div>
          <CardContent class="p-4 pb-0 space-y-1">
            <p class="text-xs font-medium text-neutral-400 uppercase tracking-widest">Santiago</p>
            <CardTitle class="text-base font-semibold">Casa Jardín Ñuñoa</CardTitle>
            <p class="text-xs text-neutral-400">Casa · Hasta 60 personas</p>
          </CardContent>
          <CardFooter class="px-4 py-4 flex items-center justify-between">
            <span class="text-sm font-medium text-neutral-950">Consultar precio</span>
            <Button size="sm" as-child>
              <RouterLink :to="{ name: 'spaces-list' }">Ver espacio</RouterLink>
            </Button>
          </CardFooter>
        </Card>

        <!-- Card 2 -->
        <Card class="overflow-hidden">
          <div class="aspect-4/3 bg-neutral-100 relative flex items-center justify-center">
            <span class="text-xs text-neutral-400 uppercase tracking-widest">Foto del espacio</span>
            <Badge class="absolute top-3 left-3 bg-amber-100 text-amber-700 border-0 hover:bg-amber-100">Pendiente conf.</Badge>
          </div>
          <CardContent class="p-4 pb-0 space-y-1">
            <p class="text-xs font-medium text-neutral-400 uppercase tracking-widest">Valparaíso</p>
            <CardTitle class="text-base font-semibold">Sala Cerro Alegre</CardTitle>
            <p class="text-xs text-neutral-400">Sala · Hasta 30 personas</p>
          </CardContent>
          <CardFooter class="px-4 py-4 flex items-center justify-between">
            <span class="text-sm font-medium text-neutral-950">Consultar precio</span>
            <Button size="sm" as-child>
              <RouterLink :to="{ name: 'spaces-list' }">Ver espacio</RouterLink>
            </Button>
          </CardFooter>
        </Card>

        <!-- Card 3 -->
        <Card class="overflow-hidden">
          <div class="aspect-4/3 bg-neutral-100 relative flex items-center justify-center">
            <span class="text-xs text-neutral-400 uppercase tracking-widest">Foto del espacio</span>
            <Badge class="absolute top-3 left-3 bg-green-100 text-green-700 border-0 hover:bg-green-100">Disponible</Badge>
          </div>
          <CardContent class="p-4 pb-0 space-y-1">
            <p class="text-xs font-medium text-neutral-400 uppercase tracking-widest">Concepción</p>
            <CardTitle class="text-base font-semibold">Estudio Biobío</CardTitle>
            <p class="text-xs text-neutral-400">Estudio · Hasta 15 personas</p>
          </CardContent>
          <CardFooter class="px-4 py-4 flex items-center justify-between">
            <span class="text-sm font-medium text-neutral-950">Consultar precio</span>
            <Button size="sm" as-child>
              <RouterLink :to="{ name: 'spaces-list' }">Ver espacio</RouterLink>
            </Button>
          </CardFooter>
        </Card>

      </div>
    </section>
    <!-- /ESPACIOS DESTACADOS -->


    <!-- ── CÓMO FUNCIONA ── -->
    <section class="bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <p class="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Proceso</p>
        <h2 class="text-3xl font-semibold tracking-tighter text-white mb-12">Reservar es simple</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 border border-white/10 rounded-xl overflow-hidden">

          <!-- Paso 01 -->
          <div class="p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-4">
            <span class="text-xs font-mono text-white/30 uppercase">01</span>
            <h3 class="text-lg font-semibold text-white">Explora y elige</h3>
            <p class="text-sm text-white/60 font-light leading-relaxed">
              Filtra por ciudad, tipo y fecha. Revisa fotos, amenities y disponibilidad en tiempo real.
            </p>
            <div class="mt-auto">
              <Badge class="bg-white/10 text-white/50 border-0 hover:bg-white/10">Explorar</Badge>
            </div>
          </div>

          <!-- Paso 02 -->
          <div class="p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-4">
            <span class="text-xs font-mono text-white/30 uppercase">02</span>
            <h3 class="text-lg font-semibold text-white">Envía tu solicitud</h3>
            <p class="text-sm text-white/60 font-light leading-relaxed">
              Selecciona el bloque horario y completa el formulario. Sin registro, sin fricción.
            </p>
            <div class="mt-auto">
              <Badge class="bg-white/10 text-white/50 border-0 hover:bg-white/10">Solicitar</Badge>
            </div>
          </div>

          <!-- Paso 03 -->
          <div class="p-8 flex flex-col gap-4">
            <span class="text-xs font-mono text-white/30 uppercase">03</span>
            <h3 class="text-lg font-semibold text-white">Coordina y confirma</h3>
            <p class="text-sm text-white/60 font-light leading-relaxed">
              El anfitrión te contacta para coordinar el pago. Una vez confirmado, el espacio es tuyo.
            </p>
            <div class="mt-auto">
              <Badge class="bg-green-950 text-green-400 border-0 hover:bg-green-950">Confirmado</Badge>
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- /CÓMO FUNCIONA -->


    <!-- ── TESTIMONIOS ── -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <p class="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-3">Opiniones</p>
      <h2 class="text-3xl font-semibold tracking-tighter text-neutral-950 mb-10">Lo que dicen nuestros usuarios</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Testimonio 1 -->
        <Card>
          <CardContent class="p-6 flex flex-col gap-4">
            <div class="flex gap-0.5">
              <Star v-for="i in 5" :key="i" class="size-4 fill-yellow-400 text-yellow-400" />
            </div>
            <p class="text-sm text-neutral-500 font-light leading-relaxed flex-1">
              "Encontramos la casa perfecta para el cumpleaños de nuestra hija. El proceso fue súper fácil y el anfitrión respondió muy rápido."
            </p>
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-950 shrink-0">MP</div>
              <div>
                <p class="text-sm font-medium text-neutral-950">María Paula</p>
                <p class="text-xs text-neutral-400">Evento familiar · Santiago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Testimonio 2 -->
        <Card>
          <CardContent class="p-6 flex flex-col gap-4">
            <div class="flex gap-0.5">
              <Star v-for="i in 5" :key="i" class="size-4 fill-yellow-400 text-yellow-400" />
            </div>
            <p class="text-sm text-neutral-500 font-light leading-relaxed flex-1">
              "Usé Funplace para organizar un taller corporativo. La sala era exactamente como en las fotos y la reserva fue en minutos."
            </p>
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-950 shrink-0">JR</div>
              <div>
                <p class="text-sm font-medium text-neutral-950">Jorge Rivas</p>
                <p class="text-xs text-neutral-400">Taller corporativo · Valparaíso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Testimonio 3 -->
        <Card>
          <CardContent class="p-6 flex flex-col gap-4">
            <div class="flex gap-0.5">
              <Star v-for="i in 5" :key="i" class="size-4 fill-yellow-400 text-yellow-400" />
            </div>
            <p class="text-sm text-neutral-500 font-light leading-relaxed flex-1">
              "Excelente plataforma. Sin registros complicados, solo elegí el espacio, llené el formulario y al día siguiente tenía confirmación."
            </p>
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-950 shrink-0">CL</div>
              <div>
                <p class="text-sm font-medium text-neutral-950">Catalina Lara</p>
                <p class="text-xs text-neutral-400">Lanzamiento de producto · Concepción</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
    <!-- /TESTIMONIOS -->


    <!-- ── PARA ANFITRIONES ── -->
    <section id="anfitriones" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

        <!-- Izquierda: CTA -->
        <div class="bg-neutral-100 rounded-2xl p-10 flex flex-col justify-between gap-8">
          <div>
            <p class="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-3">Anfitriones</p>
            <h2 class="text-3xl font-semibold tracking-tighter text-neutral-950 mb-4">¿Tienes un espacio que no usas?</h2>
            <p class="text-sm text-neutral-500 font-light leading-relaxed">
              Publica tu espacio en Funplace y empieza a recibir solicitudes de clientes que buscan exactamente lo que tú ofreces.
            </p>
          </div>
          <div>
            <Button>Publicar mi espacio</Button>
          </div>
        </div>

        <!-- Derecha: beneficios -->
        <div class="flex flex-col divide-y">
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5">01</span>
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">Control total</p>
              <p class="text-sm text-neutral-500 font-light">Tú defines los horarios, bloqueas fechas y confirmas cada reserva.</p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5">02</span>
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">Sin comisiones ocultas</p>
              <p class="text-sm text-neutral-500 font-light">La plataforma es gratuita durante el lanzamiento. Sin cobros por reserva.</p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5">03</span>
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">Panel de gestión</p>
              <p class="text-sm text-neutral-500 font-light">Visualiza todas tus reservas, pendientes y confirmadas, en un solo lugar.</p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5">04</span>
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">Contacto directo</p>
              <p class="text-sm text-neutral-500 font-light">El cliente te contacta a ti. Sin intermediarios ni mensajería interna.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
    <!-- /PARA ANFITRIONES -->


    <!-- ── CTA FINAL ── -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <h2 class="tracking-tighter mb-6 leading-tight">
        <span class="block text-4xl md:text-5xl font-semibold text-neutral-950">Tu próximo evento,</span>
        <span class="block text-4xl md:text-5xl font-light text-neutral-400">empieza aquí</span>
      </h2>
      <p class="text-base text-neutral-500 font-light mb-8 max-w-md mx-auto">
        Explora espacios disponibles ahora mismo en Santiago, Valparaíso y Concepción.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" as-child>
          <RouterLink :to="{ name: 'spaces-list' }">Explorar espacios</RouterLink>
        </Button>
        <Button size="lg" variant="outline">Listar mi espacio</Button>
      </div>
    </section>
    <!-- /CTA FINAL -->


    <!-- ── FOOTER ── -->
    <footer class="border-t px-4 sm:px-6 lg:px-8 py-6">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="6" fill="#0a0a0a"/>
            <circle cx="10" cy="14" r="3" fill="white"/>
            <circle cx="18" cy="14" r="3" fill="white"/>
          </svg>
          <span class="font-semibold text-sm text-neutral-950">funplace</span>
        </RouterLink>
        <div class="flex items-center gap-4 text-xs text-neutral-400">
          <a href="#" class="hover:text-neutral-950 transition-colors">Privacidad</a>
          <a href="#" class="hover:text-neutral-950 transition-colors">Términos</a>
          <span>© 2026 Funplace</span>
        </div>
      </div>
    </footer>
    <!-- /FOOTER -->

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Menu, X, Star, ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useLocationFilters } from '@/modules/spaces/composables/useLocationFilters'

const router = useRouter()
const { regions, citiesForRegion, fetchLocations } = useLocationFilters()

const mobileMenuOpen = ref(false)
const searchRegion = ref('')
const searchCity = ref('')

// Resetear ciudad al cambiar región
watch(searchRegion, () => { searchCity.value = '' })

onMounted(fetchLocations)

function handleSearch() {
  const query: Record<string, string> = {}
  if (searchRegion.value) query.region = searchRegion.value
  if (searchCity.value) query.city = searchCity.value
  router.push({ name: 'spaces-list', query })
}
</script>
