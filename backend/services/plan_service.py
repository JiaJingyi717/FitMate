from datetime import date

from models.plan import TrainingPlan
from models.record import TrainingRecord
from utils.extensions import db


def create_training_plan(user_id: int, payload: dict):
    plan = TrainingPlan(
        user_id=user_id,
        plan_name=payload.get("planName", "").strip(),
        description=payload.get("description", ""),
        status=payload.get("status", "todo"),
    )
    db.session.add(plan)
    db.session.commit()
    return plan


def list_training_plans(user_id: int):
    return TrainingPlan.query.filter_by(user_id=user_id).order_by(TrainingPlan.id.desc()).all()


def update_training_plan(plan, payload: dict):
    plan.plan_name = payload.get("planName", plan.plan_name)
    plan.description = payload.get("description", plan.description)
    plan.status = payload.get("status", plan.status)
    db.session.commit()


def check_in_plan(user_id: int, plan, payload: dict):
    duration = int(payload.get("duration", 30))
    exercise_type = payload.get("exerciseType", "综合训练")
    record = TrainingRecord(
        user_id=user_id,
        plan_id=plan.id,
        duration=duration,
        exercise_type=exercise_type,
        record_date=date.today(),
    )
    db.session.add(record)
    db.session.commit()
    return record
