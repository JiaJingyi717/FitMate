from datetime import datetime, timezone

from utils.extensions import db


def _utcnow():
    return datetime.now(timezone.utc)


class TrainingPlan(db.Model):
    __tablename__ = "training_plan"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, default="")
    plan_type = db.Column(db.String(32), default="手动创建")
    difficulty = db.Column(db.String(16), default="中级")
    duration_str = db.Column(db.String(16), default="")
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(32), default="todo")
    total_calories = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=_utcnow)
    updated_at = db.Column(db.DateTime, default=_utcnow, onupdate=_utcnow)
