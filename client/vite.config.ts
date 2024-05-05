import react from '@vitejs/plugin-react'
import Unfonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      custom: {
        families: [
          {
            name: 'Geist',
            src: './src/assets/fonts/geist/*.woff2',
          },
        ],
      },
    }),
  ],
})
