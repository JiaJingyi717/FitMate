from datetime import datetime

from utils.extensions import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    goal = db.Column(db.String(255), default="")
    coach_gender = db.Column(db.String(32), default="female")
    coach_style = db.Column(db.String(32), default="gentle")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
