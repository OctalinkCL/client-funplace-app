<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    router.push({ name: 'update-password' })
  }
})
</script>
