def build_chat_reply(message: str, coach_style: str):
    style_map = {
        "gentle": "温柔鼓励型",
        "strict": "严格专业型",
        "balanced": "均衡陪伴型",
    }
    style_text = style_map.get(coach_style, "专业型")
    return f"【{style_text}教练回复】收到你的问题：{message}。建议先热身10分钟，再进行30分钟主训练，保持规律作息和科学饮食。"


def generate_ai_plan(goal: str):
    goal_content_map = {
        "减脂": [
            {"title": "晨间空腹有氧", "duration": 30, "type": "有氧"},
            {"title": "核心力量训练", "duration": 25, "type": "力量"},
            {"title": "晚间拉伸放松", "duration": 15, "type": "拉伸"},
        ],
        "增肌": [
            {"title": "胸部+肱二头肌", "duration": 50, "type": "力量"},
            {"title": "背部+肱三头肌", "duration": 50, "type": "力量"},
            {"title": "腿部+肩部", "duration": 55, "type": "力量"},
        ],
        "综合体能提升": [
            {"title": "HIIT燃脂训练", "duration": 30, "type": "HIIT"},
            {"title": "全身力量循环", "duration": 40, "type": "力量"},
            {"title": "核心稳定性训练", "duration": 20, "type": "核心"},
        ],
    }
    return goal_content_map.get(goal, goal_content_map["综合体能提升"])
