"""个人中心模块 API 测试（profile/achievements/password/account）。"""

from datetime import date

from utils.extensions import db


class TestProfile:
    def test_get_profile_success(self, client, auth_headers):
        resp = client.get("/api/users/profile", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.get_json()["data"]
        assert "email" in data  # profile exists

    def test_get_profile_unauthorized(self, client):
        resp = client.get("/api/users/profile")
        assert resp.status_code == 401

    def test_update_profile_success(self, client, auth_headers):
        resp = client.put("/api/users/profile",
                          headers=auth_headers,
                          json={"name": "测试用户", "goal": "减脂", "weight": 65.0})
        assert resp.status_code == 200
        profile = client.get("/api/users/profile", headers=auth_headers).get_json()["data"]
        assert profile["name"] == "测试用户"
        assert profile["goal"] == "减脂"

    def test_update_avatar_accepts_long_base64(self, client, auth_headers):
        avatar = "data:image/jpeg;base64," + ("A" * 512)
        resp = client.put(
            "/api/users/profile/avatar",
            headers=auth_headers,
            json={"avatar": avatar},
        )
        assert resp.status_code == 200
        assert resp.get_json()["data"]["avatar"] == avatar
        profile = client.get("/api/users/profile", headers=auth_headers).get_json()["data"]
        assert profile["avatar"] == avatar

class TestAchievements:
    def test_get_achievements_success(self, client, auth_headers):
        resp = client.get("/api/users/achievements", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.get_json()["data"], list)

    def test_achievements_unlock_after_check_in(self, client, auth_headers, app):
        from models.plan import TrainingPlan
        from models.plan_task import PlanTask
        from models.user import User

        with app.app_context():
            user = User.query.filter_by(email="test@test.com").first()
            user_id = user.id
            plan = TrainingPlan.query.filter_by(user_id=user_id).first()
            if not plan:
                plan = TrainingPlan(
                    user_id=user_id,
                    name="测试计划",
                    plan_type="手动",
                    difficulty="初级",
                    duration_str="1周",
                    status="todo",
                )
                db.session.add(plan)
                db.session.flush()
            task = PlanTask(
                plan_id=plan.id,
                name="测试任务",
                task_type="力量",
                duration=20,
                duration_str="20分钟",
                calories=100,
                target_date=date.today(),
            )
            db.session.add(task)
            db.session.commit()
            task_id = task.id

        complete = client.patch(
            f"/api/plans/today/{task_id}/complete",
            headers=auth_headers,
            json={"completed": True},
        )
        assert complete.status_code == 200

        resp = client.get("/api/users/achievements", headers=auth_headers)
        data = resp.get_json()["data"]
        first = next((a for a in data if a["name"] == "初出茅庐"), None)
        assert first is not None
        assert first["isEarned"] is True


class TestPassword:
    def test_change_password_success(self, client, auth_headers):
        resp = client.post("/api/users/password/change",
                            headers=auth_headers,
                            json={"oldPassword": "password123", "newPassword": "newpass"})
        assert resp.status_code == 200

    def test_change_password_wrong_old(self, client, auth_headers):
        resp = client.post("/api/users/password/change",
                            headers=auth_headers,
                            json={"oldPassword": "wrong", "newPassword": "newpass"})
        assert resp.status_code == 400


class TestAccount:
    def test_delete_account_success(self, client, auth_headers):
        resp = client.delete("/api/users/account", headers=auth_headers)
        assert resp.status_code == 200

    def test_profile_after_delete_returns_not_found(self, client, auth_headers):
        delete_resp = client.delete("/api/users/account", headers=auth_headers)
        assert delete_resp.status_code == 200

        profile_resp = client.get("/api/users/profile", headers=auth_headers)
        assert profile_resp.status_code == 404
