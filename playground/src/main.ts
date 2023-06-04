import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { piniaGeneric } from 'generic-plugin'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaGeneric)
app.use(pinia)
app.mount('#app')
