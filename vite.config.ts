import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// base relatif : fonctionne sous https://<user>.github.io/<repo>/
export default defineConfig({
  base: './',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      // les polices (woff2) doivent être précachées, sinon le titre change d'aspect hors ligne
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'] },
      manifest: { name: 'Violon cadien, jour après jour', short_name: 'Violon cadien', lang: 'fr', display: 'standalone', start_url: './', background_color: '#f6f2e8', theme_color: '#1b3a8c', icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] },
    }),
  ],
  test: { include: ['src/**/*.test.ts'] },
})
