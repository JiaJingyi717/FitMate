from datetime import datetime

from utils.extensions import db


class TrainingRecord(db.Model):
    __tablename__ = "training_record"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey("training_plan.id"), nullable=True)
    duration = db.Column(db.Integer, default=0)
    exercise_type = db.Column(db.String(64), nullable=False)
    record_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
