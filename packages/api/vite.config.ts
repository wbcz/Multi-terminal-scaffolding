import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, mode === 'development' ? 'src/index.ts' : 'src/index.ts'),
      name: 'ElemeApi',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'js'}`,
    },
    target: 'es2020',
    rollupOptions: {
      external: ['@eleme/types', '@eleme/utils'],
      output: {
        globals: {
          '@eleme/types': 'ElemeTypes',
          '@eleme/utils': 'ElemeUtils'
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