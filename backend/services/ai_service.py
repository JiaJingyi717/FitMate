def build_chat_reply(message: str, coach_style: str):
    return f"收到你的问题：{message}。建议先热身10分钟，再进行30分钟主训练。当前教练风格：{coach_style}。"


def generate_plan_content(goal: str):
    return {
        "goal": goal or "综合体能提升",
        "plan": [
            {"day": "周一", "content": "有氧训练 30 分钟"},
            {"day": "周三", "content": "力量训练 40 分钟"},
            {"day": "周五", "content": "核心训练 + 拉伸 30 分钟"},
        ],
    }
