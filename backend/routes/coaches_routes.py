from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models.coach import Coach
from models.coach_session import CoachSession
from models.user import User
from services.coach_service import build_chat_reply
from utils.extensions import db
from utils.response import fail, ok

coaches_bp = Blueprint("coaches", __name__)


@coaches_bp.get("/coaches")
def list_coaches():
    coaches = db.session.query(Coach).all()
    return ok([
        {
            "id": c.id,
            "name": c.name,
            "gender": c.gender,
            "style": c.style,
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
                "avatar": coach.avatar,
                "introduction": coach.introduction,
            }
    return ok({
        "sessionId": session.id,
        "coach": coach_info,
        "messages": [],
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
    if coach_id is not None:
        coach = db.session.get(Coach, coach_id)
        if not coach:
            return fail("coach not found", 404)

    user.current_coach_id = coach_id
    session = CoachSession.query.filter_by(user_id=user_id).first()
    if session:
        session.coach_id = coach_id
    else:
        session = CoachSession(user_id=user_id, coach_id=coach_id, messages="[]")
        db.session.add(session)
    db.session.commit()
    return ok({"coachId": coach_id}, "coach switched")


@coaches_bp.post("/coaches/chat")
@jwt_required()
def chat():
    user_id = int(get_jwt_identity())
    payload = request.get_json(silent=True) or {}
    message = payload.get("message", "")

    session = CoachSession.query.filter_by(user_id=user_id).first()
    if not session:
        return fail("session not found", 404)

    coach = db.session.get(Coach, session.coach_id) if session.coach_id else None
    coach_style = coach.style if coach else "gentle"
    reply = build_chat_reply(message, coach_style)

    import json
    msgs = json.loads(session.messages) if session.messages else []
    msgs.append({"role": "user", "content": message})
    msgs.append({"role": "assistant", "content": reply})
    session.messages = json.dumps(msgs, ensure_ascii=False)
    db.session.commit()

    return ok({"reply": reply})


@coaches_bp.delete("/coaches/session")
@jwt_required()
def reset_session():
    user_id = int(get_jwt_identity())
    session = CoachSession.query.filter_by(user_id=user_id).first()
    if session:
        session.messages = "[]"
        db.session.commit()
    return ok(message="session reset")
