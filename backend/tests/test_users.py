"""个人中心模块 API 测试（profile/achievements/password/account）。"""
import pytest


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


class TestAchievements:
    def test_get_achievements_success(self, client, auth_headers):
        resp = client.get("/api/users/achievements", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.get_json()["data"], list)


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
