import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { resolve, dirname } from 'node:path'
//import vuetify from 'vite-plugin-vuetify'


// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    base: "/FormulaE/",
    plugins: [
      vue(),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
      })      
      //vuetify(),
    ],
    server: {
      proxy: {
        "/leaderboard": {
          target: process.env.VITE_PROXY_TARGET,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        "/items": {
          target: process.env.VITE_PROXY_TARGET,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    }
  });
}

