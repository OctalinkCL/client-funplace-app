import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/geist'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar sesión antes de montar
const auth = useAuthStore()
auth.initialize().then(() => {
  app.mount('#app')
})
