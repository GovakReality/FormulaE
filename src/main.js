import { createApp } from 'vue'

import App from './App.vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import './style.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },  
});

createApp(App).use(pinia).use(vuetify).mount('#app')
