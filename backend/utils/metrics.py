"""进程内 HTTP 指标：请求量、延迟、错误率（作业基础可观测性）。"""

from __future__ import annotations

import os
import threading
import time
from collections import defaultdict

_lock = threading.Lock()
_started_at = time.time()
_requests_total = 0
_errors_total = 0
_latency_ms_sum = 0.0
_latency_ms_count = 0
_status_counts: dict[str, int] = defaultdict(int)
_authenticated_requests = 0

_SKIP_PREFIXES = ("/health", "/api/health", "/api/metrics", "/metrics")


def _should_skip(path: str) -> bool:
    if os.getenv("FITMATE_METRICS_SKIP_HEALTH", "1").lower() in ("1", "true", "yes"):
        for prefix in _SKIP_PREFIXES:
            if path == prefix or path.startswith(prefix + "?"):
                return True
    return False


def record_request_start() -> None:
    from flask import g

    g._fitmate_request_start = time.perf_counter()


def record_request_end(response, *, had_auth_header: bool = False) -> None:
    from flask import g, request

    if _should_skip(request.path):
        return response

    elapsed_ms = 0.0
    start = getattr(g, "_fitmate_request_start", None)
    if start is not None:
        elapsed_ms = (time.perf_counter() - start) * 1000.0

    status = response.status_code
    is_error = status >= 400

    global _requests_total, _errors_total, _latency_ms_sum, _latency_ms_count, _authenticated_requests

    with _lock:
        _requests_total += 1
        if is_error:
            _errors_total += 1
        _latency_ms_sum += elapsed_ms
        _latency_ms_count += 1
        _status_counts[str(status)] += 1
        if had_auth_header:
            _authenticated_requests += 1

    return response


def get_metrics_payload() -> dict:
    with _lock:
        total = _requests_total
        errors = _errors_total
        avg_ms = (
            round(_latency_ms_sum / _latency_ms_count, 2) if _latency_ms_count else 0.0
        )
        error_rate = round(errors / total, 4) if total else 0.0
        return {
            "uptime_seconds": int(time.time() - _started_at),
            "requests_total": total,
            "errors_total": errors,
            "error_rate": error_rate,
            "latency_ms_avg": avg_ms,
            "authenticated_requests": _authenticated_requests,
            "by_status": dict(sorted(_status_counts.items())),
        }


def reset_metrics_for_tests() -> None:
    """仅测试使用。"""
    global _requests_total, _errors_total, _latency_ms_sum, _latency_ms_count, _authenticated_requests
    with _lock:
        _requests_total = 0
        _errors_total = 0
        _latency_ms_sum = 0.0
        _latency_ms_count = 0
        _status_counts.clear()
        _authenticated_requests = 0
