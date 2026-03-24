from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models.plan import TrainingPlan
from services.plan_service import (
    check_in_plan,
    create_training_plan,
    list_training_plans,
    update_training_plan,
)
from utils.response import fail, ok

plan_bp = Blueprint("plans", __name__)


@plan_bp.post("/plans")
@jwt_required()
def create_plan():
    user_id = int(get_jwt_identity())
    payload = request.get_json(silent=True) or {}
    plan_name = (payload.get("planName") or "").strip()
    if not plan_name:
        return fail("planName is required")

    plan = create_training_plan(user_id, payload)
    return ok({"planId": plan.id}, "plan created")


@plan_bp.get("/plans")
@jwt_required()
def list_plans():
    user_id = int(get_jwt_identity())
    plans = list_training_plans(user_id)
    return ok(
        [
            {
                "id": p.id,
                "planName": p.plan_name,
                "description": p.description,
                "status": p.status,
                "createdAt": p.created_at.isoformat(),
            }
            for p in plans
        ]
    )


@plan_bp.put("/plans/<int:plan_id>")
@jwt_required()
def update_plan(plan_id: int):
    user_id = int(get_jwt_identity())
    plan = TrainingPlan.query.filter_by(id=plan_id, user_id=user_id).first()
    if not plan:
        return fail("plan not found", 404)

    payload = request.get_json(silent=True) or {}
    update_training_plan(plan, payload)
    return ok(message="plan updated")


@plan_bp.post("/plans/<int:plan_id>/check-in")
@jwt_required()
def check_in(plan_id: int):
    user_id = int(get_jwt_identity())
    plan = TrainingPlan.query.filter_by(id=plan_id, user_id=user_id).first()
    if not plan:
        return fail("plan not found", 404)

    payload = request.get_json(silent=True) or {}
    record = check_in_plan(user_id, plan, payload)
    return ok({"recordId": record.id}, "check-in success")
