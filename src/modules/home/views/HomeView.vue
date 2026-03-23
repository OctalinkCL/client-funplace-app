<template>
  <div class="min-h-screen bg-white">
    <HeroSearch />

    <section class="lg:pb-[60px]">
      <div class="container mx-auto px-4 sm:px-0">
        <FeaturedSpacesGrid />
      </div>
    </section>

    <section class="py-15">
      <div class="container mx-auto px-4 sm:px-0">
        <Card class="shadow-none border-0 bg-black text-white">
          <CardContent class="grid gap-9">
            <h3 class="text-xl/6 lg:text-3xl font-bold">Reservar es simple</h3>
            <div class="grid gap-9 lg:grid-cols-3 lg:gap-12">
              <ProcessItem
                :icon="SearchIcon"
                title="Explora y elige"
                subtitle="Filtra por ciudad, tipo y fecha. Revisa fotos, amenities y disponibilidad en tiempo real."
                badge="Buscando.."
              />
              <ProcessItem
                :icon="SendIcon"
                title="Envía tu solicitud"
                subtitle="Selecciona el bloque horario y completa el formulario. Sin registro, sin fricción."
                badge="Reservado"
              />
              <ProcessItem
                :icon="PartyPopperIcon"
                title="Coordina y confirma"
                subtitle="El anfitrión te contacta para coordinar. Una vez confirmado, el espacio es tuyo."
                badge="Confirmado"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <section class="lg:py-[60px]">
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
import { SearchIcon, SendIcon, PartyPopperIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import FeaturedSpacesGrid from "../components/FeaturedSpacesGrid.vue";
import HeroSearch from "../components/HeroSearch.vue";
import PlanItems from "../components/PlanItems.vue";
import ProcessItem from "../components/ProcessItem.vue";
</script>
