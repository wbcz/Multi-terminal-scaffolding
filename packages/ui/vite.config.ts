import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, mode === 'development' ? 'src/index.ts' : 'src/index.ts'),
      name: 'WbczUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd', 'styled-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          'styled-components': 'styled',
        },
      },
    },
    sourcemap: true,
    minify: mode === 'development' ? false : 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})); 