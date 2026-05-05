/**
 * 统一入口：Node 版本检查 + Windows cwd 规范化 + 在同一进程中 spawn Vitest。
 *
 * 重要：不能用 `node ensure-test-node.mjs && vitest`，子进程里的 chdir 不会保留到 vitest 进程，
 * Windows 仍会用 c:\\ 与 C:\\ 混用路径，导致 @vitest/runner 双份、describe 报 reading 'config'。
 * 参见：https://github.com/vitest-dev/vitest/issues/5251
 */
import { spawnSync } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import path from 'node:path'
import { chdir, cwd } from 'node:process'
function normalizeWindowsProjectRoot() {
  if (process.platform !== 'win32') {
    return
  }
  let base = cwd()
  try {
    base = realpathSync.native(base)
  } catch {
    try {
      base = realpathSync(base)
    } catch {
      base = path.resolve(base)
    }
  }
  if (/^[a-z]:/.test(base)) {
    base = base[0].toUpperCase() + base.slice(1)
  }
  try {
    chdir(base)
  } catch {
    /* 保持原 cwd */
  }
}

normalizeWindowsProjectRoot()

const major = Number.parseInt(process.versions.node.split('.')[0], 10)

if (Number.isNaN(major) || major < 18) {
  console.error(`[fitmate-frontend] 需要 Node 18 及以上，当前为 ${process.version}`)
  process.exit(1)
}

if (major >= 24) {
  console.error(
    `[fitmate-frontend] 当前 Node 为 ${process.version}。\n` +
      '在本环境下 Vitest 容易出现「Cannot read properties of undefined (reading \'config\')」（堆栈指向 describe）。\n' +
      '请改用 Node 20 或 22 LTS（与 CI / package.json engines 一致），例如：\n' +
      '  · 若已安装 nvm-windows：在项目目录执行 nvm install 20 && nvm use 20\n' +
      '  · 或安装 https://nodejs.org 的 20.x / 22.x LTS，再执行 npm ci && npm run test\n'
  )
  process.exit(1)
}

const projectRoot = cwd()
const vitestCli = path.join(projectRoot, 'node_modules', 'vitest', 'vitest.mjs')

if (!existsSync(vitestCli)) {
  console.error(`[fitmate-frontend] 未找到 ${vitestCli}，请先在此目录执行 npm ci`)
  process.exit(1)
}

const forwarded = process.argv.slice(2)
const vitestArgs = forwarded.length > 0 ? forwarded : ['run', '--config', 'vitest.config.js']

const result = spawnSync(process.execPath, [vitestCli, ...vitestArgs], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: process.env,
  shell: false,
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
