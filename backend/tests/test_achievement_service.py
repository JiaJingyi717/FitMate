from datetime import date, timedelta

import pytest

from models.achievement import Achievement, UserAchievement
from models.record import TrainingRecord
from services.achievement_service import sync_user_achievements
from utils.extensions import db


def test_unlock_first_training_achievement(app):
    with app.app_context():
        from models.user import User
        from data.seed_data import seed_achievements
        seed_achievements()

        achievement = Achievement.query.filter_by(condition_type="training_count", condition_value=1).first()
        assert achievement is not None

        user = User.query.first()
        if not user:
            pytest.skip("no user")
        user_id = user.id
        UserAchievement.query.filter_by(user_id=user_id).delete()
        TrainingRecord.query.filter_by(user_id=user_id).delete()

        unlocked = sync_user_achievements(user_id)
        assert unlocked == []

        db.session.add(
            TrainingRecord(
                user_id=user_id,
                duration=20,
                exercise_type="力量",
                calories=100,
                record_date=date.today(),
            )
        )
        db.session.commit()

        unlocked = sync_user_achievements(user_id)
        assert achievement.id in unlocked

        earned = UserAchievement.query.filter_by(
            user_id=user_id, achievement_id=achievement.id
        ).first()
        assert earned is not None


def test_streak_achievement_requires_consecutive_days(app):
    with app.app_context():
        from models.user import User
        from data.seed_data import seed_achievements
        seed_achievements()

        streak = Achievement.query.filter_by(condition_type="streak_days", condition_value=7).first()
        assert streak is not None
        user = User.query.first()
        user_id = user.id
        UserAchievement.query.filter_by(user_id=user_id, achievement_id=streak.id).delete()
        TrainingRecord.query.filter_by(user_id=user_id).delete()
        db.session.commit()

        today = date.today()
        for i in range(7):
            db.session.add(
                TrainingRecord(
                    user_id=user_id,
                    duration=30,
                    exercise_type="有氧",
                    calories=200,
                    record_date=today - timedelta(days=i),
                )
            )
        db.session.commit()

        unlocked = sync_user_achievements(user_id)
        assert streak.id in unlocked
