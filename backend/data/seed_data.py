from datetime import date, timedelta

from models.article import Article
from models.coach import Coach
from models.achievement import Achievement
from utils.extensions import db


def seed_articles():
    if Article.query.count() > 0:
        return
    today = date.today()
    samples = [
        Article(
            title="深蹲入门指南", category="力量训练", article_type="article",
            summary="深蹲是健身中最基础也是最有效的动作之一。",
            thumbnail="🏋️", content="深蹲是健身中最基础也是最有效的动作之一。保持背部挺直，膝盖朝向脚尖方向，核心收紧。\n\n## 深蹲要点\n1. 双脚与肩同宽或略宽\n2. 臀部向后坐，重心放在脚后跟\n3. 膝盖不超过脚尖太多\n4. 起身时腿部发力，呼气\n\n坚持每天练习，你会看到明显的进步！",
            video_url="", duration="8:30", views=15234,
            author="官方", publish_date=today - timedelta(days=5),
            tags="深蹲,力量训练,腿部",
        ),
        Article(
            title="跑步减脂完全攻略", category="有氧运动", article_type="video",
            summary="减脂的核心是热量赤字。跑步时保持心率在最大心率的60%-75%效果最佳。",
            thumbnail="🏃", content="减脂的核心是热量赤字。跑步时保持心率在最大心率的60%-75%效果最佳。\n\n## 跑步减脂技巧\n1. 每周3-4次，每次30-60分钟\n2. 热身5分钟后开始正式跑步\n3. 匀速跑或慢跑为主\n4. 跑后记得拉伸放松\n\n坚持一个月，你一定会看到体型的变化！",
            video_url="https://example.com/running.mp4", duration="15:20", views=28341,
            author="官方", publish_date=today - timedelta(days=3),
            tags="跑步,减脂,有氧",
        ),
        Article(
            title="训练后拉伸技巧", category="拉伸放松", article_type="article",
            summary="每个拉伸动作保持20-30秒，不要弹跳。训练后拉伸有助于减少肌肉酸痛。",
            thumbnail="🧘", content="每个拉伸动作保持20-30秒，不要弹跳。训练后拉伸有助于减少肌肉酸痛。\n\n## 全身拉伸动作\n1. 腿部后侧拉伸\n2. 臀部拉伸\n3. 背部拉伸\n4. 肩颈拉伸\n\n建议每个动作重复2-3次。",
            video_url="", duration="10:15", views=9876,
            author="官方", publish_date=today - timedelta(days=7),
            tags="拉伸,放松,恢复",
        ),
        Article(
            title="增肌饮食完全指南", category="营养饮食", article_type="article",
            summary="增肌需要热量盈余，每公斤体重摄入2g蛋白质是基础目标。",
            thumbnail="🥗", content="增肌需要热量盈余，每公斤体重摄入2g蛋白质是基础目标。\n\n## 增肌饮食建议\n1. 蛋白质：鸡胸肉、鱼、鸡蛋、豆腐\n2. 碳水：米饭、燕麦、红薯\n3. 优质脂肪：坚果、牛油果\n4. 少食多餐，每天5-6餐",
            video_url="", duration="12:45", views=18792,
            author="官方", publish_date=today - timedelta(days=10),
            tags="增肌,饮食,营养,蛋白质",
        ),
        Article(
            title="HIIT高效燃脂训练", category="有氧运动", article_type="video",
            summary="HIIT通过高强度间歇训练，可以在短时间内达到极佳的燃脂效果。",
            thumbnail="🔥", content="HIIT通过高强度间歇训练，可以在短时间内达到极佳的燃脂效果。\n\n## HIIT训练示例\n1. 热身60秒\n2. 全力冲刺20秒 + 休息10秒\n3. 重复8-10轮\n4. 冷身拉伸5分钟\n\n每周2-3次即可，不需要天天做。",
            video_url="https://example.com/hiit.mp4", duration="20:00", views=34521,
            author="官方", publish_date=today - timedelta(days=2),
            tags="HIIT,燃脂,高强度,间歇训练",
        ),
        Article(
            title="核心力量训练全解", category="力量训练", article_type="article",
            summary="强大的核心是所有运动的基础。平板支撑、卷腹、俄罗斯转体是经典动作。",
            thumbnail="💪", content="强大的核心是所有运动的基础。平板支撑、卷腹、俄罗斯转体是经典动作。\n\n## 核心训练动作\n1. 平板支撑：每次30-60秒，3组\n2. 卷腹：15-20个，3组\n3. 俄罗斯转体：20个，3组\n4. 鸟狗式：每侧10个，2组",
            video_url="", duration="14:20", views=12456,
            author="官方", publish_date=today - timedelta(days=8),
            tags="核心,腹肌,平板支撑",
        ),
        Article(
            title="肩部训练详解", category="力量训练", article_type="video",
            summary="肩部训练要注意三角肌前中后束的全面发展，推举和侧平举是基础动作。",
            thumbnail="🎯", content="肩部训练要注意三角肌前中后束的全面发展，推举和侧平举是基础动作。\n\n## 肩部训练计划\n1. 热身肩部：绕肩、手臂画圈\n2. 哑铃推举：12个x4组\n3. 侧平举：15个x4组\n4. 面拉：20个x3组",
            video_url="https://example.com/shoulder.mp4", duration="18:30", views=8234,
            author="官方", publish_date=today - timedelta(days=4),
            tags="肩部,三角肌,力量训练",
        ),
        Article(
            title="运动损伤预防与恢复", category="运动损伤", article_type="article",
            summary="预防运动损伤比治疗更重要。正确的姿势、充分的热身、合理的训练强度是关键。",
            thumbnail="🩹", content="预防运动损伤比治疗更重要。正确的姿势、充分的热身、合理的训练强度是关键。\n\n## 损伤预防要点\n1. 训练前充分热身10-15分钟\n2. 使用正确的动作姿势\n3. 循序渐进增加训练强度\n4. 保证充足的休息和恢复\n5. 感觉疼痛时立即停止训练",
            video_url="", duration="16:00", views=6543,
            author="官方", publish_date=today - timedelta(days=12),
            tags="损伤,预防,恢复,运动安全",
        ),
    ]
    db.session.bulk_save_objects(samples)
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


def seed_all():
    seed_articles()
    seed_coaches()
    seed_achievements()
