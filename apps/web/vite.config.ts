import { defineConfig } from 'vite'
import { baseConfig } from './src/config/vite.config.base'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 根据 mode 加载对应应用目录下的配置
  const envDir = mode ? `./src/apps/${mode}/config` : undefined
  const appConfig = mode ? require(`./src/apps/${mode}/config/vite/vite.config.ts`).default : {}

  return {
    ...baseConfig,
    ...appConfig,
    envDir, // 设置环境配置文件目录
  }
})
