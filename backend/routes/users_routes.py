from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash

from models.achievement import Achievement, UserAchievement
from models.user import User
from services.user_service import get_user_stats, update_user_profile, verify_password
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

    bmi = None
    if user.height and user.weight and user.height > 0:
        bmi = round(user.weight / ((user.height / 100) ** 2), 1)

    join_date = ""
    if user.join_date:
        join_date = user.join_date.strftime("%Y年%m月")

    return ok({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "name": user.name,
        "avatar": user.avatar,
        "gender": user.gender,
        "age": user.age,
        "height": user.height,
        "weight": user.weight,
        "bmi": bmi,
        "location": user.location,
        "joinDate": join_date,
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
    return ok(msg="profile updated")


@users_bp.put("/users/profile/avatar")
@jwt_required()
def update_avatar():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return fail("user not found", 404)

    payload = request.get_json(silent=True) or {}
    avatar_url = payload.get("avatar", "")
    user.avatar = avatar_url
    db.session.commit()
    return ok({"avatar": avatar_url}, "avatar updated")


@users_bp.get("/users/stats")
@jwt_required()
def get_user_stats_route():
    user_id = int(get_jwt_identity())
    return ok(get_user_stats(user_id))


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
            "name": a.achievement_name,
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
    if not verify_password(user, old_password):
        return fail("old password is incorrect", 400)

    user.password = generate_password_hash(new_password)
    db.session.commit()
    return ok(msg="password changed")


@users_bp.delete("/users/account")
@jwt_required()
def delete_account():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return fail("user not found", 404)

    db.session.delete(user)
    db.session.commit()
    return ok(msg="account deleted")
