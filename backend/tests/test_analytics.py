"""数据分析模块 API 测试（overview/category-distribution/duration-trend/ai-suggestions）。"""


class TestAnalyticsOverview:
    def test_overview_success(self, client, auth_headers):
        resp = client.get("/api/analytics/overview", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.get_json()["data"]
        assert "totalDuration" in data
        assert "trainingCount" in data

    def test_overview_with_range(self, client, auth_headers):
        resp = client.get("/api/analytics/overview?range=30d", headers=auth_headers)
        assert resp.status_code == 200

    def test_overview_unauthorized(self, client):
        resp = client.get("/api/analytics/overview")
        assert resp.status_code == 401


class TestCategoryDistribution:
    def test_category_success(self, client, auth_headers):
        from datetime import date

        from models.record import TrainingRecord
        from utils.extensions import db

        login = client.post("/api/auth/login", json={"email": "test@test.com", "password": "password123"})
        user_id = login.get_json()["data"]["userId"]
        db.session.add(TrainingRecord(
            user_id=user_id,
            duration=4,
            exercise_type="力量",
            calories=27,
            record_date=date.today(),
        ))
        db.session.add(TrainingRecord(
            user_id=user_id,
            duration=1,
            exercise_type="有氧",
            calories=20,
            record_date=date.today(),
        ))
        db.session.commit()

        resp = client.get("/api/analytics/category-distribution", headers=auth_headers)
        assert resp.status_code == 200
        items = resp.get_json()["data"]
        assert isinstance(items, list)
        assert any(item["name"] == "力量" for item in items)
        assert any(item["name"] == "有氧" for item in items)

class TestDurationTrend:
    def test_trend_success(self, client, auth_headers):
        resp = client.get("/api/analytics/duration-trend", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.get_json()["data"], list)


class TestAiSuggestions:
    def test_suggestions_success(self, client, auth_headers):
        resp = client.get("/api/analytics/ai-suggestions", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.get_json()["data"], list)
