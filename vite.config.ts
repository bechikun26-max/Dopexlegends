import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  server: {
    // SPAフォールバック: /bo などのパスでもindex.htmlを返す（Vite devサーバーはデフォルトで対応）
  },
})
