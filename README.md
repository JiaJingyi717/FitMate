# FitMate——README

[![CI](https://github.com/JiaJingyi717/FitMate/actions/workflows/ci.yml/badge.svg)](https://github.com/JiaJingyi717/FitMate/actions)
[![Backend Coverage](https://codecov.io/gh/JiaJingyi717/FitMate/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/JiaJingyi717/FitMate)
[![Frontend Coverage](https://codecov.io/gh/JiaJingyi717/FitMate/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/JiaJingyi717/FitMate)

figma设计原型链接：

https://www.figma.com/design/WGetgfp2fP6v4eQRaiaXIe/FitMate%E5%8E%9F%E5%9E%8B%E8%AE%BE%E8%AE%A1?node-id=0-1&t=SiKwFAQh3FqpTKip-1

## 一、项目名称

FitMate — AI 智能健身助手

## 二、团队成员

| 姓名   | 学号       | 分工 |
| ------ | ---------- | ---- |
| 赵一诺 | 2320100819 | 前端 |
| 贾静怡 | 2323030103 | 后端 |

## 三、项目简介

​	本项目为一款**基于 Web 的智能健身辅助系统**，利用 AI 技术为用户提供个性化的运动指导与训练管理服务。系统以虚拟 AI 教练为核心交互入口，用户可以选择教练形象和性格，与 AI 教练进行互动交流，获取运动建议、解答训练疑问，并根据自身训练目标生成个性化训练计划。系统还提供健身知识库，支持分类浏览和关键词搜索，帮助用户学习动作教学和运动技巧。同时，系统会对用户训练数据进行统计分析，通过图表展示训练时长、运动项目分布和完成情况，使用户能够直观了解自己的运动状态。AI 教练还可以结合训练计划、训练记录和数据分析结果，为用户提供更加个性化的训练建议。

​	该系统主要面向**日常健身用户、运动初学者以及希望获得简单训练指导的人群**，帮助用户更科学轻松地进行运动训练。

## 四、技术栈（初步规划）

**前端：**

​	Vue.js

​	HTML5 / CSS3 / JavaScript

​	Axios（HTTP请求）

​	Responsive Design（移动端自适应）

**后端：**

​	Python Flask

​	RESTful API

​	LLM API（AI对话与训练计划生成）

**数据库：**

​	mysql

## 五、测试与覆盖率

- 后端测试目录：`backend/tests/`
- 前端测试目录：`frontend/fitmate-frontend/src/__tests__/`
- **CI 工作流**（Lint + 测试 + Codecov）：`.github/workflows/ci.yml`
- 仅覆盖率工作流（可选/历史）：`.github/workflows/coverage.yml`
- 后端覆盖率报告文件：`backend/coverage.xml`
- 前端覆盖率报告文件：`frontend/fitmate-frontend/coverage/lcov.info`

> 说明：CI 与 Codecov 徽章在 `main` 分支成功运行后由 GitHub Actions 自动更新。

## 六、Docker 部署

1. 复制根目录 `.env.example` 为 `.env`，填写 `MYSQL_ROOT_PASSWORD`、`QWEN_API_KEY` 等（勿提交 `.env`）。
2. **开发环境**（Vite 热重载 + Flask + MySQL）：

```bash
docker compose up -d --build
docker compose ps
```

若曾用旧版 `docker-compose.yml`（服务名 `app`），请先清理再启动：

```bat
docker compose down --remove-orphans
docker stop fitmate-app 2>nul
docker rm fitmate-app 2>nul
docker compose up -d --build
```

- 前端：<http://localhost:5173>
- 开发测试账号（`docker compose down -v` 重建库后由种子数据创建）：用户名 `test` / 密码 `123456`；也可用邮箱 `test@example.com` 或手机号 `13800138000` 登录。
- **AI 教练个性化**：登录后后端会根据「个人中心」资料（姓名、性别、身高体重、目标等）、进行中的训练计划与近 30 天训练统计自动注入对话上下文；AI 教练页的教练性别/性格会写入个人资料并参与回复风格。
- **AI 教练对话记录**：本次浏览器会话内（`sessionStorage`）自动保存聊天记录，切换训练计划/知识库等页面再返回不会清空；点「新对话」或退出登录会清除。

### 知识库视频播放

- 详情页 `article_type=video` 且 `video_url` 有值时，使用 HTML5 `<video>` 或 iframe（B 站 / YouTube）真实播放。
- **演示视频（B 站）**：
  - 跑步减脂完全攻略：[BV1DV411Y7rW](https://www.bilibili.com/video/BV1DV411Y7rW/)
  - HIIT高效燃脂训练（帕梅拉 10 分钟 HIIT）：[BV1Np4y1i7rG](https://www.bilibili.com/video/BV1Np4y1i7rG/)
  - 肩部训练详解：[BV1F1421t7fa](https://www.bilibili.com/video/BV1F1421t7fa/)
- 后端每次启动会同步上述链接到数据库；修改链接请编辑 `backend/data/seed_data.py` 中的 `DEMO_VIDEO_URLS`。
- **自有 MP4**：将文件放到 `frontend/fitmate-frontend/public/videos/`，`video_url` 填 `/videos/文件名.mp4`。
- 后端 API：<http://localhost:5000/health>
- MySQL 端口映射：`3307`

3. **生产环境**（Nginx + Gunicorn）：

```bash
cp secrets/db_password.txt.example secrets/db_password.txt
# 编辑 .env 与 secrets/db_password.txt，使数据库密码一致
./deploy.sh
```

Windows 下生产部署请用：

```bat
copy secrets\db_password.txt.example secrets\db_password.txt
deploy.bat
```

- 浏览器访问：<http://localhost:80>（或 `.env` 中 `HTTP_PORT`）

4. 镜像构建与推送：`.github/workflows/docker.yml`（推送到 GHCR）。

## 七、云服务部署（课程作业）

完整步骤见 **[docs/deployment.md](docs/deployment.md)**（推荐腾讯云/阿里云 + `./deploy.sh`）。

作业提交还需：`docs/contributions/12-cloud/你的名字.md`、部署成功与环境变量截图、可访问的线上链接。

**登录报 500 / `Access denied for user 'root'`**：多为 MySQL 数据卷里的 root 密码与 `.env` 里 `MYSQL_ROOT_PASSWORD` 不一致。开发环境默认密码为 **`123456`**（与旧版 compose 一致）。在根目录 `.env` 中设置 `MYSQL_ROOT_PASSWORD=123456` 后执行 `docker compose up -d --force-recreate backend`。若仍失败且可清空数据：`docker compose down -v` 后重新 `up`。

**拉取 `python:3.12-slim` 失败**（`short read` / `unexpected EOF` / `content descriptor ... not found`）：多为直连 Docker Hub 不稳定或本地缓存损坏。可先清理构建缓存 `docker buildx prune -f`，再通过国内镜像拉取并打标签：

```bat
docker pull docker.m.daocloud.io/library/python:3.12-slim
docker tag docker.m.daocloud.io/library/python:3.12-slim python:3.12-slim
docker compose build backend
```

本地已有 `fitmate-backend` 镜像时，日常启动用 `docker compose up -d` 即可，不必每次 `--build`。

**backend 一直 unhealthy / `Table 'fitmate.articles' doesn't exist`**：多为 MySQL 数据卷里只有部分表（初始化脚本未跑完或旧数据）。后端启动时会自动 `create_all` 补全表；若仍异常可 `docker compose restart backend`。需要完全重置库：`docker compose down -v` 后重新 `up`（会清空用户数据）。