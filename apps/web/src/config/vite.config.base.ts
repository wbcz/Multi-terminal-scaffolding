import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// 基础配置
export const baseConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../'),
      '@eleme': path.resolve(__dirname, '../../../packages'),
    },
  },
  server: {
    host: true,
  }
}) 