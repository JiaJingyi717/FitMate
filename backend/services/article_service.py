from datetime import date

from models.article import Article
from models.article_interaction import ArticleCollect, ArticleComment, ArticleLike
from models.user import User
from utils.extensions import db


def get_articles(category=None, keyword=None, type_=None):
    query = Article.query
    if category:
        query = query.filter_by(category=category)
    if keyword:
        query = query.filter(Article.title.like(f"%{keyword}%"))
    if type_:
        query = query.filter_by(article_type=type_)
    rows = query.order_by(Article.id.desc()).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "type": r.article_type,
            "description": r.summary,
            "thumbnail": r.thumbnail,
            "videoUrl": r.video_url,
            "duration": r.duration,
            "views": r.views,
            "likes": r.like_count,
            "commentCount": r.comment_count,
            "author": r.author,
            "publishDate": r.publish_date.isoformat() if r.publish_date else r.created_at.strftime("%Y-%m-%d"),
            "isLiked": False,
            "isCollected": False,
        }
        for r in rows
    ]


def get_article_detail(article_id: int, current_user_id: int = None):
    article = db.session.get(Article, article_id)
    if not article:
        return None

    is_liked = False
    is_collected = False
    if current_user_id:
        is_liked = db.session.query(ArticleLike).filter_by(
            user_id=current_user_id, article_id=article.id
        ).first() is not None
        is_collected = db.session.query(ArticleCollect).filter_by(
            user_id=current_user_id, article_id=article.id
        ).first() is not None

    tags_list = []
    if article.tags:
        tags_list = [t.strip() for t in article.tags.split(",") if t.strip()]

    related = (
        db.session.query(Article)
        .filter(Article.category == article.category, Article.id != article.id)
        .limit(3)
        .all()
    )
    related_articles = [
        {
            "id": r.id,
            "title": r.title,
            "thumbnail": r.thumbnail,
            "category": r.category,
        }
        for r in related
    ]

    return {
        "id": article.id,
        "title": article.title,
        "category": article.category,
        "type": article.article_type,
        "description": article.summary,
        "thumbnail": article.thumbnail,
        "content": article.content,
        "videoUrl": article.video_url,
        "duration": article.duration,
        "views": article.views,
        "likes": article.like_count,
        "commentCount": article.comment_count,
        "author": article.author,
        "publishDate": article.publish_date.isoformat() if article.publish_date else article.created_at.strftime("%Y-%m-%d"),
        "tags": tags_list,
        "isLiked": is_liked,
        "isCollected": is_collected,
        "relatedArticles": related_articles,
    }


def like_article(user_id: int, article: Article):
    existing = db.session.query(ArticleLike).filter_by(
        user_id=user_id, article_id=article.id
    ).first()
    if existing:
        db.session.delete(existing)
        article.like_count = max(0, article.like_count - 1)
        is_liked = False
    else:
        like = ArticleLike(user_id=user_id, article_id=article.id)
        db.session.add(like)
        article.like_count += 1
        is_liked = True
    db.session.commit()
    return article.like_count, is_liked


def collect_article(user_id: int, article: Article):
    existing = db.session.query(ArticleCollect).filter_by(
        user_id=user_id, article_id=article.id
    ).first()
    if existing:
        db.session.delete(existing)
        article.collect_count = max(0, article.collect_count - 1)
        is_collected = False
    else:
        col = ArticleCollect(user_id=user_id, article_id=article.id)
        db.session.add(col)
        article.collect_count += 1
        is_collected = True
    db.session.commit()
    return article.collect_count, is_collected


def get_article_comments(article_id: int, page: int = 1, page_size: int = 20):
    from datetime import timedelta
    query = db.session.query(ArticleComment).filter_by(article_id=article_id).order_by(
        ArticleComment.id.asc()
    )
    total = query.count()
    offset = (page - 1) * page_size
    comments = query.offset(offset).limit(page_size).all()

    result = []
    now = date.today()
    for c in comments:
        user = db.session.get(User, c.user_id)
        days_ago = (now - c.created_at.date()).days if c.created_at else 0
        if days_ago == 0:
            date_str = "今天"
        elif days_ago == 1:
            date_str = "1天前"
        else:
            date_str = f"{days_ago}天前"

        result.append({
            "id": c.id,
            "userId": c.user_id,
            "username": user.name if user and user.name else (user.username if user else "未知用户"),
            "avatar": user.avatar if user else "",
            "content": c.content,
            "likes": 0,
            "createdAt": c.created_at.isoformat() if c.created_at else "",
            "date": date_str,
        })
    return {"comments": result, "total": total, "page": page, "pageSize": page_size}


def comment_article(user_id: int, article: Article, content: str):
    comment = ArticleComment(user_id=user_id, article_id=article.id, content=content)
    db.session.add(comment)
    article.comment_count += 1
    db.session.commit()
    return comment


def list_user_collections(user_id: int):
    rows = (
        db.session.query(Article)
        .join(ArticleCollect, ArticleCollect.article_id == Article.id)
        .filter(ArticleCollect.user_id == user_id)
        .all()
    )
    return [
        {
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "type": r.article_type,
            "description": r.summary,
            "thumbnail": r.thumbnail,
            "videoUrl": r.video_url,
            "duration": r.duration,
            "views": r.views,
            "likes": r.like_count,
            "commentCount": r.comment_count,
            "author": r.author,
            "publishDate": r.publish_date.isoformat() if r.publish_date else r.created_at.strftime("%Y-%m-%d"),
            "isLiked": False,
            "isCollected": True,
        }
        for r in rows
    ]


def get_article_categories():
    rows = db.session.query(Article.category, db.func.count(Article.id)).group_by(Article.category).all()
    return [{"name": name, "count": count} for name, count in rows if name]
