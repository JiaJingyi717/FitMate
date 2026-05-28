"""监控：健康检查与指标端点。"""

from utils.metrics import get_metrics_payload, reset_metrics_for_tests


def test_health_endpoints(client):
    for path in ("/health", "/api/health"):
        resp = client.get(path)
        assert resp.status_code == 200
        body = resp.get_json()
        assert body["code"] == 200
        data = body["data"]
        assert data["status"] in ("healthy", "degraded")
        assert "timestamp" in data
        assert data["version"]
        assert "database" in data["checks"]


def test_metrics_endpoint_and_counters(client):
    reset_metrics_for_tests()

    client.get("/api/articles")
    client.get("/api/not-exist-path")

    resp = client.get("/api/metrics")
    assert resp.status_code == 200
    data = resp.get_json()["data"]
    assert data["requests_total"] >= 1
    assert "error_rate" in data
    assert "latency_ms_avg" in data
    assert "uptime_seconds" in data
