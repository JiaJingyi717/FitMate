# FitMate AI 接口文档

## 前置准备

### 1. 安装依赖
在后端目录执行：
```bash
pip install -r requirements.txt
```

### 2. 配置 API Key
在后端创建 `.env` 文件：
```bash
QWEN_API_KEY=your_api_key_here
QWEN_MODEL=qwen-turbo
QWEN_API_BASE=https://dashwave.cn/v1
```

### 3. 获取通义千问 API Key
访问 https://dashwave.console.aliyun.com/ 注册并申请 API Key

---

## 接口列表

### 基础信息
- 基础路径：`/api/ai`
- 所有接口需要 JWT Token 认证（Header: `Authorization: Bearer <token>`）
- 健康检查接口 `/health` 不需要认证

---

## 1. 健康检查

检查 AI 服务状态

**请求**
```
GET /api/ai/health
```

**响应**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "status": "ready",           // ready: 已就绪, not_configured: 未配置
    "model": "qwen-turbo",
    "api_base": "https://dashwave.cn/v1"
  }
}
```

---

## 2. 生成训练计划

生成个性化训练计划

**请求**
```
POST /api/ai/generate-plan
```

**请求体**
```json
{
  "goal": "增肌",                 // 健身目标：增肌/减脂/塑形/综合健身
  "level": "有基础",              // 运动水平：新手/有基础/专业
  "days_per_week": 4,            // 每周训练天数：1-7
  "duration": 4,                  // 计划时长（周）：1-12
  "preferences": "力量为主",       // 偏好：有氧为主/力量为主/均衡
  "restrictions": "膝盖不好",      // 身体限制（可选）
  "notes": "想要增加卧推重量"       // 其他需求说明（可选）
}
```

**响应**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "success": true,
    "plan": {
      "plan_name": "四周增肌训练计划",
      "description": "专为有基础用户设计的增肌计划",
      "duration_weeks": 4,
      "difficulty": "中级",
      "goals": ["增加肌肉量", "提升力量"],
      "weekly_schedule": [
        {
          "day": "周一",
          "focus": "胸部+三头肌",
          "warmup": "5分钟动态拉伸+俯卧撑热身",
          "exercises": [
            {
              "name": "杠铃卧推",
              "type": "力量",
              "sets": 4,
              "reps": "8-12",
              "rest": "90秒",
              "duration": 5,
              "calories": 120,
              "description": "保持肩胛骨收紧，核心发力"
            }
          ],
          "cooldown": "胸部拉伸+肩部放松",
          "estimated_calories": 350,
          "total_duration_minutes": 60
        }
      ],
      "nutrition_tips": "每天摄入体重(kg)*1.8克的蛋白质",
      "precautions": ["注意动作规范", "保证充足睡眠"]
    },
    "usage": {
      "prompt_tokens": 200,
      "completion_tokens": 500
    }
  }
}
```

**错误响应**
```json
{
  "code": 400,
  "message": "AI 返回的 JSON 格式错误",
  "data": null
}
```

---

## 3. 获取饮食建议

根据用户信息和训练情况生成饮食建议

**请求**
```
POST /api/ai/diet-advice
```

**请求体**
```json
{
  "goal": "增肌",
  "weight": 70,
  "height": 175,
  "age": 25,
  "gender": "男",
  "activity_level": "中度",       // 久坐/轻度/中度/高度
  "training_info": {             // 可选
    "daily_calories": 300,
    "training_days": 4
  }
}
```

**响应**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "success": true,
    "advice": {
      "daily_calories": 2800,
      "macros": {
        "protein_grams": 140,
        "protein_percentage": 20,
        "carbs_grams": 350,
        "carbs_percentage": 50,
        "fat_grams": 85,
        "fat_percentage": 30
      },
      "meal_timing": {
        "breakfast": "7:00-8:00",
        "lunch": "12:00-13:00",
        "dinner": "18:00-19:00",
        "pre_workout": "训练前1小时：香蕉+少量蛋白质",
        "post_workout": "训练后30分钟内：高蛋白+碳水"
      },
      "meal_suggestions": {
        "breakfast": ["鸡蛋3个", "全麦面包2片", "牛奶一杯"],
        "lunch": ["鸡胸肉150g", "糙米200g", "蔬菜沙拉"],
        "dinner": ["牛肉150g", "红薯200g", "西兰花"],
        "snacks": ["坚果30g", "蛋白粉1勺", "水果"]
      },
      "hydration": "每天饮水2.5-3升",
      "supplements": ["乳清蛋白", "支链氨基酸(BCAA)"],
      "cautions": ["少食多餐", "避免高糖食品"]
    },
    "usage": {}
  }
}
```

---

## 4. AI 健身教练对话

与 AI 健身教练进行对话

**请求**
```
POST /api/ai/coach/chat
```

**请求体**
```json
{
  "messages": [
    {"role": "user", "content": "如何提高卧推重量？"},
    {"role": "assistant", "content": "提高卧推重量需要从以下几个方面入手..."}
  ],
  "context": {
    "fitness_level": "有基础",
    "current_plan": "增肌计划",
    "recent_goals": "增加卧推重量",
    "injuries": "无"
  }
}
```

**响应**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": "要提高卧推重量，我建议从以下几个方面入手：\n\n1. **渐进超负荷**：每周增加2.5-5kg的重量\n2. **增加训练频率**：每周至少练2次胸部\n3. **注重动作质量**：确保卧推时下放到底、推到顶峰\n4. **加强辅助肌群**：多练肩部和三头肌\n5. **保证营养和休息**：每天摄入足够蛋白质，睡眠7-8小时\n\n记住，力量的提升需要时间，不要急于求成！💪",
    "usage": {
      "prompt_tokens": 150,
      "completion_tokens": 200
    }
  }
}
```

---

## 5. 训练进度分析

分析用户的训练进度数据并给出建议

**请求**
```
POST /api/ai/progress-analysis
```

**请求体**
```json
{
  "completed_tasks": 12,
  "total_tasks": 20,
  "total_duration": 300,
  "total_calories": 2500,
  "plan_count": 2,
  "completion_rate": 60,
  "recent_activities": "本周完成了3次训练，主要是上肢训练"
}
```

**响应**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "success": true,
    "analysis": {
      "summary": "本周训练完成情况良好，继续保持！",
      "strengths": [
        "训练强度适中",
        "热量消耗达标",
        "计划执行率高"
      ],
      "areas_for_improvement": [
        "可以增加训练频率",
        "建议加入下肢训练"
      ],
      "completion_rate": 60,
      "motivation_level": "良好",
      "weekly_trend": "上升",
      "next_week_suggestions": [
        "增加1次下肢训练",
        "保证每晚7-8小时睡眠",
        "训练后记得拉伸放松"
      ],
      "encouragement": "太棒了！你已经完成了60%的任务，继续保持这个势头！",
      "warnings": []
    },
    "completion_rate": 60,
    "usage": {}
  }
}
```

---

## 错误码说明

| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误或 AI 返回格式异常 |
| 401 | 未登录或 Token 无效 |
| 500 | 服务器内部错误 |
| 503 | AI 服务连接失败（检查 API Key 配置） |
| 504 | AI 服务响应超时 |

---

## 前端调用示例

```javascript
// 1. 生成训练计划
import { generatePlan } from '@/api/ai'

const plan = await generatePlan({
  goal: '增肌',
  level: '有基础',
  daysPerWeek: 4,
  duration: 4,
  preferences: '力量为主',
  restrictions: '',
  notes: ''
})

// 2. 饮食建议
import { getDietAdvice } from '@/api/ai'

const diet = await getDietAdvice({
  goal: '增肌',
  weight: 70,
  height: 175,
  age: 25,
  gender: '男',
  activityLevel: '中度'
})

// 3. AI 教练对话
import { askCoach } from '@/api/ai'

const messages = [
  { role: 'user', content: '如何提高卧推重量？' }
]
const context = {
  fitness_level: '有基础',
  current_plan: '增肌计划'
}
const response = await askCoach(messages, context)

// 4. 进度分析
import { analyzeProgress } from '@/api/ai'

const analysis = await analyzeProgress({
  completedTasks: 12,
  totalTasks: 20,
  totalDuration: 300,
  totalCalories: 2500,
  planCount: 2,
  completionRate: 60
})
```

---

## 注意事项

1. **所有接口都需要登录**（健康检查除外）
2. **AI 响应有时间延迟**（通常 3-10 秒），建议显示 loading 状态
3. **通义千问有免费额度**，但请注意控制调用频率
4. **对话历史需要前端维护**，每次请求需要传递完整的消息历史
5. **错误处理**：建议捕获异常并显示友好提示给用户
