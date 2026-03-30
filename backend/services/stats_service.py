from models.record import TrainingRecord


def build_summary(user_id: int):
    records = TrainingRecord.query.filter_by(user_id=user_id).all()
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


def build_advice():
    return {"advice": "保持每周 3 次训练频率，力量与有氧按 1:1 搭配效果更好。"}
