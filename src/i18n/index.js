import { createI18n } from "vue-i18n";
import en from "./locales/en.json" 
import ar from "./locales/ar.json" 
import { en as envuetify, ar as arvuetify } from 'vuetify/locale'

export default createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE, 
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE, 
  legacy: false,
  globalInjection: true,
  messages: {
    en: {
      $vuetify: {
        ...envuetify,
      },
      ...en
    },
    ar: {
      $vuetify: {
        ...arvuetify,
      },
      ...ar
    },
  },
  rtl: {ar: true},
})