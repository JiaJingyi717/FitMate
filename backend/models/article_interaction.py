from models._shared import _utcnow
from utils.extensions import db


class ArticleLike(db.Model):
    __tablename__ = "article_likes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=_utcnow)


class ArticleCollect(db.Model):
    __tablename__ = "article_collects"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=_utcnow)


class ArticleComment(db.Model):
    __tablename__ = "article_comments"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)
    parent_id = db.Column(db.Integer, nullable=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=_utcnow)
