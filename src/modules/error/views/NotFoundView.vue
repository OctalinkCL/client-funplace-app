<script setup lang="ts">
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="flex items-center justify-center h-dvh">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Avatar class="size-30">
            <AvatarImage
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzCJNVA_pAOtijM-kCJeo7a-SaLk2XcBOFbg&s"
              class="object-cover"
            />
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>404 - No Encontrada</EmptyTitle>
        <EmptyDescription>
          La página que estás buscando no existe. Intenta buscar lo que
          necesitas a continuación.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button class="rounded-full min-w-xs" as-child>
          <RouterLink to="/">
            <span>Regresar</span>
          </RouterLink>
        </Button>
      </EmptyContent>
    </Empty>
  </div>
</template>
