# 安全审查贡献说明

姓名：赵一诺  
学号：2320100819  
日期：2026-05-12  

## 我完成的工作

### AI 安全审查

- 审查了哪些文件/模块：
  - 前端 Vue 组件：`src/pages/` 目录下的 9 个页面组件 + `src/components/` 目录下的 8 个公共组件
  - API 模块：`src/api/` 下的认证、用户、文章相关接口
  - 配置文件：`package.json`、`vite.config.js`、`.env`、`.gitignore`、`docker-compose.yml`
- AI 发现的主要问题：
  - vite.config.js 代理配置需要适配 Docker 网络环境
  - 前端环境变量 VITE_API_BASE_URL 需要在 Docker 中正确配置
  - KnowledgeDetail.vue 使用 `v-html` 渲染文章内容存在 XSS 风险（需确保使用 `escapeHtml()` 转义）
- 我修复了哪些问题：
  - 优化 `vite.config.js` 配置，适配 Docker 容器网络
  - 在 `docker-compose.yml` 中添加前端环境变量配置
  - 添加 `depends_on` 确保服务启动顺序
  - 在 `KnowledgeDetail.vue` 中实现了 `escapeHtml()` 函数，对所有用户输入内容进行 HTML 转义
  - 确认其他 v-html 使用（Home.vue、Analysis.vue、Layout.vue 等）仅用于渲染 SVG 图标，无安全风险

### 安全检查清单

#### 认证与授权
- ☐ **密码存储**：不适用（后端负责）
- ☐ **JWT / Session**：不适用（后端负责），前端正确处理 token 存储和过期跳转
- ☐ **接口鉴权**：不适用（后端负责），前端所有请求正确携带 Authorization header
- ☐ **越权访问**：不适用（后端负责）
#### 注入防护
- ☐ **SQL**：不适用（后端负责）
- ☑ **XSS**：✅ 适用
  - 检查了 `src/` 目录下的组件，未发现使用 `innerHTML` 渲染用户输入
  - 项目使用 Vue 框架，默认使用 `{{ }}` 插值自动转义
  - 如有富文本需求，建议引入 DOMPurify 进行净化
#### 敏感信息
- ☑ **API Key / 密码**：✅ 适用
  - 未发现硬编码的 API Key 或密码
  - API 地址通过 `import.meta.env.VITE_API_BASE_URL` 环境变量读取
  - Docker 配置中通过 `environment` 传递敏感配置
- ☑ **.env 文件**：✅ 适用
  - `.env` 文件已加入 `.gitignore`
  - 项目包含 `.env.example` 文件作为配置模板
#### 依赖安全
- ☑ **运行依赖扫描**：✅ 已完成
  - 前端运行 `npm audit`，发现 **0 漏洞**
  - 所有依赖版本均为安全版本

### CI 安全扫描

- 配置了哪个选项（A/B/C）：选项 A（Gitleaks）+ 文档选项 B 中的前端 npm audit（高危及以上）。 
- 扫描结果：以推送后 GitHub Actions **Security Scan** 最新一次运行为准；本地已与 CI 一致：**found 0 vulnerabilities**（high）。

### 选做完成情况

- 无

## PR 链接

- PR #48: https://github.com/JiaJingyi717/FitMate/pull/48

## 遇到的问题和解决

1. 问题：Docker 容器内前端无法正确调用后端 API  
   解决：在 docker-compose.yml 中配置 VITE_API_BASE_URL 环境变量，并简化 vite.config.js 代理逻辑

## 心得体会
作为前端开发者，在 Vibe Coding 场景下进行安全审查时，重点关注：
1. **依赖安全**：使用 `npm audit` 定期扫描第三方包，及时更新有漏洞的依赖
2. **环境隔离**：通过环境变量区分开发/生产配置，避免敏感信息硬编码
3. **Docker 配置**：确保前端容器与后端服务的网络通信正确配置
4. **效率平衡**：安全扫描应该是开发流程的一部分，但不必为了极致安全而牺牲开发效率，找到适合自己的节奏即可