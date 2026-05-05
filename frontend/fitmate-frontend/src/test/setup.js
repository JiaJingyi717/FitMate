// Vitest 全局 setup。
// 当前测试仅用 Vitest 内置断言与 @vue/test-utils，未使用 jest-dom 的 DOM matcher；
// 若在 setup 中加载 `@testing-library/jest-dom/vitest` 或对 matchers 做 expect.extend，
// 在部分 Windows / Vitest 4 组合下会报错：`Cannot read properties of undefined (reading 'config')`。
