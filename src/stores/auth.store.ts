import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

let _initPromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin' || profile.value?.role === 'superadmin')
  const isSuperAdmin = computed(() => profile.value?.role === 'superadmin')

  function initialize() {
    if (!_initPromise) {
      _initPromise = (async () => {
        const { data: { session } } = await supabase.auth.getSession()
        user.value = session?.user ?? null
        if (user.value) await fetchProfile()

        supabase.auth.onAuthStateChange(async (_event, session) => {
          user.value = session?.user ?? null
          if (session?.user && !profile.value) await fetchProfile()
          if (!session?.user) profile.value = null
        })
      })()
    }
    return _initPromise
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      user.value = data.user
      await fetchProfile()
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
    _initPromise = null // permitir re-inicialización tras logout
  }

  async function fetchProfile() {
    if (!user.value) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    if (!error) profile.value = data
  }

  return { user, profile, loading, isAuthenticated, isAdmin, isSuperAdmin, initialize, login, logout, fetchProfile }
})
