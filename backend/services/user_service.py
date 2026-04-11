from datetime import timedelta, datetime

from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash

from models.user import User
from utils.extensions import db


def register_user(username: str, password: str, email: str = None, phone: str = None, name: str = None):
    hashed = generate_password_hash(password)
    user = User(
        username=username,
        password=hashed,
        email=email,
        phone=phone,
        name=name or "",
        join_date=datetime.now()
    )
    db.session.add(user)
    db.session.commit()
    return user


def verify_password(user, password: str) -> bool:
    return check_password_hash(user.password, password)


def create_login_token(user_id: int):
    return create_access_token(identity=str(user_id), expires_delta=timedelta(days=1))


def update_user_profile(user, payload: dict):
    user.name = payload.get("name", user.name)
    user.avatar = payload.get("avatar", user.avatar)
    user.gender = payload.get("gender", user.gender)
    user.height = payload.get("height", user.height)
    user.weight = payload.get("weight", user.weight)
    user.age = payload.get("age", user.age)
    user.location = payload.get("location", user.location)
    user.goal = payload.get("goal", user.goal)
    user.current_coach_id = payload.get("currentCoachId", user.current_coach_id)
    db.session.commit()


def get_user_stats(user_id: int):
    from datetime import date, timedelta
    from models.plan import TrainingPlan
    from models.plan_task import PlanTask
    from models.record import TrainingRecord

    today = date.today()
    thirty_days_ago = today - timedelta(days=30)

    records = TrainingRecord.query.filter(
        TrainingRecord.user_id == user_id,
        TrainingRecord.record_date >= thirty_days_ago,
    ).all()

    total_duration = sum(r.duration for r in records)
    total_calories = sum(r.calories for r in records)
    total_days = len(set(r.record_date for r in records))

    completed_plans = TrainingPlan.query.filter_by(
        user_id=user_id, status="done"
    ).count()

    return {
        "totalDays": total_days,
        "totalDuration": total_duration,
        "totalCalories": total_calories,
        "completedPlans": completed_plans,
    }
