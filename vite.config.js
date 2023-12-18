import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //vuetify(),
  ],
  server: {
    proxy: {
      "/leaderboard": {
        target: "https://if040cyo8k.execute-api.eu-central-1.amazonaws.com/",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  }  
})
