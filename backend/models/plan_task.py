from models._shared import _utcnow
from utils.extensions import db


class PlanTask(db.Model):
    __tablename__ = "plan_tasks"
    id = db.Column(db.Integer, primary_key=True)
    plan_id = db.Column(db.Integer, db.ForeignKey("training_plan.id"), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, default="")
    duration = db.Column(db.Integer, default=30)
    exercise_type = db.Column(db.String(64), default="综合")
    target_date = db.Column(db.Date, nullable=True)
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
