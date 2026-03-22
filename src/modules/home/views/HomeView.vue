<template>
  <div class="min-h-screen bg-white">
    <HeroSearch />

    <!-- ── ESPACIOS DESTACADOS ── -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-red-400">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p
            class="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2"
          >
            Destacados
          </p>
          <h2 class="text-3xl font-semibold tracking-tighter text-neutral-950">
            Espacios populares
          </h2>
        </div>
        <RouterLink
          :to="{ name: 'spaces-list' }"
          class="text-sm text-neutral-500 hover:text-neutral-950 flex items-center gap-1 transition-colors"
        >
          Ver todos <ArrowRight class="size-4" />
        </RouterLink>
      </div>

      <FeaturedSpacesGrid />
    </section>
    <!-- /ESPACIOS DESTACADOS -->

    <!-- ── CÓMO FUNCIONA ── -->
    <section class="bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <p
          class="text-xs font-medium text-white/40 uppercase tracking-widest mb-3"
        >
          Proceso
        </p>
        <h2 class="text-3xl font-semibold tracking-tighter text-white mb-12">
          Reservar es simple
        </h2>

        <div
          class="grid grid-cols-1 md:grid-cols-3 border border-white/10 rounded-xl overflow-hidden"
        >
          <!-- Paso 01 -->
          <div
            class="p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-4"
          >
            <span class="text-xs font-mono text-white/30 uppercase">01</span>
            <h3 class="text-lg font-semibold text-white">Explora y elige</h3>
            <p class="text-sm text-white/60 font-light leading-relaxed">
              Filtra por ciudad, tipo y fecha. Revisa fotos, amenities y
              disponibilidad en tiempo real.
            </p>
            <div class="mt-auto">
              <Badge class="bg-white/10 text-white/50 border-0 hover:bg-white/10"
                >Explorar</Badge
              >
            </div>
          </div>

          <!-- Paso 02 -->
          <div
            class="p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-4"
          >
            <span class="text-xs font-mono text-white/30 uppercase">02</span>
            <h3 class="text-lg font-semibold text-white">Envía tu solicitud</h3>
            <p class="text-sm text-white/60 font-light leading-relaxed">
              Selecciona el bloque horario y completa el formulario. Sin
              registro, sin fricción.
            </p>
            <div class="mt-auto">
              <Badge class="bg-white/10 text-white/50 border-0 hover:bg-white/10"
                >Solicitar</Badge
              >
            </div>
          </div>

          <!-- Paso 03 -->
          <div class="p-8 flex flex-col gap-4">
            <span class="text-xs font-mono text-white/30 uppercase">03</span>
            <h3 class="text-lg font-semibold text-white">
              Coordina y confirma
            </h3>
            <p class="text-sm text-white/60 font-light leading-relaxed">
              El anfitrión te contacta para coordinar el pago. Una vez
              confirmado, el espacio es tuyo.
            </p>
            <div class="mt-auto">
              <Badge class="bg-green-950 text-green-400 border-0 hover:bg-green-950"
                >Confirmado</Badge
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- /CÓMO FUNCIONA -->

    <!-- ── TESTIMONIOS ── -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <p
        class="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-3"
      >
        Opiniones
      </p>
      <h2
        class="text-3xl font-semibold tracking-tighter text-neutral-950 mb-10"
      >
        Lo que dicen nuestros usuarios
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Testimonio 1 -->
        <Card>
          <CardContent class="p-6 flex flex-col gap-4">
            <div class="flex gap-0.5">
              <Star v-for="i in 5" :key="i" class="size-4 fill-yellow-400 text-yellow-400" />
            </div>
            <p class="text-sm text-neutral-500 font-light leading-relaxed flex-1">
              "Encontramos la casa perfecta para el cumpleaños de nuestra hija.
              El proceso fue súper fácil y el anfitrión respondió muy rápido."
            </p>
            <div class="flex items-center gap-3">
              <div
                class="size-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-950 shrink-0"
              >
                MP
              </div>
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
              "Usé Funplace para organizar un taller corporativo. La sala era
              exactamente como en las fotos y la reserva fue en minutos."
            </p>
            <div class="flex items-center gap-3">
              <div
                class="size-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-950 shrink-0"
              >
                JR
              </div>
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
              "Excelente plataforma. Sin registros complicados, solo elegí el
              espacio, llené el formulario y al día siguiente tenía confirmación."
            </p>
            <div class="flex items-center gap-3">
              <div
                class="size-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-950 shrink-0"
              >
                CL
              </div>
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
            <p class="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-3">
              Anfitriones
            </p>
            <h2 class="text-3xl font-semibold tracking-tighter text-neutral-950 mb-4">
              ¿Tienes un espacio que no usas?
            </h2>
            <p class="text-sm text-neutral-500 font-light leading-relaxed">
              Publica tu espacio en Funplace y empieza a recibir solicitudes de
              clientes que buscan exactamente lo que tú ofreces.
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
              <p class="text-sm text-neutral-500 font-light">
                Tú defines los horarios, bloqueas fechas y confirmas cada reserva.
              </p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5">02</span>
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">Sin comisiones ocultas</p>
              <p class="text-sm text-neutral-500 font-light">
                La plataforma es gratuita durante el lanzamiento. Sin cobros por reserva.
              </p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5">03</span>
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">Panel de gestión</p>
              <p class="text-sm text-neutral-500 font-light">
                Visualiza todas tus reservas, pendientes y confirmadas, en un solo lugar.
              </p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5">04</span>
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">Contacto directo</p>
              <p class="text-sm text-neutral-500 font-light">
                El cliente te contacta a ti. Sin intermediarios ni mensajería interna.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- /PARA ANFITRIONES -->

    <!-- ── CTA FINAL ── -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <h2 class="tracking-tighter mb-6 leading-tight">
        <span class="block text-4xl md:text-5xl font-semibold text-neutral-950"
          >Tu próximo evento,</span
        >
        <span class="block text-4xl md:text-5xl font-light text-neutral-400"
          >empieza aquí</span
        >
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
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Star, ArrowRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import FeaturedSpacesGrid from "../components/FeaturedSpacesGrid.vue";
import HeroSearch from "../components/HeroSearch.vue";
</script>
