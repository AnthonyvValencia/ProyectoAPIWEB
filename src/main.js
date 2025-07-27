// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 👈 Aquí importas el router
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(router) // 👈 Aquí conectas el router con la app
app.mount('#app')
