/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import type { Plugin } from 'vite'

// Plugin to inject strict CSP in production build
function productionCSP(): Plugin {
  return {
    name: 'production-csp',
    apply: 'build',
    transformIndexHtml(html) {
      // Replace dev-friendly CSP with strict production CSP
      const strictCSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests;";
      
      // Replace CSP meta tag
      html = html.replace(
        /<meta http-equiv="Content-Security-Policy" content="[^"]+" \/>/,
        `<meta http-equiv="Content-Security-Policy" content="${strictCSP}" />`
      );
      
      // Re-add strict Cross-Origin policies for production
      const crossOriginHeaders = `
    <!-- Cross-Origin Policies: Protection against speculative side-channel attacks -->
    <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin" />
    <meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp" />
    <meta http-equiv="Cross-Origin-Resource-Policy" content="same-origin" />`;
      
      // Insert Cross-Origin headers before the comment about production
      html = html.replace(
        /<!-- Note: Cross-Origin policies removed for development\. Add back in production deployment via server headers\. -->/,
        crossOriginHeaders
      );
      
      return html;
    }
  };
}

export default defineConfig({
  base: '/portfolio/',
  plugins: [
    vue(),
    tailwindcss(),
    productionCSP(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.webp', 'robots.txt', 'lars_memoji.webp', 'icons/*.svg'],
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
