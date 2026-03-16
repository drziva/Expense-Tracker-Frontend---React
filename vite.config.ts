import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Expense Tracker",
        short_name: "Tracker",
        description: "The app to end all apps",
        theme_color: "#0B0F14",
        background_color: "#0B0F14",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icon-usd-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-usd-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({request}) => 
              request.destination === "script" || 
              request.destination === "style",

            handler: "CacheFirst",

            options: {
              cacheName: "static-assets",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: ({request}) => 
              request.destination === "image",
            
            handler: "CacheFirst",
            
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: ({url}) => url.port === "3000",

            handler: "NetworkFirst",

            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 5
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setupTests.ts"
  }
})
