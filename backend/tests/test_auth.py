"""认证模块 API 测试（注册/登录/登出）。"""
import pytest


class TestRegister:
    def test_register_success(self, client):
        resp = client.post(
            "/api/users/register",
            json={"name": "alice", "email": "alice@test.com", "password": "alice123"},
        )
        assert resp.status_code == 200
        assert "userId" in resp.get_json()["data"]

    def test_register_missing_fields(self, client):
        resp = client.post("/api/users/register", json={"password": "123"})
        assert resp.status_code == 400

    def test_register_duplicate(self, client):
        client.post("/api/users/register", json={"name": "bob", "email": "bob@test.com", "password": "123"})
        resp = client.post("/api/users/register", json={"name": "bob", "email": "bob2@test.com", "password": "456"})
        assert resp.status_code == 400


class TestLogin:
    def test_login_success(self, client):
        client.post(
            "/api/users/register",
            json={"name": "carol", "email": "carol@test.com", "password": "pw999"},
        )
        resp = client.post("/api/auth/login", json={"email": "carol@test.com", "password": "pw999"})
        assert resp.status_code == 200
        assert "token" in resp.get_json()["data"]

    def test_login_wrong_password(self, client):
        client.post(
            "/api/users/register",
            json={"name": "dave", "email": "dave@test.com", "password": "correct"},
        )
        resp = client.post("/api/auth/login", json={"email": "dave@test.com", "password": "wrong"})
        assert resp.status_code == 401

    def test_login_by_username_and_phone(self, client):
        client.post(
            "/api/users/register",
            json={"name": "eric", "email": "eric@test.com", "phone": "13800001111", "password": "pw111"},
        )

        resp_user = client.post("/api/auth/login", json={"username": "eric", "password": "pw111"})
        assert resp_user.status_code == 200
        assert "token" in resp_user.get_json()["data"]

        resp_phone = client.post("/api/auth/login", json={"phone": "13800001111", "password": "pw111"})
        assert resp_phone.status_code == 200
        assert "token" in resp_phone.get_json()["data"]


class TestForgotResetPassword:
    def test_forgot_password_requires_contact(self, client):
        resp = client.post("/api/auth/forgot-password", json={})
        assert resp.status_code == 400

    def test_forgot_password_success(self, client):
        resp = client.post("/api/auth/forgot-password", json={"email": "x@test.com"})
        assert resp.status_code == 200

    def test_reset_password_invalid_code(self, client):
        resp = client.post(
            "/api/auth/reset-password",
            json={"email": "nouser@test.com", "code": "000000", "newPassword": "abcdef"},
        )
        assert resp.status_code == 400

    def test_reset_password_short_password(self, client):
        client.post(
            "/api/users/register",
            json={"name": "frank", "email": "frank@test.com", "password": "oldpass"},
        )
        resp = client.post(
            "/api/auth/reset-password",
            json={"email": "frank@test.com", "code": "123456", "newPassword": "123"},
        )
        assert resp.status_code == 400

    def test_reset_password_user_not_found(self, client):
        resp = client.post(
            "/api/auth/reset-password",
            json={"email": "missing@test.com", "code": "123456", "newPassword": "newpass"},
        )
        assert resp.status_code == 404

    def test_reset_password_success_and_login_with_new_password(self, client):
        client.post(
            "/api/users/register",
            json={"name": "gina", "email": "gina@test.com", "password": "oldpass"},
        )
        reset = client.post(
            "/api/auth/reset-password",
            json={"email": "gina@test.com", "code": "123456", "newPassword": "newpass"},
        )
        assert reset.status_code == 200

        login = client.post("/api/auth/login", json={"email": "gina@test.com", "password": "newpass"})
        assert login.status_code == 200


class TestLogout:
    def test_logout_success(self, client, auth_headers):
        resp = client.post("/api/auth/logout", headers=auth_headers)
        assert resp.status_code == 200

    def test_logout_unauthorized(self, client):
        resp = client.post("/api/auth/logout")
        assert resp.status_code == 401
