import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'docs',
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
  },
  base: '/green-api/',
});
