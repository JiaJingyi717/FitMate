from types import SimpleNamespace


def test_generate_plan_empty_payload(client, auth_headers):
    resp = client.post("/api/ai/generate-plan", json={}, headers=auth_headers)
    assert resp.status_code == 400
    assert resp.get_json()["code"] == 400


def test_generate_plan_success_without_save(client, auth_headers, monkeypatch):
    fake_client = SimpleNamespace(
        generate_plan=lambda profile: {"success": True, "plan": {"plan_name": "AI计划", "weekly_schedule": []}}
    )
    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: fake_client)

    resp = client.post(
        "/api/ai/generate-plan",
        json={"goal": "减脂", "save": False, "training_days": "周一、周三"},
        headers=auth_headers,
    )
    data = resp.get_json()
    assert resp.status_code == 200
    assert data["code"] == 200
    assert data["data"]["plan"]["plan_name"] == "AI计划"


def test_generate_plan_success_with_save(client, auth_headers, monkeypatch):
    fake_client = SimpleNamespace(
        generate_plan=lambda profile: {"success": True, "plan": {"plan_name": "AI计划", "weekly_schedule": []}}
    )
    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: fake_client)
    monkeypatch.setattr(
        "services.plan_service.save_ai_plan",
        lambda **kwargs: {"plan_id": 88, "plan_name": "保存计划"},
    )

    resp = client.post(
        "/api/ai/generate-plan",
        json={"goal": "增肌", "save": True, "start_date": "2026-04-01", "end_date": "2026-04-30"},
        headers=auth_headers,
    )
    data = resp.get_json()["data"]
    assert resp.status_code == 200
    assert data["saved_plan_id"] == 88
    assert data["saved_plan"]["plan_name"] == "保存计划"


def test_generate_plan_timeout(client, auth_headers, monkeypatch):
    class FakeClient:
        def generate_plan(self, profile):
            raise TimeoutError("timeout")

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: FakeClient())
    resp = client.post("/api/ai/generate-plan", json={"goal": "减脂"}, headers=auth_headers)
    assert resp.status_code == 504


def test_generate_plan_connection_and_value_error(client, auth_headers, monkeypatch):
    class ConnClient:
        def generate_plan(self, profile):
            raise ConnectionError("down")

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: ConnClient())
    resp = client.post("/api/ai/generate-plan", json={"goal": "减脂"}, headers=auth_headers)
    assert resp.status_code == 503

    class ValueClient:
        def generate_plan(self, profile):
            raise ValueError("bad input")

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: ValueClient())
    resp2 = client.post("/api/ai/generate-plan", json={"goal": "减脂"}, headers=auth_headers)
    assert resp2.status_code == 400


def test_diet_advice_success(client, auth_headers, monkeypatch):
    fake_client = SimpleNamespace(diet_advice=lambda profile, info: {"success": True, "advice": {"daily_calories": 2000}})
    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: fake_client)
    resp = client.post("/api/ai/diet-advice", json={"goal": "减脂"}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.get_json()["data"]["advice"]["daily_calories"] == 2000


def test_diet_advice_error_branches(client, auth_headers, monkeypatch):
    empty = client.post("/api/ai/diet-advice", json={}, headers=auth_headers)
    assert empty.status_code == 400

    class TimeoutClient:
        def diet_advice(self, profile, info):
            raise TimeoutError("timeout")

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: TimeoutClient())
    timeout_resp = client.post("/api/ai/diet-advice", json={"goal": "减脂"}, headers=auth_headers)
    assert timeout_resp.status_code == 504

    class ConnClient:
        def diet_advice(self, profile, info):
            raise ConnectionError("down")

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: ConnClient())
    conn_resp = client.post("/api/ai/diet-advice", json={"goal": "减脂"}, headers=auth_headers)
    assert conn_resp.status_code == 503


def test_coach_chat_validation_and_success(client, auth_headers, monkeypatch):
    resp = client.post("/api/ai/coach/chat", json={"messages": []}, headers=auth_headers)
    assert resp.status_code == 400

    fake_client = SimpleNamespace(fitness_coach=lambda msgs, ctx: {"content": "保持节奏", "usage": {"t": 1}})
    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: fake_client)
    ok_resp = client.post(
        "/api/ai/coach/chat",
        json={"messages": [{"role": "user", "content": "你好"}], "context": {"fitness_level": "有基础"}},
        headers=auth_headers,
    )
    data = ok_resp.get_json()
    assert ok_resp.status_code == 200
    assert data["data"]["content"] == "保持节奏"


def test_progress_analysis_success(client, auth_headers, monkeypatch):
    fake_client = SimpleNamespace(progress_analysis=lambda payload: {"success": True, "analysis": {"summary": "很好"}})
    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: fake_client)
    resp = client.post(
        "/api/ai/progress-analysis",
        json={"completed_tasks": 5, "total_tasks": 10},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.get_json()["data"]["analysis"]["summary"] == "很好"


def test_progress_analysis_error_branches(client, auth_headers, monkeypatch):
    empty = client.post("/api/ai/progress-analysis", json={}, headers=auth_headers)
    assert empty.status_code == 400

    class TimeoutClient:
        def progress_analysis(self, payload):
            raise TimeoutError("timeout")

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: TimeoutClient())
    timeout_resp = client.post(
        "/api/ai/progress-analysis",
        json={"completed_tasks": 1, "total_tasks": 2},
        headers=auth_headers,
    )
    assert timeout_resp.status_code == 504

    class ConnClient:
        def progress_analysis(self, payload):
            raise ConnectionError("down")

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: ConnClient())
    conn_resp = client.post(
        "/api/ai/progress-analysis",
        json={"completed_tasks": 1, "total_tasks": 2},
        headers=auth_headers,
    )
    assert conn_resp.status_code == 503


def test_ai_health_check_variants(client, monkeypatch):
    monkeypatch.setattr(
        "routes.ai_routes.get_ai_client",
        lambda: SimpleNamespace(model="qwen", api_base="https://x"),
    )
    resp = client.get("/api/ai/health")
    assert resp.status_code == 200
    assert resp.get_json()["data"]["status"] == "ready"

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: (_ for _ in ()).throw(ValueError("missing")))
    resp2 = client.get("/api/ai/health")
    assert resp2.status_code == 200
    assert resp2.get_json()["data"]["status"] == "not_configured"

    monkeypatch.setattr("routes.ai_routes.get_ai_client", lambda: (_ for _ in ()).throw(RuntimeError("boom")))
    resp3 = client.get("/api/ai/health")
    assert resp3.status_code == 503
