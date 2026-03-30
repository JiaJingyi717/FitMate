from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models.achievement import Achievement, UserAchievement
from models.user import User
from services.user_service import update_user_profile
from utils.extensions import db
from utils.response import fail, ok

users_bp = Blueprint("users", __name__)


@users_bp.get("/users/profile")
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return fail("user not found", 404)
    return ok({
        "id": user.id,
        "username": user.username,
        "nickname": user.nickname,
        "avatar": user.avatar,
        "gender": user.gender,
        "height": user.height,
        "weight": user.weight,
        "age": user.age,
        "goal": user.goal,
        "currentCoachId": user.current_coach_id,
    })


@users_bp.put("/users/profile")
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return fail("user not found", 404)

    payload = request.get_json(silent=True) or {}
    update_user_profile(user, payload)
    return ok(message="profile updated")


@users_bp.get("/users/stats")
@jwt_required()
def get_user_stats():
    user_id = int(get_jwt_identity())
    from services.analytics_service import build_overview
    return ok(build_overview(user_id))


@users_bp.get("/users/achievements")
@jwt_required()
def get_achievements():
    user_id = int(get_jwt_identity())
    all_achievements = db.session.query(Achievement).all()
    earned_ids = {
        row.achievement_id
        for row in db.session.query(UserAchievement.achievement_id).filter_by(user_id=user_id).all()
    }
    return ok([
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "icon": a.icon,
            "badgeType": a.badge_type,
            "isEarned": a.id in earned_ids,
        }
        for a in all_achievements
    ])


@users_bp.post("/users/password/change")
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return fail("user not found", 404)

    payload = request.get_json(silent=True) or {}
    old_password = payload.get("oldPassword", "")
    new_password = payload.get("newPassword", "")
    if not old_password or not new_password:
        return fail("oldPassword and newPassword are required")
    if user.password != old_password:
        return fail("old password is incorrect", 400)

    user.password = new_password
    db.session.commit()
    return ok(message="password changed")


@users_bp.delete("/users/account")
@jwt_required()
def delete_account():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return fail("user not found", 404)

    db.session.delete(user)
    db.session.commit()
    return ok(message="account deleted")
