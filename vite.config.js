import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/vueti-select/',
  plugins: [vue()],
  build: {
    outDir: 'dist'
  }
})
