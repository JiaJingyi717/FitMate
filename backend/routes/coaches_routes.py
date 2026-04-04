from datetime import time as dt_time
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models.coach import Coach
from models.coach_session import CoachSession
from models.user import User
from services.coach_service import build_chat_reply
from utils.extensions import db
from utils.response import fail, ok

coaches_bp = Blueprint("coaches", __name__)


WELCOME_MESSAGES = {
    "gentle": "嗨，我是你的健身教练！有什么健身问题都可以问我，我会用最温柔的方式帮助你达成目标。💪",
    "strict": "我是你的健身教练。训练是严肃的事，我会严格要求你，但请相信，这是为你好。开始吧！💪",
    "energetic": "哇！你终于来了！我是你的活力健身教练，今天我们要一起燃烧卡路里！准备好了吗？💪",
}


@coaches_bp.get("/coaches")
def list_coaches():
    coaches = db.session.query(Coach).all()
    return ok([
        {
            "id": c.id,
            "name": c.name,
            "gender": c.gender,
            "style": c.style,
            "personality": c.personality,
            "avatar": c.avatar,
            "introduction": c.introduction,
        }
        for c in coaches
    ])


@coaches_bp.get("/coaches/session/init")
@jwt_required()
def init_session():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    session = CoachSession.query.filter_by(user_id=user_id).first()
    if not session:
        session = CoachSession(user_id=user_id, coach_id=user.current_coach_id if user else None, messages="[]")
        db.session.add(session)
        db.session.commit()

    coach_info = None
    if session.coach_id:
        coach = db.session.get(Coach, session.coach_id)
        if coach:
            coach_info = {
                "id": coach.id,
                "name": coach.name,
                "gender": coach.gender,
                "style": coach.style,
                "personality": coach.personality,
                "avatar": coach.avatar,
                "introduction": coach.introduction,
            }
    else:
        coach_info = {
            "id": None,
            "name": "默认教练",
            "gender": "female",
            "style": "gentle",
            "personality": "gentle",
            "avatar": "",
            "introduction": "你的专属AI健身教练",
        }

    import json
    msgs = json.loads(session.messages) if session.messages else []
    return ok({
        "sessionId": session.id,
        "coach": coach_info,
        "messages": msgs,
    })


@coaches_bp.put("/coaches/current")
@jwt_required()
def switch_coach():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return fail("user not found", 404)

    payload = request.get_json(silent=True) or {}
    coach_id = payload.get("coachId")
    coach_gender = payload.get("coachGender")
    coach_personality = payload.get("coachPersonality")

    if coach_id is not None:
        coach = db.session.get(Coach, coach_id)
        if not coach:
            return fail("coach not found", 404)

    user.current_coach_id = coach_id
    if coach_gender is not None:
        user.coach_gender = coach_gender
    if coach_personality is not None:
        user.coach_personality = coach_personality

    session = CoachSession.query.filter_by(user_id=user_id).first()
    if session:
        session.coach_id = coach_id
    else:
        session = CoachSession(user_id=user_id, coach_id=coach_id, messages="[]")
        db.session.add(session)
    db.session.commit()

    return ok({
        "coachId": coach_id,
        "coachGender": coach_gender,
        "coachPersonality": coach_personality,
    }, "coach switched")


@coaches_bp.post("/coaches/chat")
@jwt_required()
def chat():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "")

    session = CoachSession.query.filter_by(user_id=user_id).first()
    if not session:
        session = CoachSession(user_id=user_id, coach_id=user.current_coach_id if user else None, messages="[]")
        db.session.add(session)
        db.session.commit()

    coach = db.session.get(Coach, session.coach_id) if session.coach_id else None
    coach_personality = coach.personality if coach else "gentle"
    result = build_chat_reply(message, coach_personality)

    import json
    from datetime import datetime
    msgs = json.loads(session.messages) if session.messages else []
    msgs.append({"id": len(msgs) + 1, "sender": "user", "text": message, "time": datetime.now().strftime("%H:%M")})
    msgs.append({
        "id": len(msgs) + 2,
        "sender": "coach",
        "text": result["reply"],
        "time": datetime.now().strftime("%H:%M"),
        "recommendation": result.get("recommendation"),
    })
    session.messages = json.dumps(msgs, ensure_ascii=False)
    db.session.commit()

    return ok(result)


@coaches_bp.delete("/coaches/session")
@jwt_required()
def reset_session():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    session = CoachSession.query.filter_by(user_id=user_id).first()

    coach_personality = "gentle"
    if session and session.coach_id:
        coach = db.session.get(Coach, session.coach_id)
        if coach:
            coach_personality = coach.personality
    elif user and user.coach_personality:
        coach_personality = user.coach_personality

    welcome = WELCOME_MESSAGES.get(coach_personality, WELCOME_MESSAGES["gentle"])

    if session:
        session.messages = "[]"
    else:
        session = CoachSession(user_id=user_id, coach_id=user.current_coach_id if user else None, messages="[]")
        db.session.add(session)

    new_session_id = session.id if session.id else 1
    db.session.commit()

    return ok({
        "sessionId": new_session_id,
        "messages": [
            {
                "id": 1,
                "sender": "coach",
                "text": welcome,
                "time": "00:00",
                "recommendation": None,
            }
        ],
    }, "session reset")
