import { realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

/** Windows：cwd 盘符小写（如 c:\）与 Vite 解析出的大写（C:\）会混用，导致重复加载 @vitest/runner，runner 未初始化 */
function normalizeFsPath(p) {
  try {
    return realpathSync.native(p)
  } catch {
    try {
      return realpathSync(p)
    } catch {
      return p
    }
  }
}

const root = normalizeFsPath(path.dirname(fileURLToPath(import.meta.url)))

/**
 * 单独的配置文件（npm run test 已指定 --config）。
 * 勿对 vitest / @vitest/runner 做整包 alias（会破坏 vitest/node 等子路径导出，仍可能加载双份 runner）。
 * Windows 盘符问题：须通过 scripts/run-vitest.mjs 启动（先 chdir 再 spawn Vitest）；见 vitest#5251
 */
export default defineConfig({
  root,
  plugins: [vue()],
  ssr: {
    noExternal: [/^@vitest\//, 'vitest'],
  },
  resolve: {
    dedupe: ['vue', 'vue-router', 'vitest', '@vitest/runner'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    root,
    server: {
      deps: {
        inline: true,
      },
    },
    isolate: false,
    pool: 'forks',
    maxWorkers: 1,
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: ['src/mocks/**', 'src/test/**', '**/*.d.ts'],
    },
  },
})
