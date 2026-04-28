"""训练计划模块 API 测试（overview/list/detail/create/ai-generate/delete/today/complete）。"""
import pytest

from models.plan import TrainingPlan
from services.plan_service import (
    ai_generate_plan,
    add_task_to_plan,
    create_training_plan,
    remove_task_from_plan,
    update_training_plan,
)
from utils.extensions import db
from datetime import date

from models.plan import TrainingPlan
from models.plan_task import PlanTask
from services.plan_service import (
    ai_generate_plan,
    add_task_to_plan,
    create_training_plan,
    remove_task_from_plan,
    update_training_plan,
)
from utils.extensions import db


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

    def test_complete_task_success_and_uncheck(self, client, auth_headers):
        create = client.post("/api/plans", headers=auth_headers, json={"name": "打卡测试"})
        plan_id = create.get_json()["data"]["planId"]
        add_task = client.post(
            f"/api/plans/{plan_id}/tasks",
            headers=auth_headers,
            json={"task": {"name": "深蹲", "durationMinutes": 20, "calories": 100}},
        )
        task_id = add_task.get_json()["data"]["taskId"]

        done = client.patch(
            f"/api/plans/today/{task_id}/complete",
            headers=auth_headers,
            json={"isCompleted": True},
        )
        assert done.status_code == 200
        assert done.get_json()["data"]["recordId"] is not None

        undo = client.patch(
            f"/api/plans/today/{task_id}/complete",
            headers=auth_headers,
            json={"isCompleted": False},
        )
        assert undo.status_code == 200


class TestPlanTaskOps:
    def test_add_remove_task_route(self, client, auth_headers):
        create = client.post("/api/plans", headers=auth_headers, json={"name": "任务增删"})
        plan_id = create.get_json()["data"]["planId"]

        add_resp = client.post(
            f"/api/plans/{plan_id}/tasks",
            headers=auth_headers,
            json={"task": {"name": "跑步", "durationMinutes": 30, "calories": 120}},
        )
        assert add_resp.status_code == 200
        task_id = add_resp.get_json()["data"]["taskId"]

        remove_resp = client.delete(
            f"/api/plans/{plan_id}/tasks",
            headers=auth_headers,
            json={"taskId": task_id},
        )
        assert remove_resp.status_code == 200

    def test_remove_task_route_validation(self, client, auth_headers):
        create = client.post("/api/plans", headers=auth_headers, json={"name": "任务删校验"})
        plan_id = create.get_json()["data"]["planId"]

        missing_id = client.delete(f"/api/plans/{plan_id}/tasks", headers=auth_headers, json={})
        assert missing_id.status_code == 400

        not_found = client.delete(
            f"/api/plans/{plan_id}/tasks",
            headers=auth_headers,
            json={"taskId": 9999},
        )
        assert not_found.status_code == 404


class TestPlanServiceDirect:
    def test_create_and_update_plan_with_invalid_dates(self, app):
        with app.app_context():
            plan = create_training_plan(
                user_id=1,
                payload={"name": "服务层计划", "startDate": "invalid", "endDate": "invalid"},
            )
            assert plan.id is not None
            assert plan.start_date is None
            assert plan.end_date is None

            update_training_plan(
                plan,
                {"name": "更新后", "startDate": "bad", "endDate": "bad", "status": "done"},
            )
            refreshed = db.session.get(TrainingPlan, plan.id)
            assert refreshed.name == "更新后"
            assert refreshed.status == "done"

    def test_add_remove_task_service_branches(self, app):
        with app.app_context():
            plan = create_training_plan(user_id=1, payload={"name": "服务任务"})

            task = add_task_to_plan(plan.id, 1, {"name": "卧推", "durationMinutes": 25, "calories": 90})
            assert task is not None
            assert task.plan_id == plan.id

            assert remove_task_from_plan(plan.id, 1, task.id) is True
            assert remove_task_from_plan(plan.id, 1, 9999) is False
            assert remove_task_from_plan(plan.id, 2, 9999) is False

    def test_ai_generate_plan_save_false_and_true(self, app, monkeypatch):
        monkeypatch.setattr(
            "services.plan_service.generate_ai_plan_content",
            lambda *args, **kwargs: [{"name": "波比跳", "type": "有氧", "duration": 20, "calories": 80}],
        )
        with app.app_context():
            out = ai_generate_plan(1, {"goal": "减脂", "trainingDays": ["周一", "周三"]}, save=False)
            assert out["planId"] is None
            assert len(out["tasks"]) == 1

        monkeypatch.setattr(
            "services.plan_service.save_ai_plan",
            lambda **kwargs: {
                "plan_id": 123,
                "plan_name": "AI计划",
                "description": "desc",
                "difficulty": "中级",
                "duration_str": "4周",
                "weekly_schedule": [{"day": "周一"}],
            },
        )
        with app.app_context():
            out2 = ai_generate_plan(
                1,
                {"goal": "减脂", "training_days": ["周一"], "start_date": "2026-04-01", "end_date": "2026-04-30"},
                save=True,
            )
            assert out2["planId"] == 123
            assert out2["saved_plan"]["plan_name"] == "AI计划"

    def test_complete_task_success_and_uncheck(self, client, auth_headers):
        create = client.post("/api/plans", headers=auth_headers, json={"name": "打卡测试"})
        plan_id = create.get_json()["data"]["planId"]
        add_task = client.post(
            f"/api/plans/{plan_id}/tasks",
            headers=auth_headers,
            json={"task": {"name": "深蹲", "durationMinutes": 20, "calories": 100}},
        )
        task_id = add_task.get_json()["data"]["taskId"]

        done = client.patch(
            f"/api/plans/today/{task_id}/complete",
            headers=auth_headers,
            json={"isCompleted": True},
        )
        assert done.status_code == 200
        assert done.get_json()["data"]["recordId"] is not None

        undo = client.patch(
            f"/api/plans/today/{task_id}/complete",
            headers=auth_headers,
            json={"isCompleted": False},
        )
        assert undo.status_code == 200


class TestPlanTaskOps:
    def test_add_remove_task_route(self, client, auth_headers):
        create = client.post("/api/plans", headers=auth_headers, json={"name": "任务增删"})
        plan_id = create.get_json()["data"]["planId"]

        add_resp = client.post(
            f"/api/plans/{plan_id}/tasks",
            headers=auth_headers,
            json={"task": {"name": "跑步", "durationMinutes": 30, "calories": 120}},
        )
        assert add_resp.status_code == 200
        task_id = add_resp.get_json()["data"]["taskId"]

        remove_resp = client.delete(
            f"/api/plans/{plan_id}/tasks",
            headers=auth_headers,
            json={"taskId": task_id},
        )
        assert remove_resp.status_code == 200

    def test_remove_task_route_validation(self, client, auth_headers):
        create = client.post("/api/plans", headers=auth_headers, json={"name": "任务删校验"})
        plan_id = create.get_json()["data"]["planId"]

        missing_id = client.delete(f"/api/plans/{plan_id}/tasks", headers=auth_headers, json={})
        assert missing_id.status_code == 400

        not_found = client.delete(
            f"/api/plans/{plan_id}/tasks",
            headers=auth_headers,
            json={"taskId": 9999},
        )
        assert not_found.status_code == 404


class TestPlanServiceDirect:
    def test_create_and_update_plan_with_invalid_dates(self, app):
        with app.app_context():
            plan = create_training_plan(
                user_id=1,
                payload={"name": "服务层计划", "startDate": "invalid", "endDate": "invalid"},
            )
            assert plan.id is not None
            assert plan.start_date is None
            assert plan.end_date is None

            update_training_plan(
                plan,
                {"name": "更新后", "startDate": "bad", "endDate": "bad", "status": "done"},
            )
            refreshed = db.session.get(TrainingPlan, plan.id)
            assert refreshed.name == "更新后"
            assert refreshed.status == "done"

    def test_add_remove_task_service_branches(self, app):
        with app.app_context():
            plan = create_training_plan(user_id=1, payload={"name": "服务任务"})

            task = add_task_to_plan(plan.id, 1, {"name": "卧推", "durationMinutes": 25, "calories": 90})
            assert task is not None
            assert task.plan_id == plan.id

            assert remove_task_from_plan(plan.id, 1, task.id) is True
            assert remove_task_from_plan(plan.id, 1, 9999) is False
            assert remove_task_from_plan(plan.id, 2, 9999) is False

    def test_ai_generate_plan_save_false_and_true(self, app, monkeypatch):
        monkeypatch.setattr(
            "services.plan_service.generate_ai_plan_content",
            lambda *args, **kwargs: [{"name": "波比跳", "type": "有氧", "duration": 20, "calories": 80}],
        )
        with app.app_context():
            out = ai_generate_plan(1, {"goal": "减脂", "trainingDays": ["周一", "周三"]}, save=False)
            assert out["planId"] is None
            assert len(out["tasks"]) == 1

        monkeypatch.setattr(
            "services.plan_service.save_ai_plan",
            lambda **kwargs: {
                "plan_id": 123,
                "plan_name": "AI计划",
                "description": "desc",
                "difficulty": "中级",
                "duration_str": "4周",
                "weekly_schedule": [{"day": "周一"}],
            },
        )
        with app.app_context():
            out2 = ai_generate_plan(
                1,
                {"goal": "减脂", "training_days": ["周一"], "start_date": "2026-04-01", "end_date": "2026-04-30"},
                save=True,
            )
            assert out2["planId"] == 123
            assert out2["saved_plan"]["plan_name"] == "AI计划"
