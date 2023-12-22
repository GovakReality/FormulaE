import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
//import vuetify from 'vite-plugin-vuetify'


// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    base: '/FormulaE/',
    plugins: [
      vue(),
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

