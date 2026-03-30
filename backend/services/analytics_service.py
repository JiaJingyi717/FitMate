from datetime import date, timedelta

from models.record import TrainingRecord


def _parse_range(range_: str) -> date:
    if range_ == "30d":
        return date.today() - timedelta(days=30)
    return date.today() - timedelta(days=7)


def build_overview(user_id: int, range_: str = "7d"):
    since = _parse_range(range_)
    records = TrainingRecord.query.filter(
        TrainingRecord.user_id == user_id,
        TrainingRecord.record_date >= since,
    ).all()
    total_duration = sum(r.duration for r in records)
    training_count = len(records)
    dist = {}
    for r in records:
        dist[r.exercise_type] = dist.get(r.exercise_type, 0) + r.duration
    sport_distribution = [{"name": k, "value": v} for k, v in dist.items()]
    return {
        "totalDuration": total_duration,
        "trainingCount": training_count,
        "sportDistribution": sport_distribution,
    }


def build_category_distribution(user_id: int, range_: str = "7d"):
    since = _parse_range(range_)
    records = TrainingRecord.query.filter(
        TrainingRecord.user_id == user_id,
        TrainingRecord.record_date >= since,
    ).all()
    dist = {}
    total = 0
    for r in records:
        dist[r.exercise_type] = dist.get(r.exercise_type, 0) + r.duration
        total += r.duration
    items = []
    for name, value in dist.items():
        items.append({
            "name": name,
            "value": value,
            "percentage": round(value / total * 100, 1) if total > 0 else 0,
        })
    return {"distribution": items, "total": total}


def build_duration_trend(user_id: int, range_: str = "7d"):
    since = _parse_range(range_)
    days = 30 if range_ == "30d" else 7
    trend = []
    for i in range(days - 1, -1, -1):
        d = date.today() - timedelta(days=i)
        total = sum(
            r.duration
            for r in TrainingRecord.query.filter_by(user_id=user_id, record_date=d).all()
        )
        trend.append({"date": d.isoformat(), "duration": total})
    return {"trend": trend}


def build_ai_suggestions(user_id: int, range_: str = "7d"):
    since = _parse_range(range_)
    records = TrainingRecord.query.filter(
        TrainingRecord.user_id == user_id,
        TrainingRecord.record_date >= since,
    ).all()
    count = len(records)
    total = sum(r.duration for r in records)
    if count == 0:
        suggestions = ["建议本周开始你的第一次训练，从每天10分钟轻度运动开始。"]
    elif count < 3:
        suggestions = ["本周训练次数偏少，建议每周至少3次才能看到明显效果。", "力量训练和有氧训练穿插进行，效率更高。"]
    elif total < 150:
        suggestions = ["本周训练时长充足，但可以适当增加力量训练比例。", "建议每周加入1-2次核心训练，提升整体体能。"]
    else:
        suggestions = ["本周训练表现优秀，注意休息和恢复，避免过度训练。", "建议定期更换训练内容，防止身体适应导致效果下降。"]
    return {"suggestions": suggestions}
