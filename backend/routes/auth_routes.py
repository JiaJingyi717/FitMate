import os
import secrets

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash

from models.user import User
from services.user_service import create_login_token, register_user, verify_password
from utils.extensions import db
from utils.response import fail, ok

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/users/register")
def register():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip() or None
    phone = (payload.get("phone") or "").strip() or None
    password = payload.get("password") or ""

    if not name:
        return fail("name is required")
    if not password:
        return fail("password is required")

    # 使用name作为username，同时保存email和phone
    if db.session.query(User).filter_by(username=name).first():
        return fail("username already exists")

    user = register_user(
        username=name,
        password=password,
        email=email,
        phone=phone,
        name=name
    )

    token = create_login_token(user.id)
    return ok({"userId": user.id, "token": token}, "register success")


@auth_bp.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip() or None
    phone = (payload.get("phone") or "").strip() or None
    username = (payload.get("username") or "").strip() or None
    password = payload.get("password") or ""

    try:
        user = None
        if email:
            user = db.session.query(User).filter_by(email=email).first()
        elif phone:
            user = db.session.query(User).filter_by(phone=phone).first()
        elif username:
            user = db.session.query(User).filter_by(username=username).first()
    except SQLAlchemyError:
        return fail(
            "数据库连接失败，请检查 MYSQL_ROOT_PASSWORD 是否与 MySQL 数据卷初始化密码一致",
            503,
        )

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


def _expected_password_reset_code():
    """必须通过环境变量配置验证码，禁止在代码中写死通用后门。"""
    return (os.getenv("FITMATE_PASSWORD_RESET_CODE") or "").strip()


@auth_bp.post("/auth/reset-password")
def reset_password():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip() or None
    phone = (payload.get("phone") or "").strip() or None
    code = (payload.get("code") or "").strip()
    new_password = payload.get("newPassword", "") or ""

    expected = _expected_password_reset_code()
    if not expected:
        return fail("password reset is not configured on server", 503)
    if not secrets.compare_digest(code, expected):
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
