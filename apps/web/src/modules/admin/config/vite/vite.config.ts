import { defineConfig } from 'vite'
import { baseConfig } from '../../../../config/vite.config.base'
import { resolve } from 'path'
import fs from 'fs'

// 管理后台特定的 Vite 配置
export default defineConfig({
  ...baseConfig,
  base: './',
  root: resolve(__dirname, '../..'),
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    outDir: resolve(__dirname, '../../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, '../../index.html')
      },
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
    host: 'admin.eleme.local',
    port: 443, // HTTPS 默认端口
    strictPort: true, // 端口被占用时不会自动尝试下一个可用端口
    open: true,
    https: {
      key: fs.readFileSync(resolve(__dirname, '../ssl/key.pem')),
      cert: fs.readFileSync(resolve(__dirname, '../ssl/cert.pem'))
    }
  }
}) 