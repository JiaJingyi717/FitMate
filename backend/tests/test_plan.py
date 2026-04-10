"""训练计划模块 API 测试（overview/list/detail/create/ai-generate/delete/today/complete）。"""
import pytest


class TestPlanOverview:
    def test_overview_success(self, client, auth_headers):
        resp = client.get("/api/plans/overview", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.get_json()["data"]
        assert "planCount" in data
        assert "totalTasks" in data


class TestPlanList:
    def test_list_empty(self, client, auth_headers):
        resp = client.get("/api/plans", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.get_json()["data"] == []

    def test_create_plan(self, client, auth_headers):
        resp = client.post("/api/plans",
                            headers=auth_headers,
                            json={"name": "减脂计划", "description": "每周3次"})
        assert resp.status_code == 200
        assert "planId" in resp.get_json()["data"]

    def test_create_plan_missing_name(self, client, auth_headers):
        resp = client.post("/api/plans", headers=auth_headers, json={})
        assert resp.status_code == 400


class TestPlanDetail:
    def test_get_detail(self, client, auth_headers):
        create = client.post("/api/plans", headers=auth_headers, json={"name": "详情测试"})
        plan_id = create.get_json()["data"]["planId"]
        resp = client.get(f"/api/plans/{plan_id}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.get_json()["data"]["name"] == "详情测试"

    def test_get_detail_not_found(self, client, auth_headers):
        resp = client.get("/api/plans/9999", headers=auth_headers)
        assert resp.status_code == 404


class TestPlanAiGenerate:
    def test_ai_generate(self, client, auth_headers):
        resp = client.post("/api/plans/ai-generate",
                            headers=auth_headers,
                            json={"goal": "减脂"})
        assert resp.status_code == 200
        data = resp.get_json()["data"]
        assert "planId" in data
        assert "tasks" in data


class TestPlanDelete:
    def test_delete_plan(self, client, auth_headers):
        create = client.post("/api/plans", headers=auth_headers, json={"name": "待删除"})
        plan_id = create.get_json()["data"]["planId"]
        resp = client.delete(f"/api/plans/{plan_id}", headers=auth_headers)
        assert resp.status_code == 200

    def test_delete_not_found(self, client, auth_headers):
        resp = client.delete("/api/plans/9999", headers=auth_headers)
        assert resp.status_code == 404


class TestTodayTasks:
    def test_today_tasks(self, client, auth_headers):
        resp = client.get("/api/plans/today", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.get_json()["data"], list)

    def test_complete_task_not_found(self, client, auth_headers):
        resp = client.patch("/api/plans/today/9999/complete",
                             headers=auth_headers,
                             json={"isCompleted": True})
        assert resp.status_code == 404
