from models._shared import _utcnow
from utils.extensions import db


class PlanTask(db.Model):
    __tablename__ = "plan_tasks"
    id = db.Column(db.Integer, primary_key=True)
    plan_id = db.Column(db.Integer, db.ForeignKey("training_plan.id"), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    task_type = db.Column(db.String(64), default="综合")
    duration = db.Column(db.Integer, default=30)
    duration_str = db.Column(db.String(32), default="")
    calories = db.Column(db.Integer, default=0)
    sets = db.Column(db.Integer, nullable=True)
    reps = db.Column(db.Integer, nullable=True)
    rest = db.Column(db.String(32), nullable=True)
    description = db.Column(db.Text, default="")
    target_date = db.Column(db.Date, nullable=True)
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
