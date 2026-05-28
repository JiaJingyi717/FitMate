"""为 AI 教练对话组装用户画像上下文。"""

from __future__ import annotations

from typing import Any

from models.user import User
from services.plan_service import list_training_plans
from services.user_service import get_user_stats
from utils.extensions import db

_COACH_GENDER_LABEL = {"male": "男教练", "female": "女教练", "男": "男教练", "女": "女教练"}
_COACH_PERSONALITY_LABEL = {
    "gentle": "温柔鼓励型",
    "strict": "严格激励型",
    "energetic": "活力四射型",
}


def build_coach_user_context(user_id: int, request_context: dict[str, Any] | None = None) -> dict[str, Any]:
    """
    从数据库读取用户资料、训练计划与统计，并与请求中的 context 合并。
    请求中的 coach_gender / coach_personality / injuries 等可覆盖或补充库内数据。
    """
    request_context = dict(request_context or {})
    user = db.session.get(User, user_id)
    if not user:
        return request_context

    ctx: dict[str, Any] = {}

    display_name = (user.name or "").strip() or user.username
    if display_name:
        ctx["name"] = display_name
    if user.gender:
        ctx["gender"] = user.gender
    if user.age is not None:
        ctx["age"] = user.age
    if user.height is not None:
        ctx["height"] = user.height
    if user.weight is not None:
        ctx["weight"] = user.weight
    if user.location:
        ctx["location"] = user.location
    if user.goal:
        ctx["recent_goals"] = user.goal

    if user.height and user.weight and user.height > 0:
        bmi = round(user.weight / ((user.height / 100) ** 2), 1)
        ctx["bmi"] = bmi

    coach_gender = request_context.get("coach_gender") or user.coach_gender
    coach_personality = request_context.get("coach_personality") or user.coach_personality
    if coach_gender:
        ctx["coach_gender"] = _COACH_GENDER_LABEL.get(coach_gender, coach_gender)
    if coach_personality:
        ctx["coach_personality"] = _COACH_PERSONALITY_LABEL.get(
            coach_personality, coach_personality
        )

    plans = list_training_plans(user_id)
    ongoing = [p for p in plans if p.get("status") != "done"]
    if ongoing:
        parts = [
            f"{p['name']}（{p.get('type') or '计划'}/{p.get('difficulty') or ''}，"
            f"进度{p.get('progress', 0)}%）"
            for p in ongoing[:3]
        ]
        ctx["current_plan"] = "；".join(parts)
    elif plans:
        latest = plans[0]
        ctx["current_plan"] = f"{latest['name']}（{latest.get('status', '')}）"

    stats = get_user_stats(user_id)
    ctx["recent_training"] = (
        f"近30天训练{stats['totalDays']}天，"
        f"累计时长约{stats['totalDuration']}分钟，"
        f"消耗约{stats['totalCalories']}千卡，"
        f"已完成计划{stats['completedPlans']}个"
    )

    if request_context.get("fitness_level"):
        ctx["fitness_level"] = request_context["fitness_level"]
    elif stats["completedPlans"] >= 3 or stats["totalDays"] >= 10:
        ctx["fitness_level"] = "有基础"
    elif stats["totalDays"] > 0:
        ctx["fitness_level"] = "入门"
    else:
        ctx["fitness_level"] = "新手（资料较少，可多询问再给建议）"

    if request_context.get("recent_goals"):
        ctx["recent_goals"] = request_context["recent_goals"]
    if request_context.get("injuries"):
        ctx["injuries"] = request_context["injuries"]
    if request_context.get("current_plan"):
        ctx["current_plan"] = request_context["current_plan"]

    return ctx
