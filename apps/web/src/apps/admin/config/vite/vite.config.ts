import { defineConfig } from 'vite'
import { baseConfig } from '../../../../config/vite.config.base'
import { resolve } from 'path'

// 管理后台特定的 Vite 配置
export default defineConfig({
  ...baseConfig,
  base: './',
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    outDir: resolve(__dirname, '../../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, '../../index.html'),
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
          'mobx-vendor': ['mobx', 'mobx-react-lite']
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  server: {
    ...baseConfig.server,
    port: 3001,
  }
}) 