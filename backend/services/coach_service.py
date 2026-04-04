def build_chat_reply(message: str, coach_personality: str):
    personality_map = {
        "gentle": "温柔鼓励型",
        "strict": "严格专业型",
        "energetic": "活力四射型",
    }
    personality_text = personality_map.get(coach_personality, "专业型")

    msg_lower = message.lower()

    if any(k in msg_lower for k in ["训练", "计划", "运动", "锻炼"]):
        recommendation = {
            "title": "训练计划",
            "description": "点击查看和创建你的个性化训练计划",
            "icon": "📅",
            "link": "/workout",
        }
    elif any(k in msg_lower for k in ["数据", "分析", "统计", "消耗", "时长"]):
        recommendation = {
            "title": "数据分析",
            "description": "查看你的训练数据统计与趋势",
            "icon": "📊",
            "link": "/dashboard",
        }
    elif any(k in msg_lower for k in ["知识", "教程", "视频", "文章", "怎么练"]):
        recommendation = {
            "title": "知识库",
            "description": "浏览专业健身知识与视频教程",
            "icon": "📚",
            "link": "/knowledge",
        }
    else:
        recommendation = None

    reply = f"【{personality_text}教练】收到你的问题：{message}。作为你的健身教练，我会根据你的目标为你制定科学的训练方案。建议先热身10分钟，再进行30分钟主训练，保持规律作息和科学饮食，有任何问题随时问我！"

    result = {"reply": reply}
    if recommendation:
        result["recommendation"] = recommendation
    return result


def generate_ai_plan_content(goal: str, level: str = "有基础", days_per_week: int = 4,
                               time_per_day: int = 45, training_days: list = None,
                               additional_requirements: str = ""):
    level_map = {
        "初学者": {"warmup": 5, "main": 20, "cooldown": 5, "intensity": "低"},
        "有基础": {"warmup": 10, "main": 30, "cooldown": 5, "intensity": "中"},
        "健身达人": {"warmup": 10, "main": 40, "cooldown": 10, "intensity": "高"},
    }
    cfg = level_map.get(level, level_map["有基础"])

    all_tasks = []
    if goal in ["减脂", "减肥"]:
        all_tasks = [
            {"name": "热身跑步", "type": "有氧", "duration": cfg["warmup"], "duration_str": f"{cfg['warmup']}分钟", "calories": cfg["warmup"] * 7, "sets": None, "reps": None, "rest": None},
            {"name": "HIIT燃脂训练", "type": "HIIT", "duration": cfg["main"], "duration_str": f"{cfg['main']}分钟", "calories": cfg["main"] * 12, "sets": 5, "reps": 20, "rest": "30秒"},
            {"name": "核心力量训练", "type": "核心", "duration": cfg["main"] - 5, "duration_str": f"{cfg['main'] - 5}分钟", "calories": (cfg["main"] - 5) * 5, "sets": 3, "reps": 15, "rest": "45秒"},
            {"name": "晚间拉伸放松", "type": "拉伸", "duration": cfg["cooldown"], "duration_str": f"{cfg['cooldown']}分钟", "calories": cfg["cooldown"] * 2, "sets": None, "reps": None, "rest": None},
        ]
    elif goal in ["增肌", "力量"]:
        all_tasks = [
            {"name": "热身激活", "type": "热身", "duration": cfg["warmup"], "duration_str": f"{cfg['warmup']}分钟", "calories": cfg["warmup"] * 4, "sets": None, "reps": None, "rest": None},
            {"name": "胸部+肱二头肌", "type": "力量", "duration": cfg["main"], "duration_str": f"{cfg['main']}分钟", "calories": cfg["main"] * 6, "sets": 4, "reps": 10, "rest": "60秒"},
            {"name": "背部+肱三头肌", "type": "力量", "duration": cfg["main"], "duration_str": f"{cfg['main']}分钟", "calories": cfg["main"] * 6, "sets": 4, "reps": 10, "rest": "60秒"},
            {"name": "拉伸放松", "type": "拉伸", "duration": cfg["cooldown"], "duration_str": f"{cfg['cooldown']}分钟", "calories": cfg["cooldown"] * 2, "sets": None, "reps": None, "rest": None},
        ]
    elif goal in ["体能", "综合"]:
        all_tasks = [
            {"name": "全身热身", "type": "热身", "duration": cfg["warmup"], "duration_str": f"{cfg['warmup']}分钟", "calories": cfg["warmup"] * 4, "sets": None, "reps": None, "rest": None},
            {"name": "HIIT燃脂训练", "type": "HIIT", "duration": cfg["main"] // 2, "duration_str": f"{cfg['main'] // 2}分钟", "calories": (cfg["main"] // 2) * 12, "sets": 5, "reps": 20, "rest": "30秒"},
            {"name": "全身力量循环", "type": "力量", "duration": cfg["main"] // 2, "duration_str": f"{cfg['main'] // 2}分钟", "calories": (cfg["main"] // 2) * 6, "sets": 3, "reps": 12, "rest": "45秒"},
            {"name": "核心稳定性训练", "type": "核心", "duration": cfg["cooldown"] + 5, "duration_str": f"{cfg['cooldown'] + 5}分钟", "calories": (cfg["cooldown"] + 5) * 5, "sets": 3, "reps": 20, "rest": "30秒"},
        ]
    else:
        all_tasks = [
            {"name": "热身跑步", "type": "有氧", "duration": cfg["warmup"], "duration_str": f"{cfg['warmup']}分钟", "calories": cfg["warmup"] * 7, "sets": None, "reps": None, "rest": None},
            {"name": "综合体能训练", "type": "综合", "duration": cfg["main"], "duration_str": f"{cfg['main']}分钟", "calories": cfg["main"] * 6, "sets": 3, "reps": 15, "rest": "45秒"},
            {"name": "拉伸放松", "type": "拉伸", "duration": cfg["cooldown"], "duration_str": f"{cfg['cooldown']}分钟", "calories": cfg["cooldown"] * 2, "sets": None, "reps": None, "rest": None},
        ]

    return all_tasks
