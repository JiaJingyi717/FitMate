import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-jwt-secret"
os.environ["SECRET_KEY"] = "test-secret"
os.environ["FITMATE_SKIP_MIGRATIONS"] = "1"

from app import create_app
from utils.extensions import db


@pytest.fixture(scope="function")
def app():
    test_app = create_app()
    with test_app.app_context():
        db.create_all()
        yield test_app
        db.drop_all()


@pytest.fixture(scope="function")
def client(app):
    return app.test_client()


@pytest.fixture(scope="function")
def auth_headers(client):
    client.post("/api/users/register", json={"email": "test@test.com", "password": "password123"})
    resp = client.post("/api/auth/login", json={"email": "test@test.com", "password": "password123"})
    data = resp.get_json()
    token = data["data"]["token"]
    return {"Authorization": f"Bearer {token}"}
