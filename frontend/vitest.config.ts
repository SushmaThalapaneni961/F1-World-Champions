/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/__tests__/**',
      ],
    },
  },
});
