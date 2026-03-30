from datetime import date, datetime, timezone

from models.plan import TrainingPlan
from models.plan_task import PlanTask
from models.record import TrainingRecord
from services.coach_service import generate_ai_plan
from utils.extensions import db


def list_plan_overview(user_id: int):
    total_plans = db.session.query(TrainingPlan).filter_by(user_id=user_id).count()
    done_plans = db.session.query(TrainingPlan).filter_by(user_id=user_id, status="done").count()
    today_count = db.session.query(PlanTask).filter(
        PlanTask.plan_id.in_(
            db.session.query(TrainingPlan.id).filter_by(user_id=user_id)
        ),
        PlanTask.target_date == date.today(),
    ).count()
    done_today = db.session.query(PlanTask).filter(
        PlanTask.plan_id.in_(
            db.session.query(TrainingPlan.id).filter_by(user_id=user_id)
        ),
        PlanTask.target_date == date.today(),
        PlanTask.is_completed == True,
    ).count()
    return {
        "totalPlans": total_plans,
        "donePlans": done_plans,
        "todayTasks": today_count,
        "doneToday": done_today,
    }


def list_training_plans(user_id: int):
    return TrainingPlan.query.filter_by(user_id=user_id).order_by(TrainingPlan.id.desc()).all()


def get_plan_detail(plan_id: int, user_id: int):
    plan = TrainingPlan.query.filter_by(id=plan_id, user_id=user_id).first()
    if not plan:
        return None
    tasks = db.session.query(PlanTask).filter_by(plan_id=plan_id).all()
    return {
        "id": plan.id,
        "planName": plan.plan_name,
        "description": plan.description,
        "status": plan.status,
        "createdAt": plan.created_at.isoformat(),
        "tasks": [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "duration": t.duration,
                "exerciseType": t.exercise_type,
                "targetDate": t.target_date.isoformat() if t.target_date else None,
                "isCompleted": t.is_completed,
            }
            for t in tasks
        ],
    }


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


def update_training_plan(plan, payload: dict):
    plan.plan_name = payload.get("planName", plan.plan_name)
    plan.description = payload.get("description", plan.description)
    plan.status = payload.get("status", plan.status)
    db.session.commit()


def delete_plan(plan):
    db.session.query(PlanTask).filter_by(plan_id=plan.id).delete()
    db.session.delete(plan)
    db.session.commit()


def ai_generate_plan(user_id: int, goal: str):
    items = generate_ai_plan(goal)
    plan = TrainingPlan(
        user_id=user_id,
        plan_name=f"AI{goal}计划",
        description=f"由AI生成的{goal}训练计划",
        status="todo",
    )
    db.session.add(plan)
    db.session.flush()

    for item in items:
        task = PlanTask(
            plan_id=plan.id,
            title=item["title"],
            duration=item["duration"],
            exercise_type=item["type"],
            target_date=date.today(),
        )
        db.session.add(task)
    db.session.commit()
    return {
        "planId": plan.id,
        "planName": plan.plan_name,
        "tasks": [
            {"id": t.id, "title": t.title, "duration": t.duration, "type": t.exercise_type}
            for t in db.session.query(PlanTask).filter_by(plan_id=plan.id).all()
        ],
    }


def list_plan_tasks(user_id: int):
    plan_ids = db.select(TrainingPlan.id).where(TrainingPlan.user_id == user_id).scalar_subquery()
    tasks = db.session.query(PlanTask).filter(
        PlanTask.plan_id.in_(plan_ids),
        PlanTask.target_date == date.today(),
    ).all()
    return [
        {
            "id": t.id,
            "planId": t.plan_id,
            "title": t.title,
            "description": t.description,
            "duration": t.duration,
            "exerciseType": t.exercise_type,
            "isCompleted": t.is_completed,
        }
        for t in tasks
    ]


def check_in_task(user_id: int, task: PlanTask, is_completed: bool):
    task.is_completed = is_completed
    task.completed_at = datetime.now(timezone.utc) if is_completed else None

    record = None
    if is_completed:
        record = TrainingRecord(
            user_id=user_id,
            plan_id=task.plan_id,
            duration=task.duration,
            exercise_type=task.exercise_type,
            record_date=date.today(),
        )
        db.session.add(record)
    db.session.commit()
    return record
