"""成就检测与解锁"""

from datetime import timedelta

from sqlalchemy import func

from models.achievement import Achievement, UserAchievement
from models.article_interaction import ArticleCollect, ArticleComment, ArticleLike
from models.record import TrainingRecord
from utils.extensions import db


def _training_count(user_id: int) -> int:
    return TrainingRecord.query.filter_by(user_id=user_id).count()


def _training_streak_days(user_id: int) -> int:
    """从今天或最近训练日起，向前统计连续有打卡记录的天数。"""
    dates = sorted(
        {r.record_date for r in TrainingRecord.query.filter_by(user_id=user_id).all()},
        reverse=True,
    )
    if not dates:
        return 0

    streak = 1
    for i in range(1, len(dates)):
        if dates[i - 1] - dates[i] == timedelta(days=1):
            streak += 1
        else:
            break
    return streak


def _total_calories(user_id: int) -> int:
    total = (
        db.session.query(func.coalesce(func.sum(TrainingRecord.calories), 0))
        .filter(TrainingRecord.user_id == user_id)
        .scalar()
    )
    return int(total or 0)


def _article_read_count(user_id: int) -> int:
    """点赞 / 收藏 / 评论过的文章去重计数，视为「阅读互动」。"""
    liked = {row.article_id for row in ArticleLike.query.filter_by(user_id=user_id).all()}
    collected = {row.article_id for row in ArticleCollect.query.filter_by(user_id=user_id).all()}
    commented = {row.article_id for row in ArticleComment.query.filter_by(user_id=user_id).all()}
    return len(liked | collected | commented)


def _meets_condition(user_id: int, achievement: Achievement) -> bool:
    condition_type = achievement.condition_type or ""
    target = int(achievement.condition_value or 0)
    if target <= 0:
        return False

    if condition_type == "training_count":
        return _training_count(user_id) >= target
    if condition_type == "streak_days":
        return _training_streak_days(user_id) >= target
    if condition_type == "total_calories":
        return _total_calories(user_id) >= target
    if condition_type == "article_read":
        return _article_read_count(user_id) >= target
    return False


def sync_user_achievements(user_id: int) -> list[int]:
    """根据当前数据解锁成就，返回本次新解锁的 achievement id 列表。"""
    earned_ids = {
        row.achievement_id
        for row in UserAchievement.query.filter_by(user_id=user_id).all()
    }
    newly_unlocked: list[int] = []

    for achievement in Achievement.query.order_by(Achievement.id).all():
        if achievement.id in earned_ids:
            continue
        if _meets_condition(user_id, achievement):
            db.session.add(UserAchievement(user_id=user_id, achievement_id=achievement.id))
            newly_unlocked.append(achievement.id)

    if newly_unlocked:
        db.session.commit()
    return newly_unlocked


def list_user_achievements(user_id: int) -> list[dict]:
    sync_user_achievements(user_id)
    earned_map = {
        row.achievement_id: row.earned_at
        for row in UserAchievement.query.filter_by(user_id=user_id).all()
    }
    return [
        {
            "id": a.id,
            "name": a.achievement_name,
            "description": a.description,
            "icon": a.icon,
            "badgeType": a.badge_type,
            "isEarned": a.id in earned_map,
            "earnedAt": earned_map[a.id].isoformat() if a.id in earned_map and earned_map[a.id] else None,
        }
        for a in Achievement.query.order_by(Achievement.id).all()
    ]
