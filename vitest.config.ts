import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react() as any],
  test: {
    environment: 'jsdom',
    include: [
      'src/**/*.property.test.ts',
      'src/**/*.unit.test.ts',
      'src/**/*.property.test.tsx',
      'src/**/*.unit.test.tsx',
    ],
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
