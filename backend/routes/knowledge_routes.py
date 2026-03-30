from flask import Blueprint, request

from services.knowledge_service import (
    get_categories,
    get_knowledge_by_id,
    list_knowledge,
    search_knowledge,
)
from utils.response import fail, ok

knowledge_bp = Blueprint("knowledge", __name__)


@knowledge_bp.get("/knowledge/categories")
def knowledge_categories():
    return ok(get_categories())


@knowledge_bp.get("/knowledge")
def knowledge_list():
    category = request.args.get("category")
    rows = list_knowledge(category)
    return ok(
        [{"id": k.id, "title": k.title, "category": k.category, "videoUrl": k.video_url} for k in rows]
    )


@knowledge_bp.get("/knowledge/search")
def knowledge_search():
    keyword = (request.args.get("keyword") or "").strip()
    if not keyword:
        return ok([])
    rows = search_knowledge(keyword)
    return ok([{"id": k.id, "title": k.title, "category": k.category} for k in rows])


@knowledge_bp.get("/knowledge/<int:item_id>")
def knowledge_detail(item_id: int):
    k = get_knowledge_by_id(item_id)
    if not k:
        return fail("knowledge not found", 404)
    return ok(
        {
            "id": k.id,
            "title": k.title,
            "category": k.category,
            "content": k.content,
            "videoUrl": k.video_url,
        }
    )
