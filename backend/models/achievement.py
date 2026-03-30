from models._shared import _utcnow
from utils.extensions import db


class Achievement(db.Model):
    __tablename__ = "achievements"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, default="")
    icon = db.Column(db.String(255), default="")
    badge_type = db.Column(db.String(32), default="bronze")
    condition_type = db.Column(db.String(32), default="")
    condition_value = db.Column(db.Integer, default=0)


class UserAchievement(db.Model):
    __tablename__ = "user_achievements"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey("achievements.id"), nullable=False)
    earned_at = db.Column(db.DateTime, default=_utcnow)
