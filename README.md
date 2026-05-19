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