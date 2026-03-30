from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from services.analytics_service import (
    build_ai_suggestions,
    build_category_distribution,
    build_duration_trend,
    build_overview,
)
from utils.response import ok

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.get("/analytics/overview")
@jwt_required()
def analytics_overview():
    user_id = int(get_jwt_identity())
    range_ = request.args.get("range", "7d")
    return ok(build_overview(user_id, range_))


@analytics_bp.get("/analytics/category-distribution")
@jwt_required()
def analytics_category():
    user_id = int(get_jwt_identity())
    range_ = request.args.get("range", "7d")
    return ok(build_category_distribution(user_id, range_))


@analytics_bp.get("/analytics/duration-trend")
@jwt_required()
def analytics_duration():
    user_id = int(get_jwt_identity())
    range_ = request.args.get("range", "7d")
    return ok(build_duration_trend(user_id, range_))


@analytics_bp.get("/analytics/ai-suggestions")
@jwt_required()
def analytics_suggestions():
    user_id = int(get_jwt_identity())
    range_ = request.args.get("range", "7d")
    return ok(build_ai_suggestions(user_id, range_))
