# FitMate——项目规则

## 技术栈
- 前端：Vue 3 + Vite + JavaScript
- 网络请求：Axios
- 后端：Python Flask（RESTful API）
- 数据库：MySQL
- 认证：JWT（Flask-JWT-Extended）
- 跨域：Flask-CORS

## 目录结构
前端：

- src/components/ - 可复用组件
- src/pages/ - 页面组件
- src/api/ - API 调用
- src/router/ - 路由管理
- src/styles/ - 样式文件
- src/utils/ - 工具函数

后端：

- backend/models/ - 数据模型
- backend/routes/ - 接口路由
- backend/services/ - 业务逻辑
- backend/utils/ - 工具函数

## 代码规范
- 前端使用组件化开发（Pages + Components）
- 路由统一由 router 管理
- 接口请求统一封装在 api 模块
- API 响应使用统一格式（code / message / data）
- 后端采用分层架构（routes / services / models / utils）
- 业务逻辑集中在 services 层

## 禁止事项
- 不要在页面组件中写复杂业务逻辑
- 不要在 routes 中写核心业务逻辑
- 不要暴露数据库配置或密钥信息
- 不要修改统一接口返回格式
- 不要绕过 JWT 鉴权调用接口