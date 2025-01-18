import { defineConfig, type UserConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react() as any,
    dts({
      rollupTypes: true,
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'shared',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    minify: isProd ? 'esbuild' : false,
    sourcemap: !isProd,
    rollupOptions: {
      external: ['react', 'react-dom', 'events'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          events: 'EventEmitter'
        }
      }
    }
  },
  optimizeDeps: {
    include: ['events']
  }
} as UserConfig)
