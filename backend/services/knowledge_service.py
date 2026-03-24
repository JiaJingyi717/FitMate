from models.knowledge import Knowledge
from utils.extensions import db


def get_categories():
    rows = db.session.query(Knowledge.category).distinct().all()
    return [row[0] for row in rows]


def list_knowledge(category=None):
    query = Knowledge.query
    if category:
        query = query.filter_by(category=category)
    return query.order_by(Knowledge.id.desc()).all()


def search_knowledge(keyword: str):
    return Knowledge.query.filter(Knowledge.title.like(f"%{keyword}%")).all()


def get_knowledge_by_id(item_id: int):
    return Knowledge.query.get(item_id)
