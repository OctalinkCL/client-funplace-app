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
              <Badge
                class="bg-white/10 text-white/50 border-0 hover:bg-white/10"
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
              <Badge
                class="bg-white/10 text-white/50 border-0 hover:bg-white/10"
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
              <Badge
                class="bg-green-950 text-green-400 border-0 hover:bg-green-950"
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
              <Star
                v-for="i in 5"
                :key="i"
                class="size-4 fill-yellow-400 text-yellow-400"
              />
            </div>
            <p
              class="text-sm text-neutral-500 font-light leading-relaxed flex-1"
            >
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
                <p class="text-xs text-neutral-400">
                  Evento familiar · Santiago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Testimonio 2 -->
        <Card>
          <CardContent class="p-6 flex flex-col gap-4">
            <div class="flex gap-0.5">
              <Star
                v-for="i in 5"
                :key="i"
                class="size-4 fill-yellow-400 text-yellow-400"
              />
            </div>
            <p
              class="text-sm text-neutral-500 font-light leading-relaxed flex-1"
            >
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
                <p class="text-xs text-neutral-400">
                  Taller corporativo · Valparaíso
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Testimonio 3 -->
        <Card>
          <CardContent class="p-6 flex flex-col gap-4">
            <div class="flex gap-0.5">
              <Star
                v-for="i in 5"
                :key="i"
                class="size-4 fill-yellow-400 text-yellow-400"
              />
            </div>
            <p
              class="text-sm text-neutral-500 font-light leading-relaxed flex-1"
            >
              "Excelente plataforma. Sin registros complicados, solo elegí el
              espacio, llené el formulario y al día siguiente tenía
              confirmación."
            </p>
            <div class="flex items-center gap-3">
              <div
                class="size-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-950 shrink-0"
              >
                CL
              </div>
              <div>
                <p class="text-sm font-medium text-neutral-950">
                  Catalina Lara
                </p>
                <p class="text-xs text-neutral-400">
                  Lanzamiento de producto · Concepción
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
    <!-- /TESTIMONIOS -->

    <!-- ── PARA ANFITRIONES ── -->
    <section
      id="anfitriones"
      class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <!-- Izquierda: CTA -->
        <div
          class="bg-neutral-100 rounded-2xl p-10 flex flex-col justify-between gap-8"
        >
          <div>
            <p
              class="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-3"
            >
              Anfitriones
            </p>
            <h2
              class="text-3xl font-semibold tracking-tighter text-neutral-950 mb-4"
            >
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
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5"
              >01</span
            >
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">
                Control total
              </p>
              <p class="text-sm text-neutral-500 font-light">
                Tú defines los horarios, bloqueas fechas y confirmas cada
                reserva.
              </p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5"
              >02</span
            >
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">
                Sin comisiones ocultas
              </p>
              <p class="text-sm text-neutral-500 font-light">
                La plataforma es gratuita durante el lanzamiento. Sin cobros por
                reserva.
              </p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5"
              >03</span
            >
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">
                Panel de gestión
              </p>
              <p class="text-sm text-neutral-500 font-light">
                Visualiza todas tus reservas, pendientes y confirmadas, en un
                solo lugar.
              </p>
            </div>
          </div>
          <div class="py-6 flex gap-4">
            <span class="text-xs font-mono text-neutral-400 w-6 shrink-0 pt-0.5"
              >04</span
            >
            <div>
              <p class="text-sm font-semibold text-neutral-950 mb-1">
                Contacto directo
              </p>
              <p class="text-sm text-neutral-500 font-light">
                El cliente te contacta a ti. Sin intermediarios ni mensajería
                interna.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- /PARA ANFITRIONES -->

    <section>
      <div
        class="container mx-auto px-2 sm:0 grid lg:grid-cols-2 gap-9 lg:gap-20"
      >
        <Card class="shadow-none border-0 bg-gray-100">
          <CardContent class="flex flex-col gap-4">
            <Badge variant="outline" class="bg-white">Para tu negocio</Badge>
            <h3 class="text-2xl/6 lg:text-4xl font-bold">
              Tus clientes no quieren esperar tu respuesta para reservar
            </h3>
            <p>
              Ya sea tu casa de cumpleaños, tu carro de comida o tu show de
              magia — publica tu disponibilidad real en Funplace y deja que tus
              clientes reserven solos. Sin WhatsApp, sin dobles reservas, sin
              clientes perdidos.
            </p>

            <footer class="mt-auto">
              <Button class="h-10 rounded-full">Publicar mi espacio</Button>
            </footer>
          </CardContent>
        </Card>
        <ul>
          <li>ldsljldskj</li>
        </ul>
      </div>
    </section>

    <section class="pt-[90px]">
      <div class="container mx-auto px-4 sm:px-0 grid gap-12">
        <div class="grid gap-3 text-center lg:max-w-3xl lg:mx-auto">
          <h3 class="text-3xl lg:text-5xl font-bold">
            Deja de perder reservas por WhatsApp
          </h3>
          <p class="text-lg text-black/60 font-medium lg:text-xl">
            Tus clientes ven tu disponibilidad real y reservan solos. Tú solo
            confirmas.
          </p>
        </div>
        <div class="flex flex-col gap-4 lg:grid lg:grid-cols-3">
          <PlanItems
            title="Espacios"
            subtitle="Para casas de cumpleaños, salones y centros de eventos."
            price="39.990"
            :features="[
              'Página de reserva para tus clientes',
              'Calendario con disponibilidad real',
              'Bloques horarios personalizados',
              'Confirmación y cancelación manual',
              'Bloqueo de fechas específicas',
            ]"
            message="Hola, me interesa el Plan Espacios para gestionar las reservas de mi local. ¿Me pueden dar más información?"
          />
          <PlanItems
            title="Servicios"
            subtitle="Para food trucks, animadores, magos, inflables y fotógrafos."
            price="29.900"
            :features="[
              'Agenda con disponibilidad real',
              'Bloques horarios personalizados',
              'Confirmación y cancelación manual',
              'Bloqueo de fechas específicas',
              'Agendamientos ilimitados',
            ]"
            message="Hola, me interesa el Plan Servicios para gestionar mis agendamientos. ¿Me pueden dar más información?"
          />
          <PlanItems
            title="Emprendedor"
            subtitle="Para quienes tienen su espacio y además ofrecen servicios."
            price="49.900"
            :features="[
              'Espacios + servicios en una cuenta',
              'Página de reserva para cada uno',
              'Reservas y agendamientos ilimitados',
              'Oferta de todos tus servicios',
              'Soporte preferente',
            ]"
            message="Hola, me interesa el Plan Emprendedor para gestionar mi espacio y servicios. ¿Me pueden dar más información?"
          />
        </div>
      </div>
    </section>

    <section
      class="bg-linear-to-t from-violet-200 from-60% to-white pt-[120px]"
    >
      <div class="container mx-auto px-4 sm:px-0 grid gap-12">
        <div class="flex flex-col gap-5 text-center lg:max-w-3xl mx-auto">
          <h3 class="text-4xl font-bold lg:text-6xl">
            Tu próximo evento, empieza aquí
          </h3>
          <p class="text-base text-black/60 lg:text-2xl">
            Explora espacios disponibles ahora mismo en Concepción y todas las
            regiones del país.
          </p>
          <div class="flex justify-center">
            <Button
              size="lg"
              class="h-12 px-12 rounded-full bg-violet-700 hover:bg-violet-800 transition-all duration-300"
              as-child
            >
              <RouterLink :to="{ name: 'spaces-list' }"
                >Explorar espacios</RouterLink
              >
            </Button>
          </div>
        </div>
        <div>
          <img
            src="https://framerusercontent.com/images/3uvceqytCHwJDIfhFyK75EuwCys.png?width=3840&height=2223"
            alt="dashboard"
            class="rounded-t-lg"
          />
        </div>
      </div>
    </section>
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
import PlanItems from "../components/PlanItems.vue";
</script>
