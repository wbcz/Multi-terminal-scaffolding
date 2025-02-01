import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './main',
  server: {
    port: 3000
  },
  build: {
    outDir: '../dist/main'
  }
}); 