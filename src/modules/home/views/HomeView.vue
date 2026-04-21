<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import FeaturedSpacesGrid from "../components/FeaturedSpacesGrid.vue";
import HeroSearch from "../components/HeroSearch.vue";
</script>

<template>
  <div id="page-home">
    <!-- hero -->
    <section
      class="bg-zinc-50 flex items-center pt-6 pb-12 | md:pt-12 md:pb-24"
    >
      <div class="grid gap-6 mx-auto px-4 md:max-w-4xl md:gap-9">
        <!-- tag_title_subtitle -->
        <div class="flex flex-col items-center text-center gap-3 lg:gap-6">
          <Badge class="bg-white text-black px-1 lg:text-base">
            <Badge class="bg-lime-300 text-black lg:text-sm">Nuevo</Badge>
            <span class="pl-2 pr-2">Haz crecer tu negocio</span>
          </Badge>
          <h3 class="font-heading text-4xl font-semibold | lg:text-7xl">
            El lugar perfecto para cada cumpleaños
          </h3>
          <p class="text-neutral-500 text-md | lg:text-xl lg:px-18">
            Encuentra el lugar ideal para tu fiesta, evento o celebración. Desde
            salones de cumpleaños hasta espacios para eventos corporativos,
            tenemos opciones para todos los gustos y necesidades.
          </p>
        </div>
        <!-- finder -->
        <HeroSearch />
      </div>
    </section>

    <!-- featured_spaces -->
    <section class="py-12 lg:pt-18">
      <div class="container-wrap grid gap-4 lg:gap-6">
        <header>
          <p class="text-sm font-medium text-violet-700 lg:text-base">
            Partamos por algo
          </p>
          <h3 class="font-heading text-2xl font-semibold lg:text-3xl">
            Los más destacados
          </h3>
        </header>
        <FeaturedSpacesGrid />
      </div>
    </section>

    <!-- process_items -->
    <section class="mb-12 lg:mb-18">
      <div class="container-wrap">
        <Card class="shadow-none border-0 bg-black text-white">
          <CardContent>
            <!-- top -->
            <header
              class="grid gap-2 border-b border-neutral-700 pb-4 md:pb-8 md:pt-6"
            >
              <Badge
                variant="outline"
                class="border-neutral-700 text-neutral-300 font-mono"
                >Así Funciona</Badge
              >
              <h3 class="font-heading text-2xl md:text-5xl">
                Reservar es
                <span class="text-violet-600 font-semibold">Fun</span>
              </h3>
            </header>
            <!-- items -->
            <ul
              class="grid md:grid-cols-3 pt-4 md:pt-12 gap-6 md:gap-12 pb-6 md:pb-12"
            >
              <li class="grid gap-2">
                <p class="font-mono text-xs text-violet-300 font-medium">
                  01 / ELIGE
                </p>
                <h5 class="font-heading font-semibold text-2xl">
                  Explora solo donde te interesa.
                </h5>
                <p class="text-neutral-400">
                  Ubicación, capacidad, facilidades. Solo lo que nos importa
                  para encontrar el lugar perfecto.
                </p>
              </li>
              <li class="grid gap-2">
                <p class="font-mono text-xs text-violet-300 font-medium">
                  02 / RESERVA
                </p>
                <h5 class="font-heading font-semibold text-2xl">
                  Ves la disponibilidad real.
                </h5>
                <p class="text-neutral-400">
                  Calendario actualizado. Si está verde, está disponible. Sin
                  sorpresas.
                </p>
              </li>
              <li class="grid gap-2">
                <p class="font-mono text-xs text-violet-300 font-medium">
                  03 / DISFRUTA
                </p>
                <h5 class="font-heading font-semibold text-2xl">
                  La fiesta es tuya.
                </h5>
                <p class="text-neutral-400">
                  Reserva inmediata, el lugar recibe notificación y te
                  contactará. Sin complicaciones.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>

    <section>
      <div
        class="container mx-auto px-4 sm:px-0 grid lg:grid-cols-2 gap-9 lg:gap-20"
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
          </CardContent>
        </Card>
        <ul class="grid gap-6">
          <li class="flex gap-5 items-start">
            <div
              class="bg-gray-200 rounded size-9 flex items-center justify-center shrink-0"
            >
              <span class="text-base font-semibold">01</span>
            </div>
            <div class="grid gap-1">
              <h6 class="text-lg font-semibold">
                Disponibilidad en tiempo real
              </h6>
              <p class="text-neutral-500 font-medium">
                Tus clientes ven qué fechas y horarios están libres. Sin
                preguntar, sin esperar respuesta.
              </p>
            </div>
          </li>
          <li class="flex gap-5 items-start">
            <div
              class="bg-gray-200 rounded size-9 flex items-center justify-center shrink-0"
            >
              <span class="text-base font-semibold">02</span>
            </div>
            <div class="grid gap-1">
              <h6 class="text-lg font-semibold">Evita dobles reservas</h6>
              <p class="text-neutral-500 font-medium">
                Cuando alguien reserva un bloque, se bloquea automáticamente
                para todos los demás.
              </p>
            </div>
          </li>
          <li class="flex gap-5 items-start">
            <div
              class="bg-gray-200 rounded size-9 flex items-center justify-center shrink-0"
            >
              <span class="text-base font-semibold">03</span>
            </div>
            <div class="grid gap-1">
              <h6 class="text-lg font-semibold">Tú confirmas, tú decides</h6>
              <p class="text-neutral-500 font-medium">
                Cada solicitud pasa por ti antes de hacerse efectiva. Nada se
                agenda sin tu aprobación.
              </p>
            </div>
          </li>
          <li class="flex gap-5 items-start">
            <div
              class="bg-gray-200 rounded size-9 flex items-center justify-center shrink-0"
            >
              <span class="text-base font-semibold">04</span>
            </div>
            <div class="grid gap-1">
              <h6 class="text-lg font-semibold">
                Un link profesional, no un chat
              </h6>
              <p class="text-neutral-500 font-medium">
                Tus clientes reservan en 30 segundos desde un link que puedes
                compartir en cualquier red social.
              </p>
            </div>
          </li>
          <li class="flex gap-5 items-start">
            <div
              class="bg-gray-200 rounded size-9 flex items-center justify-center shrink-0"
            >
              <span class="text-base font-semibold">05</span>
            </div>
            <div class="grid gap-1">
              <h6 class="text-lg font-semibold">Cliente siempre informado</h6>
              <p class="text-neutral-500 font-medium">
                Recibe una notificación por correo con cada actualización de su
                reserva. Sin tener que preguntar "¿me confirmaron?"
              </p>
            </div>
          </li>
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
        </div>
        <div>
          <img
            src="https://images.pexels.com/photos/7100331/pexels-photo-7100331.jpeg"
            alt="dashboard"
            class="rounded-t-lg"
          />
        </div>
      </div>
    </section>
  </div>
</template>
