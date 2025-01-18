import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

interface ConfigEnv {
  mode: string
}

export default ({ mode }: ConfigEnv) => {
  const envDir = mode ? resolve(__dirname, `./src/modules/${mode}/config`) : undefined
  const appConfig = mode ? require(`./src/modules/${mode}/config/vite/vite.config.ts`).default : {}

  return defineConfig({
    ...appConfig,
    plugins: [react()],
    envDir,
    envPrefix: 'VITE_',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  })
}
