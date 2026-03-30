from models._shared import _utcnow
from utils.extensions import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    # 个人信息
    nickname = db.Column(db.String(64), default="")
    avatar = db.Column(db.String(255), default="")
    gender = db.Column(db.String(16), default="")
    height = db.Column(db.Float, nullable=True)
    weight = db.Column(db.Float, nullable=True)
    age = db.Column(db.Integer, nullable=True)
    goal = db.Column(db.String(128), default="")
    # 教练设定
    current_coach_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=_utcnow)
