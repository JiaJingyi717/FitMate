# FitMate 数据库设计文档

## 1. 数据库概述

### 1.1 数据库选型

- **MySQL 5.7+**（`fitmate` 库，`utf8mb4` 字符集，`mysql+pymysql://` 驱动，`DATABASE_URL` 环境变量指定）
- 通过 `DATABASE_URL` 切换引擎；设为 `sqlite:///fitmate.db` 时可零配置启动（仅限开发）

### 1.2 数据库名称

```
fitmate
```

### 1.3 字符集

```
utf8mb4
```

---

## 2. E-R 图

```mermaid
erDiagram
    users {
        bigint id PK
        varchar username UK
        varchar password
        varchar goal
        varchar coach_gender
        varchar coach_style
        datetime created_at
    }

    training_plan {
        bigint id PK
        bigint user_id FK
        varchar plan_name
        varchar description
        varchar status
        datetime created_at
        datetime updated_at
    }

    training_record {
        bigint id PK
        bigint user_id FK
        bigint plan_id FK "可空"
        int duration
        varchar exercise_type
        date record_date
        datetime created_at
    }

    knowledge {
        bigint id PK
        varchar title
        varchar category
        text content
        varchar video_url
    }

    users ||--o{ training_plan : "1:N，用户拥有计划"
    users ||--o{ training_record : "1:N，用户打卡"
    training_plan ||--o{ training_record : "1:N，计划含多条打卡（plan_id可空）"
```



---

## 3. 数据表设计

### 3.1 用户表（users）

存储用户账号信息。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | — | 用户唯一标识 |
| username | VARCHAR(64) | NOT NULL, UNIQUE | — | 用户名 |
| password | VARCHAR(255) | NOT NULL | — | 密码（加密存储） |
| goal | VARCHAR(255) | — | '' | 训练目标 |
| coach_gender | VARCHAR(32) | — | 'female' | 偏好教练性别 |
| coach_style | VARCHAR(32) | — | 'gentle' | 偏好教练性格 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

**建表 SQL（MySQL）：**

```sql
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    goal VARCHAR(255) DEFAULT '',
    coach_gender VARCHAR(32) DEFAULT 'female',
    coach_style VARCHAR(32) DEFAULT 'gentle',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**字段说明：**

| 字段 | 枚举值 | 说明 |
|------|--------|------|
| coach_gender | `female`, `male` | 偏好教练性别 |
| coach_style | `gentle`, `strict` | 偏好教练性格；实际代码仅 `gentle`/`strict`，非 `humorous` |

---

### 3.2 训练计划表（training_plan）

存储用户创建的训练计划。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | — | 计划唯一标识 |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | — | 所属用户 ID |
| plan_name | VARCHAR(128) | NOT NULL | — | 计划名称 |
| description | TEXT | — | '' | 计划描述 |
| status | VARCHAR(32) | NOT NULL | 'todo' | 计划状态 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

**建表 SQL（MySQL）：**

```sql
CREATE TABLE IF NOT EXISTS training_plan (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_name VARCHAR(128) NOT NULL,
    description TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'todo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**字段说明：**

| 字段 | 枚举值（示例） | 说明 |
|------|----------------|------|
| status | `todo`（默认）, `in_progress`, `completed` | 计划状态；由前端/后端协作决定实际写入的值 |

---

### 3.3 训练记录表（training_record）

存储用户每次训练打卡记录。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | — | 记录唯一标识 |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | — | 用户 ID |
| plan_id | BIGINT | FOREIGN KEY | NULL | 关联计划 ID |
| duration | INT | NOT NULL | 0 | 训练时长（分钟），默认 30，由打卡接口传入 |
| exercise_type | VARCHAR(64) | NOT NULL | — | 运动类型，必填，由打卡接口传入 |
| record_date | DATE | NOT NULL | — | 训练日期，由打卡接口在提交时自动填入当天日期 |
| created_at | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 记录时间 |

**建表 SQL（MySQL）：**

```sql
CREATE TABLE IF NOT EXISTS training_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_id BIGINT,
    duration INT NOT NULL DEFAULT 0,
    exercise_type VARCHAR(64) NOT NULL,
    record_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_record_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_record_plan FOREIGN KEY (plan_id) REFERENCES training_plan(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**字段说明：**

| 字段 | 枚举值（示例） | 说明 |
|------|----------------|------|
| exercise_type | 自由字符串，如 `综合训练`、`跑步`、`力量训练` 等 | 由打卡接口 `exerciseType` 参数传入，无枚举限制 |
| plan_id | — | 可为空（`plan_id` 字段无 NOT NULL），表示自由训练不关联任何计划 |

---

### 3.4 知识库表（knowledge）

存储健身知识内容。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | — | 知识唯一标识 |
| title | VARCHAR(255) | NOT NULL | — | 知识标题 |
| category | VARCHAR(64) | NOT NULL | — | 知识分类 |
| content | TEXT | NOT NULL | — | 知识内容 |
| video_url | VARCHAR(255) | — | '' | 视频链接 |

**建表 SQL（MySQL）：**

```sql
CREATE TABLE IF NOT EXISTS knowledge (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    video_url VARCHAR(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**字段说明：**

| 字段 | 枚举值（示例） | 说明 |
|------|----------------|------|
| category | `力量训练`, `有氧训练`, `拉伸恢复` | 知识分类；由种子数据初始化，无枚举强制约束，新增文章时自由填写 |

---

## 4. 表关系说明

### 4.1 关系概述

| 关系 | 表A | 表B | 类型 | 说明 |
|------|-----|-----|------|------|
| 用户 - 训练计划 | users | training_plan | 一对多 | 一个用户可拥有多个训练计划 |
| 用户 - 训练记录 | users | training_record | 一对多 | 每条记录必属某用户（`user_id` 必填） |
| 训练计划 - 训练记录 | training_plan | training_record | 一对多（`plan_id` 可空） | 有 `plan_id` 时关联某计划；`NULL` 表示不绑定计划的自由训练，此时仍依赖 `user_id` |
| 知识库 | knowledge | — | 独立表 | 与其他表无外键关联 |

### 4.2 关系图

```
users (用户)
    │
    ├── 1:N ──▶ training_plan (训练计划)
    │
    └── 1:N ──▶ training_record (训练记录)
                     ▲
                     │
                     └── N:1 ── training_plan

knowledge (知识库) ── 独立，无外键关联
```

---

## 5. 索引设计

### 5.1 索引列表

| 表名 | 索引字段 | 类型 | 作用 |
|------|----------|------|------|
| users | username | UNIQUE | 保证用户名唯一，加速登录查询 |
| users | id | PRIMARY | 主键索引 |
| training_plan | user_id | INDEX | 加速按用户查询训练计划 |
| training_plan | id | PRIMARY | 主键索引 |
| training_record | user_id | INDEX | 加速按用户查询训练记录 |
| training_record | record_date | INDEX | 加速按日期范围查询 |
| training_record | id | PRIMARY | 主键索引 |
| knowledge | category | INDEX | 加速按分类查询知识 |
| knowledge | id | PRIMARY | 主键索引 |

---

## 6. 初始化数据

### 6.1 知识库初始数据

```sql
INSERT INTO knowledge (title, category, content, video_url) VALUES
('深蹲入门', '力量训练', '保持背部挺直，膝盖与脚尖方向一致。', ''),
('跑步减脂建议', '有氧训练', '每周 3-4 次中等强度跑步，每次 30 分钟以上。', ''),
('训练后拉伸', '拉伸恢复', '每个动作保持 20-30 秒，避免弹震式拉伸。', '');
```

---

## 7. SQLAlchemy 模型映射

### 7.1 模型文件对照

| 模型文件 | 对应数据表 |
|----------|------------|
| `models/user.py` | users |
| `models/plan.py` | training_plan |
| `models/record.py` | training_record |
| `models/knowledge.py` | knowledge |

### 7.2 模型关系定义

实际代码中 **未使用 SQLAlchemy `relationship`**，表间关联完全通过外键字段在查询时手动关联。以下为 `models/` 下各文件的字段对照：

```python
# models/user.py
class User(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    username    = db.Column(db.String(64), nullable=False, unique=True)
    password    = db.Column(db.String(255), nullable=False)
    goal        = db.Column(db.String(255), default="")
    coach_gender = db.Column(db.String(32), default="female")
    coach_style = db.Column(db.String(32), default="gentle")
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

# models/plan.py
class TrainingPlan(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    plan_name   = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, default="")
    status      = db.Column(db.String(32), default="todo")
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# models/record.py
class TrainingRecord(db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    plan_id       = db.Column(db.Integer, db.ForeignKey("training_plan.id"), nullable=True)
    duration      = db.Column(db.Integer, default=0)
    exercise_type = db.Column(db.String(64), nullable=False)
    record_date   = db.Column(db.Date, nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

# models/knowledge.py
class Knowledge(db.Model):
    id        = db.Column(db.Integer, primary_key=True)
    title     = db.Column(db.String(255), nullable=False)
    category  = db.Column(db.String(64), nullable=False)
    content   = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.String(255), default="")
```

> 注：`db.Integer` 对应 MySQL BIGINT，SQLAlchemy 会自动映射，无需在 `schema_mysql.sql` 中额外指定。

---

## 8. 数据库配置

数据库连接由 `backend/.env` 中的 `DATABASE_URL` 环境变量控制，`backend/config.py` 读取后赋值给 Flask-SQLAlchemy。

### 8.1 MySQL（默认，已在 .env 中配置）

```env
DATABASE_URL=mysql+pymysql://root:123456@127.0.0.1:3306/fitmate?charset=utf8mb4
```

### 8.2 SQLite（开发/调试用）

```env
DATABASE_URL=sqlite:///fitmate.db
```

> 切换后重启 Flask 服务即可，`db.create_all()` 会自动在对应引擎中建表。

---

## 9. 数据库维护

### 9.1 建表脚本

生产环境使用 `schema_mysql.sql` 脚本初始化数据库。

```bash
mysql -u root -p < schema_mysql.sql
```

### 9.2 表结构更新

在开发阶段，使用 SQLAlchemy 的 `db.create_all()` 自动同步模型与表结构。生产环境变更需手动执行 SQL 脚本并更新 `schema_mysql.sql`。
