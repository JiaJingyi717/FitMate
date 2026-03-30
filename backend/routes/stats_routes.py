from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from services.stats_service import build_advice, build_summary
from utils.response import ok

stats_bp = Blueprint("stats", __name__)


@stats_bp.get("/stats/summary")
@jwt_required()
def stats_summary():
    user_id = int(get_jwt_identity())
    return ok(build_summary(user_id))


@stats_bp.get("/stats/advice")
@jwt_required()
def stats_advice():
    return ok(build_advice())
