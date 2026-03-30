### 认证模块

```
POST   /api/users/register            # 用户注册（邮箱/手机号）
POST   /api/auth/login                 # 用户登录（邮箱/手机号/用户名）
POST   /api/auth/forgot-password       # 忘记密码 - 发送验证码
POST   /api/auth/reset-password        # 忘记密码 - 重置密码
POST   /api/auth/logout                # 退出登录
```

### 个人中心模块

```
GET    /api/users/profile              # 获取用户个人信息与身体数据
PUT    /api/users/profile              # 修改用户个人信息与身体数据
PUT    /api/users/profile/avatar      # 上传/更新头像
GET    /api/users/stats                # 获取用户训练统计
GET    /api/users/achievements         # 获取用户成就徽章列表（已/未获得）
POST   /api/users/password/change     # 修改密码
DELETE /api/users/account              # 注销账号
```

### AI 教练模块

```
GET    /api/coaches                    # 获取AI教练配置列表
GET    /api/coaches/session/init       # 初始化AI教练页面
PUT    /api/coaches/current            # 切换当前AI教练设定
POST   /api/coaches/chat               # 发送消息并获取AI回复
DELETE /api/coaches/session            # 重置当前会话
```

### 训练计划模块

```
GET    /api/plans/overview             # 获取训练计划页顶部统计概览
GET    /api/plans                      # 获取训练计划列表
GET    /api/plans/{id}                 # 获取训练计划详情
POST   /api/plans                      # 手动创建训练计划
POST   /api/plans/ai-generate          # AI生成训练计划
DELETE /api/plans/{id}                 # 删除训练计划

GET    /api/plans/today                # 获取今日训练任务列表
PATCH  /api/plans/today/{taskId}/complete  # 今日任务打卡完成/取消完成
POST   /api/plans/{id}/tasks           # 向指定计划添加训练任务
DELETE /api/plans/{id}/tasks           # 从计划中移除训练任务
```

### 知识库模块

```
GET    /api/articles                   # 获取内容列表（支持分类/关键词筛选）
GET    /api/articles/categories         # 获取知识库全部分类
GET    /api/articles/{id}              # 获取文章/视频详情
POST   /api/articles/{id}/like          # 点赞文章（Toggle）
POST   /api/articles/{id}/collect       # 收藏文章（Toggle）
GET    /api/articles/{id}/comments      # 获取文章评论列表
POST   /api/articles/{id}/comments      # 发表评论
GET    /api/articles/collections        # 获取我的收藏
```

### 数据分析模块

```
GET    /api/analytics/overview              # 获取数据总览（支持 range=7d / 30d）
GET    /api/analytics/category-distribution # 获取运动类型分布（支持 range=7d / 30d）
GET    /api/analytics/duration-trend        # 获取训练时长趋势（支持 range=7d / 30d）
GET    /api/analytics/ai-suggestions        # 获取AI建议（支持 range=7d / 30d）
```
