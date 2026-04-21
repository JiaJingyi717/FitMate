"""
通义千问 AI 服务层
封装与通义千问 API 的交互
"""

import os
import json
import requests
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()


class QwenAIClient:
    """通义千问 AI 客户端"""

    def __init__(self):
        self.api_key = os.getenv("QWEN_API_KEY", "")
        self.model = os.getenv("QWEN_MODEL", "qwen3.6-flash")
        self.api_base = os.getenv("QWEN_API_BASE", "https://dashscope.aliyuncs.com/compatible-mode/v1")

        if not self.api_key:
            raise ValueError("⚠️ 未配置 QWEN_API_KEY，请在 .env 文件中配置")

    def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> Dict[str, Any]:
        """
        发送对话请求到通义千问

        Args:
            messages: 消息列表，格式为 [{"role": "user", "content": "..."}]
            temperature: 创造性参数（0-1），越低越保守
            max_tokens: 最大生成 token 数

        Returns:
            AI 响应字典，包含 content、usage 等
        """
        url = f"{self.api_base}/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            result = response.json()

            return {
                "content": result["choices"][0]["message"]["content"],
                "usage": result.get("usage", {}),
                "model": result.get("model", self.model),
            }
        except requests.exceptions.Timeout:
            raise TimeoutError("🤖 AI 服务响应超时，请稍后重试")
        except requests.exceptions.RequestException as e:
            raise ConnectionError(f"🤖 AI 服务连接失败: {str(e)}")
        except KeyError as e:
            raise ValueError(f"🤖 AI 响应格式异常: {str(e)}")

    def generate_plan(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        生成个性化训练计划

        Args:
            user_profile: 用户信息，包含：
                - goal: 健身目标（如：增肌、减脂、塑形）
                - level: 运动水平（新手、有基础、专业）
                - days_per_week: 每周训练天数
                - preferences: 偏好（如：有氧为主、力量为主）
                - restrictions: 限制（如：膝盖不好、无器械）
                - duration: 计划时长（周）

        Returns:
            AI 生成的训练计划
        """
        system_prompt = """你是一位专业的健身教练 AI。你的职责是根据用户的信息，生成科学、合理的个性化训练计划。

请严格遵循以下格式输出 JSON（不要添加任何其他说明文字）：
{
    "plan_name": "计划名称",
    "description": "计划简介（1-2句话）",
    "duration_weeks": 训练周数,
    "difficulty": "难度（初级/中级/高级）",
    "goals": ["目标1", "目标2"],
    "weekly_schedule": [
        {
            "day": "周一",
            "focus": "训练重点",
            "warmup": "热身动作描述",
            "exercises": [
                {
                    "name": "动作名称",
                    "type": "动作类型（有氧/力量/核心）",
                    "sets": 组数,
                    "reps": "次数（如：12-15 或 30秒）",
                    "rest": "休息时间",
                    "duration": "单组时长（分钟）",
                    "calories": 预估消耗卡路里,
                    "description": "动作要点"
                }
            ],
            "cooldown": "拉伸放松动作",
            "estimated_calories": 当日总消耗卡路里,
            "total_duration_minutes": 当日总时长（分钟）
        }
    ],
    "nutrition_tips": "饮食建议（1-2句话）",
    "precautions": ["注意事项1", "注意事项2"]
}

请确保：
1. JSON 格式完全正确，可以被 json.loads() 解析
2. 每周至少3天训练，休息日要合理安排
3. 动作要科学，考虑用户的身体限制
4. 热量消耗估算要合理
"""

        user_message = f"""请为以下用户生成训练计划：

健身目标：{user_profile.get('goal', '综合健身')}
运动水平：{user_profile.get('level', '有基础')}
每周训练天数：{user_profile.get('days_per_week', 4)} 天
计划时长：{user_profile.get('duration', 4)} 周
用户偏好：{user_profile.get('preferences', '无特殊偏好')}
身体限制：{user_profile.get('restrictions', '无')}
额外需求：{user_profile.get('notes', '')}

请生成一个科学、详细的训练计划。"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ]

        result = self.chat(messages, temperature=0.7, max_tokens=3000)

        # 尝试解析 JSON
        content = result["content"].strip()

        # 处理可能的 markdown 代码块
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]

        try:
            plan_data = json.loads(content.strip())
            return {
                "success": True,
                "plan": plan_data,
                "usage": result.get("usage", {}),
            }
        except json.JSONDecodeError as e:
            raise ValueError(f"AI 返回的 JSON 格式错误: {str(e)}\n原始内容: {content[:500]}")

    def diet_advice(self, user_profile: Dict[str, Any], training_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        生成饮食建议

        Args:
            user_profile: 用户信息，包含：
                - goal: 健身目标
                - weight: 体重（kg）
                - height: 身高（cm）
                - age: 年龄
                - gender: 性别
                - activity_level: 活动水平（久坐/轻度/中度/高度）
            training_info: 训练信息（可选），包含：
                - daily_calories: 每日训练消耗卡路里
                - training_days: 每周训练天数

        Returns:
            饮食建议
        """
        system_prompt = """你是一位专业的营养师 AI。你的职责是根据用户的身体信息和健身目标，给出科学、合理的饮食建议。

请严格遵循以下格式输出 JSON：
{
    "daily_calories": 每日总热量目标,
    "macros": {
        "protein_grams": 蛋白质克数,
        "protein_percentage": 蛋白质百分比,
        "carbs_grams": 碳水化合物克数,
        "carbs_percentage": 碳水化合物百分比,
        "fat_grams": 脂肪克数,
        "fat_percentage": 脂肪百分比
    },
    "meal_timing": {
        "breakfast": "早餐建议时间",
        "lunch": "午餐建议时间",
        "dinner": "晚餐建议时间",
        "pre_workout": "训练前建议",
        "post_workout": "训练后建议"
    },
    "meal_suggestions": {
        "breakfast": ["食物建议1", "食物建议2"],
        "lunch": ["食物建议1", "食物建议2"],
        "dinner": ["食物建议1", "食物建议2"],
        "snacks": ["零食建议1", "零食建议2"]
    },
    "hydration": "饮水建议",
    "supplements": ["补剂建议1", "补剂建议2"],
    "cautions": ["注意事项1", "注意事项2"]
}

请确保 JSON 格式完全正确。"""

        weight = user_profile.get('weight', 70)
        height = user_profile.get('height', 170)
        age = user_profile.get('age', 25)
        gender = user_profile.get('gender', '男')
        goal = user_profile.get('goal', '综合健身')
        activity = user_profile.get('activity_level', '中度')

        training_text = ""
        if training_info:
            daily_cal = training_info.get('daily_calories', 300)
            train_days = training_info.get('training_days', 4)
            training_text = f"\n训练信息：\n- 每日训练消耗：约 {daily_cal} 卡路里\n- 每周训练天数：{train_days} 天"

        user_message = f"""请为以下用户生成饮食建议：

基本信息：
- 体重：{weight} kg
- 身高：{height} cm
- 年龄：{age} 岁
- 性别：{gender}
- 健身目标：{goal}
- 活动水平：{activity}{training_text}

请给出详细的饮食建议。"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ]

        result = self.chat(messages, temperature=0.7, max_tokens=2500)
        content = result["content"].strip()

        # 处理 markdown 代码块
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        try:
            advice_data = json.loads(content.strip())
            return {
                "success": True,
                "advice": advice_data,
                "usage": result.get("usage", {}),
            }
        except json.JSONDecodeError as e:
            raise ValueError(f"AI 返回的 JSON 格式错误: {str(e)}")

    def fitness_coach(self, messages: List[Dict[str, str]], user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        AI 健身教练对话

        Args:
            messages: 对话历史，格式为 [{"role": "user/assistant", "content": "..."}]
            user_context: 用户上下文信息（可选），包含：
                - fitness_level: 健身水平
                - current_plan: 当前训练计划
                - recent_goals: 近期目标
                - injuries: 伤病情况

        Returns:
            AI 回复
        """
        system_prompt = """你是一位专业、热情、耐心的健身教练 AI。

你的特点：
1. 专业：提供科学、准确的健身知识
2. 鼓励：总是鼓励用户，保持积极态度
3. 耐心：详细解答各种健身问题
4. 实用：给出的建议要切实可行

你擅长：
- 训练动作指导（姿势、发力技巧）
- 计划制定和调整
- 饮食营养建议
- 伤病预防和康复
- 心理激励

请用中文回答，语言要自然、亲切，避免过于学术化的表述。

如果用户询问的内容涉及医疗建议（如伤病康复），请提醒他们咨询专业医生。"""

        # 添加用户上下文
        context_text = ""
        if user_context:
            context_text = f"\n\n【用户背景】（供参考）\n"
            if user_context.get('fitness_level'):
                context_text += f"- 健身水平：{user_context['fitness_level']}\n"
            if user_context.get('current_plan'):
                context_text += f"- 当前计划：{user_context['current_plan']}\n"
            if user_context.get('recent_goals'):
                context_text += f"- 近期目标：{user_context['recent_goals']}\n"
            if user_context.get('injuries'):
                context_text += f"- 伤病情况：{user_context['injuries']}\n"

        # 构建消息列表
        full_messages = [{"role": "system", "content": system_prompt}]

        # 添加上下文
        if context_text:
            full_messages.append({
                "role": "system",
                "content": f"【提示】{context_text}"
            })

        # 添加对话历史
        full_messages.extend(messages)

        result = self.chat(full_messages, temperature=0.8, max_tokens=1500)

        return {
            "content": result["content"],
            "usage": result.get("usage", {}),
        }

    def progress_analysis(self, progress_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        分析训练进度并给出建议

        Args:
            progress_data: 进度数据，包含：
                - completed_tasks: 已完成任务数
                - total_tasks: 总任务数
                - total_duration: 总训练时长（分钟）
                - total_calories: 总消耗卡路里
                - plan_count: 计划数量
                - completion_rate: 完成率
                - recent_activities: 近期活动记录

        Returns:
            进度分析和建议
        """
        system_prompt = """你是一位专业的健身教练 AI。你的职责是分析用户的训练进度数据，给出个性化的鼓励和建议。

请严格遵循以下格式输出 JSON：
{
    "summary": "整体总结（一句话）",
    "strengths": ["优点1", "优点2", "优点3"],
    "areas_for_improvement": ["可提升点1", "可提升点2"],
    "completion_rate": 完成率百分比,
    "motivation_level": "动力水平（高涨/良好/一般/需要调整）",
    "weekly_trend": "周趋势（上升/稳定/下降）",
    "next_week_suggestions": ["下周建议1", "建议2", "建议3"],
    "encouragement": "鼓励语（1-2句话）",
    "warnings": ["警告/提醒（如有）"]
}

请确保 JSON 格式完全正确。"""

        completed = progress_data.get('completed_tasks', 0)
        total = progress_data.get('total_tasks', 1)
        duration = progress_data.get('total_duration', 0)
        calories = progress_data.get('total_calories', 0)
        plan_count = progress_data.get('plan_count', 0)

        # 计算完成率
        completion_rate = (completed / total * 100) if total > 0 else 0

        user_message = f"""请分析以下训练进度数据：

- 完成任务数：{completed} / {total}
- 总训练时长：约 {duration} 分钟
- 总消耗卡路里：约 {calories} 卡路里
- 训练计划数：{plan_count} 个
- 完成率：{completion_rate:.1f}%

请给出详细的进度分析和个性化建议。"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ]

        result = self.chat(messages, temperature=0.7, max_tokens=2000)
        content = result["content"].strip()

        # 处理 markdown 代码块
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        try:
            analysis_data = json.loads(content.strip())
            return {
                "success": True,
                "analysis": analysis_data,
                "completion_rate": completion_rate,
                "usage": result.get("usage", {}),
            }
        except json.JSONDecodeError as e:
            raise ValueError(f"AI 返回的 JSON 格式错误: {str(e)}")


# 全局单例
_ai_client = None


def get_ai_client() -> QwenAIClient:
    """获取 AI 客户端单例"""
    global _ai_client
    if _ai_client is None:
        _ai_client = QwenAIClient()
    return _ai_client
