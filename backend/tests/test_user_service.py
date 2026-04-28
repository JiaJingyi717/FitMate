from datetime import date, timedelta

from models.plan import TrainingPlan
from models.record import TrainingRecord
from models.user import User
from services.user_service import create_login_token, get_user_stats, register_user, update_user_profile, verify_password
from utils.extensions import db


def test_register_and_verify_password(app):
    with app.app_context():
        user = register_user(
            username="svc_user",
            password="password123",
            email="svc@test.com",
            phone="13912345678",
            name="服务用户",
        )
        assert user.id is not None
        assert user.password != "password123"
        assert verify_password(user, "password123") is True
        assert verify_password(user, "wrong") is False


def test_update_user_profile_fields(app):
    with app.app_context():
        user = User(username="u1", password="p", name="旧名")
        db.session.add(user)
        db.session.commit()

        update_user_profile(
            user,
            {
                "name": "新名",
                "avatar": "a.png",
                "gender": "male",
                "height": 175,
                "weight": 70.5,
                "age": 28,
                "location": "北京",
                "goal": "减脂",
                "currentCoachId": 3,
            },
        )
        refreshed = db.session.get(User, user.id)
        assert refreshed.name == "新名"
        assert refreshed.current_coach_id == 3
        assert refreshed.goal == "减脂"


def test_get_user_stats_recent_records_only(app):
    with app.app_context():
        user = User(username="u2", password="p", name="统计用户")
        db.session.add(user)
        db.session.commit()

        today = date.today()
        old_day = today - timedelta(days=40)

        db.session.add(TrainingRecord(user_id=user.id, duration=30, calories=200, exercise_type="有氧", record_date=today))
        db.session.add(
            TrainingRecord(
                user_id=user.id,
                duration=20,
                calories=100,
                exercise_type="力量",
                record_date=today - timedelta(days=1),
            )
        )
        db.session.add(TrainingRecord(user_id=user.id, duration=99, calories=999, exercise_type="历史", record_date=old_day))
        db.session.add(TrainingPlan(user_id=user.id, name="完成计划", status="done"))
        db.session.commit()

        stats = get_user_stats(user.id)
        assert stats["totalDuration"] == 50
        assert stats["totalCalories"] == 300
        assert stats["totalDays"] == 2
        assert stats["completedPlans"] == 1


def test_create_login_token_has_value(app):
    with app.app_context():
        token = create_login_token(123)
        assert isinstance(token, str)
        assert len(token) > 10
