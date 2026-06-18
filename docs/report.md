---
title: FitMate——AI 智能健身助手
author:
  - 赵一诺(2320100819)
  - 贾静怡(2323030103)
description: |
  FitMate 是一款基于 Web 的智能健身辅助系统，前端采用 Vue 3 + Vite，
  后端采用 Python Flask + MySQL，集成阿里云通义千问 API，
  实现 AI 教练对话、个性化训练计划、成就解锁、知识库、数据分析与阿里云生产部署。
  报告配图目录：`docs/images/`（见 `docs/images/README.md`）。
---

# 一、项目介绍 [赵一诺、贾静怡]

## 1.1 背景与问题陈述

随着全民健身意识提升，越来越多用户希望获得**个性化、可追踪**的训练指导，但面临以下痛点：

| 痛点 | 具体表现 |
|------|----------|
| 计划缺乏个性化 | 通用健身 App 模板化，难以结合身高、体重、目标与水平定制 |
| 专业指导门槛高 | 私教成本高，初学者难以判断动作与强度是否合理 |
| 训练数据分散 | 打卡、时长、卡路里、类型分布缺乏统一视图 |
| 知识获取低效 | 动作教学、饮食建议散落在各平台，难以与自身计划联动 |

FitMate 针对上述问题，提供 **Web 端一站式健身辅助**：以虚拟 AI 教练为交互入口，结合训练计划管理、知识库与数据分析，帮助用户更科学、轻量地完成日常锻炼。

## 1.2 项目目标与核心功能

**项目目标：**

1. 提供可登录、可持久化的个人健身档案与训练记录。
2. 基于大语言模型生成可执行、可打卡的 AI 训练计划。
3. 实现训练数据可视化，支撑用户自我评估与调整。
4. 完成 Docker 容器化与阿里云生产部署，满足课程工程化要求。

**已实现功能（功能性需求）：**

| 模块 | 功能点 | 状态 |
|------|--------|------|
| 用户认证 | 注册、登录（邮箱/手机/用户名）、JWT 鉴权、登出 | ✅ |
| 个人中心 | 资料编辑、头像上传、身体数据、改密、注销、成就自动解锁与展示 | ✅ |
| AI 教练 | 多性格教练、上下文对话、DashScope 不可用时本地模板降级 | ✅ |
| 训练计划 | AI 按起止日期计算周数生成、今日打卡、周视图、进度统计 | ✅ |
| 知识库 | 文章/视频分类、搜索、点赞收藏、评论、B 站视频嵌入 | ✅ |
| 数据分析 | 7/30 日概览、运动类型分布、时长趋势、AI 建议 | ✅ |
| AI 扩展 | 饮食建议、训练进度分析、计划生成（通义千问） | ✅ |
| 运维监控 | 结构化日志、`/health`、`/api/metrics`、Compose 健康检查 | ✅ |

**非功能性需求：**

| 类型 | 目标 | 实现方式 |
|------|------|----------|
| 性能 | 首屏与 API 响应可接受 | Vite 构建、Nginx 静态资源、Gunicorn 多 worker |
| 可用性 | 生产环境可访问、可自愈 | Docker Compose 健康检查 + 自动重启 |
| 安全 | 密码哈希、JWT、密钥不入库 | Werkzeug hash、Flask-JWT-Extended、`.env` 注入 |
| 可维护 | 分层架构、统一 API 格式 | routes / services / models、`{code,message,data}` |
| 可测试 | CI 自动化测试与覆盖率 | GitHub Actions + pytest + Vitest + Codecov |

**用例概览：**

```text
FitMate
├── 访客：注册 / 登录
├── 登录用户
│   ├── AI 教练：选教练 → 对话 → 获取建议
│   ├── 训练计划：AI 生成 → 今日打卡 → 查看周计划
│   ├── 知识库：浏览 / 搜索 → 看视频 / 读文章 → 互动
│   ├── 数据分析：查看统计与图表
│   └── 个人中心：维护资料、查看成就徽章
└── 运维：健康检查 / 日志 / 指标
```

## 1.3 技术选型

| 层次 | 技术 | 选型理由 |
|------|------|----------|
| 前端 | Vue 3 + Vite 8 + Vue Router 5 | 组件化成熟、构建快、团队熟悉 |
| HTTP | Axios | 拦截器统一 Token 与错误处理 |
| 后端 | Python 3.12 + Flask 3 | 轻量、REST 友好、AI 生态好 |
| ORM | Flask-SQLAlchemy 3 | 防 SQL 注入、支持 MySQL/SQLite 切换 |
| 认证 | Flask-JWT-Extended | 无状态 API、前后端分离友好 |
| 数据库 | MySQL 8（生产）/ SQLite（测试） | 关系型数据、Compose 一键起库 |
| AI | 阿里云 DashScope（计划/对话用 qwen-plus，默认 omni 可配） | 国内可用、OpenAI 兼容；超时与网络异常时本地模板降级 |
| 部署 | Docker + Compose + Nginx + Gunicorn | 环境一致、适合作业与轻量云 |
| CI/CD | GitHub Actions | 与仓库集成、免费额度 |
| 云平台 | 阿里云轻量应用服务器 | 国内访问快、价格可控 |

## 1.4 团队分工

本项目为**二人协作**，按前后端职责划分，各讲次贡献说明归档于 `docs/contribution/`。

| 姓名 | 学号 | 角色 | 主要负责 |
|------|------|------|----------|
| **赵一诺** | 2320100819 | **前端** | Figma UI/UX 设计、Vue 页面与组件、API 封装与联调、前端测试、前端 Dockerfile/Nginx、前端 CI 与监控埋点、线上前端问题排查 |
| **贾静怡** | 2323030103 | **后端** | 后端架构与数据库、Flask API 与 services、AI 集成、后端测试、安全加固、后端 Docker/Gunicorn、CI/CD 后端流水线、阿里云部署与运维、监控后端实现 |

**协作方式**：API 契约先在 `docs/api.yaml` 中约定，再并行开发；联调、PR 审查、文档与线上排障由二人共同完成。

**按课程讲次的分工一览：**

| 讲次 | 主题 | 赵一诺（前端） | 贾静怡（后端） |
|------|------|----------------|----------------|
| 02 | UI/UX 设计 | 全部页面 Figma 原型、配色与组件规范 | — |
| 03 | 软件架构 | 前端分层、Vite 初始化、交互流程 | 后端分层、ER 图、MySQL/SQLite 切换 |
| 04 | API 设计 | Axios 封装、Mock、Apifox 测试 | OpenAPI、路由与 services、45 个初版用例 |
| 05 | 前端实现 | 6 大页面 + 7 个公共组件、接口对接 | — |
| 06 | 后端实现 | — | 认证/用户/成就 API、Docker 初版 |
| 07 | AI 集成 | AI 页面调用与错误展示 | DashScope 接入、prompt 与 JSON 解析 |
| 08 | 软件测试 | Vitest **131** 用例、覆盖率 ~75% | pytest **99** 用例、覆盖率 ~80% |
| 09 | CI/CD | 前端 lint/test/coverage job | 后端 ruff/pytest/coverage job |
| 10 | 安全审查 | XSS、依赖 audit、Docker 前端网络 | JWT/密钥/重置密码、安全 HTTP 头 |
| 11 | Docker 部署 | 前端多阶段 Dockerfile、nginx.conf | 后端 Gunicorn 镜像、compose 编排 |
| 12 | 云服务 | Nginx 反代、路由 404、会话缓存 | 阿里云部署、seed 数据、pip 镜像 |
| 13 | 监控 | logger.js、axios 指标埋点 | logger/health/metrics、Compose 探活 |

**项目开发流程（时间线）：**

```text
2026-03  UI 设计(Figma) → 架构文档 → 前后端项目初始化
2026-03~04  API 契约定稿 → 后端 routes/services → 前端页面与联调
2026-04  AI 功能集成 → 单元测试补全
2026-05  CI/CD → 安全审查 → Docker 化 → 阿里云上线 → 监控配置
2026-05~06  线上问题修复与体验优化 → 最终文档与报告
```

**设计流程证据链（从需求到上线）：**

| 阶段 | 设计产物 | 证明材料 | 在本文中的位置 |
|------|----------|----------|----------------|
| 需求与用户场景 | 用户画像、使用闭环、核心流程 | Figma 总览与原型页 | 第 3 章 |
| 交互与视觉设计 | 登录、AI 教练、训练计划、知识库、分析、个人中心页面原型 | `docs/design/` 原型截图 | 第 3 章 |
| 架构设计 | 前后端分离、Docker Compose、MySQL、DashScope 调用链 | 架构图与分层说明 | 第 4 章 |
| API 契约设计 | OpenAPI、统一响应格式、Apifox 联调 | API 列表与测试截图 | 第 5 章 |
| 前端落地 | Vue 页面、组件、路由、Axios、状态反馈 | 页面实现截图与代码截图 | 第 6 章 |
| 后端落地 | routes/services/models 分层、JWT、计划与 AI 服务 | 关键代码与数据库截图 | 第 7 章 |
| 验证与交付 | pytest/Vitest、CI/CD、安全审查、Docker、云部署、监控 | 测试、流水线、部署、监控截图 | 第 10-16 章 |

这条证据链体现了项目不是直接堆功能，而是先完成用户场景与原型设计，再通过 API 契约、架构分层、前后端实现、测试和部署逐步验证设计可行性。

---

# 二、版本控制与团队协作 [赵一诺、贾静怡]

## 2.1 分支策略

采用 **GitHub Flow 简化模型**：

| 分支                               | 用途                                       |
| ---------------------------------- | ------------------------------------------ |
| `main`                             | 稳定可发布分支，受保护，合并需通过 PR      |
| `develop`                          | 日常开发整合分支，用于汇总前后端阶段性代码 |
| `feature/JiaJingyi717-backend-doc` | 后端相关开发分支                           |
| `feature/zyn156-frontend-doc`      | 前端开发分支                               |

**保护规则**：`main` 禁止直接 push；合并前要求 PR 审核通过，确保代码或文档内容检查无误后再合并。

## 2.2 提交规范

- **Commit message**：动词开头，说明「为什么改」，如 `fix: 修复头像字段 VARCHAR 过短导致上传 500`。
- **PR 流程**：功能分支 → 发起 PR → 描述变更与测试方式 → 审查 → 合并。
- **代码审查**：至少一人 Review；关注 API 契约、安全与测试是否更新。

## 2.3 协作统计

**仓库地址**：<https://github.com/JiaJingyi717/FitMate>

**项目管理**：GitHub Issues + Pull Requests；各讲次个人贡献见 `docs/contribution/` 目录。

**关键 PR 列表（按模块）：**

| PR | 说明 | 负责人 | 链接 |
|----|------|--------|------|
| #7 | 前端架构与项目初始化 | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/7 |
| #8 / #9 | 后端架构与 API 初版 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/8 |
| #11 | 前端 API 封装与 Mock | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/11 |
| #12 / #15 | 后端用户认证与资料 API | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/12 |
| #13 / #17 | 前端页面开发与联调 | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/13 |
| #18 | AI 后端 API 集成 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/18 |
| #19 | AI 前端调用与展示 | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/19 |
| #20 | 后端测试补全 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/20 |
| #24 | 前端 Vitest 测试 | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/24 |
| #39 / #43 | 前端 CI 适配 | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/39 |
| #40 / #42 | 后端 CI 配置 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/40 |
| #45 / #50 | 后端安全加固 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/45 |
| #48 | 前端安全审查 | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/48 |
| #53 | 后端 Docker 镜像 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/53 |
| #54 | 前端 Docker / Nginx | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/54 |
| #66 / #67 | 阿里云后端部署 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/66 |
| #68 | 后端监控 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/68 |
| #69 | 前端云部署修复 | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/69 |
| #70 | 前端监控埋点 | 赵一诺 | https://github.com/JiaJingyi717/FitMate/pull/70 |
| #84 | 成就解锁、AI 降级、计划日期与 README/部署脚本 | 贾静怡 | https://github.com/JiaJingyi717/FitMate/pull/84 |

**CI 运行总览**：<https://github.com/JiaJingyi717/FitMate/actions>

---

# 三、UI/UX 设计与原型 [赵一诺]

## 3.1 用户画像与场景分析

| 用户类型 | 特征 | 典型场景 |
|----------|------|----------|
| 运动初学者 | 缺乏系统知识，易受伤 | 注册后让 AI 生成「初级减脂」计划，跟着今日任务打卡 |
| 日常健身者 | 有一定基础，需记录 | 查看数据分析中的类型分布与时长趋势，调整训练 |
| 知识学习型 | 想查动作细节 | 在知识库看 B 站教学视频与文章 |
| 数据驱动型 | 关注卡路里与完成率 | 在计划页查看周视图与顶部统计卡片 |

**设计目标**：降低健身入门门槛，让用户在单一 Web 应用中完成「咨询 → 计划 → 执行 → 复盘」闭环。

## 3.2 界面原型设计

**Figma 设计源文件**：<https://www.figma.com/design/WGetgfp2fP6v4eQRaiaXIe/FitMate%E5%8E%9F%E5%9E%8B%E8%AE%BE%E8%AE%A1>

**原型与设计过程截图：**

Figma 总览图用于证明早期已完成页面结构、模块划分和视觉方向确认，`docs/design/` 中的单页原型用于证明每个核心流程在编码前已有明确交互方案。

![Figma 设计总览](images/Figma设计图.png)

赵一诺完成了以下页面的完整原型设计：

| 模块 | 页面 | 主要元素 | 跳转关系 |
|------|------|----------|----------|
| 认证 | 登录 / 注册 | 双 Tab 表单、记住我 | → 首页（AI 教练） |
| 首页 | AI 教练 | 侧边栏、对话区、教练选择 | ↔ 各业务页 |
| 计划 | 训练计划 | 四色统计卡片、计划列表、今日任务、AI 生成弹窗 | → 计划详情周视图 |
| 知识库 | 列表 / 详情 | 分类 Tab、搜索、视频播放器 | 详情 ↔ 列表 |
| 分析 | 数据分析 | 时间筛选、饼图、折线图、AI 建议 | 侧边栏进入 |
| 个人 | 个人中心 | 头像、身体数据、成就、设置 | 侧边栏进入 |

**设计规范：**

| 维度 | 说明 |
|------|------|
| 配色 | 蓝绿渐变品牌色；训练完成态浅绿背景 + 勾选图标 |
| 字体 | 系统无衬线字体栈，保证跨平台一致 |
| 组件 | Button / Input / Card / Dialog / Tabs / Badge / Layout 统一 variant 与 size |
| 布局 | 左侧固定导航 + 右侧内容区，信息分区清晰 |

**设计理念：**

- **信息架构**：将系统划分为 AI 教练、训练计划、知识库、数据分析、个人中心五个模块，避免功能堆叠导致层级混乱。
- **卡片化统计**：计划页顶部四色卡片（完成数、时长、卡路里、计划数）一眼可读。
- **AI 入口突出**：「AI 生成计划」使用主色按钮，与手动流程区分。
- **优点**：结构简单、开发成本可控、适配桌面与平板。
- **缺点**：未做原生 App 手势；小屏依赖响应式 CSS。
- **实现难度**：中等；周计划网格与图表纯 CSS/SVG 实现，无重型图表库。

**设计过程说明**：初期借助 Figma 辅助生成架构草稿，再手动完善弹窗、悬停、组件等细节，并参考 B 站教程学习 Figma 组件与交互设计。

### 3.2.1 交互设计原则

- **即时反馈**：打卡、加载态、错误 Toast/alert。
- **会话保持**：AI 教练对话存 `sessionStorage`（`coachChatStorage`），路由切换不丢上下文；配合 `<keep-alive>` 保持页面状态。
- **响应式**：Flex/Grid 布局，Layout 组件侧边栏可折叠。
- **表单复用**：登录/注册共用 Login.vue，通过 `activeTab` 切换，减少重复组件。

### 3.2.2 用户体验设计

- Vite 开发热更新、生产 Nginx gzip 压缩静态资源。
- 统一 Axios 错误文案，避免暴露后端堆栈。
- 头像上传前 Canvas 压缩至 256px，减少上传失败。
- 生产环境 Nginx `try_files` 支持 Vue Router history 模式，避免刷新 404。

---

# 四、软件架构设计 [贾静怡]

## 4.1 整体架构

```mermaid
flowchart TB
    subgraph Client["客户端"]
        Browser["浏览器<br/>Vue 3 SPA<br/>Axios / Vue Router"]
    end

    subgraph DockerCompose["Docker Compose 生产环境"]
        subgraph Frontend["fitmate-frontend-prod"]
            Nginx["Nginx :80<br/>静态资源 + /api 反代"]
        end

        subgraph Backend["fitmate-backend-prod"]
            Gunicorn["Gunicorn<br/>Flask 后端"]
            Routes["routes 路由层"]
            Services["services 业务层"]
            Models["models ORM"]
            Gunicorn --> Routes --> Services --> Models
        end

        subgraph Database["fitmate-mysql-prod"]
            MySQL[("MySQL 8<br/>业务数据持久化")]
        end
    end

    subgraph External["外部服务"]
        DashScope["阿里云 DashScope<br/>通义千问 API"]
        Fallback["本地模板降级<br/>计划 / 教练对话"]
    end

    subgraph Observability["可观测性"]
        Logs["结构化日志<br/>logger.py / logger.js"]
        Metrics["/health · /api/metrics"]
    end

    Browser -->|"HTTP :80"| Nginx
    Nginx -->|"/api/*"| Gunicorn
    Models --> MySQL
    Services -->|"HTTPS"| DashScope
    Services -.->|"超时 / 断连"| Fallback
    Gunicorn --> Logs
    Gunicorn --> Metrics
    Browser --> Logs
```

**架构设计图证据：**该图用于说明最终部署时前端、后端、数据库和反向代理的关系，与上方 Mermaid 架构一致，证明架构设计已落地到 Docker 部署方案。

| 组件 | 作用 | 优点 | 缺点 |
|------|------|------|------|
| Nginx | 静态资源 + 反代 API | 性能好、配置简单 | 需单独维护 nginx.conf |
| Flask | 业务 API | 轻量灵活 | 超大并发需水平扩展 |
| MySQL | 关系数据 | 事务可靠 | 需备份与迁移策略 |
| DashScope | AI 能力 | 免自训模型 | 依赖外网与配额 |

**系统交互流程**（赵一诺参与设计）：用户浏览器加载 Vue SPA → Axios 请求 `/api/*` → Nginx 反代至 Gunicorn → Flask routes 鉴权后调用 services → ORM 读写 MySQL；AI 相关请求由 `ai_service` 代理 DashScope，密钥仅存服务端。

## 4.2 技术架构分层

### 4.2.1 表现层（前端 · 赵一诺）

```
frontend/fitmate-frontend/src/
├── pages/          # Home, Plan, Knowledge*, Analysis, Profile, Login...
├── components/     # Button, Card, Dialog, Layout, ArticleVideoPlayer...
├── api/            # auth, user, plan, article, analytics, ai
├── router/         # 路由与 JWT 守卫
└── utils/          # logger, coachChatStorage, image 压缩等
```

- 页面只负责展示与交互；业务规则由后端校验。
- API 模块统一 Mock 开关（`VITE_USE_MOCK`），便于后端未就绪时独立开发。

### 4.2.2 业务逻辑层（后端 · 贾静怡）

```
backend/
├── routes/         # HTTP 入口，参数解析，JWT 装饰器
├── services/       # plan_service, ai_service, analytics_service...
├── models/         # SQLAlchemy ORM
└── utils/          # logger, health, metrics, exercise_duration...
```

**原则**：routes 薄、services 厚；禁止在 routes 写复杂 SQL。

### 4.2.3 数据访问层

- SQLAlchemy ORM + PyMySQL 驱动。
- 启动时 `create_all` + 增量 `ALTER`（`app.py` 迁移逻辑）兼容旧库。
- 测试环境 SQLite 内存库（`conftest.py`）；开发/生产通过 `.env` 中 `DATABASE_URL` 切换，ORM 代码零改动。

## 4.3 关键设计决策

| 决策             | 选择                                      | 理由                                                         | 负责人          |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------ | --------------- |
| UI/UX 设计       | Figma 原型与统一配色规范                  | 先确定页面原型、配色和组件风格，保证系统界面统一，减少后期页面修改成本 | 赵一诺          |
| 软件架构         | 前后端分离                                | 前端负责页面展示、用户交互和接口调用，后端负责业务逻辑、数据处理和接口服务，便于两人并行开发 | 赵一诺 + 贾静怡 |
| 前端框架与分层   | Vue + Vite，Pages / Components / API 分层 | Vue 适合组件化开发，Vite 构建速度快；页面、组件和接口代码分开管理，提高代码可读性和可维护性 | 赵一诺          |
| 后端框架与数据库 | Flask + MySQL / SQLite                    | Flask 结构轻量，适合快速开发接口；SQLite 便于本地测试，MySQL 更适合后期部署和数据管理 | 贾静怡          |
| API 风格         | REST + JSON                               | 接口结构清晰，便于 Axios 调用、Apifox 测试和前后端联调       | 赵一诺 + 贾静怡 |
| 认证方式         | JWT                                       | 适合前后端分离项目，可减少 Session 和 Cookie 跨域带来的问题  | 贾静怡          |
| AI 集成方式      | 后端统一调用 AI 接口                      | 保护 API Key，同时方便统一管理 prompt、返回格式和错误处理    | 贾静怡          |
| 部署方式         | Docker + Nginx                            | Docker 便于统一运行环境，Nginx 可用于前端静态资源部署和接口反向代理 | 贾静怡          |
| 安全审查         | 依赖检查、XSS、JWT 密钥保护               | 提前发现依赖、前端输入和接口鉴权方面的安全问题，提高系统稳定性和安全性 | 赵一诺 + 贾静怡 |

**架构演进说明**：早期文档曾提及 Spring Boot，经团队统一后全部更正为 Flask + MySQL，以 `backend/` 实际代码为准（PR #8）。

---

# 五、API 设计 [赵一诺、贾静怡]

## 5.1 设计原则

贾静怡在后端确立「**先立契约再写代码**」流程：先在 `docs/api.yaml` 固定路径与响应结构，再实现 routes / services。

- **RESTful**：资源名复数、HTTP 动词语义化。
- **统一响应**：

```json
{
  "code": 200,
  "message": "success",
  "data": { }
}
```

- **错误**：`code` 与 HTTP 状态一致或业务码；生产环境不返回堆栈。
- **鉴权**：除注册/登录外，Header `Authorization: Bearer <token>`。
- **文档**：OpenAPI 见 `docs/api.yaml`；Apifox 测试步骤见 §5.1–§5.2 及 `docs/images/1.api设计/` 截图。

赵一诺在前端实现 Axios 拦截器：登录后将 token 存入 localStorage；请求拦截器统一附加 `Authorization`；401 时清 token 并跳转登录页。

**API 设计流程证据：**本章截图按“统一响应格式 -> 模块接口列表 -> Apifox/测试验证”的顺序组织，体现接口先于联调确定；前端再依据契约封装 `src/api/*`，后端依据契约实现 routes/services。这样能减少字段名不一致、鉴权遗漏和响应结构漂移。

**统一响应格式：**

![统一响应格式1](images/1.api设计/后端/统一响应格式1.jpg)

![统一响应格式2](images/1.api设计/后端/统一响应格式2.jpg)

## 5.2 接口文档

### 5.2.1 用户认证接口

![认证-接口列表](images/1.api设计/后端/认证-接口列表.png)

**实现要点**：注册时检查 email/phone 唯一性；邮箱注册自动生成唯一 username（`@` 前缀 + hash 后缀）；JWT 通过 `JWTManager` 统一管理，`@jwt_required()` 装饰敏感路由。

### 5.2.2 个人中心与用户接口

![个人中心-接口列表](images/1.api设计/后端/个人中心-接口列表.png)

### 5.2.3 训练计划与打卡接口

![训练计划-接口列表](images/1.api设计/后端/训练计划-接口列表.png)

### 5.2.4 AI、知识库与数据统计接口

![AI智能](images/1.api设计/后端/AI智能.png)

**生产环境 AI 配置（`backend/.env`，密钥不进 Git）**：
| 变量 | 说明 |
|------|------|
| `QWEN_API_KEY` | 阿里云百炼 API Key |
| `QWEN_API_BASE` | OpenAI 兼容端点（默认 `https://dashscope.aliyuncs.com/compatible-mode/v1`） |
| `QWEN_MODEL` | 默认模型（如 `qwen3.5-omni-plus`） |
| `QWEN_PLAN_MODEL` / `QWEN_PLAN_TIMEOUT` | 计划生成（默认 `qwen-plus` / **180s**，对应 `POST /api/ai/generate-plan`） |
| `QWEN_CHAT_MODEL` / `QWEN_CHAT_TIMEOUT` | 教练对话（默认 `qwen-plus` / **120s**，对应 `POST /api/ai/coach/chat`） |
| `FITMATE_AI_PLAN_FALLBACK` | 计划生成降级（默认 `1`，DashScope 不可用时本地模板） |
| `FITMATE_AI_CHAT_FALLBACK` | 教练对话降级（默认 `1`） |

> 配置模板见仓库 `.env.example`；修改后需 `docker compose -f compose.prod.yaml up -d --build backend` 重建容器生效。

![AI环境变量](images/1.api设计/后端/AI环境变量.png)

**5.2.5 AI 教练接口：**

![AI教练接口](images/1.api设计/后端/AI教练接口.png)

**说明**：`/api/coaches/*` 为教练列表、会话管理与本地模板对话（兼容旧版）；线上主流程 `Home.vue` / `Plan.vue` 已走 `/api/ai/*`，无需额外 AI 环境变量。

**5.2.6 知识库接口：**

![知识库](images/1.api设计/后端/知识库.png)

**5.2.7 数据分析接口：**

![数据分析](images/1.api设计/后端/数据分析.png)

**5.2.8 监控接口：**

![监控接口](images/1.api设计/后端/监控接口.png)

## 5.3 接口安全设计

- JWT 过期与 `@jwt_required()` 保护敏感路由。
- 用户只能操作 `get_jwt_identity()` 对应数据，防越权。
- 密码 Werkzeug 哈希；重置密码验证码走环境变量 `FITMATE_PASSWORD_RESET_CODE`。
- 生产环境强制非默认 `SECRET_KEY` / `JWT_SECRET_KEY`（`security_config.py`）。

## 5.4 接口测试

| 层次 | 工具 | 负责人 | 说明 |
|------|------|--------|------|
| 后端单元/集成 | pytest | 贾静怡 | **99** 个用例，覆盖 auth/users/plan/ai/articles/analytics/monitoring 等 |
| 前端 API 契约 | Vitest | 赵一诺 | `src/__tests__/api` **8** 个文件、**37** 个用例，校验 URL / method / 超时 |
| 手工联调 | Apifox | 赵一诺 | 导入 `docs/api.yaml`，`bearerToken` 鉴权联调 |

**后端 pytest：**

![测试集成1](images/4.软件测试/后端/测试集成1.png)

![测试集成2](images/4.软件测试/后端/测试集成2.png)

**前端 API 契约（Vitest）：**

![前端 API 契约测试](images/4.软件测试/前端/契约API.png)

**联调经验（赵一诺）**：前后端字段不一致时，通过 `console.log` 打印响应并对照 `api.yaml` 约定；必要时在前端增加数据适配层。

---

# 六、前端实现 [赵一诺]

## 6.1 技术栈与开发环境

| 项目 | 版本/工具 |
|------|-----------|
| Vue | 3.5.x |
| Vite | 8.x |
| Vue Router | 5.x |
| Axios | 1.16.x |
| Vitest + Vue Test Utils | 4.x |
| ESLint | 9.x |
| Node | 20 LTS |

```bash
cd frontend/fitmate-frontend
npm ci
npm run dev      # http://localhost:5173
npm run test     # 单元测试
npm run build    # 生产构建
```

![npm ci](images/2.前后端开发/前端/npm ci.png)

![local运行](images/2.前后端开发/前端/local运行.png)

![npm test](images/2.前后端开发/前端/npm test.png)

![build run](images/2.前后端开发/前端/build run.png)

开发环境通过 Vite proxy 将 `/api` 转发至 `http://backend:5000`（Compose）或 `127.0.0.1:5000`。

**从原型到实现的页面证据：**

以下截图对应第 3 章的原型设计，用于证明核心页面已经从设计稿落地为可运行前端页面。

![登录页实现](images/2.前后端开发/前端/页面/登录页.png)

![注册页实现](images/2.前后端开发/前端/页面/注册页.png)

![训练计划-全部计划实现](images/2.前后端开发/前端/页面/训练计划-全部计划.png)

![训练计划-今日任务实现](images/2.前后端开发/前端/页面/训练计划-今日任务.png)

![知识库实现](images/2.前后端开发/前端/页面/知识库.png)

![知识库视频详情实现](images/2.前后端开发/前端/页面/知识库-视频详情.png)

![数据分析图表实现](images/2.前后端开发/前端/页面/数据分析-图表.png)

![个人中心实现](images/2.前后端开发/前端/页面/个人中心.png)

![个人中心成就徽章实现](images/2.前后端开发/前端/页面/个人中心-成就徽章.png)

## 6.2 核心功能模块实现

### 6.2.1 用户管理模块

| 文件 | 功能 |
|------|------|
| `Login.vue` | 登录/注册双 Tab、`activeTab` 切换、记住我 |
| `Register.vue` | 注册表单校验 |
| `Profile.vue` | 资料编辑；头像经 `compressImageFile` 压缩后 Base64 上传；成就徽章 `isEarned` 展示 |
| `api/request.js` | 拦截器附加 JWT；401 清 token 跳转登录 |
| `utils/image.js` | Canvas 压缩图片至 256px |

**Axios 统一鉴权与错误处理**（`src/api/request.js`）：

![request.js拦截器](images/2.前后端开发/前端/代码/request.js.png)

### 6.2.2 训练计划模块

**Plan.vue** 是前端最复杂的页面，主要实现：

- **AI 生成弹窗**：收集目标、水平、起止日期与训练日；`utils/planDates.js` 按日期范围计算周数，不再硬编码 4 周。
- **生成态**：`isGeneratingAI` 与 loading 文案；`api/ai.js` 中 `generatePlan` 超时 **180s** 与后端对齐。
- **周视图**：按 `weeklySchedule` 与计划日期循环渲染，每日展示 `totalDuration` / `totalCalories`。
- **实时统计**：`stats` 计算属性基于 `todayTasksComputed` 汇总完成数、时长、卡路里，打卡后立即更新。
- **打卡流程**：`toggleTaskComplete` 乐观更新 UI + 调用 `PATCH /api/plans/today/{taskId}/complete`。

**AI 生成超时与打卡乐观更新**：

![AI 计划长超时配置](images/2.前后端开发/前端/代码/ai-generatePlan.png)

![打卡乐观更新](images/2.前后端开发/前端/代码/Plan-toggleTaskComplete.png)

### 6.2.3 数据分析模块

**Analysis.vue**：

- 并行 `Promise.all` 请求 overview / 分布 / 趋势 / AI 建议。
- 饼图 SVG + 图例；折线图展示 7/30 日时长。
- 字段映射：后端返回 `name`，前端使用 `item.name` 显示类型标签（修复原 `category` 字段不一致问题）。

**6.2.4 AI 教练与知识库：**

| 文件 | 功能 |
|------|------|
| `Home.vue` | 对话 UI；教练选择；`askCoach` 超时 120s；503/超时友好提示与意图推荐卡片 |
| `utils/coachChatStorage.js` | sessionStorage 会话级持久化，解决路由切换丢对话 |
| `api/ai.js` | 封装 generatePlan / askCoach / analyzeProgress，长超时配置 |
| `KnowledgeDetail.vue` | `ArticleVideoPlayer` 支持 B 站 iframe / MP4；`escapeHtml()` 防 XSS |
| `ArticleVideoPlayer.vue` | 视频嵌入与占位处理 |

**AI 教练 API 封装**（与后端 120s 超时对齐）：

![API封装](images/2.前后端开发/前端/代码/ai-askCoach.png)

**6.2.5 公共组件库：**

赵一诺封装了 7 个可复用组件：

| 组件 | 能力 |
|------|------|
| Button | variant（default/outline/ghost）、size（sm/md/lg）、hover/disabled |
| Input | v-model、placeholder、enter 事件 |
| Card | 渐变背景、自定义 class |
| Dialog | show/title/size、ESC 与遮罩关闭 |
| Tabs | v-model tabs、具名插槽 |
| Badge | variant、size，状态标签 |
| Layout | 可折叠侧边栏、router-view、导航菜单 |

## 6.3 性能优化实践

| 优化项 | 做法 | 效果 |
|--------|------|------|
| 构建 | Vite ESM 构建 | 开发冷启动秒级 |
| 路由 | 按需加载页面组件 | 减小首包 |
| 头像 | Canvas 压缩至 256px | 减少上传体积与 500 错误 |
| 请求 | 并行 `Promise.all` 拉分析数据 | 缩短 Analysis 首屏 |
| 生产 | Nginx gzip + 同源 `/api` 反代 | 无额外 CORS 开销 |

## 6.4 兼容性处理

- 现代浏览器（Chrome / Edge / Firefox 近期版本）。
- Vitest jsdom 环境对 `window` 做守卫（如 `request.js`）。
- Windows 下 Vitest 通过 `run-vitest.mjs` 统一 cwd，解决路径与 chdir 继承问题（PR #39）。

---

# 七、后端实现 [贾静怡]

## 7.1 技术栈与架构

- Python 3.12、Flask 3、Gunicorn（生产）、Flask-CORS、Flask-JWT-Extended。
- 分层：`routes` → `services` → `models`。
- 统一响应：`utils/response.py` 的 `ok()` / `fail()`。

**统一响应封装**：

![response](images/2.前后端开发/后端/代码/response.py.png)

**蓝图注册**：

![蓝图注册](images/2.前后端开发/后端/代码/app-blueprints.png)

## 7.2 核心业务模块实现

### 7.2.1 用户认证与授权

| 模块 | 说明 |
|------|------|
| `auth_routes.py` | 注册写库、多凭证登录签发 JWT、登出 |
| `user_service.py` | 密码校验、资料更新、BMI 计算、统计聚合 |
| `users_routes.py` | 头像、成就（`list_user_achievements`）、改密、注销 |

**多凭证注册**：支持 email/phone/username；自动生成唯一 username 避免冲突。

**JWT 登录签发**（`auth_routes.py`）：

![JWT登录签发](images/2.前后端开发/后端/代码/auth-login.png)

### 7.2.2 训练与成就服务

**achievement_service.py**（PR #84）：

| 函数 | 职责 |
|------|------|
| `sync_user_achievements` | 按 `condition_type` 检测训练/连续天/卡路里/知识库互动并写入 `user_achievements` |
| `list_user_achievements` | 返回成就列表及 `isEarned`、`earnedAt` |

**解锁条件（种子数据）**：初出茅庐（1 次打卡）、坚持一周（连续 7 天）、训练达人（30 次）、自律王者（连续 30 天）、热量燃烧者（10000 kcal）、知识探索者（10 篇互动文章，点赞/收藏/评论去重）。

**触发时机**：`GET /api/users/achievements`、训练打卡成功、文章点赞/收藏/评论后。

### 7.2.3 计划打卡业务逻辑

**plan_service.py** 核心逻辑：

| 函数 | 职责 |
|------|------|
| `save_ai_plan` | 解析 AI 的 `weekly_schedule`，按训练日落库 `plan_tasks`；结合 `plan_dates.duration_weeks_between` 处理起止日期 |
| `check_in_task` | 按 `task_id` 幂等写入 `training_record`，防重复打卡；成功后 sync 成就 |
| `_aggregate_plan_tasks` | 列表接口返回 trainingDays、totalDuration、plannedCalories |
| `get_plan_detail` | weeklySchedule 每日附带汇总字段 |

**时长估算**（`utils/exercise_duration.py`）：AI 未返回有效 `duration` 时，按组数/次数/休息间隔估算分钟数，`save_ai_plan` 调用 `resolve_duration_minutes` 兜底。

**日期工具**（`utils/plan_dates.py`）：根据起止日期计算计划周数，与前端 `planDates.js` 保持一致。

**打卡幂等**（`plan_service.check_in_task`）：

![打卡](images/2.前后端开发/后端/代码/plan-check_in_task.png)

### 7.2.4 数据统计分析

**analytics_service.py**：

- 基于 `training_record` 聚合时长、卡路里、类型分布。
- `effective_record_duration`：兼容历史 duration=0 的记录。
- 返回字段 `name`（非 `category`）供前端饼图使用。

**7.2.5 AI 服务：**

**ai_service.py** + **ai_routes.py**：

- DashScope OpenAI 兼容接口（`QWEN_API_BASE` + `QWEN_API_KEY`）。
- **分场景模型**：计划/对话默认 `qwen-plus`（`QWEN_PLAN_MODEL` / `QWEN_CHAT_MODEL`），可独立于 `QWEN_MODEL` 配置。
- **超时与重试**：`_post_with_retry`；计划 180s、对话 120s；SSL/读超时不对网络错误盲目重试。
- **结构化 prompt**：要求 JSON 计划，含 `weekly_schedule`、`duration_minutes`；解析失败返回 400。
- **降级策略**：
  - 计划：`build_local_plan_result()`（`FITMATE_AI_PLAN_FALLBACK`）
  - 教练对话：`build_chat_reply()`（`FITMATE_AI_CHAT_FALLBACK`）
- `coach_context_service.py`：对话时注入用户资料、计划、近 30 天统计与教练性格。

**教练对话：用户画像注入 + 降级**（`ai_routes.py`）：

![AI教练](images/2.前后端开发/后端/代码/ai-coach-chat.png)

**7.2.6 种子数据与内容同步：**

| 模块 | 说明 |
|------|------|
| `data/seed_data.py` | 演示用户、文章、教练；`fix_demo_video_urls()` 同步 B 站链接 |
| `data/article_contents.py` | 知识库详细正文 `sync_article_contents()` |
| `app.py` 启动 | `seed_all()` + 连接重试 + 增量 ALTER（如 avatar TEXT） |

## 7.3 数据库设计

共 **12** 张核心表（见 `backend/schema_mysql.sql`）：

| 表名 | 说明 |
|------|------|
| users | 用户账号与资料（avatar 为 TEXT） |
| coaches | 教练模板 |
| training_plan | 训练计划 |
| plan_tasks | 计划内每日任务 |
| training_record | 打卡记录（含 task_id 去重） |
| articles | 知识库文章/视频 |
| article_likes / collects / comments | 互动 |
| achievements / user_achievements | 成就 |
| coach_sessions | 教练会话 |

![MySQL](images/2.前后端开发/后端/MySQL.png)

**ER 关系**：

```mermaid
erDiagram
    users {
        bigint id PK
        string username UK
        string email UK
        string phone UK
        text avatar
        bigint current_coach_id FK
        string coach_personality
    }

    coaches {
        bigint id PK
        string name
        string gender
        string personality
    }

    training_plan {
        bigint id PK
        bigint user_id FK
        string name
        date start_date
        date end_date
        string status
    }

    plan_tasks {
        bigint id PK
        bigint plan_id FK
        string name
        string task_type
        date target_date
        boolean is_completed
        int duration
        int calories
    }

    training_record {
        bigint id PK
        bigint user_id FK
        bigint plan_id FK
        bigint task_id
        date record_date
        int duration
        int calories
        string exercise_type
    }

    articles {
        bigint id PK
        string title
        string category
        string article_type
        string video_url
    }

    article_likes {
        bigint id PK
        bigint user_id FK
        bigint article_id FK
    }

    article_collects {
        bigint id PK
        bigint user_id FK
        bigint article_id FK
    }

    article_comments {
        bigint id PK
        bigint user_id FK
        bigint article_id FK
        bigint parent_id
        text content
    }

    achievements {
        bigint id PK
        string achievement_name
        string condition_type
        int condition_value
    }

    user_achievements {
        bigint id PK
        bigint user_id FK
        bigint achievement_id FK
        datetime earned_at
    }

    coach_sessions {
        bigint id PK
        bigint user_id FK
        bigint coach_id FK
        text messages
    }

    users ||--o{ training_plan : "创建"
    training_plan ||--o{ plan_tasks : "包含"
    users ||--o{ training_record : "打卡"
    training_plan |o--o{ training_record : "plan_id可空"
    plan_tasks ||--o{ training_record : "task_id幂等"

    coaches ||--o{ users : "current_coach_id"
    users ||--o{ coach_sessions : "会话"
    coaches |o--o{ coach_sessions : "关联"

    users ||--o{ user_achievements : "解锁"
    achievements ||--o{ user_achievements : "定义"

    users ||--o{ article_likes : "点赞"
    articles ||--o{ article_likes : "被赞"
    users ||--o{ article_collects : "收藏"
    articles ||--o{ article_collects : "被藏"
    users ||--o{ article_comments : "评论"
    articles ||--o{ article_comments : "被评"
```

**关系说明**：

| 关系 |  cardinality | 说明 |
|------|-------------|------|
| users → training_plan | 1:N | 每用户可有多个训练计划 |
| training_plan → plan_tasks | 1:N | 每计划含多个按日落库的任务 |
| users → training_record | 1:N | 打卡记录归属用户 |
| plan_tasks → training_record | 1:N | 同一 task_id 幂等打卡，防重复 |
| users → user_achievements | N:M | 经中间表关联 achievements |
| users → articles 互动 | 1:N | likes / collects / comments 三表 |
| users → coach_sessions | 1:N | 教练对话历史（可选关联 coaches） |

**索引策略**：username、email、phone 唯一索引；外键 user_id、plan_id。

## 7.4 中间件与工具集成

| 模块 | 说明 |
|------|------|
| `logger.py` | JSON 单行日志；`request_start` / `request_end` 钩子 |
| `health.py` | `status`、`timestamp`、`version`、`checks.database` |
| `metrics.py` | 进程内计数器；跳过 health/metrics 探活路径 |
| `security_config.py` | 生产环境密钥校验 |
| CORS | Flask-CORS 允许前端源 |
| 安全头 | `X-Frame-Options`、`X-Content-Type-Options`、`Referrer-Policy` 等 |

## 7.5 性能优化实践

| 优化项 | 说明 |
|--------|------|
| pip 阿里云镜像 | 国内服务器 Docker 构建加速 |
| 数据库连接重试 | 启动时等待 MySQL ready |
| 打卡幂等 | 避免重复 record 导致统计虚高 |
| Gunicorn 多 worker | 生产并发处理 |
| Compose healthcheck | `depends_on: condition: service_healthy` 避免 Flask 先于 MySQL 启动 |

---

# 八、AI 工程化应用 [赵一诺、贾静怡]

## 8.1 AI 辅助开发实践

在 FitMate 的开发过程中，团队主要使用 **Cursor** 作为 AI 辅助开发工具，覆盖了代码生成、测试补全、文档编写、部署排障和代码修正等多个环节。

| 工具 | 使用环节 | 使用者 | 具体实践 | 实际效果 |
|------|----------|--------|----------|----------|
| Cursor | 代码生成与补全 | 贾静怡、赵一诺 | 生成后端接口初稿、前端页面交互代码、测试骨架与辅助脚本 | 减少重复编码工作，提升初版实现速度 |
| Cursor | 代码审查与修正 | 贾静怡、赵一诺 | 对接口返回结构、前后端字段映射、异常处理分支进行核对，辅助发现遗漏条件与不一致字段 | 更快定位联调问题，减少低级错误反复出现 |
| Cursor | 文档编写 | 贾静怡、赵一诺 | 编写报告文档、测试说明与问题复盘记录 | 降低文档整理成本，使部署与交接更顺畅 |
| Cursor | 调试与排障 | 贾静怡、赵一诺 | 结合报错日志、Compose 输出、Network 面板和测试失败信息分析问题原因 | 缩短排障时间，提高问题闭环效率 |


**实际效果与经验总结**：

- AI 工具显著提高了项目初版开发速度，尤其适合生成重复性强的样板代码、测试用例和文档草稿。
- 在联调和排障阶段，AI 对日志、报错信息和接口结构的归纳能力较强，能够帮助团队更快缩小问题范围。
- AI 给出的方案通常需要结合实际业务再做人工修改，尤其是字段命名、异常处理、边界条件和部署配置不能直接照搬。
- 团队在实践中形成的原则是：AI 负责提效，人负责判断。所有 AI 生成内容在合并前都必须经过人工检查、实际运行验证和回归测试。

## 8.2 AI 辅助故障排查（Vibe Debugging 实例）

项目开发和部署过程中，团队使用 Cursor 进行过 AI 辅助故障排查。具体做法是将错误日志、接口响应、页面现象和配置项作为上下文提供给 AI，由其帮助分析可能原因并给出修复建议，最后再由开发者完成验证和修复。

**案例一：头像上传与前端展示相关问题**

- **问题描述**：线上头像上传返回 500；数据分析饼图无标签；训练计划时长全部为 0；计划统计信息不能实时更新。
- **提供给 AI 的上下文**：后端日志 `Data too long for column 'avatar'`；Network 面板中 API 返回 `{name, percentage}`；AI 生成 JSON 中缺少 `duration` 字段；页面状态更新前后表现不一致。
- **AI 给出的分析和建议**：建议优先检查数据库字段长度与图片 Base64 存储方式；核对前后端字段映射是否一致；对缺失的训练时长字段增加估算逻辑；将统计信息改为依赖响应式数据的计算属性。
- **实际解决结果**：将 avatar 字段调整为 `TEXT` 并增加前端压缩；Analysis 页面改为使用 `item.name`；在 `exercise_duration.py` 中补充时长估算；在 `Plan.vue` 中改用 stats 计算属性。上述问题均已修复，并补充测试验证。

**案例二：DashScope 503 / 读超时（2026-06）**

- **问题描述**：`/api/ai/coach/chat` 大约 10 秒后返回 503，日志中出现 `ReadTimeoutError`，AI 对话功能不可用。
- **提供给 AI 的上下文**：接口超时日志、请求耗时现象、当前使用模型配置、Gunicorn 超时配置以及线上容器运行状态。
- **AI 给出的分析和建议**：判断问题更可能来自模型响应时间过长和超时参数过短，而不是 API 额度不足；建议更换响应更稳定的模型，延长 SDK 与服务端超时时间，并增加失败时的本地降级回复。
- **实际解决结果**：将 `QWEN_CHAT_MODEL` 调整为 `qwen-plus`，`QWEN_CHAT_TIMEOUT` 调整为 `120`；在路由层加入本地模板降级；同时将 Gunicorn timeout 提升到 120 秒。通过 `test_coach_chat_timeout_fallback` 完成验证，重建 backend 容器后线上恢复可用。

## 8.3 AI 功能集成

**后端（贾静怡 · PR #18）：**

| 功能 | 接口 | 说明 |
|------|------|------|
| 智能计划生成 | `POST /api/ai/generate-plan` | prompt 约束 JSON schema，解析失败 400 |
| AI 教练对话 | `POST /api/ai/coach/chat` | 注入用户上下文 |
| AI进度分析 | `POST /api/ai/progress-analysis` | 基于训练记录 |

*智能计划生成*

![智能计划生成](images/3.AI集成/智能计划生成成功.png)

*AI教练对话*

![AI教练对话](images/3.AI集成/AI教练对话.png)

*AI进度分析*

![AI进度分析](images/3.AI集成/AI进度分析.png)

**Prompt 工程要点**：要求 AI 返回结构化 JSON（含 `weekly_schedule`、`duration_minutes`）；服务端 normalize 后落库；DashScope 超时/断连时降级本地模板，响应中带 `fallback: true`；异常分支返回明确错误码。

---

# 九、安全设计 [赵一诺、贾静怡]

## 9.1 安全威胁分析

| 威胁 | 风险 | 应对 | 负责人 |
|------|------|------|--------|
| SQL 注入 | 高 | ORM 参数化 | 贾静怡 |
| 越权访问 | 高 | JWT + 用户 ID 校验 | 贾静怡 |
| 敏感信息泄露 | 高 | .env 不入库、Gitleaks CI | 贾静怡 |
| XSS | 中 | Vue 默认转义 + `escapeHtml()` | 赵一诺 |
| 弱密钥 | 高 | 生产启动校验 | 贾静怡 |
| 依赖漏洞 | 中 | npm audit / pip 版本锁定 | 赵一诺 |

**审查过程（AI 辅助梳理威胁与改法）**：

![前端安全 AI 审查 1](images/6.安全审查与加固/前端/ai提问1.png)

![前端安全 AI 审查 2](images/6.安全审查与加固/前端/ai提问2.png)

![后端安全 AI 审查](images/6.安全审查与加固/后端/ai提问1.png)

*说明：使用 Cursor 对 JWT、XSS、密钥管理等逐项提问，形成加固清单后再改代码。*

## 9.2 安全防护措施

### 9.2.1 身份认证与授权

- JWT HS256；token 存 sessionStorage / localStorage（记住我）。
- `@jwt_required()` + `get_jwt_identity()` 限定当前用户数据。
- 重置密码：环境变量 `FITMATE_PASSWORD_RESET_CODE` + `secrets.compare_digest`；未配置返回 503。
- 生产环境 `security_config.py` 禁止使用默认 `SECRET_KEY` / `JWT_SECRET_KEY`。

**生产弱密钥拦截**：

![生产弱密钥拦截](images/6.安全审查与加固/后端/代码/security_config.py.png)

**重置密码常量时间比较**：

![后端 JWT 加固讨论](images/6.安全审查与加固/后端/ai提问2.png)

![auth重置密码](images/6.安全审查与加固/后端/代码/auth-reset-password.png)

### 9.2.2 输入验证与 SQL 注入防护

- 路由层校验必填 JSON；ORM 类型约束。
- 头像：前端压缩 + Nginx `client_max_body_size 5m`；DB 字段 TEXT。
- 全局安全响应头：`X-Frame-Options`、`X-Content-Type-Options`、`Referrer-Policy` 等（`app.py` after_request）。

![HTTP安全响应头](images/6.安全审查与加固/后端/代码/app-security-headers.png)

### 9.2.3 敏感数据保护

- 知识库 Markdown 渲染前 `escapeHtml()`，再处理 `**bold**` 等轻量语法；用户评论走 Vue 文本绑定。
- `vite.config.js` 适配 Docker 网络；`.env` 已加入 `.gitignore`。
- `npm audit --omit=dev`：**0 高危**（生产依赖）。

**XSS 防护代码**：

![XSS防护代码](images/6.安全审查与加固/前端/代码/renderArticleMarkdown-escapeHtml.png)

**Git / 依赖安全审查**：

![前端 Git 安全审查](images/6.安全审查与加固/前端/git安全审查.png)

### 9.2.4 其他安全措施

- `.github/workflows/security.yml`：**Gitleaks** 全仓密钥扫描 + **npm audit**（仅生产依赖、high 及以上）。
- 与 `ci.yml` 测试流水线分离，push/PR 到 main 自动触发。

**工作流配置**：

![security](images/6.安全审查与加固/后端/代码/security.yml.png)

**Gitleaks 扫描通过**：

![后端 Git 安全检查](images/6.安全审查与加固/后端/git安全检查.png)

## 9.3 安全审计

| 层次 | 工具 | 结果 |
|------|------|------|
| 后端 | ruff + pytest | 通过 |
| 前端 | eslint + npm audit | 0 高危（生产依赖） |
| 仓库 | Gitleaks | 无密钥泄露 |

**审计复核截图**：

*CI截图及README徽章*

![前端安全 workflow](images/6.安全审查与加固/前端/git安全审查.png)

![README徽章](images/5.持续集成/README徽章.png)

*Security审查*

![后端 Gitleaks 通过](images/6.安全审查与加固/后端/git安全检查.png)

贡献说明与检查清单见 `docs/contribution/10-security/`。

---

# 十、软件测试 [赵一诺、贾静怡]

## 10.1 测试策略

| 层次 | 工具 | 负责人 | 范围 |
|------|------|--------|------|
| 后端单元/集成 | pytest + pytest-cov | 贾静怡 | routes、services |
| 前端单元 | Vitest + @vue/test-utils | 赵一诺 | 组件、页面、api |
| CI | GitHub Actions | 二人 | 每次 push/PR |

## 10.2 单元测试

**后端（贾静怡 · PR #20 / #84）：**

- **99** 个用例（`pytest --collect-only`）。
- 测试文件：`test_auth.py`、`test_plan.py`、`test_users.py`、`test_analytics.py`、`test_articles.py`、`test_coaches.py`、`test_ai_routes.py`、`test_ai_service.py`、`test_achievement_service.py`、`test_plan_dates.py`、`test_user_service.py`、`test_monitoring.py` 等。
- 关键模块覆盖率：auth_routes 96%、plan_routes 93%、user_service 100%。
- 整体覆盖率 **~80%**（本地 `pytest` + pytest-cov；Codecov backend 徽章）。

**典型用例**：

- `test_complete_task_does_not_duplicate_records`：打卡幂等。
- `test_update_avatar_accepts_long_base64`：头像长 Base64。
- `test_achievements_unlock_after_check_in`：打卡后解锁「初出茅庐」。
- `test_coach_chat_timeout_fallback` / `test_generate_plan_timeout_fallback`：AI 降级分支。
- AI 路由超时/连接异常/参数缺失分支。

**本地 pytest 执行与用例规模**：

![后端测试用例数量](images/4.软件测试/后端/测试数量.png)

**覆盖率报告**：

![后端覆盖率 1](images/4.软件测试/后端/覆盖率1.png)

![后端覆盖率 2](images/4.软件测试/后端/覆盖率2.png)

![后端测试通过率](images/4.软件测试/后端/测试通过率.png)

**JWT 测试夹具**（集成测试基础）：

![conftest auth_headers 夹具](images/4.软件测试/后端/代码/conftest-auth_headers.png)

**前端（赵一诺 · PR #24 / #84）：**

- **131** 个用例（28 个测试文件）。
- 目录：`__tests__/api`（8 文件 / **37** 用例）、`__tests__/components`（7）、`__tests__/pages`（8）、`__tests__/utils`（含 `planDates.test.js`）。
- 正常 + 边界/异常场景；核心模块覆盖率 **~75%**。
- Cursor 辅助生成 66 个用例，人工补充边界与 mock 重置。

**测试技巧**：

- 异步：`flushPromises()` 等待 `onMounted` 请求完成。
- Mock：`window.confirm` 用 `vi.fn()`；`beforeEach` 中 `mockReset()` + 清理 storage。

**本地 Vitest 全量执行**：

![前端 Vitest 测试 1](images/4.软件测试/前端/测试1.png)

![前端 Vitest 测试 2](images/4.软件测试/前端/测试2.png)

**API 契约测试** 详见 **§5.4**：

![前端 API 契约测试](images/4.软件测试/前端/契约API.png)

## 10.3 集成测试

- 后端 API 测试通过 Flask `test_client` + JWT fixture（`conftest.py`，见上截图）。
- 前端 `api/*.test.js` 验证请求路径与 method、timeout 等参数（见 §5.4）。

**Apifox 手工联调**（接口层集成，非 E2E）见 **§5.4** 中的截图。

## 10.4 端到端测试

- 未引入 Playwright；核心流程靠 API 测试 + 线上手工验证（登录 → AI 计划 → 打卡 → 分析）。

## 10.5 测试结果汇总

| 测试类型 | 用例数 | 通过率 | 覆盖率（约） | 负责人 |
|---------|--------|--------|--------------|--------|
| 后端单元/集成 | 99 | 100% | ~80% | 贾静怡 |
| 前端单元 | 131 | 100% | ~75% | 赵一诺 |
| 前端 API 契约 | 37 | 100% | — | 赵一诺 |
| CI Lint | ruff + eslint | 通过 | — | 二人 |

---

# 十一、持续集成与持续交付（CI/CD） [赵一诺、贾静怡]

## 11.1 CI/CD 方案

| 工作流 | 文件 | 说明 |
|--------|------|------|
| CI | `.github/workflows/ci.yml` | push/PR 触发 lint + test + coverage |
| 镜像构建 | `.github/workflows/docker.yml` | 推送 GHCR + Trivy 扫描 |
| 安全扫描 | `.github/workflows/security.yml` | Gitleaks + npm audit |
| 可选 CD | `.github/workflows/deploy-cloud.yml` | SSH 自动部署（step 级 secrets 判断；需配置 DEPLOY_HOST 等） |

**CI 工作流配置**（backend / frontend 并行 job）：

![CI1](images/5.持续集成/代码/ci.yml.png)

![CI2](images/5.持续集成/CI2.png)

## 11.2 自动化流水线

**前端 CI（赵一诺 · PR #39/#43）：**

1. `npm ci`
2. `npm run lint`（ESLint）
3. `npm run test:coverage` → `coverage/lcov.info`
4. Codecov 上传（`flags: frontend`）

**Windows 适配**：编写 `run-vitest.mjs`，用 `spawnSync` 统一 cwd，解决 `chdir` 不继承与盘符混用导致 Vitest 双份 runner 问题。

![统一cwd](images/5.持续集成/代码/run-vitest.mjs.png)

**后端 CI（贾静怡 · PR #40/#42）：**

1. `pip install -r requirements.txt`
2. `ruff check .`
3. `pytest`（`pytest.ini` 统一 `--cov` 与 `coverage.xml`）
4. Codecov 上传（`flags: backend`）

**注意**：以 `pytest` 为准，勿与 `coverage run -m pytest` 叠用（会出现 No data to report）。

**CI 运行结果：**

**GitHub Actions 全绿通过**（backend + frontend job 均 success）：

![GitHub Actions CI 运行成功](images/5.持续集成/CI运行成功.png)

**CD 阶段（生产）：**

1. 本地/服务器 `docker compose -f compose.prod.yaml up -d --build`
2. 或 GHCR pull + `scripts/cloud-update.sh`

## 11.3 分支保护与质量门禁

- 合并 `main` 前期望 CI 绿色。
- README 徽章：CI、Backend Coverage、Frontend Coverage。

![README CI 与覆盖率徽章](images/5.持续集成/README徽章.png)

---

# 十二、系统部署 [赵一诺、贾静怡]

## 12.1 部署架构

**部署设计证据：**部署章节保留本地 Docker 成功运行和部署后打开项目截图，证明系统设计不仅停留在代码层面，也完成了可复现运行环境设计。

![Docker 成功运行](images/7.系统docker部署/docker成功运行.png)

![Docker 部署打开项目](images/7.系统docker部署/docker部署打开项目.png)

```text
Internet :80
    │
    ▼
[ fitmate-frontend-prod ]  Nginx → 静态 Vue + /api 反代
    │
    ▼
[ fitmate-backend-prod ]   Gunicorn :5000
    │
    ▼
[ fitmate-mysql-prod ]     仅内网，卷 mysql_data_prod
```

## 12.2 容器化

| 文件 | 说明 | 负责人 |
|------|------|--------|
| `compose.yaml` | 开发：Vite + Flask reload + MySQL | 二人 |
| `compose.prod.yaml` | 生产：Nginx + Gunicorn + MySQL | 贾静怡 |
| `backend/Dockerfile` | 多阶段 development / production | 贾静怡 |
| `frontend/.../Dockerfile` | 多阶段 dev / nginx 生产 | 赵一诺 |
| `frontend/.../nginx.conf` | 静态 + `/api` 反代 + `/health` | 赵一诺 |
| `deploy.sh` / `deploy.bat` | 一键生产启动 | 贾静怡 |
| `pack-upload.bat` | Windows 打包 tar.gz（排除 .env / node_modules） | 贾静怡 |

**前端容器要点（赵一诺 · PR #54）：**

- 开发：`frontend_node_modules` 命名卷，避免宿主机覆盖 Linux 容器依赖。
- 生产：axios 使用相对路径 `/api`，Nginx 反代 `backend:5000`，构建无需写死后端域名。
- `try_files` 支持 Vue Router history 模式。

**后端容器要点（贾静怡 · PR #53）：**

- Gunicorn 生产运行；非 root 用户 `app`。
- MySQL `healthcheck` + `depends_on: condition: service_healthy`。
- pip 使用阿里云镜像：`-i https://mirrors.aliyun.com/pypi/simple/`。

## 12.3 部署步骤（生产 · 阿里云）

**本机打包**：

```bat
tar -czf fitmate-upload.tar.gz --exclude=node_modules --exclude=.git --exclude=frontend/fitmate-frontend/node_modules --exclude=frontend/fitmate-frontend/dist --exclude=.env .
```

**服务器**（`/opt/fitmate`）：

```bash
sudo mkdir -p /tmp/fitmate-keep
sudo cp -a /opt/fitmate/.env /opt/fitmate/secrets /tmp/fitmate-keep/
cd /opt && sudo rm -rf fitmate && sudo mkdir fitmate && cd fitmate
sudo tar -xzf /tmp/fitmate-upload.tar.gz
sudo cp -a /tmp/fitmate-keep/.env /tmp/fitmate-keep/secrets .
注：在备份 .env 基础上追加 QWEN_CHAT_* 等，勿覆盖 MYSQL_ROOT_PASSWORD
sudo docker compose -f compose.prod.yaml up -d --build
docker compose -f compose.prod.yaml up -d --force-recreate backend
curl -s http://127.0.0.1/health
```

## 12.4 环境配置

| 变量 | 说明 |
|------|------|
| MYSQL_ROOT_PASSWORD | 数据库 root 密码（与数据卷、secrets 一致） |
| SECRET_KEY / JWT_SECRET_KEY | Flask/JWT 密钥 |
| QWEN_API_KEY / QWEN_MODEL | AI 基础配置 |
| QWEN_PLAN_MODEL / QWEN_PLAN_TIMEOUT | 计划生成模型与超时 |
| QWEN_CHAT_MODEL / QWEN_CHAT_TIMEOUT | 教练对话模型与超时 |
| FITMATE_AI_PLAN_FALLBACK / FITMATE_AI_CHAT_FALLBACK | AI 降级开关 |
| HTTP_PORT | 默认 80 |
| FITMATE_PRODUCTION | 生产标记，启用 JSON 日志等 |
| FITMATE_PASSWORD_RESET_CODE | 重置密码验证码 |

---

# 十三、云服务应用 [贾静怡]

## 13.1 云平台选型

项目部署在 **阿里云轻量应用服务器（Ubuntu 22.04，2 核 2G）**。选择该平台的主要原因是国内访问延迟低、具备公网 IP、课程演示成本可控，并且适合使用单机 Docker Compose 快速部署前后端与 MySQL。

赵一诺负责前端 Nginx 配置与浏览器侧验证；贾静怡负责服务器初始化、Compose 编排、数据库与后端运维。

![阿里云云服务器](images/8.云服务部署/阿里云云服务器.png)

## 13.2 使用的云服务

| 服务类型 | 具体产品 | 用途 |
|---------|---------|------|
| 计算 | 阿里云轻量应用服务器 | 运行 Docker Compose |
| 数据库 | 容器内 MySQL 8 | 业务数据持久化 |
| 存储 | 云盘 | 系统盘与 Docker 卷 |
| AI | 阿里云 DashScope | 通义千问 API 调用 |
| 代码托管 | GitHub | 源码管理与 CI |
| 镜像仓库 | GHCR | backend/frontend 镜像 |

线上部署采用公网 80 端口访问，后端健康检查通过 `/health` 验证，生产更新以备份 `.env`、保留 MySQL 卷、重新构建服务为基本流程。部署过程中遇到的 pip 超时、MySQL 密码与数据卷不一致、AI 503/超时、云端 `.env` 误覆盖等问题，已通过阿里云 PyPI 镜像、密钥备份、AI 本地降级和 tar 包更新流程解决。

![云端网页打开](images/8.云服务部署/用云端网页打开.png)

## 13.3 成本与资源配置

| 资源 | 配置/计费方式 | 说明 |
|------|--------------|------|
| 服务器 | 2 核 2G 轻量应用服务器，约 50-100 元/月 | 满足课程演示与验收访问 |
| 数据库 | MySQL 8 容器 + Docker 卷 | 与应用部署在同一台服务器，降低成本 |
| AI 服务 | DashScope 按量计费 | 新用户 Token 免费额度可覆盖演示场景 |
| CI/CD | GitHub Actions | 公开仓库免费分钟数可满足测试流水线 |

整体资源配置以“可复现、低成本、足够稳定”为目标；当前单机部署不追求高并发扩展，但通过健康检查、日志和降级策略保证演示环境可用。

---

# 十四、可观测性与监控 [赵一诺、贾静怡]

## 14.1 错误追踪

项目未接入 Sentry 等独立错误追踪平台，当前采用前端 Console 日志、Axios 失败事件、后端结构化日志和 Docker logs 联合定位问题。前端请求失败会记录 method、url、status、durationMs 与错误消息；后端记录 `request_start`、`request_end`、状态码和路径，便于复盘线上异常。

## 14.2 日志管理

后端通过 `utils/logger.py` 输出结构化日志，可由 `FITMATE_LOG_LEVEL` 和 `FITMATE_LOG_JSON` 控制格式；Flask `before_request` / `after_request` 记录请求链路。前端通过 `utils/logger.js` 统一输出 time、level、module、message 和 detail，并在 Axios 拦截器中记录 API 耗时。

```text
浏览器 axios 拦截器 -> logger.js
Nginx /health 反代 -> backend/health.py
Flask before/after -> logger.py + metrics.py
GET /api/metrics -> 进程内计数器
```

![后端监控1](images/9.系统监控/后端1.png)

![后端监控2](images/9.系统监控/后端2.png)

## 14.3 健康检查与可用性监控

后端提供 `GET /health` 和 `GET /api/health`，返回服务状态、时间戳、版本和数据库检查结果；Compose healthcheck 依赖该接口判断后端可用性。前端 Nginx 将 `/health` 反代到后端，便于从公网快速验证生产环境。

```bash
curl -s http://121.196.198.164/health
curl -s http://121.196.198.164/api/ai/health
docker compose -f compose.prod.yaml logs -f backend
```

![运维监控可视化页](images/9.系统监控/可视化.png)

## 14.4 指标监控

后端 `GET /api/metrics` 暴露进程内 HTTP 指标，包括 `requests_total`、`errors_total`、`error_rate`、`latency_ms_avg`、`by_status` 和 `uptime_seconds`。health/metrics 路径默认不计入业务请求指标，避免探活流量污染统计。当前尚未接入 Prometheus/Grafana，指标主要用于课程验收与线上排障。

---

# 十五、性能优化 [赵一诺、贾静怡]

## 15.1 性能基线报告

| 指标 | 参考值 |
|------|--------|
| `/health` | < 50ms（内网） |
| 静态首屏 | Vite 生产包 + Nginx gzip |
| AI 生成计划 | 10–180s（qwen-plus + 降级兜底） |
| AI 教练对话 | 5–120s（超时后本地模板） |

## 15.2 已完成的优化项

| 优化项 | 优化前 | 优化后 | 负责人 |
|--------|--------|--------|--------|
| Docker pip 安装 | 频繁超时 | 稳定 | 贾静怡 |
| 头像上传 | 500 错误 | 成功 | 赵一诺 + 贾静怡 |
| 打卡统计 | 重复计数 | 准确 | 贾静怡 |
| 计划时长 | 常显示 0 | 合理估算 | 贾静怡 |
| 前端统计 | 需刷新 | 实时 | 赵一诺 |
| 计划列表汇总 | 显示 0 | 正确聚合 | 贾静怡 |
| 饼图标签 | 空白 | 正常 | 赵一诺 |
| Vitest Windows | CI 失败 | 稳定 | 赵一诺 |
| AI DashScope 503 | 直接失败 | 本地模板降级 | 贾静怡 |
| 计划周数 | 硬编码 4 周 | 按起止日期计算 | 赵一诺 + 贾静怡 |
| 成就解锁 | 仅展示未写入 | 打卡/互动自动 sync | 贾静怡 |
| 云端更新 .env | 误删数据库密码 | tar 部署 + 备份恢复 | 贾静怡 |

---

# 十六、功能展示 [赵一诺、贾静怡]

**线上演示地址**：http://121.196.198.164/  
**测试账号**：`test@example.com` / `123456`

## 16.1 系统演示

FitMate 的核心演示流程为：用户登录后进入 AI 教练对话，生成训练计划，在今日任务中打卡，并在数据分析页查看训练趋势与 AI 建议。知识库、个人中心、成就徽章和云端部署页面作为辅助展示，证明系统已形成完整的 Web 健身辅助闭环。

![公网访问 FitMate](images/8.云服务部署/用云端网页打开.png)

**AI 教练对话**

![AI教练对话](images/3.AI集成/AI教练对话.png)

**AI 生成训练计划**

![AI计划生成表单](images/3.AI集成/AI计划生成表单.png)

![智能计划生成成功](images/3.AI集成/智能计划生成成功.png)

**AI 数据分析**

![AI数据分析](images/3.AI集成/AI进度分析.png)

**云端 Docker 部署**

![阿里云终端部署](images/8.云服务部署/阿里云线上终端docker部署项目.png)

## 16.2 性能测试结果

- 健康检查稳定返回 200，数据库状态为 `up`。
- 单台 2G 轻量服务器可满足课程演示和验收访问需求。
- 静态资源由 Vite 生产构建与 Nginx 承载，后端由 Gunicorn + Flask 提供 API。
- AI 计划和教练对话受模型响应与网络状况影响，前端提供 loading 与超时提示，后端通过本地模板降级保证基本可用。

---

# 十七、总结与展望 [赵一诺、贾静怡]

## 17.1 项目总结

FitMate 完成了从 **UI 原型（Figma）→ 架构设计 → API 契约 → 前后端实现 → AI 集成 → 单元测试 → CI/CD → 安全审查 → Docker 容器化 → 阿里云上线 → 监控配置 → 线上优化迭代** 的完整工程闭环。报告已将该过程分别落实到项目介绍、UI/UX、架构、API、前后端实现、测试、部署和监控章节中，并通过截图作为过程证据。

核心健身流程——**注册 → AI 生成计划 → 今日打卡 → 成就解锁 → 数据分析复盘**——可在生产环境 http://121.196.198.164/ 完整跑通。

## 17.2 技术收获

**赵一诺（前端）**：

- Vue 3 组件化与 7 个公共组件封装。
- Axios 拦截器、Mock 开发、复杂页面状态（Plan 周视图、实时统计）。
- Vitest 测试与 Windows CI 适配。
- Nginx 生产配置、Docker 前端镜像、前端监控埋点。

**贾静怡（后端）**：

- Flask 分层架构、MySQL ER 设计、SQLAlchemy 多环境切换。
- JWT 鉴权、AI prompt 工程与 JSON 解析。
- pytest 覆盖率 ~80%；成就与 AI 降级测试补全。
- Docker/Gunicorn 生产镜像、阿里云 tar 部署、结构化日志与 metrics。

## 17.3 问题与反思

| 问题 | 经验 |
|------|------|
| 线上代码与本地不一致 | 整包 tar 部署 + 备份 .env |
| MySQL 密码与卷不匹配 | 禁止随意 `down -v`；nano 时保留 MYSQL_ROOT_PASSWORD |
| AI 返回字段不稳定 | 服务端 normalize + 时长估算 + 本地模板降级 |
| DashScope 超时/503 | 分场景模型 qwen-plus + 延长超时 + fallback |
| 成就只展示不解锁 | 业务逻辑下沉 achievement_service，多触发点 sync |
| 前后端字段命名不一致 | 以 OpenAPI 为单一真相源 |
| Windows 与 Linux CI 行为差异 | 统一 npm script 入口，避免裸跑 vitest |
| deploy-cloud 语法错误 | secrets 仅可在 step 级 if 使用 |

## 17.4 未来展望

- 接入 Redis 缓存与 Sentry 错误追踪。
- 头像改对象存储（OSS）；配置 HTTPS 证书。
- 移动端 PWA 或小程序。
- 引入 Playwright 端到端自动化测试。
- JWT 登出黑名单或服务端 token 撤销。

---

# 参考文献

[1] Vue.js 官方文档. https://vuejs.org/

[2] Flask 官方文档. https://flask.palletsprojects.com/

[3] 阿里云 DashScope 文档. https://help.aliyun.com/zh/model-studio/

[4] Docker 文档. https://docs.docker.com/

[5] MySQL 8.0 参考手册. https://dev.mysql.com/doc/

[6] OpenAPI Specification. https://swagger.io/specification/

---

# AI 使用声明

本文档中以下部分由 AI 辅助生成，经人工审核和修改：

| 章节 | AI 工具 | 使用方式 | 人工修改情况 |
|------|---------|---------|-------------|
| 第一章 项目介绍 | Cursor | 基于项目材料生成章节初稿与基础框架，整理背景、目标、功能模块、技术选型与团队分工等内容脉络 | 团队结合实际实现过程补充细节，统一表述，并逐项核对与项目内容一致 |
| 第二章 版本控制与团队协作 | Cursor | 生成分支策略、提交规范、PR 协作流程与仓库统计说明的初步结构 | 团队根据 GitHub 仓库记录补全具体内容，并对流程与数据进行人工复核 |
| 第三章 UI/UX 设计与原型 | Cursor | 按原型设计材料整理章节草稿，搭建用户画像、页面原型、设计规范与交互逻辑的表达框架 | 团队依据 Figma 原型与前端实现结果补充说明，调整细节并完成全文校对 |
| 第四章 软件架构设计 | Cursor | 生成系统架构、模块划分、数据流与前后端职责说明的基础草稿 | 团队结合实际代码结构、数据库设计与部署方案补全内容，并逐段核查准确性 |
| 第五章 API 设计 | Cursor | 整理接口设计章节的初稿框架，概括认证方式、统一响应格式与核心接口示例 | 团队对照 OpenAPI 文档与后端实现逐条补充、修正并完成一致性校验 |
| 第六章 前端实现 | Cursor | 基于页面与组件信息生成章节草稿，梳理页面结构、组件拆分与交互实现思路 | 团队结合前端源码、联调情况与运行效果补充完整，并统一术语与表述 |
| 第七章 后端实现 | Cursor | 生成后端实现部分的基础框架，概括路由层、服务层、数据库模型与业务逻辑 | 团队依据后端代码、数据库结构与测试结果补充细节，并进行全面校核 |
| 第八章 AI 工程化应用 | Cursor | 整理 AI 功能相关章节草稿，概括 AI 教练、训练计划、饮食建议与分析功能的整体结构 | 团队结合实际功能流程、接口调用方式与 prompt 设计补充完善，并反复核对描述准确性 |
| 第九章 安全设计 | Cursor | 生成安全设计章节初稿，搭建鉴权、密码存储、环境变量与安全审查的说明框架 | 团队根据安全配置、测试结果与审查记录补充细节，并完成人工复核 |
| 第十章 软件测试 | Cursor | 梳理测试章节草稿，概括前后端测试策略、测试类型、覆盖率与结果分析结构 | 团队结合本地测试与 CI 运行结果补充真实数据，修订内容并逐项校对 |
| 第十一章 持续集成与持续交付（CI/CD） | Cursor | 生成 CI/CD 章节初稿，整理工作流结构、质量门禁与自动化流程的基本框架 | 团队对照 GitHub Actions 工作流文件与运行记录补充细节，并核验描述无误 |
| 第十二章 系统部署 | Cursor | 搭建部署章节草稿，概括 Docker、Compose、Nginx、Gunicorn 与部署流程 | 团队结合实际部署步骤、脚本与线上运行情况补全内容，并进行完整校对 |
| 第十三章 云服务应用 | Cursor | 整理云服务应用章节的初步框架，概括阿里云环境配置与上线过程 | 团队依据真实云端操作记录补充细节，修正表述并人工确认准确性 |
| 第十四章 可观测性与监控 | Cursor | 生成监控章节初稿，梳理日志、健康检查、指标采集与前后端监控实现结构 | 团队结合监控接口、日志结果与运行情况补充说明，并逐项完成核对 |
| 第十五章 性能优化 | Cursor | 生成性能优化章节草稿，归纳构建、请求、数据库与运行性能方面的优化思路 | 团队根据实际优化项与效果补充验证内容，修订后完成全文复核 |
| 第十六章 功能展示 | Cursor | 按系统模块生成功能展示章节的基础框架，梳理主要功能流程与典型使用场景 | 团队结合真实页面、运行结果与展示材料补全内容，并逐一检查准确性 |
| 第十七章 总结与展望 | Cursor | 生成总结与展望章节初稿 | 团队结合项目复盘内容进一步完善、润色并完成最终校对 |

未在上表中列出的内容均由团队成员独立撰写。

---

# 第三方库与开源引用

| 库 / 框架 | 版本 | 用途 | 来源 |
|-----------|------|------|------|
| Flask | ≥3.0 | Web 框架 | https://flask.palletsprojects.com |
| Flask-SQLAlchemy | ≥3.1 | ORM | https://flask-sqlalchemy.palletsprojects.com |
| Flask-JWT-Extended | ≥4.6 | JWT | https://flask-jwt-extended.readthedocs.io |
| Vue | ^3.5 | 前端框架 | https://vuejs.org |
| Vite | ^8.0 | 构建工具 | https://vite.dev |
| Axios | ^1.16 | HTTP 客户端 | https://axios-http.com |
| Vitest | ^4.1 | 前端测试 | https://vitest.dev |
| pytest | ≥8.0 | 后端测试 | https://pytest.org |

---

# 项目结构

```text
FitMate/
├── docs/                              # 项目文档
│   ├── report.md                      # 本最终报告
│   ├── api.yaml                       # OpenAPI 规范
│   ├── images/                        # 实验报告所需图片
│   └── contribution/                  # 各讲次个人贡献
│       ├── 02-ui/zhaoyinuo.md
│       ├── 03-architecture/
│       ├── 04-api/
│       ├── 05-frontend/
│       ├── 06-backend/
│       ├── 07-ai/
│       ├── 08-testing/
│       ├── 09-cicd/
│       ├── 10-security/
│       ├── 11-docker/
│       ├── 12-cloud/
│       └── 13-monitoring/
│
├── frontend/fitmate-frontend/         # Vue 3 前端（赵一诺）
│   ├── src/pages/                     # 页面组件
│   ├── src/components/                # 通用组件
│   ├── src/api/                       # 接口封装
│   ├── src/router/                    # 路由
│   ├── src/utils/                     # logger、image、coachChatStorage、planDates
│   ├── src/__tests__/                 # Vitest 测试
│   ├── nginx.conf                     # 生产 Nginx
│   └── Dockerfile
│
├── backend/                           # Flask 后端（贾静怡）
│   ├── routes/                        # 路由层
│   ├── services/                      # 业务层（含 achievement_service、ai_service）
│   ├── models/                        # ORM 模型
│   ├── utils/                         # 日志/健康/指标/时长估算/plan_dates
│   ├── tests/                         # pytest
│   ├── data/                          # 种子数据
│   ├── schema_mysql.sql               # MySQL 建表
│   └── Dockerfile
│
├── compose.yaml                       # 开发 Compose
├── compose.prod.yaml                  # 生产 Compose
├── deploy.sh / deploy.bat             # 部署脚本
├── pack-upload.bat                    # Windows 打包上传
├── scripts/cloud-update.sh            # 服务器更新
├── codecov.yml                        # Codecov 覆盖率策略
├── README.md                          # 快速启动与云部署
└── .github/workflows/                 # CI/CD/Security/Docker/Deploy
```
