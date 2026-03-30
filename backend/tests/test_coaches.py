"""AI教练模块 API 测试（列表/会话初始化/切换/对话/重置）。"""
import pytest


class TestCoachesList:
    def test_list_coaches(self, client):
        resp = client.get("/api/coaches")
        assert resp.status_code == 200
        assert isinstance(resp.get_json()["data"], list)


class TestCoachesSession:
    def test_init_session(self, client, auth_headers):
        resp = client.get("/api/coaches/session/init", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.get_json()["data"]
        assert "sessionId" in data

    def test_switch_coach(self, client, auth_headers):
        coaches_resp = client.get("/api/coaches")
        coaches = coaches_resp.get_json()["data"]
        if coaches:
            coach_id = coaches[0]["id"]
            resp = client.put("/api/coaches/current",
                               headers=auth_headers,
                               json={"coachId": coach_id})
            assert resp.status_code == 200
            assert resp.get_json()["data"]["coachId"] == coach_id


class TestCoachesChat:
    def test_chat_success(self, client, auth_headers):
        client.get("/api/coaches/session/init", headers=auth_headers)
        resp = client.post("/api/coaches/chat",
                            headers=auth_headers,
                            json={"message": "如何减脂？"})
        assert resp.status_code == 200
        assert "reply" in resp.get_json()["data"]

    def test_reset_session(self, client, auth_headers):
        client.get("/api/coaches/session/init", headers=auth_headers)
        resp = client.delete("/api/coaches/session", headers=auth_headers)
        assert resp.status_code == 200
