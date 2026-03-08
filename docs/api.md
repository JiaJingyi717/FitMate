# API设计文档

## 一、模块功能

本项目 API 采用 **RESTful 设计风格**，主要用于支持前端页面的数据交互。当前阶段 API 以满足核心功能为目标，与前端模块一一对应，主要包括用户管理、AI 教练、训练计划、知识库以及数据统计等模块。

### 1. 用户模块

用于支持用户账号相关功能，为个人中心页面提供数据支持。

主要接口：

- 用户注册
- 用户登录
- 获取用户信息
- 修改用户资料

主要 API：

```
POST /api/register
POST /api/login
GET  /api/user/profile
PUT  /api/user/profile
```

------

### 2. AI 教练模块

用于支持首页 AI 教练互动功能。

主要接口：

- 用户发送问题
- AI 返回训练建议

主要 API：

```
POST /api/ai/chat
```

请求示例：

```
{
  "message": "我想减脂，应该怎么训练？",
  "coachGender": "female",
  "coachStyle": "gentle"
}
```

返回示例：

```
{
  "code": 200,
  "message": "success",
  "data": {
    "reply": "建议每周进行3-4次有氧训练，并结合基础力量训练。"
  }
}
```

------

### 3. 训练计划模块

用于支持训练计划页面。

主要接口：

- AI 生成训练计划
- 创建训练计划
- 查询训练计划
- 修改训练计划
- 训练打卡

主要 API：

```
POST /api/plans/generate
POST /api/plans
GET  /api/plans
PUT  /api/plans/{planId}
POST /api/plans/{planId}/check-in
```

------

### 4. 知识库模块

用于支持健身知识浏览与搜索。

主要接口：

- 获取知识分类
- 按分类获取知识
- 搜索知识
- 获取知识详情

主要 API：

```
GET /api/knowledge/categories
GET /api/knowledge
GET /api/knowledge/search
GET /api/knowledge/{id}
```

------

### 5. 数据统计模块

用于支持数据分析页面的图表展示。

主要接口：

- 获取训练统计数据
- 获取 AI 分析建议

主要 API：

```
GET /api/stats/summary
GET /api/stats/advice
```

返回示例：

```
{
  "code": 200,
  "message": "success",
  "data": {
    "totalDuration": 320,
    "trainingCount": 8,
    "sportDistribution": [
      {"name": "跑步", "value": 120},
      {"name": "力量训练", "value": 140},
      {"name": "拉伸", "value": 60}
    ]
  }
}
```

------

# 二、技术选型

API 服务基于 **轻量化 Web 框架**构建，便于快速开发和前后端联调。

主要技术如下：

| 技术                  | 作用               |
| --------------------- | ------------------ |
| Flask                 | 构建 REST API      |
| Flask-CORS            | 解决跨域问题       |
| SQLAlchemy            | ORM 数据库操作     |
| SQLite / MySQL        | 数据存储           |
| JWT                   | 用户登录认证       |
| OpenAI / DeepSeek API | AI 教练对话功能    |
| JSON                  | 前后端数据交换格式 |

说明：

- 初期阶段可使用 **SQLite**，便于快速开发
- 若系统规模扩大，可迁移至 **MySQL**

------

# 三、目录结构

API 后端推荐目录结构如下：

```
backend/
│
├── app.py
├── config.py
├── requirements.txt
│
├── models
│   ├── user.py
│   ├── plan.py
│   ├── record.py
│   └── knowledge.py
│
├── routes
│   ├── user_routes.py
│   ├── ai_routes.py
│   ├── plan_routes.py
│   ├── knowledge_routes.py
│   └── stats_routes.py
│
├── services
│   ├── ai_service.py
│   ├── plan_service.py
│   ├── stats_service.py
│
├── utils
│   ├── jwt_utils.py
│   ├── response.py
│   └── db.py
│
└── data
    └── seed_data.py
```

说明：

- **routes**：API 路由层
- **services**：业务逻辑层
- **models**：数据库模型
- **utils**：工具类

------

# 四、运行方式

## 1 安装依赖

```
pip install -r requirements.txt
```

------

## 2 启动 API 服务

```
python app.py
```

------

## 3 服务地址

默认 API 服务地址：

```
http://localhost:5000
```

接口基础路径：

```
http://localhost:5000/api
```

------

## 五、API返回格式

所有接口统一返回 JSON 数据：

```
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

字段说明：

| 字段    | 说明     |
| ------- | -------- |
| code    | 状态码   |
| message | 返回信息 |
| data    | 返回数据 |