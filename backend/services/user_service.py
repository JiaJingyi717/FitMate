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
    user.goal = payload.get("goal", user.goal)
    user.coach_gender = payload.get("coachGender", user.coach_gender)
    user.coach_style = payload.get("coachStyle", user.coach_style)
    db.session.commit()
