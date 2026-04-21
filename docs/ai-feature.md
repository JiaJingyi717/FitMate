# AI 功能说明

## 概述

FitMate 应用集成通义千问 AI 能力，为用户提供智能化的健身辅助功能，包括个性化训练计划生成、健身问答和数据分析。

## 使用模型

| 配置项 | 值 |
|--------|-----|
| 模型 | 通义千问 qwen3.6-flash |
| API 提供商 | 阿里云 DashScope |
| API 地址 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| 环境变量 | `QWEN_API_KEY`、`QWEN_MODEL`、`QWEN_API_BASE` |

## 实现的功能

### 1. 智能训练计划生成

**功能描述：** 根据用户的身体信息、健身目标和偏好设置，AI 自动生成科学、个性化的训练计划。

**核心方法：** `QwenAIClient.generate_plan()`

**输入参数：**
- `goal` - 健身目标（增肌、减脂、塑形、综合健身）
- `level` - 运动水平（新手、有基础、专业）
- `days_per_week` - 每周训练天数
- `duration` - 计划时长（周）
- `preferences` - 训练偏好（有氧为主、力量为主）
- `restrictions` - 身体限制（膝盖不好、无器械等）
- `notes` - 额外需求

**输出内容：**
- 计划名称和描述
- 训练周期和难度等级
- 每周训练安排（每天的热身、动作、拉伸）
- 每个动作的组数、次数、休息时间、热量消耗
- 饮食建议和注意事项

---

### 2. AI 健身教练对话

**功能描述：** 提供智能健身问答服务，用户可以随时向 AI 教练提问，获得专业的训练指导、动作建议和健身知识。

**核心方法：** `QwenAIClient.fitness_coach()`

**输入参数：**
- `messages` - 对话历史列表
- `user_context` - 用户上下文信息（健身水平、当前计划、伤病情况）

**AI 教练特点：**
- 专业的健身知识指导
- 训练动作和姿势建议
- 积极的鼓励和激励
- 实用的饮食建议
- 伤病预防和康复提醒

**使用场景：**
- 动作不标准时的指导
- 计划调整咨询
- 健身知识问答
- 心理激励

---

### 3. 数据分析

**功能描述：** 基于用户的训练数据，AI 分析训练效果，给出个性化的改进建议和鼓励。

**核心方法：** `QwenAIClient.progress_analysis()`

**输入参数：**
- `completed_tasks` - 已完成任务数
- `total_tasks` - 总任务数
- `total_duration` - 总训练时长（分钟）
- `total_calories` - 总消耗卡路里
- `plan_count` - 训练计划数量
- `completion_rate` - 完成率
- `recent_activities` - 近期活动记录

**输出内容：**
- 整体总结
- 优点分析
- 可提升点
- 完成率统计
- 动力水平评估
- 周趋势分析
- 下周训练建议
- 鼓励语和警示提醒

---

## 错误处理

AI 服务实现了完善的错误处理机制：

| 错误类型 | 处理方式 |
|----------|----------|
| API 超时 | 抛出 `TimeoutError`，提示"AI 服务响应超时，请稍后重试" |
| 连接失败 | 抛出 `ConnectionError`，包含具体错误信息 |
| 响应格式异常 | 抛出 `ValueError`，提示 JSON 解析错误 |
| API Key 未配置 | 初始化时抛出 `ValueError`，提示配置 QWEN_API_KEY |

所有 AI 调用都设置了 60 秒超时和 1500-3000 tokens 的输出限制，确保响应速度和服务稳定性。

## 配置说明

在 `backend/.env` 文件中配置：

```env
QWEN_API_KEY=your_api_key_here
QWEN_MODEL=qwen3.6-flash
QWEN_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
```
