from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models.plan import TrainingPlan
from models.plan_task import PlanTask
from models.record import TrainingRecord
from services.plan_service import (
    add_task_to_plan,
    ai_generate_plan,
    check_in_task,
    create_training_plan,
    delete_plan,
    get_plan_detail,
    list_plan_overview,
    list_plan_tasks,
    list_training_plans,
    remove_task_from_plan,
    update_training_plan,
)
from utils.extensions import db
from utils.response import fail, ok

plan_bp = Blueprint("plans", __name__)


@plan_bp.get("/plans/overview")
@jwt_required()
def get_overview():
    user_id = int(get_jwt_identity())
    return ok(list_plan_overview(user_id))


@plan_bp.get("/plans")
@jwt_required()
def list_plans():
    user_id = int(get_jwt_identity())
    plans = list_training_plans(user_id)
    return ok(plans)


@plan_bp.get("/plans/<int:plan_id>")
@jwt_required()
def get_plan(plan_id: int):
    user_id = int(get_jwt_identity())
    plan = get_plan_detail(plan_id, user_id)
    if not plan:
        return fail("plan not found", 404)
    return ok(plan)


@plan_bp.post("/plans")
@jwt_required()
def create_plan():
    user_id = int(get_jwt_identity())
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    if not name:
        return fail("name is required")

    plan = create_training_plan(user_id, payload)
    return ok({"planId": plan.id}, "plan created")


@plan_bp.post("/plans/ai-generate")
@jwt_required()
def ai_generate():
    user_id = int(get_jwt_identity())
    payload = request.get_json(silent=True) or {}
    save = payload.get("save", True)
    result = ai_generate_plan(user_id, payload, save=save)
    return ok(result)


@plan_bp.delete("/plans/<int:plan_id>")
@jwt_required()
def remove_plan(plan_id: int):
    user_id = int(get_jwt_identity())
    plan = TrainingPlan.query.filter_by(id=plan_id, user_id=user_id).first()
    if not plan:
        return fail("plan not found", 404)

    delete_plan(plan)
    return ok(msg="plan deleted")


@plan_bp.get("/plans/today")
@jwt_required()
def today_tasks():
    user_id = int(get_jwt_identity())
    tasks = list_plan_tasks(user_id)
    return ok(tasks)


@plan_bp.patch("/plans/today/<int:task_id>/complete")
@jwt_required()
def complete_task(task_id: int):
    user_id = int(get_jwt_identity())
    payload = request.get_json(silent=True) or {}
    task = db.session.get(PlanTask, task_id)
    if not task:
        return fail("task not found", 404)
    if task.plan_id:
        plan = db.session.get(TrainingPlan, task.plan_id)
        if not plan or plan.user_id != user_id:
            return fail("task not found", 404)

    is_completed = payload.get("isCompleted", True)
    record = check_in_task(user_id, task, is_completed)
    return ok({"recordId": record.id if record else None, "taskId": task.id}, "task updated")


@plan_bp.post("/plans/<int:plan_id>/tasks")
@jwt_required()
def add_task(plan_id: int):
    user_id = int(get_jwt_identity())
    plan = TrainingPlan.query.filter_by(id=plan_id, user_id=user_id).first()
    if not plan:
        return fail("plan not found", 404)

    payload = request.get_json(silent=True) or {}
    task_data = payload.get("task", {})
    task = add_task_to_plan(plan_id, user_id, task_data)
    if not task:
        return fail("failed to add task", 400)
    return ok({"taskId": task.id}, "task added")


@plan_bp.delete("/plans/<int:plan_id>/tasks")
@jwt_required()
def remove_task(plan_id: int):
    user_id = int(get_jwt_identity())
    payload = request.get_json(silent=True) or {}
    task_id = payload.get("taskId")
    if not task_id:
        return fail("taskId is required")

    success = remove_task_from_plan(plan_id, user_id, task_id)
    if not success:
        return fail("task not found", 404)
    return ok(msg="task removed")
