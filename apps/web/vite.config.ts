import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../../packages/shared/src'),
      '@api': resolve(__dirname, '../../packages/api/src'),
      '@utils': resolve(__dirname, '../../packages/utils/src'),
      '@ui': resolve(__dirname, '../../packages/ui/src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        admin: resolve(__dirname, 'src/apps/admin/index.html'),
        merchant: resolve(__dirname, 'src/apps/merchant/index.html'),
        platform: resolve(__dirname, 'src/apps/platform/index.html')
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
