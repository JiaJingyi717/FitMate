from models._shared import _utcnow
from utils.extensions import db


class Article(db.Model):
    __tablename__ = "articles"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(64), default="")
    cover_image = db.Column(db.String(255), default="")
    content = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.String(255), default="")
    like_count = db.Column(db.Integer, default=0)
    collect_count = db.Column(db.Integer, default=0)
    comment_count = db.Column(db.Integer, default=0)
    author = db.Column(db.String(64), default="官方")
    created_at = db.Column(db.DateTime, default=_utcnow)
