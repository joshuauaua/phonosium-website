import { defineConfig } from 'vite-plus'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    exclude: ['node_modules', 'dist', 'api'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: ['node_modules/', 'src/test/', '*.config.js', 'dist/', 'api/'],
    },
  },
  fmt: {
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
    tabWidth: 2,
    printWidth: 80,
    arrowParens: 'avoid',
  },
})
