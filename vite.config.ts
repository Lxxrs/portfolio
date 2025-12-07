import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Changed from @vitejs/plugin-react
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(), // Vue plugin handles .vue files
    tailwindcss(),
  ],
})
