"""知识库/文章模块 API 测试（列表/详情/点赞/收藏/评论/收藏列表）。"""
import pytest


class TestArticlesList:
    def test_list_articles(self, client):
        resp = client.get("/api/articles")
        assert resp.status_code == 200
        assert isinstance(resp.get_json()["data"], list)

    def test_list_with_category(self, client):
        resp = client.get("/api/articles?category=力量训练")
        assert resp.status_code == 200


class TestArticleDetail:
    def test_detail_success(self, client):
        list_resp = client.get("/api/articles")
        articles = list_resp.get_json()["data"]
        if articles:
            resp = client.get(f"/api/articles/{articles[0]['id']}")
            assert resp.status_code == 200

    def test_detail_not_found(self, client):
        resp = client.get("/api/articles/9999")
        assert resp.status_code == 404


class TestArticleLike:
    def test_like_toggle(self, client, auth_headers):
        list_resp = client.get("/api/articles")
        articles = list_resp.get_json()["data"]
        if articles:
            article_id = articles[0]["id"]
            resp = client.post(f"/api/articles/{article_id}/like", headers=auth_headers)
            assert resp.status_code == 200
            assert "likeCount" in resp.get_json()["data"]


class TestArticleCollect:
    def test_collect_toggle(self, client, auth_headers):
        list_resp = client.get("/api/articles")
        articles = list_resp.get_json()["data"]
        if articles:
            article_id = articles[0]["id"]
            resp = client.post(f"/api/articles/{article_id}/collect", headers=auth_headers)
            assert resp.status_code == 200


class TestArticleComments:
    def test_get_comments(self, client):
        list_resp = client.get("/api/articles")
        articles = list_resp.get_json()["data"]
        if articles:
            resp = client.get(f"/api/articles/{articles[0]['id']}/comments")
            assert resp.status_code == 200
            assert isinstance(resp.get_json()["data"], list)

    def test_add_comment(self, client, auth_headers):
        list_resp = client.get("/api/articles")
        articles = list_resp.get_json()["data"]
        if articles:
            article_id = articles[0]["id"]
            resp = client.post(f"/api/articles/{article_id}/comments",
                                headers=auth_headers,
                                json={"content": "写得很好！"})
            assert resp.status_code == 200
            assert "commentId" in resp.get_json()["data"]


class TestCollections:
    def test_collections(self, client, auth_headers):
        resp = client.get("/api/articles/collections", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.get_json()["data"], list)
