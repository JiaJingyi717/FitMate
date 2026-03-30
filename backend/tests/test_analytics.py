"""数据分析模块 API 测试（overview/category-distribution/duration-trend/ai-suggestions）。"""
import pytest


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
        resp = client.get("/api/analytics/category-distribution", headers=auth_headers)
        assert resp.status_code == 200
        assert "distribution" in resp.get_json()["data"]


class TestDurationTrend:
    def test_trend_success(self, client, auth_headers):
        resp = client.get("/api/analytics/duration-trend", headers=auth_headers)
        assert resp.status_code == 200
        assert "trend" in resp.get_json()["data"]


class TestAiSuggestions:
    def test_suggestions_success(self, client, auth_headers):
        resp = client.get("/api/analytics/ai-suggestions", headers=auth_headers)
        assert resp.status_code == 200
        assert "suggestions" in resp.get_json()["data"]
