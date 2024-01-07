import { createApp } from 'vue'

import App from './App.vue'
import { createPinia } from 'pinia'
import i18n from "./i18n"
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { useI18n } from 'vue-i18n'

import 'vuetify/styles'
import './style.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import "@mdi/font/css/materialdesignicons.css"

const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
  locale: { //
    adapter: createVueI18nAdapter({ i18n, useI18n }), //
  }, //
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

createApp(App).use(pinia).use(i18n).use(vuetify).mount('#app')
