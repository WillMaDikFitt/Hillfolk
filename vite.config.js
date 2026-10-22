import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  // Inline PostCSS options so Vite skips filesystem config search
  // (avoids "Unexpected end of JSON input" from empty/broken config files).
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        town3d: resolve(__dirname, 'town3d.html'),
        vista: resolve(__dirname, 'vista.html'),
        world: resolve(__dirname, 'world.html'),
      },
    },
  },
})
