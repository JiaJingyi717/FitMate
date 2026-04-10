"""认证模块 API 测试（注册/登录/登出）。"""
import pytest


class TestRegister:
    def test_register_success(self, client):
        resp = client.post("/api/users/register", json={"email": "alice@test.com", "password": "alice123"})
        assert resp.status_code == 200
        assert "userId" in resp.get_json()["data"]

    def test_register_missing_fields(self, client):
        resp = client.post("/api/users/register", json={"password": "123"})
        assert resp.status_code == 400

    def test_register_duplicate(self, client):
        client.post("/api/users/register", json={"email": "bob@test.com", "password": "123"})
        resp = client.post("/api/users/register", json={"email": "bob@test.com", "password": "456"})
        assert resp.status_code == 400


class TestLogin:
    def test_login_success(self, client):
        client.post("/api/users/register", json={"email": "carol@test.com", "password": "pw999"})
        resp = client.post("/api/auth/login", json={"email": "carol@test.com", "password": "pw999"})
        assert resp.status_code == 200
        assert "token" in resp.get_json()["data"]

    def test_login_wrong_password(self, client):
        client.post("/api/users/register", json={"email": "dave@test.com", "password": "correct"})
        resp = client.post("/api/auth/login", json={"email": "dave@test.com", "password": "wrong"})
        assert resp.status_code == 401


class TestLogout:
    def test_logout_success(self, client, auth_headers):
        resp = client.post("/api/auth/logout", headers=auth_headers)
        assert resp.status_code == 200

    def test_logout_unauthorized(self, client):
        resp = client.post("/api/auth/logout")
        assert resp.status_code == 401
