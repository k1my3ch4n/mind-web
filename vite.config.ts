import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(react|react-dom|react-router-dom)\//.test(id)) return 'react-vendor'
          if (id.includes('node_modules/@xyflow')) return 'xyflow-vendor'
          if (id.includes('node_modules/@dnd-kit')) return 'dnd-kit-vendor'
        },
      },
    },
  },
})
