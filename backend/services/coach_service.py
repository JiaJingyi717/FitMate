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
        "初学者": {
            "warmup": 8,
            "main": 22,
            "cooldown": 6,
            "sets_delta": -1,
            "duration_factor": 0.85,
            "cal_factor": 0.85,
            "rep_style": "保守",
            "rest": "75秒",
        },
        "有基础": {
            "warmup": 10,
            "main": 30,
            "cooldown": 8,
            "sets_delta": 0,
            "duration_factor": 1.0,
            "cal_factor": 1.0,
            "rep_style": "标准",
            "rest": "60秒",
        },
        "健身达人": {
            "warmup": 12,
            "main": 38,
            "cooldown": 10,
            "sets_delta": 1,
            "duration_factor": 1.2,
            "cal_factor": 1.2,
            "rep_style": "进阶",
            "rest": "45秒",
        },
    }
    cfg = level_map.get(level, level_map["有基础"])

    def adapt_strength(base_sets, reps_begin, reps_end, base_duration, base_cal):
        sets = max(2, base_sets + cfg["sets_delta"])
        duration = max(10, int(base_duration * cfg["duration_factor"]))
        calories = max(40, int(base_cal * cfg["cal_factor"]))
        if cfg["rep_style"] == "保守":
            reps = f"{max(6, reps_begin - 2)}-{max(8, reps_end - 2)}"
        elif cfg["rep_style"] == "进阶":
            reps = f"{reps_begin + 2}-{reps_end + 2}"
        else:
            reps = f"{reps_begin}-{reps_end}"
        return sets, reps, duration, calories

    def make_strength_task(name, task_type, base_sets, reps_begin, reps_end, base_duration, base_cal):
        sets, reps, duration, calories = adapt_strength(
            base_sets, reps_begin, reps_end, base_duration, base_cal
        )
        return {
            "name": name,
            "type": task_type,
            "duration": duration,
            "duration_str": f"{duration}分钟",
            "calories": calories,
            "sets": sets,
            "reps": reps,
            "rest": cfg["rest"],
        }

    def make_cardio_task(name, task_type, base_duration, cal_per_min):
        duration = max(8, int(base_duration * cfg["duration_factor"]))
        calories = max(30, int(duration * cal_per_min * cfg["cal_factor"]))
        return {
            "name": name,
            "type": task_type,
            "duration": duration,
            "duration_str": f"{duration}分钟",
            "calories": calories,
            "sets": None,
            "reps": None,
            "rest": None,
        }

    warmup_task = make_cardio_task("动态热身激活", "热身", cfg["warmup"], 4)
    cooldown_task = make_cardio_task("拉伸放松", "拉伸", cfg["cooldown"], 2)

    if goal in ["减脂", "减肥"]:
        main_tasks = [
            make_cardio_task("变速跑/椭圆机", "有氧", cfg["main"], 8),
            make_cardio_task("HIIT间歇循环", "HIIT", max(16, cfg["main"] - 6), 10),
            make_strength_task("徒手深蹲+箭步蹲", "力量", 3, 10, 15, 20, 120),
            make_strength_task("核心稳定循环", "核心", 3, 12, 18, 18, 100),
        ]
    elif goal in ["增肌", "力量"]:
        # 同目标下通过动作选择与处方差异拉开等级
        if level == "初学者":
            main_tasks = [
                make_strength_task("俯卧撑（可跪姿）", "力量", 3, 8, 12, 20, 90),
                make_strength_task("哑铃划船", "力量", 3, 8, 12, 20, 100),
                make_strength_task("高脚杯深蹲", "力量", 3, 10, 12, 22, 110),
                make_strength_task("平板支撑", "核心", 3, 30, 45, 12, 70),
            ]
        elif level == "健身达人":
            main_tasks = [
                make_strength_task("杠铃卧推", "力量", 4, 6, 10, 25, 130),
                make_strength_task("硬拉", "力量", 4, 5, 8, 25, 150),
                make_strength_task("深蹲", "力量", 4, 6, 10, 25, 145),
                make_strength_task("引体向上", "力量", 4, 8, 12, 18, 110),
                make_strength_task("腹轮/悬垂举腿", "核心", 3, 10, 15, 15, 90),
            ]
        else:
            main_tasks = [
                make_strength_task("哑铃卧推", "力量", 4, 8, 12, 24, 120),
                make_strength_task("杠铃划船", "力量", 4, 8, 12, 24, 125),
                make_strength_task("罗马尼亚硬拉", "力量", 3, 8, 10, 22, 120),
                make_strength_task("肩推+侧平举", "力量", 3, 10, 12, 18, 100),
                make_strength_task("卷腹/平板支撑", "核心", 3, 12, 20, 14, 80),
            ]
    elif goal in ["塑形", "体态"]:
        main_tasks = [
            make_strength_task("臀腿塑形循环", "力量", 3, 10, 15, 22, 110),
            make_strength_task("上肢线条训练", "力量", 3, 10, 15, 20, 100),
            make_cardio_task("低冲击有氧", "有氧", max(15, cfg["main"] - 10), 7),
            make_strength_task("核心抗旋转训练", "核心", 3, 12, 18, 15, 85),
        ]
    else:
        main_tasks = [
            make_cardio_task("中等强度有氧", "有氧", max(15, cfg["main"] - 12), 7),
            make_strength_task("全身力量循环", "力量", 3, 10, 12, 24, 120),
            make_strength_task("功能性核心训练", "核心", 3, 12, 16, 16, 90),
        ]

    # 返回扁平任务池，后续由计划服务按训练日分配
    return [warmup_task, *main_tasks, cooldown_task]
