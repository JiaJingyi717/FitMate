from models.knowledge import Knowledge
from utils.extensions import db


def seed_knowledge():
    if Knowledge.query.count() > 0:
        return
    samples = [
        Knowledge(title="深蹲入门", category="力量训练", content="背部挺直，膝盖朝脚尖方向。", video_url=""),
        Knowledge(title="跑步减脂建议", category="有氧训练", content="每周 3-4 次，每次 30 分钟。", video_url=""),
        Knowledge(title="训练后拉伸", category="拉伸恢复", content="每个动作保持 20-30 秒。", video_url=""),
    ]
    db.session.bulk_save_objects(samples)
    db.session.commit()
