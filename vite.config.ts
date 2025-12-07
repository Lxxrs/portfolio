/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.webp', 'robots.txt', 'lars_memoji.webp'],
      manifest: {
        name: 'Lars M. | System Engineer',
        short_name: 'Lars M.',
        description: 'System Engineer Portfolio',
        theme_color: '#0d1117',
        icons: [
          {
            src: 'favicon.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'favicon.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
