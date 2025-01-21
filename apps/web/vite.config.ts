import { defineConfig, UserConfig, ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default ({ mode }: ConfigEnv): UserConfig => {
  const envDir = mode ? resolve(__dirname, `./src/modules/${mode}/config`) : undefined
  const appConfig = mode ? require(`./src/modules/${mode}/config/vite/vite.config.ts`).default : {}

  return defineConfig({
    ...appConfig,
    plugins: [react()],
    envDir,
    envPrefix: 'VITE_',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@wbcz/api': resolve(__dirname, '../../packages/api/src'),
        '@wbcz/types': resolve(__dirname, '../../packages/types/src'),
        '@wbcz/utils': resolve(__dirname, '../../packages/utils/src'),
        '@wbcz/ui': resolve(__dirname, '../../packages/ui/src')
      }
    }
  })
}
