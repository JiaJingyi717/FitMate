import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

  return {
    plugins: [vue()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        reportsDirectory: './coverage',
        exclude: [
          'src/mocks/**',
          'src/test/**',
          '**/*.d.ts',
        ],
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          // 开发环境代理到后端（可通过 VITE_API_BASE_URL 覆盖）
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
