"""结构化日志：生产环境默认 JSON 行输出，开发环境可读文本。"""

from __future__ import annotations

import json
import logging
import os
import sys
from datetime import datetime, timezone


class JsonFormatter(logging.Formatter):
    """每行一条 JSON，便于 Docker / 云平台日志检索。"""

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "time": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "logger": record.name,
        }
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False)


def setup_logging(app=None) -> None:
    level_name = os.getenv("FITMATE_LOG_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)

    use_json = os.getenv("FITMATE_LOG_JSON", "").lower() in ("1", "true", "yes")
    if not use_json and os.getenv("FITMATE_PRODUCTION", "").lower() in ("1", "true", "yes"):
        use_json = True

    root = logging.getLogger()
    root.handlers.clear()
    root.setLevel(level)

    handler = logging.StreamHandler(sys.stdout)
    if use_json:
        handler.setFormatter(JsonFormatter())
    else:
        handler.setFormatter(
            logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
        )
    root.addHandler(handler)

    # 降低第三方库噪音
    logging.getLogger("werkzeug").setLevel(logging.WARNING)

    if app is not None:
        app.logger.handlers = root.handlers
        app.logger.setLevel(level)
