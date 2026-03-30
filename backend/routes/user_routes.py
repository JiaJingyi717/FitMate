from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models.user import User
from services.user_service import create_login_token, register_user, update_user_profile
from utils.response import fail, ok

user_bp = Blueprint("user", __name__)


@user_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    password = payload.get("password") or ""
    if not username or not password:
        return fail("username and password are required")
    if User.query.filter_by(username=username).first():
        return fail("username already exists")

    user = register_user(username, password)
    return ok({"userId": user.id}, "register success")


@user_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    password = payload.get("password") or ""
    user = User.query.filter_by(username=username).first()
    if not user or user.password != password:
        return fail("invalid username or password", 401)

    token = create_login_token(user.id)
    return ok({"token": token, "userId": user.id}, "login success")


@user_bp.get("/user/profile")
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return fail("user not found", 404)
    return ok(
        {
            "id": user.id,
            "username": user.username,
            "goal": user.goal,
            "coachGender": user.coach_gender,
            "coachStyle": user.coach_style,
        }
    )


@user_bp.put("/user/profile")
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return fail("user not found", 404)

    payload = request.get_json(silent=True) or {}
    update_user_profile(user, payload)
    return ok(message="profile updated")
