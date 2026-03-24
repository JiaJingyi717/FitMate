from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from services.ai_service import build_chat_reply, generate_plan_content
from utils.response import ok

ai_bp = Blueprint("ai", __name__)


@ai_bp.post("/ai/chat")
def ai_chat():
    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "")
    coach_style = payload.get("coachStyle", "gentle")
    reply = build_chat_reply(message, coach_style)
    return ok({"reply": reply})


@ai_bp.post("/plans/generate")
@jwt_required()
def generate_plan():
    payload = request.get_json(silent=True) or {}
    goal = payload.get("goal", "综合体能提升")
    return ok(generate_plan_content(goal))
