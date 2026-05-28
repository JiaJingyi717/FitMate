from datetime import date, timedelta

from models.user import User
from models.article import Article
from models.coach import Coach
from models.achievement import Achievement
from data.article_contents import ARTICLE_CONTENTS
from services.user_service import register_user
from utils.extensions import db


def seed_test_user():
    if User.query.count() > 0:
        return
    register_user(
        username="test",
        password="123456",
        email="test@example.com",
        phone="13800138000",
        name="李明"
    )


def _article_fields(title: str, category: str, article_type: str, thumbnail: str, **kwargs):
    """从 ARTICLE_CONTENTS 取详细正文，缺省则用传入的 summary/content。"""
    detail = ARTICLE_CONTENTS.get(title, {})
    return {
        "title": title,
        "category": category,
        "article_type": article_type,
        "summary": kwargs.get("summary") or detail.get("summary", ""),
        "thumbnail": thumbnail,
        "content": kwargs.get("content") or detail.get("content", ""),
        "video_url": kwargs.get("video_url", ""),
        "duration": kwargs.get("duration", ""),
        "views": kwargs.get("views", 0),
        "author": kwargs.get("author", "官方"),
        "publish_date": kwargs.get("publish_date"),
        "tags": kwargs.get("tags", ""),
    }


def seed_articles():
    if Article.query.count() > 0:
        return
    today = date.today()
    specs = [
        ("深蹲入门指南", "力量训练", "article", "🏋️", dict(
            duration="8:30", views=15234, publish_date=today - timedelta(days=5),
            tags="深蹲,力量训练,腿部",
        )),
        ("跑步减脂完全攻略", "有氧运动", "video", "🏃", dict(
            video_url="https://www.bilibili.com/video/BV1DV411Y7rW/",
            duration="15:20", views=28341, publish_date=today - timedelta(days=3),
            tags="跑步,减脂,有氧",
        )),
        ("训练后拉伸技巧", "拉伸放松", "article", "🧘", dict(
            duration="10:15", views=9876, publish_date=today - timedelta(days=7),
            tags="拉伸,放松,恢复",
        )),
        ("增肌饮食完全指南", "营养饮食", "article", "🥗", dict(
            duration="12:45", views=18792, publish_date=today - timedelta(days=10),
            tags="增肌,饮食,营养,蛋白质",
        )),
        ("HIIT高效燃脂训练", "有氧运动", "video", "🔥", dict(
            video_url="https://www.bilibili.com/video/BV1Np4y1i7rG/",
            duration="20:00", views=34521, publish_date=today - timedelta(days=2),
            tags="HIIT,燃脂,高强度,间歇训练",
        )),
        ("核心力量训练全解", "力量训练", "article", "💪", dict(
            duration="14:20", views=12456, publish_date=today - timedelta(days=8),
            tags="核心,腹肌,平板支撑",
        )),
        ("肩部训练详解", "力量训练", "video", "🎯", dict(
            video_url="https://www.bilibili.com/video/BV1F1421t7fa/",
            duration="18:30", views=8234, publish_date=today - timedelta(days=4),
            tags="肩部,三角肌,力量训练",
        )),
        ("运动损伤预防与恢复", "运动损伤", "article", "🩹", dict(
            duration="16:00", views=6543, publish_date=today - timedelta(days=12),
            tags="损伤,预防,恢复,运动安全",
        )),
    ]
    samples = [Article(**_article_fields(title, cat, atype, thumb, **extra)) for title, cat, atype, thumb, extra in specs]
    db.session.bulk_save_objects(samples)
    db.session.commit()


def sync_article_contents():
    """将详细正文同步到已有文章（启动时执行，便于升级旧库）。"""
    updated = False
    for title, detail in ARTICLE_CONTENTS.items():
        article = Article.query.filter_by(title=title).first()
        if not article:
            continue
        if article.summary != detail.get("summary") or article.content != detail.get("content"):
            article.summary = detail["summary"]
            article.content = detail["content"]
            updated = True
    if updated:
        db.session.commit()


def seed_coaches():
    if Coach.query.count() > 0:
        return
    samples = [
        Coach(
            name="小雅教练", gender="female", style="gentle", personality="gentle",
            avatar="", introduction="温柔鼓励型教练，擅长减脂指导与心理陪伴"
        ),
        Coach(
            name="健强教练", gender="male", style="strict", personality="strict",
            avatar="", introduction="严格专业型教练，擅长力量训练与增肌计划"
        ),
        Coach(
            name="活力教练", gender="female", style="energetic", personality="energetic",
            avatar="", introduction="活力四射型教练，适合喜欢高强度训练的用户"
        ),
    ]
    db.session.bulk_save_objects(samples)
    db.session.commit()


def seed_achievements():
    if Achievement.query.count() > 0:
        return
    samples = [
        Achievement(
            achievement_name="初出茅庐", description="完成第一次训练打卡",
            icon="⭐", badge_type="bronze", condition_type="training_count", condition_value=1
        ),
        Achievement(
            achievement_name="坚持一周", description="连续7天完成训练",
            icon="🌟", badge_type="bronze", condition_type="streak_days", condition_value=7
        ),
        Achievement(
            achievement_name="训练达人", description="累计完成30次训练",
            icon="🏅", badge_type="silver", condition_type="training_count", condition_value=30
        ),
        Achievement(
            achievement_name="自律王者", description="连续30天完成训练",
            icon="👑", badge_type="gold", condition_type="streak_days", condition_value=30
        ),
        Achievement(
            achievement_name="热量燃烧者", description="累计消耗10000千卡",
            icon="🔥", badge_type="silver", condition_type="total_calories", condition_value=10000
        ),
        Achievement(
            achievement_name="知识探索者", description="阅读10篇健身知识文章",
            icon="📚", badge_type="bronze", condition_type="article_read", condition_value=10
        ),
    ]
    db.session.bulk_save_objects(samples)
    db.session.commit()


# 知识库视频教程（B 站嵌入播放）
DEMO_VIDEO_URLS = {
    "跑步减脂完全攻略": "https://www.bilibili.com/video/BV1DV411Y7rW/",
    "HIIT高效燃脂训练": "https://www.bilibili.com/video/BV1Np4y1i7rG/",
    "肩部训练详解": "https://www.bilibili.com/video/BV1F1421t7fa/",
}


def fix_demo_video_urls():
    """同步三篇视频教程的 B 站链接（已有库在启动时也会更新）。"""
    updated = False
    for title, url in DEMO_VIDEO_URLS.items():
        article = Article.query.filter_by(title=title, article_type="video").first()
        if not article:
            continue
        if article.video_url != url:
            article.video_url = url
            updated = True
    if updated:
        db.session.commit()


def seed_all():
    seed_test_user()
    seed_articles()
    sync_article_contents()
    fix_demo_video_urls()
    seed_coaches()
    seed_achievements()
