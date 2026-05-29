# 云服务部署贡献说明

姓名：赵一诺  
学号：2320100819  
角色：前端  
日期：2026-05-28  

## 我完成的工作

### 1. 平台选择

- 使用平台：**阿里云轻量服务器 + Docker**
  前端由 Nginx 容器托管静态资源，后端服务通过 Docker Compose 统一管理。
- 备选说明：仓库中的 `vercel.json` 作为 Vercel 备选配置，主要适用于纯静态前端 + 外置 API 的部署方式。

### 2. 部署配置

- [x] 配置文件编写
  编写了前端生产环境 `Dockerfile`、`nginx.conf`、`.dockerignore`，并在 `compose.prod.yaml` 中配置前端服务。
- [x] 环境变量配置
  生产环境中前端 API 使用同源相对路径 `/api/...`，通过 Nginx 反向代理到后端服务 `http://backend:5000`，避免写死后端公网 IP。
- [x] 自动部署配置
  配置了 GitHub Actions 中的 `build-frontend` 任务，用于构建前端生产镜像并推送到 GHCR。

### 3. 问题解决

- 遇到的问题：线上知识库视频只显示灰色占位图。
  解决方案：检查后发现服务器前端代码包缺少 `ArticleVideoPlayer` 等相关文件，重新上传完整前端代码，并执行 `docker compose up -d --build frontend` 重新构建前端容器。
- 遇到的问题：切换侧边栏后，AI 教练对话内容丢失，只剩欢迎语。
  解决方案：增加 `coachChatStorage` 本地会话缓存，并结合 `<keep-alive>` 保持页面状态；同时提醒用户使用 Ctrl+F5 强制刷新浏览器缓存。
- 遇到的问题：生产环境中可能出现跨域问题。
  解决方案：通过 Nginx 反向代理 `/api`，使浏览器访问页面和接口保持同源，无需额外配置 CORS。
- 遇到的问题：前端构建后刷新页面出现 404。
  解决方案：在 Nginx 的 `location /` 中使用 `try_files ... /index.html`，支持 Vue Router history 模式。

## PR 链接

- PR #69: https://github.com/JiaJingyi717/FitMate/pull/69

## 在线地址

http://121.196.198.164/

测试账号：`test@example.com` / `123456`

## 心得体会

通过本次云服务部署，我更加清楚地理解了前端开发环境和生产环境的区别。开发阶段主要依靠 Vite 和本地代理，而生产环境需要先构建静态资源，再通过 Nginx 进行托管和接口转发。部署过程中，我也学习了 Docker Compose 服务通信、Nginx 反向代理、前端路由适配和浏览器缓存刷新等内容。通过解决知识库视频无法播放、AI 教练会话丢失等问题，我认识到线上部署不仅要保证代码本地可运行，还要确认服务器代码完整、镜像重新构建、线上功能真实可用。
