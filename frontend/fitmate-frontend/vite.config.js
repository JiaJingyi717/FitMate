import vue from '@vitejs/plugin-vue'
import { loadEnv } from 'vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/（开发 / 构建；单元测试请使用 vitest.config.js）
export default defineConfig(({ mode }) => {
  const resolvedMode = mode || process.env.NODE_ENV || 'development'
  const env = loadEnv(resolvedMode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

  return {
    plugins: [vue()],
    resolve: {
      dedupe: ['vue', 'vue-router'],
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
