# FitMate——后端说明

## 一、模块功能

后端主要负责业务逻辑处理、数据存储、接口提供以及 AI 服务调用，为前端页面提供统一的数据支持。结合当前前端设计，后端模块与页面功能一一对应，主要服务于 AI 教练互动、训练计划管理、知识库查询、数据分析展示和个人中心管理等功能。

主要模块如下：

| 前端页面       | 后端模块     |
| -------------- | ------------ |
| 首页（AI教练） | AI教练模块   |
| 训练计划       | 训练计划模块 |
| 知识库         | 知识库模块   |
| 数据分析       | 数据统计模块 |
| 个人中心       | 用户模块     |

------

# 二、系统模块设计

## 1 用户模块（User Module）

该模块负责用户身份认证与个人信息管理。

主要功能：

- 用户注册
- 用户登录
- 用户信息查询
- 修改用户信息
- 用户训练目标设置
- 用户教练偏好设置

## 2 AI教练模块（AI Coach Module）

该模块是系统核心交互模块，用于实现用户与 AI 教练的互动。

功能包括：

- AI 健身问答
- 训练建议生成
- 饮食建议
- AI 训练计划生成
- AI 数据分析建议

用户可以选择：

- 教练性别
- 教练性格

后端将这些参数作为 **Prompt 输入 LLM**。

------

## 3 训练计划模块（Training Plan Module）

该模块用于管理用户训练任务。

主要功能：

- AI生成训练计划
- 手动创建训练计划
- 查看训练计划
- 修改训练计划
- 删除训练计划
- 每日训练打卡

------

## 4 知识库模块（Knowledge Module）

知识库模块提供健身知识内容。

功能包括：

- 分类浏览
- 关键词搜索
- 查看知识详情
- 视频/图文内容展示

------

## 5 数据分析模块（Statistics Module）

该模块根据用户训练记录进行统计分析，并返回图表数据。

统计内容包括：

- 最近一周训练时长
- 最近一月训练时长
- 训练次数统计
- 运动项目分布
- AI分析建议

------

# 三、技术选型

根据 README 中的技术栈，后端技术如下：

| 技术                  | 用途     |
| --------------------- | -------- |
| Python Flask          | Web框架  |
| Flask-CORS            | 解决跨域 |
| MySQL                 | 数据库   |
| SQLAlchemy            | ORM      |
| JWT                   | 用户认证 |
| OpenAI / DeepSeek API | AI对话   |
| Python统计逻辑        | 数据分析 |

说明：

初期开发可以先使用 **本地MySQL数据库**。

------

# 四、数据库设计（核心表）

### 用户表

```
user
```

字段：

```
id
username
password
goal
coach_gender
coach_style
create_time
```

------

### 训练计划表

```
training_plan
```

字段：

```
id
user_id
plan_name
description
create_time
```

------

### 训练记录表

```
training_record
```

字段：

```
id
user_id
plan_id
duration
exercise_type
date
```

------

### 知识库表

```
knowledge
```

字段：

```
id
title
category
content
video_url
```

------

# 五、后端项目结构

```text
backend/
│
├─ app.py                    # 项目入口
├─ config.py                 # 配置文件
├─ requirements.txt          # 依赖文件
│
├─ models/                   # 数据模型
│  ├─ user.py                # 用户模型
│  ├─ plan.py                # 训练计划模型
│  ├─ record.py              # 训练记录模型
│  └─ knowledge.py           # 知识库模型
│
├─ routes/                   # 路由层
│  ├─ user_routes.py         # 用户相关接口
│  ├─ ai_routes.py           # AI教练相关接口
│  ├─ plan_routes.py         # 训练计划相关接口
│  ├─ knowledge_routes.py    # 知识库相关接口
│  └─ stats_routes.py        # 数据分析相关接口
│
├─ services/                 # 业务逻辑层
│  ├─ ai_service.py          # AI对话逻辑
│  ├─ plan_service.py        # 训练计划逻辑
│  ├─ knowledge_service.py   # 知识库逻辑
│  └─ stats_service.py       # 数据统计逻辑
│
├─ utils/                    # 工具层
│  ├─ jwt_utils.py           # token处理
│  ├─ response.py            # 统一返回格式
│  └─ db.py                  # 数据库初始化
│
└─ data/                     # 初期测试数据
   └─ seed_data.py
```

------

# 六、运行方式

### 1 安装依赖

```
pip install -r requirements.txt
```

### 2 启动后端

```
python app.py
```

### 3 默认访问地址

```
http://localhost:5000
```

------

# 七、前后端接口关系

| 前端页面    | API模块        |
| ----------- | -------------- |
| 首页 AI教练 | /api/ai        |
| 训练计划    | /api/plan      |
| 知识库      | /api/knowledge |
| 数据分析    | /api/stats     |
| 个人中心    | /api/user      |