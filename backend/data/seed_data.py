from models.article import Article
from models.coach import Coach
from models.achievement import Achievement
from utils.extensions import db


def seed_articles():
    if Article.query.count() > 0:
        return
    samples = [
        Article(title="深蹲入门指南", category="力量训练", cover_image="", content="深蹲是健身中最基础也是最有效的动作之一。保持背部挺直，膝盖朝向脚尖方向，核心收紧。", video_url="", author="官方"),
        Article(title="跑步减脂完全攻略", category="有氧训练", cover_image="", content="减脂的核心是热量赤字。跑步时保持心率在最大心率的60%-75%效果最佳。", video_url="", author="官方"),
        Article(title="训练后拉伸技巧", category="拉伸恢复", cover_image="", content="每个拉伸动作保持20-30秒，不要弹跳。训练后拉伸有助于减少肌肉酸痛。", video_url="", author="官方"),
        Article(title="增肌饮食完全指南", category="营养饮食", cover_image="", content="增肌需要热量盈余，每公斤体重摄入2g蛋白质是基础目标。", video_url="", author="官方"),
        Article(title="HIIT高效燃脂训练", category="有氧训练", cover_image="", content="HIIT通过高强度间歇训练，可以在短时间内达到极佳的燃脂效果。", video_url="", author="官方"),
    ]
    db.session.bulk_save_objects(samples)
    db.session.commit()


def seed_coaches():
    if Coach.query.count() > 0:
        return
    samples = [
        Coach(name="小雅教练", gender="female", style="gentle", avatar="", introduction="温柔鼓励型教练，擅长减脂指导与心理陪伴"),
        Coach(name="健强教练", gender="male", style="strict", avatar="", introduction="严格专业型教练，擅长力量训练与增肌计划"),
        Coach(name="静怡教练", gender="female", style="balanced", avatar="", introduction="均衡陪伴型教练，适合综合提升用户"),
    ]
    db.session.bulk_save_objects(samples)
    db.session.commit()


def seed_achievements():
    if Achievement.query.count() > 0:
        return
    samples = [
        Achievement(title="初出茅庐", description="完成第一次训练打卡", icon="badge_1.png", badge_type="bronze", condition_type="training_count", condition_value=1),
        Achievement(title="坚持一周", description="连续7天完成训练", icon="badge_2.png", badge_type="bronze", condition_type="streak_days", condition_value=7),
        Achievement(title="训练达人", description="累计完成30次训练", icon="badge_3.png", badge_type="silver", condition_type="training_count", condition_value=30),
        Achievement(title="自律王者", description="连续30天完成训练", icon="badge_4.png", badge_type="gold", condition_type="streak_days", condition_value=30),
        Achievement(title="热量燃烧者", description="累计消耗10000千卡", icon="badge_5.png", badge_type="silver", condition_type="total_calories", condition_value=10000),
    ]
    db.session.bulk_save_objects(samples)
    db.session.commit()


def seed_all():
    seed_articles()
    seed_coaches()
    seed_achievements()
