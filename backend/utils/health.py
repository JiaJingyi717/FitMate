"""健康检查负载：供 /health 与 /api/health 使用。"""

from __future__ import annotations

import os
from datetime import datetime, timezone

from sqlalchemy import text

from utils.extensions import db


def get_health_payload() -> dict:
    db_status = "up"
    try:
        db.session.execute(text("SELECT 1"))
    except Exception:
        db_status = "down"

    overall = "healthy" if db_status == "up" else "degraded"

    return {
        "status": overall,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": os.getenv("FITMATE_VERSION", "1.0.0"),
        "checks": {
            "database": db_status,
        },
    }
