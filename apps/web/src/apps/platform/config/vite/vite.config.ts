import { defineConfig } from 'vite'
import { baseConfig } from '../../../../config/vite.config.base'

// 平台管理系统特定的 Vite 配置
export default defineConfig({
  ...baseConfig,
  // 这里可以覆盖或添加特定于平台管理系统的配置
  server: {
    ...baseConfig.server,
    port: 3003, // 平台管理系统使用 3003 端口
  }
}) 