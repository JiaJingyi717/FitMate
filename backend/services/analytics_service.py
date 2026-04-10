from datetime import date, timedelta


def _parse_range(range_: str) -> date:
    if range_ == "30d":
        return date.today() - timedelta(days=30)
    return date.today() - timedelta(days=7)


def build_overview(user_id: int, range_: str = "7d"):
    since = _parse_range(range_)
    from models.record import TrainingRecord
    records = TrainingRecord.query.filter(
        TrainingRecord.user_id == user_id,
        TrainingRecord.record_date >= since,
    ).all()
    total_duration = sum(r.duration for r in records)
    total_calories = sum(r.calories for r in records)
    training_count = len(records)
    avg_duration = int(total_duration / training_count) if training_count > 0 else 0
    dist = {}
    for r in records:
        dist[r.exercise_type] = dist.get(r.exercise_type, 0) + r.duration
    sport_distribution = [{"name": k, "value": v} for k, v in dist.items()]
    return {
        "totalDuration": total_duration,
        "totalCalories": total_calories,
        "trainingCount": training_count,
        "avgDuration": avg_duration,
        "sportDistribution": sport_distribution,
    }


def build_category_distribution(user_id: int, range_: str = "7d"):
    since = _parse_range(range_)
    from models.record import TrainingRecord
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
    from models.record import TrainingRecord
    trend = []
    for i in range(days - 1, -1, -1):
        d = date.today() - timedelta(days=i)
        recs = TrainingRecord.query.filter_by(user_id=user_id, record_date=d).all()
        total_duration = sum(r.duration for r in recs)
        total_calories = sum(r.calories for r in recs)
        m = d.month
        day = d.day
        trend.append({
            "date": f"{m}/{day}",
            "duration": total_duration,
            "calories": total_calories,
        })
    return {"trend": trend}


def build_ai_suggestions(user_id: int, range_: str = "7d"):
    since = _parse_range(range_)
    from models.record import TrainingRecord
    records = TrainingRecord.query.filter(
        TrainingRecord.user_id == user_id,
        TrainingRecord.record_date >= since,
    ).all()
    count = len(records)
    total = sum(r.duration for r in records)

    suggestions = []
    if count == 0:
        suggestions = [
            {"id": 1, "type": "tip", "title": "开启你的训练之旅", "description": "建议本周开始你的第一次训练，从每天10分钟轻度运动开始。"},
            {"id": 2, "type": "positive", "title": "制定明确目标", "description": "先确定你的健身目标（减脂、增肌或提升体能），然后让AI教练帮你规划。"},
            {"id": 3, "type": "warning", "title": "注意运动安全", "description": "新手建议从低强度开始，循序渐进，避免运动损伤。"},
        ]
    elif count < 3:
        suggestions = [
            {"id": 1, "type": "warning", "title": "训练频率偏低", "description": "本周训练次数偏少，建议每周至少3次才能看到明显效果。"},
            {"id": 2, "type": "tip", "title": "合理安排训练", "description": "力量训练和有氧训练穿插进行，效率更高。"},
            {"id": 3, "type": "positive", "title": "保持积极心态", "description": "每次训练都是进步，坚持下去就会看到变化！"},
        ]
    elif total < 150:
        suggestions = [
            {"id": 1, "type": "positive", "title": "训练时长充足", "description": "本周训练时长充足，但可以适当增加力量训练比例。"},
            {"id": 2, "type": "tip", "title": "加强核心训练", "description": "建议每周加入1-2次核心训练，提升整体体能。"},
            {"id": 3, "type": "warning", "title": "注意恢复休息", "description": "训练后记得拉伸放松，帮助肌肉恢复。"},
        ]
    else:
        suggestions = [
            {"id": 1, "type": "positive", "title": "训练表现优秀", "description": "本周训练表现优秀，注意休息和恢复，避免过度训练。"},
            {"id": 2, "type": "tip", "title": "定期更换训练内容", "description": "建议定期更换训练内容，防止身体适应导致效果下降。"},
            {"id": 3, "type": "positive", "title": "关注饮食配合", "description": "配合科学饮食能让训练效果事半功倍。"},
        ]
    return {"suggestions": suggestions}
