from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from models.user import User
from services.user_service import create_login_token, register_user
from utils.extensions import db
from utils.response import fail, ok

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/users/register")
def register():
    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    password = payload.get("password") or ""
    if not username or not password:
        return fail("username and password are required")
    if db.session.query(User).filter_by(username=username).first():
        return fail("username already exists")

    user = register_user(username, password)
    return ok({"userId": user.id}, "register success")


@auth_bp.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    password = payload.get("password") or ""
    user = db.session.query(User).filter_by(username=username).first()
    if not user or user.password != password:
        return fail("invalid username or password", 401)

    token = create_login_token(user.id)
    return ok({"token": token, "userId": user.id}, "login success")


@auth_bp.post("/auth/logout")
@jwt_required()
def logout():
    return ok(message="logout success")
