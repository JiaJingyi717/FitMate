"""认证模块 API 测试（注册/登录/登出）。"""
import pytest


class TestRegister:
    def test_register_success(self, client):
        resp = client.post("/api/users/register", json={"username": "alice", "password": "alice123"})
        assert resp.status_code == 200
        assert "userId" in resp.get_json()["data"]

    def test_register_missing_fields(self, client):
        resp = client.post("/api/users/register", json={"password": "123"})
        assert resp.status_code == 400

    def test_register_duplicate(self, client):
        client.post("/api/users/register", json={"username": "bob", "password": "123"})
        resp = client.post("/api/users/register", json={"username": "bob", "password": "456"})
        assert resp.status_code == 400


class TestLogin:
    def test_login_success(self, client):
        client.post("/api/users/register", json={"username": "carol", "password": "pw999"})
        resp = client.post("/api/auth/login", json={"username": "carol", "password": "pw999"})
        assert resp.status_code == 200
        assert "token" in resp.get_json()["data"]

    def test_login_wrong_password(self, client):
        client.post("/api/users/register", json={"username": "dave", "password": "correct"})
        resp = client.post("/api/auth/login", json={"username": "dave", "password": "wrong"})
        assert resp.status_code == 401


class TestLogout:
    def test_logout_success(self, client, auth_headers):
        resp = client.post("/api/auth/logout", headers=auth_headers)
        assert resp.status_code == 200

    def test_logout_unauthorized(self, client):
        resp = client.post("/api/auth/logout")
        assert resp.status_code == 401
