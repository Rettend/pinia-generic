import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaGeneric } from '../../src'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

pinia.use(PiniaGeneric)
app.use(pinia)
app.mount('#app')
