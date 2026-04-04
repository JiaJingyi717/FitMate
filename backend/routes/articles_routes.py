from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models.article import Article
from models.article_interaction import ArticleComment
from services.article_service import (
    collect_article,
    comment_article,
    get_article_categories,
    get_article_comments,
    get_article_detail,
    get_articles,
    like_article,
    list_user_collections,
)
from utils.extensions import db
from utils.response import fail, ok

articles_bp = Blueprint("articles", __name__)


@articles_bp.get("/articles")
def list_articles():
    category = request.args.get("category")
    keyword = request.args.get("keyword")
    type_ = request.args.get("type")
    rows = get_articles(category=category, keyword=keyword, type_=type_)
    return ok(rows)


@articles_bp.get("/articles/categories")
def categories():
    return ok(get_article_categories())


@articles_bp.get("/articles/<int:article_id>")
def article_detail(article_id: int):
    user_id = None
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = int(get_jwt_identity())
    except Exception:
        pass

    article = get_article_detail(article_id, user_id)
    if not article:
        return fail("article not found", 404)
    return ok(article)


@articles_bp.post("/articles/<int:article_id>/like")
@jwt_required()
def like(article_id: int):
    user_id = int(get_jwt_identity())
    article = db.session.get(Article, article_id)
    if not article:
        return fail("article not found", 404)

    like_count, is_liked = like_article(user_id, article)
    return ok({"likeCount": like_count, "isLiked": is_liked})


@articles_bp.post("/articles/<int:article_id>/collect")
@jwt_required()
def collect(article_id: int):
    user_id = int(get_jwt_identity())
    article = db.session.get(Article, article_id)
    if not article:
        return fail("article not found", 404)

    collect_count, is_collected = collect_article(user_id, article)
    return ok({"collectCount": collect_count, "isCollected": is_collected})


@articles_bp.get("/articles/<int:article_id>/comments")
def comments(article_id: int):
    article = db.session.get(Article, article_id)
    if not article:
        return fail("article not found", 404)

    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("pageSize", 20, type=int)

    result = get_article_comments(article_id, page=page, page_size=page_size)
    return ok(result)


@articles_bp.post("/articles/<int:article_id>/comments")
@jwt_required()
def add_comment(article_id: int):
    user_id = int(get_jwt_identity())
    article = db.session.get(Article, article_id)
    if not article:
        return fail("article not found", 404)

    payload = request.get_json(silent=True) or {}
    content = (payload.get("content") or "").strip()
    if not content:
        return fail("content is required")

    record = comment_article(user_id, article, content)
    return ok({"commentId": record.id})


@articles_bp.get("/articles/collections")
@jwt_required()
def collections():
    user_id = int(get_jwt_identity())
    rows = list_user_collections(user_id)
    return ok(rows)
