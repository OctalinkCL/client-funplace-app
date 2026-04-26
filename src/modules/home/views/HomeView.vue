<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeaturedSpacesGrid from "../components/FeaturedSpacesGrid.vue";
import HeroSearch from "../components/HeroSearch.vue";
import PlanItems from "../components/PlanItems.vue";
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

    <!-- business -->
    <section class="mb-12 lg:mb-18">
      <div
        class="container-wrap flex flex-col md:flex-row gap-6 md:gap-12 md:items-start"
      >
        <div class="grid gap-4">
          <Badge variant="outline" class="font-mono">Por qué Funplace</Badge>
          <h3 class="font-heading text-3xl md:text-5xl font-semibold">
            Los clientes no quieren
            <span class="text-violet-600">esperar</span> para reservar.
          </h3>
          <p class="text-neutral-700 md:text-lg md:pr-12">
            Un 60% de los arriendos de espacios se pierden porque la respuesta
            llega tarde. Funplace resuelve eso.
          </p>
          <div>
            <Button size="lg" class="rounded-full bg-violet-600 px-12"
              >Publica tu espacio</Button
            >
          </div>
        </div>
        <div>
          <ul class="grid gap-4">
            <li class="flex gap-6 border-b pb-4">
              <h5 class="font-mono text-neutral-400">01</h5>
              <div>
                <h6 class="font-heading text-xl font-semibold">
                  Disponibilidad transparente
                </h6>
                <p class="text-neutral-600 md:text-lg">
                  Tu calendario sincronizado. Los clientes ven lo que está libre
                  sin preguntar.
                </p>
              </div>
            </li>
            <li class="flex gap-6 border-b pb-4">
              <h5 class="font-mono text-neutral-400">02</h5>
              <div>
                <h6 class="font-heading text-xl font-semibold">
                  Más visibilidad
                </h6>
                <p class="text-neutral-600 md:text-lg">
                  Tu espacio aparece en búsquedas filtradas — llega a quien
                  realmente quiere arrendar.
                </p>
              </div>
            </li>
            <li class="flex gap-6 border-b pb-4">
              <h5 class="font-mono text-neutral-400">03</h5>
              <div>
                <h6 class="font-heading text-xl font-semibold">
                  Tu confirmas, tu decides
                </h6>
                <p class="text-neutral-600 md:text-lg">
                  No hay cobros por reserva. Tú decides si aceptas o rechazas
                  cada solicitud. Nada se confirma si tú no lo apruebas.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mb-12 lg:mb-18">
      <div class="container-wrap">
        <Card class="bg-zinc-50 border-0 shadow-none">
          <CardContent class="text-center py-6 md:py-12">
            <h5 class="font-mono text-neutral-400 text-sm">Vamos por más</h5>
            <h3 class="font-heading text-3xl md:text-5xl font-semibold">
              ¿Listo para llenar tu agenda?
            </h3>
            <p class="text-neutral-700 md:text-lg mt-4">
              Crea tu perfil en minutos y empieza a recibir reservas.
            </p>
            <div
              class="flex flex-col md:flex-row gap-4 md:gap-6 justify-center pt-6 md:pt-8"
            >
              <Button size="lg" class="rounded-full bg-violet-600 px-12"
                ><a href="https://wa.me/56998433651"
                  >Hablemos por WhatsApp</a
                ></Button
              >
              <!-- <Button size="lg" class="rounded-full bg-violet-600 px-12"
                ><a href="/">Busca tu espacio</a></Button
              > -->
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <section v-if="false">
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
      v-if="false"
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
