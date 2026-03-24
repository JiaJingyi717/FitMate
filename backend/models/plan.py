from datetime import datetime

from utils.extensions import db


class TrainingPlan(db.Model):
    __tablename__ = "training_plan"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    plan_name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, default="")
    status = db.Column(db.String(32), default="todo")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
