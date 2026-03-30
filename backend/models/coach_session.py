from models._shared import _utcnow
from utils.extensions import db


class CoachSession(db.Model):
    __tablename__ = "coach_sessions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    coach_id = db.Column(db.Integer, db.ForeignKey("coaches.id"), nullable=True)
    messages = db.Column(db.Text, default="[]")
    created_at = db.Column(db.DateTime, default=_utcnow)
