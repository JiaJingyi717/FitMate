from models.article import Article
from models.article_interaction import ArticleCollect, ArticleComment, ArticleLike
from utils.extensions import db


def get_articles(category=None, keyword=None):
    query = Article.query
    if category:
        query = query.filter_by(category=category)
    if keyword:
        query = query.filter(Article.title.like(f"%{keyword}%"))
    rows = query.order_by(Article.id.desc()).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "coverImage": r.cover_image,
            "videoUrl": r.video_url,
            "likeCount": r.like_count,
            "collectCount": r.collect_count,
            "commentCount": r.comment_count,
            "author": r.author,
            "createdAt": r.created_at.isoformat(),
        }
        for r in rows
    ]


def get_article_detail(article_id: int):
    article = db.session.get(Article, article_id)
    if not article:
        return None
    return {
        "id": article.id,
        "title": article.title,
        "category": article.category,
        "coverImage": article.cover_image,
        "content": article.content,
        "videoUrl": article.video_url,
        "likeCount": article.like_count,
        "collectCount": article.collect_count,
        "commentCount": article.comment_count,
        "author": article.author,
        "createdAt": article.created_at.isoformat(),
    }


def like_article(user_id: int, article: Article):
    existing = db.session.query(ArticleLike).filter_by(
        user_id=user_id, article_id=article.id
    ).first()
    if existing:
        db.session.delete(existing)
        article.like_count = max(0, article.like_count - 1)
    else:
        like = ArticleLike(user_id=user_id, article_id=article.id)
        db.session.add(like)
        article.like_count += 1
    db.session.commit()


def collect_article(user_id: int, article: Article):
    existing = db.session.query(ArticleCollect).filter_by(
        user_id=user_id, article_id=article.id
    ).first()
    if existing:
        db.session.delete(existing)
        article.collect_count = max(0, article.collect_count - 1)
    else:
        col = ArticleCollect(user_id=user_id, article_id=article.id)
        db.session.add(col)
        article.collect_count += 1
    db.session.commit()


def get_article_comments(article_id: int):
    from models.user import User
    comments = db.session.query(ArticleComment).filter_by(article_id=article_id).order_by(
        ArticleComment.id.asc()
    ).all()
    result = []
    for c in comments:
        user = db.session.get(User, c.user_id)
        result.append({
            "id": c.id,
            "userId": c.user_id,
            "username": user.username if user else "未知用户",
            "avatar": user.avatar if user else "",
            "content": c.content,
            "createdAt": c.created_at.isoformat(),
        })
    return result


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
            "coverImage": r.cover_image,
            "videoUrl": r.video_url,
            "author": r.author,
        }
        for r in rows
    ]
