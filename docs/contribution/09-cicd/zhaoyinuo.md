# CI/CD 配置贡献说明

姓名：赵一诺

学号：2320100819

角色：前端

日期：2026-05-05

## 完成的工作

### 工作流

- [x] 参与编写 / 审查 `.github/workflows/ci.yml`（**frontend** job：`npm ci`、`npm run lint`、`npm run test:coverage`、生成 `coverage/lcov.info`）
- [x] 核对 Codecov **前端**覆盖率上传（工作流中复制为 `frontend-lcov.info`、`flags: frontend`）
- [x] 协作维护 `README.md` 顶部 **CI**、**Frontend Coverage** 等状态徽章

### 代码适配

- [x] 本地命令与 CI 一致：在 `frontend/fitmate-frontend` 执行 `npm run lint`、`npm run test`；需要覆盖率时使用 `npm run test:coverage` 生成 **`coverage/lcov.info`**
- [x] 前端 **ESLint** 检查通过（与 CI「ESLint」步骤一致）
- [x] **Vitest** 全量测试通过，覆盖率可生成并供 Codecov 使用（前端徽章约 71%）

### 可选项

- [ ] 配置 Dependabot 自动更新依赖
- [ ] 集成 CodeRabbit AI 代码审查
- [ ] 使用 act 本地验证工作流

## PR 链接

- PR #39: https://github.com/JiaJingyi717/FitMate/pull/39

   PR #43:https://github.com/JiaJingyi717/FitMate/pull/43

## CI 运行链接

- 合并与工作流总览：<https://github.com/JiaJingyi717/FitMate/actions>

## 遇到的问题和解决

1. **问题**：
    windows 环境下执行 `npm run test` 报错：
    `cannot read properties of undefined (reading 'config')`，堆栈指向 `describe`。

   **解决**：
    问题原因是执行链 `node ensure-test-node.mjs && vitest` 中，子进程的 `chdir` 无法传递到后续进程，同时存在路径盘符混用问题，导致 vitest 加载了双份 runner。
    通过编写 `run-vitest.mjs`，在脚本内部统一规范 `cwd`，并使用 `spawnSync` 启动 vitest；同时配合**统一大写盘符**与 `realpath` 策略，解决路径冲突问题。

2. **问题**：
    文档示例使用 jest 的 `--ci` 参数，但项目实际使用的是 **vitest**，存在不一致。

   **解决**：
    以 `package.json` 中定义的 `test` 和 `test:coverage` 命令为准，确保测试命令为**非交互模式**，并与 ci 中执行的 `npm run test:coverage` 保持一致，从而保证本地与 ci 行为统一。

## 心得体会

​	本次参与前端 CI，最大的收获是：同一套命令在本地（尤其是 Windows）与 GitHub Actions（Linux）下行为可能不一致，必须在文档和脚本里写清楚入口命令（如 `npm run test`、`test:coverage`），避免组员各自用 `npx vitest` 绕过封装导致环境问题难以复现。

​	排查 Vitest 在 Windows 上的报错时，我认识到 Shell 里 `&&` 串联多个 Node 进程时，`chdir` 不会继承，这类细节只有对照官方 issue 和日志才能定位；写成 `run-vitest.mjs` 统一 spawn 后，团队不再需要记忆盘符或路径技巧。

​	此外，ESLint、Vitest 与 Codecov 串联后，每次 PR 都能看到前端覆盖率变化，促使我们在改组件时顺手维护测试。CI/CD 把「质量门槛」前移，减少了合并后再救火的情况。
