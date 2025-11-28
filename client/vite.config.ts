import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, '../attached_assets')
    }
  },
  build: {
    outDir: 'dist',
    emptyDirBeforeWrite: true
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
