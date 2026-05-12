"""启动时安全校验（生产环境禁用弱默认密钥）。"""

import os


def validate_app_secrets(app) -> None:
    """生产环境禁止使用仓库内置默认 SECRET_KEY / JWT_SECRET_KEY。"""
    if app.testing:
        return
    if os.getenv("FLASK_ENV") != "production" and os.getenv("FITMATE_PRODUCTION") != "1":
        return

    weak = {"", "fitmate-dev-secret", "fitmate-jwt-secret"}
    sk = app.config.get("SECRET_KEY") or ""
    jk = app.config.get("JWT_SECRET_KEY") or ""
    if sk in weak or jk in weak:
        raise RuntimeError(
            "生产环境必须在环境变量中设置强随机 SECRET_KEY 与 JWT_SECRET_KEY，"
            "且不能使用仓库默认值。参见 docs/security-review.md 与 .env.example。"
        )
