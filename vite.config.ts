import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

import { dependencies } from './package.json'

function renderChunks(deps: Record<string, string>) {
  const chunks = {}
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return
    if (key.includes('firebase')) {
      if (!Object.keys(chunks).includes('firebase')) {
        chunks['firebase/firestore'] = ['firebase/firestore']
        chunks['firebase/app'] = ['firebase/app']
        chunks['firebase/auth'] = ['firebase/auth']
      }
      return
    }
    chunks[key] = [key]
  })
  return chunks
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [
    react(),
    svgrPlugin(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['/assets/**/*.svg', '/assets/**/*.png', '/assets/**/*.ttf'],
      manifest: {
        name: 'Planner',
        short_name: 'Planner',
        icons: [
          {
            src: './assets/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: './assets/pwa-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: './assets/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: '#5AC596',
        background_color: '#ffffff',
        display: 'standalone',
        description: 'Planner',
        screenshots: [
          {
            src: './assets/screenshots/1.png',
            sizes: '375x712',
            type: 'image/png',
          },
          {
            src: './assets/screenshots/2.png',
            sizes: '375x712',
            type: 'image/png',
          },
          {
            src: './assets/screenshots/3.png',
            sizes: '375x712',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
