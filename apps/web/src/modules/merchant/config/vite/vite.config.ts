import { defineConfig } from 'vite'
import { baseConfig } from '../../../../config/vite.config.base'

// 商户后台特定的 Vite 配置
export default defineConfig({
  ...baseConfig,
  // 这里可以覆盖或添加特定于商户后台的配置
  server: {
    ...baseConfig.server,
    port: 3002, // 商户后台使用 3002 端口
  }
}) 