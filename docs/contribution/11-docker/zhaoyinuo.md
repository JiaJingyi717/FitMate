# Docker 部署贡献说明

姓名：赵一诺  
学号：2320100819  
角色：前端  
日期：2026-05-18

## 我完成的工作

### 1. Dockerfile 编写

- [x] 前端 Dockerfile（多阶段：`development` / `builder` / `production`）
- [x] 前端 `.dockerignore`（排除测试、缓存、`node_modules`）
- [x] 生产阶段 Nginx 配置 `nginx.conf`（静态资源 + `/api` 反代后端）
- [ ] 后端 Dockerfile — 由后端同学主导

### 2. Compose 配置

- [x] 开发环境 `compose.yaml`（Vite 5173、`frontend_node_modules` 匿名卷避免覆盖依赖）
- [x] 生产环境 `compose.prod.yaml`（Nginx 暴露 80，依赖后端 healthy）
- [x] 与 `vite.config.js` 代理目标统一为 `http://backend:5000`

### 3. 自动化部署

- 选择了选项 **A**：
  - `.github/workflows/docker.yml` 中 **build-frontend** job 构建 `production` 目标并推送 GHCR

## PR 链接

- \- PR #54: https://github.com/JiaJingyi717/FitMate/pull/54

## 遇到的问题和解决

1. **问题**：开发容器挂载宿主机目录后，`node_modules` 与 Linux 容器架构不一致。  
   **解决**：在 `compose.yaml` 中为 `/app/node_modules` 使用命名卷，容器内 `npm ci` 的依赖不被宿主机覆盖。

2. **问题**：生产构建时 API 地址。  
   **解决**：前端 axios 使用相对路径 `/api`，由 Nginx 反代到 `backend:5000`，构建阶段无需写死后端域名。

## AI 使用情况

- 使用 Prompt：Vue + Vite 多阶段 Dockerfile（Node 构建 + Nginx 托管）。
- AI 协助：编写 `nginx.conf`、调整 `VITE_API_BASE_URL` 与 Compose 环境变量说明。

## 心得体会

前端容器化关键是区分「开发（Vite dev server）」与「生产（build + Nginx）」两条路径。生产环境用 Nginx 统一入口后，浏览器只访问 80 端口，CORS 与代理配置更简单。与后端约定服务名 `backend` 后，Compose 网络内通信稳定，也便于和 GitHub Actions 自动构建衔接。
