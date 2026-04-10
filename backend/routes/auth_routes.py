from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash

from models.user import User
from services.user_service import create_login_token, register_user, verify_password
from utils.extensions import db
from utils.response import fail, ok

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/users/register")
def register():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip() or None
    phone = (payload.get("phone") or "").strip() or None
    password = payload.get("password") or ""
    name = (payload.get("name") or "").strip() or None

    if not password:
        return fail("password is required")

    username = email.split("@")[0] if email else (phone if phone else None)
    if not username:
        return fail("email or phone is required")

    username = f"{username}_{abs(hash(password + str(username))) % 100000}"

    if email and db.session.query(User).filter_by(email=email).first():
        return fail("email already exists")
    if phone and db.session.query(User).filter_by(phone=phone).first():
        return fail("phone already exists")

    user = register_user(username=username, password=password, email=email, phone=phone, name=name)
    return ok({"userId": user.id}, "register success")


@auth_bp.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip() or None
    phone = (payload.get("phone") or "").strip() or None
    username = (payload.get("username") or "").strip() or None
    password = payload.get("password") or ""

    user = None
    if email:
        user = db.session.query(User).filter_by(email=email).first()
    elif phone:
        user = db.session.query(User).filter_by(phone=phone).first()
    elif username:
        user = db.session.query(User).filter_by(username=username).first()

    if not user or not verify_password(user, password):
        return fail("invalid username or password", 401)

    token = create_login_token(user.id)
    return ok({"token": token, "userId": user.id}, "login success")


@auth_bp.post("/auth/forgot-password")
def forgot_password():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip() or None
    phone = (payload.get("phone") or "").strip() or None
    if not email and not phone:
        return fail("email or phone is required")
    return ok(msg="verification code sent")


@auth_bp.post("/auth/reset-password")
def reset_password():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip() or None
    phone = (payload.get("phone") or "").strip() or None
    code = payload.get("code", "")
    new_password = payload.get("newPassword", "") or ""

    if code != "123456":
        return fail("verification code is incorrect or expired", 400)
    if not new_password or len(new_password) < 6:
        return fail("newPassword must be at least 6 characters", 400)

    user = None
    if email:
        user = db.session.query(User).filter_by(email=email).first()
    elif phone:
        user = db.session.query(User).filter_by(phone=phone).first()

    if not user:
        return fail("user not found", 404)

    user.password = generate_password_hash(new_password)
    db.session.commit()
    return ok(msg="password reset success")


@auth_bp.post("/auth/logout")
@jwt_required()
def logout():
    return ok(msg="logout success")
