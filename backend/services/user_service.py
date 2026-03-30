from datetime import timedelta

from flask_jwt_extended import create_access_token

from models.user import User
from utils.extensions import db


def register_user(username: str, password: str):
    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return user


def create_login_token(user_id: int):
    return create_access_token(identity=str(user_id), expires_delta=timedelta(days=1))


def update_user_profile(user, payload: dict):
    user.nickname = payload.get("nickname", user.nickname)
    user.avatar = payload.get("avatar", user.avatar)
    user.gender = payload.get("gender", user.gender)
    user.height = payload.get("height", user.height)
    user.weight = payload.get("weight", user.weight)
    user.age = payload.get("age", user.age)
    user.goal = payload.get("goal", user.goal)
    user.current_coach_id = payload.get("currentCoachId", user.current_coach_id)
    db.session.commit()
