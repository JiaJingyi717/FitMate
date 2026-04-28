import os
import requests
import pytest

from services.ai_service import QwenAIClient, get_ai_client
import services.ai_service as ai_service_module


def test_init_requires_api_key(monkeypatch):
    monkeypatch.delenv("QWEN_API_KEY", raising=False)
    with pytest.raises(ValueError):
        QwenAIClient()


def test_chat_success_and_singleton(monkeypatch):
    monkeypatch.setenv("QWEN_API_KEY", "k")
    ai_service_module._ai_client = None

    class Resp:
        def raise_for_status(self):
            return None

        def json(self):
            return {"choices": [{"message": {"content": "ok"}}], "usage": {"tokens": 10}, "model": "m1"}

    monkeypatch.setattr("requests.post", lambda *args, **kwargs: Resp())
    c = QwenAIClient()
    out = c.chat([{"role": "user", "content": "hi"}])
    assert out["content"] == "ok"
    assert out["usage"]["tokens"] == 10

    a = get_ai_client()
    b = get_ai_client()
    assert a is b


def test_chat_exception_branches(monkeypatch):
    monkeypatch.setenv("QWEN_API_KEY", "k")
    c = QwenAIClient()

    def timeout_post(*args, **kwargs):
        raise requests.exceptions.Timeout()

    monkeypatch.setattr("requests.post", timeout_post)
    with pytest.raises(TimeoutError):
        c.chat([{"role": "user", "content": "hi"}])

    def reqerr_post(*args, **kwargs):
        raise requests.exceptions.RequestException("bad")

    monkeypatch.setattr("requests.post", reqerr_post)
    with pytest.raises(ConnectionError):
        c.chat([{"role": "user", "content": "hi"}])

    class BadResp:
        def raise_for_status(self):
            return None

        def json(self):
            return {"choices": []}

    monkeypatch.setattr("requests.post", lambda *args, **kwargs: BadResp())
    with pytest.raises(ValueError):
        c.chat([{"role": "user", "content": "hi"}])


def test_generate_plan_and_diet_and_progress_parsing(monkeypatch):
    monkeypatch.setenv("QWEN_API_KEY", "k")
    c = QwenAIClient()

    monkeypatch.setattr(
        c,
        "chat",
        lambda *args, **kwargs: {"content": '```json\n{"plan_name":"A","weekly_schedule":[]}\n```', "usage": {}},
    )
    p = c.generate_plan({"goal": "减脂"})
    assert p["success"] is True
    assert p["plan"]["plan_name"] == "A"

    monkeypatch.setattr(c, "chat", lambda *args, **kwargs: {"content": "not json", "usage": {}})
    with pytest.raises(ValueError):
        c.generate_plan({"goal": "减脂"})

    monkeypatch.setattr(
        c,
        "chat",
        lambda *args, **kwargs: {"content": '```json\n{"daily_calories":2000}\n```', "usage": {}},
    )
    d = c.diet_advice({"goal": "增肌"}, {"daily_calories": 300, "training_days": 4})
    assert d["success"] is True
    assert d["advice"]["daily_calories"] == 2000

    monkeypatch.setattr(c, "chat", lambda *args, **kwargs: {"content": '```json\n{"summary":"ok"}\n```', "usage": {}})
    prog = c.progress_analysis({"completed_tasks": 1, "total_tasks": 2})
    assert prog["success"] is True
    assert prog["analysis"]["summary"] == "ok"


def test_fitness_coach_context_build(monkeypatch):
    monkeypatch.setenv("QWEN_API_KEY", "k")
    c = QwenAIClient()
    captured = {}

    def fake_chat(messages, **kwargs):
        captured["messages"] = messages
        return {"content": "建议", "usage": {}}

    monkeypatch.setattr(c, "chat", fake_chat)
    out = c.fitness_coach(
        [{"role": "user", "content": "我想增肌"}],
        {"fitness_level": "有基础", "current_plan": "A", "recent_goals": "卧推", "injuries": "无"},
    )
    assert out["content"] == "建议"
    assert len(captured["messages"]) >= 3
