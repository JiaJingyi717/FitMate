from models._shared import _utcnow
from utils.extensions import db


class Article(db.Model):
    __tablename__ = "articles"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(64), default="")
    article_type = db.Column(db.String(16), default="article")
    summary = db.Column(db.Text, default="")
    thumbnail = db.Column(db.String(255), default="")
    content = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.String(255), default="")
    duration = db.Column(db.String(16), nullable=True)
    views = db.Column(db.Integer, default=0)
    like_count = db.Column(db.Integer, default=0)
    collect_count = db.Column(db.Integer, default=0)
    comment_count = db.Column(db.Integer, default=0)
    author = db.Column(db.String(64), default="官方")
    publish_date = db.Column(db.Date, nullable=True)
    tags = db.Column(db.String(255), default="")
    created_at = db.Column(db.DateTime, default=_utcnow)
