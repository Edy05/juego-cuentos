import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza la app automáticamente cuando hay cambios
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Cuentos Mágicos',
        short_name: 'Cuentos',
        description: 'Un juego interactivo para descubrir el mundo de los cuentos',
        theme_color: '#8b5cf6', // Color morado (coincide con Tailwind purple-500)
        background_color: '#ffffff',
        display: 'standalone', // Hace que se vea como una app nativa, sin barra del navegador
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Necesario para que Android lo trate como app instalable
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true // Limpia cachés viejas para no llenar el dispositivo
      },
      devOptions: {
        enabled: true // Permite probar que la PWA funciona incluso en modo desarrollo (npm run dev)
      }
    })
  ]
})