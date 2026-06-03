# FitMate——README

[![CI](https://github.com/JiaJingyi717/FitMate/actions/workflows/ci.yml/badge.svg)](https://github.com/JiaJingyi717/FitMate/actions)
[![Backend Coverage](https://codecov.io/gh/JiaJingyi717/FitMate/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/JiaJingyi717/FitMate)
[![Frontend Coverage](https://codecov.io/gh/JiaJingyi717/FitMate/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/JiaJingyi717/FitMate)

**线上演示**：<http://121.196.198.164/>  
**健康检查**：<http://121.196.198.164/health>

Figma 设计原型：<https://www.figma.com/design/WGetgfp2fP6v4eQRaiaXIe/FitMate%E5%8E%9F%E5%9E%8B%E8%AE%BE%E8%AE%A1?node-id=0-1&t=SiKwFAQh3FqpTKip-1>

## 一、项目名称

FitMate — AI 智能健身助手

## 二、团队成员

| 姓名   | 学号       | 分工 |
| ------ | ---------- | ---- |
| 赵一诺 | 2320100819 | 前端 |
| 贾静怡 | 2323030103 | 后端 |

## 三、项目简介

本项目为一款**基于 Web 的智能健身辅助系统**，以虚拟 AI 教练为核心交互入口，主要功能包括：

- **AI 教练对话**：可选教练形象与性格，结合个人资料、训练计划与近 30 天统计个性化回复；DashScope 不可用时自动降级为本地模板回复
- **AI 训练计划**：按起止日期计算周数生成计划，支持保存到数据库；云端超时时可降级为本地智能模板
- **训练打卡**：计划任务打卡、训练记录与数据分析
- **成就系统**：根据打卡次数、连续天数、消耗卡路里、知识库互动自动解锁徽章
- **知识库**：分类浏览、搜索、点赞/收藏/评论；支持 B 站 / YouTube / 本地 MP4 视频
- **个人中心**：资料编辑、头像上传、统计数据、成就展示、账号设置

面向日常健身用户、运动初学者及希望获得简单训练指导的人群。

## 四、技术栈

| 层级 | 技术 |
| ---- | ---- |
| 前端 | Vue 3、Vite、JavaScript、Axios、Vue Router |
| 后端 | Python Flask、RESTful API、Flask-JWT-Extended、Gunicorn |
| 数据库 | MySQL 8 |
| AI | 阿里云通义千问 DashScope（兼容 OpenAI 接口） |
| 部署 | Docker Compose、Nginx、GitHub Actions（CI / GHCR / 可选 SSH 部署） |
| 云平台 | 阿里云轻量应用服务器 |

## 五、测试与覆盖率

- 后端测试：`backend/tests/`（pytest + ruff）
- 前端测试：`frontend/fitmate-frontend/src/__tests__/`（Vitest + ESLint）
- CI 工作流：`.github/workflows/ci.yml`（Lint + 测试 + Codecov）
- 镜像构建：`.github/workflows/docker.yml`（推送 GHCR + Trivy 扫描）
- 可选自动部署：`.github/workflows/deploy-cloud.yml`（需配置 `DEPLOY_HOST` 等 Secrets）
- 覆盖率报告：`backend/coverage.xml`、`frontend/fitmate-frontend/coverage/lcov.info`

> CI 与 Codecov 徽章在 `main` 分支 workflow 成功运行后自动更新。

## 六、环境变量

根目录 `.env`（生产 Compose）或 `backend/.env`（本地开发）需配置：

| 变量 | 说明 |
| ---- | ---- |
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码（须与 `secrets/db_password.txt` 一致） |
| `SECRET_KEY` / `JWT_SECRET_KEY` | Flask / JWT 密钥（生产必设强随机值） |
| `QWEN_API_KEY` | 阿里云百炼 API Key |
| `QWEN_MODEL` | 默认模型（如 `qwen3.5-omni-plus`） |
| `QWEN_PLAN_MODEL` | 计划生成模型，建议 `qwen-plus` |
| `QWEN_PLAN_TIMEOUT` | 计划生成超时（秒），默认 `180` |
| `QWEN_CHAT_MODEL` | 教练对话模型，建议 `qwen-plus` |
| `QWEN_CHAT_TIMEOUT` | 教练对话超时（秒），默认 `120` |
| `FITMATE_AI_PLAN_FALLBACK` | 计划生成降级（默认开启） |
| `FITMATE_AI_CHAT_FALLBACK` | 教练对话降级（默认开启） |

示例见根目录 `.env.example` 与 `backend/.env.example`。

## 七、Docker 部署

### 1. 开发环境（Vite 热重载 + Flask + MySQL）

```bash
cp .env.example .env   # 按需填写
docker compose up -d --build
docker compose ps
```

- 前端：<http://localhost:5173>
- 后端健康检查：<http://localhost:5000/health>
- MySQL 端口：`3307`
- 测试账号（`docker compose down -v` 重建库后）：用户名 `test` / 密码 `123456`；或邮箱 `test@example.com`

**AI 教练**：登录后自动注入个人资料、训练计划与统计上下文；对话记录保存在本次浏览器会话（`sessionStorage`），退出登录或「新对话」会清除。

**知识库视频**：演示链接见 `backend/data/seed_data.py` 中 `DEMO_VIDEO_URLS`；自有 MP4 放 `frontend/fitmate-frontend/public/videos/`。

### 2. 生产环境（Nginx + Gunicorn + MySQL）

```bash
cp secrets/db_password.txt.example secrets/db_password.txt
# 编辑 .env 与 secrets/db_password.txt，密码须一致
./deploy.sh          # Linux / macOS
deploy.bat           # Windows
```

浏览器访问：<http://localhost:80>（或 `.env` 中 `HTTP_PORT`）

## 八、云服务部署（阿里云）

部署目录：`/opt/fitmate`；对外端口 **80**。

### Windows 本机打包

```bat
pack-upload.bat
```

或 CMD 单行：

```bat
tar -czf fitmate-upload.tar.gz --exclude=node_modules --exclude=.git --exclude=frontend/fitmate-frontend/node_modules --exclude=frontend/fitmate-frontend/dist --exclude=.env --exclude=backend/.env .
```

上传到服务器 `/tmp/` 后，在服务器执行：

```bash
sudo mkdir -p /tmp/fitmate-keep
sudo cp -a /opt/fitmate/.env /opt/fitmate/secrets /tmp/fitmate-keep/ 2>/dev/null || true
cd /opt && sudo rm -rf fitmate && sudo mkdir fitmate && cd fitmate
sudo tar -xzf /tmp/fitmate-upload.tar.gz
sudo cp -a /tmp/fitmate-keep/.env /tmp/fitmate-keep/secrets .
# 确认 .env 含 MYSQL_ROOT_PASSWORD、SECRET_KEY、JWT_SECRET_KEY、QWEN_* 等
sudo docker compose -f compose.prod.yaml up -d --build
curl -s http://127.0.0.1/health
```

> **注意**：更新时先备份 `.env` 与 `secrets/`，在备份基础上追加新变量，不要只保留 QWEN 几行导致数据库密码丢失。

服务器也可使用 `scripts/cloud-update.sh`（git pull 或 GHCR 拉镜像）。
