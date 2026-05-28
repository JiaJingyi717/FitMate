from flask import Flask
from flask_cors import CORS
import os

from sqlalchemy import text

from config import Config
from data.seed_data import seed_all
from utils.security_config import validate_app_secrets
from routes.analytics_routes import analytics_bp
from routes.articles_routes import articles_bp
from routes.auth_routes import auth_bp
from routes.coaches_routes import coaches_bp
from routes.plan_routes import plan_bp
from routes.users_routes import users_bp
from routes.ai_routes import ai_bp
from utils.extensions import db, jwt
from utils.health import get_health_payload
from utils.logger import setup_logging
from utils.metrics import get_metrics_payload, record_request_end, record_request_start
from utils.response import ok


def _register_all_models():
    """导入全部 ORM 模型，供 db.create_all() 注册元数据。"""
    import models.achievement  # noqa: F401
    import models.article
    import models.article_interaction
    import models.coach
    import models.coach_session
    import models.knowledge
    import models.plan
    import models.plan_task
    import models.record
    import models.user  # noqa: F401


def _apply_mysql_baseline_schema():
    """空库或仅有部分表时执行 schema_mysql.sql（与 Docker init 脚本一致，避免 ORM 与 BIGINT 外键冲突）。"""
    has_core = db.session.execute(
        text(
            "SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = DATABASE() AND table_name = 'training_plan' LIMIT 1"
        )
    ).fetchone()
    if has_core:
        return

    schema_path = os.path.join(os.path.dirname(__file__), "schema_mysql.sql")
    if not os.path.isfile(schema_path):
        print("[migration] 警告: 未找到 schema_mysql.sql")
        return

    print("[migration] 应用 schema_mysql.sql（补全缺失表）")
    with open(schema_path, encoding="utf-8") as f:
        content = f.read()

    for part in content.split(";"):
        stmt = part.strip()
        if not stmt or stmt.startswith("--"):
            continue
        upper = stmt.upper()
        if upper.startswith("CREATE DATABASE") or upper.startswith("USE "):
            continue
        try:
            db.session.execute(text(stmt))
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            err = str(e).lower()
            if "already exists" in err or "duplicate" in err:
                continue
            print(f"[migration] schema WARN: {e}")


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    validate_app_secrets(app)
    setup_logging(app)

    @app.before_request
    def _monitoring_before():
        from flask import request

        record_request_start()
        app.logger.info("request_start method=%s path=%s", request.method, request.path)

    @app.after_request
    def _security_headers(response):
        from flask import request

        record_request_end(
            response,
            had_auth_header=bool(request.headers.get("Authorization")),
        )
        app.logger.info(
            "request_end method=%s path=%s status=%s",
            request.method,
            request.path,
            response.status_code,
        )
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault(
            "Permissions-Policy",
            "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
        )
        return response

    @app.get("/")
    def index():
        return ok({"message": "FitMate API", "docs": "API 根路径: /api", "health": "/api/health"})

    @app.get("/api/health")
    def health():
        return ok(get_health_payload())

    @app.get("/health")
    def health_probe():
        """Docker / 负载均衡健康检查（与 /api/health 一致）。"""
        return ok(get_health_payload())

    @app.get("/api/metrics")
    def metrics():
        """进程内 HTTP 指标（请求量、延迟、错误率）。"""
        return ok(get_metrics_payload())

    # 用户认证
    app.register_blueprint(auth_bp, url_prefix="/api")
    # 个人中心
    app.register_blueprint(users_bp, url_prefix="/api")
    # AI教练
    app.register_blueprint(coaches_bp, url_prefix="/api")
    # 训练计划
    app.register_blueprint(plan_bp, url_prefix="/api")
    # 知识库
    app.register_blueprint(articles_bp, url_prefix="/api")
    # 数据分析
    app.register_blueprint(analytics_bp, url_prefix="/api")
    # AI 智能功能
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    with app.app_context():
        from time import sleep

        dialect = db.engine.dialect.name
        is_sqlite = dialect == "sqlite"
        skip_migrations = os.environ.get("FITMATE_SKIP_MIGRATIONS", "0") == "1"

        if skip_migrations or is_sqlite:
            _register_all_models()
            db.create_all()
            seed_all()
        else:
            # MySQL: 添加重试机制，等待数据库就绪
            max_retries = 30
            retry_delay = 2

            for attempt in range(max_retries):
                try:
                    # 测试连接
                    db.session.execute(text("SELECT 1"))
                    print(f"[migration] 数据库连接成功（尝试 {attempt + 1}/{max_retries}）")
                    break
                except Exception as e:
                    print(f"[migration] 数据库连接失败，{retry_delay}秒后重试... ({attempt + 1}/{max_retries}): {e}")
                    if attempt < max_retries - 1:
                        sleep(retry_delay)
                    else:
                        print("[migration] 错误：无法连接到数据库，跳过迁移")
                        return app

            _apply_mysql_baseline_schema()

            # 安全地添加缺失的列
            def safe_add_column_if_missing(table, column, col_type):
                try:
                    existing = db.session.execute(
                        text("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=:t AND COLUMN_NAME=:c"),
                        {"t": table, "c": column}
                    ).fetchone()
                    if existing:
                        return
                    db.session.execute(text(f"ALTER TABLE {table} ADD COLUMN `{column}` {col_type}"))
                    db.session.commit()
                    print(f"[migration] 添加列: {table}.{column}")
                except Exception as e:
                    db.session.rollback()
                    # 忽略"列已存在"等非致命错误
                    if "Duplicate column" in str(e) or "already exists" in str(e).lower():
                        pass
                    else:
                        print(f"[migration] WARN: {table}.{column}: {e}")

            # 安全地修改列类型
            def safe_modify_column_type(table, column, new_type):
                try:
                    db.session.execute(text(f"ALTER TABLE {table} MODIFY COLUMN `{column}` {new_type}"))
                    db.session.commit()
                    print(f"[migration] 修改列类型: {table}.{column} -> {new_type}")
                except Exception as e:
                    db.session.rollback()
                    if "Duplicate column" in str(e) or "already exists" in str(e).lower():
                        pass
                    else:
                        print(f"[migration] WARN: {table}.{column} 修改失败: {e}")

            safe_add_column_if_missing("users", "email", "VARCHAR(128) NULL")
            safe_add_column_if_missing("users", "phone", "VARCHAR(32) NULL")
            safe_add_column_if_missing("users", "name", "VARCHAR(64) DEFAULT ''")
            safe_add_column_if_missing("users", "location", "VARCHAR(128) DEFAULT ''")
            safe_add_column_if_missing("users", "coach_gender", "VARCHAR(16) NULL")
            safe_add_column_if_missing("users", "coach_personality", "VARCHAR(32) NULL")
            safe_add_column_if_missing("users", "join_date", "DATETIME NULL")

            safe_add_column_if_missing("training_plan", "plan_type", "VARCHAR(32) DEFAULT '手动创建'")
            safe_add_column_if_missing("training_plan", "difficulty", "VARCHAR(16) DEFAULT '中级'")
            safe_add_column_if_missing("training_plan", "duration_str", "VARCHAR(16) DEFAULT ''")
            safe_add_column_if_missing("training_plan", "start_date", "DATE NULL")
            safe_add_column_if_missing("training_plan", "end_date", "DATE NULL")
            safe_add_column_if_missing("training_plan", "total_calories", "INT DEFAULT 0")

            safe_add_column_if_missing("plan_tasks", "name", "VARCHAR(128) NOT NULL")
            safe_add_column_if_missing("plan_tasks", "task_type", "VARCHAR(64) DEFAULT '综合'")
            safe_add_column_if_missing("plan_tasks", "duration_str", "VARCHAR(32) DEFAULT ''")
            safe_add_column_if_missing("plan_tasks", "calories", "INT DEFAULT 0")
            safe_add_column_if_missing("plan_tasks", "sets", "INT NULL")
            safe_add_column_if_missing("plan_tasks", "reps", "VARCHAR(32) NULL")
            safe_add_column_if_missing("plan_tasks", "rest", "VARCHAR(32) NULL")
            # 旧库 schema 中 reps 为 INT，AI 计划会写入 "8-12" 等字符串，需改列类型
            safe_modify_column_type("plan_tasks", "reps", "VARCHAR(32) NULL")

            safe_add_column_if_missing("articles", "article_type", "VARCHAR(16) DEFAULT 'article'")
            safe_add_column_if_missing("articles", "summary", "TEXT")
            safe_add_column_if_missing("articles", "thumbnail", "VARCHAR(255) DEFAULT ''")
            safe_add_column_if_missing("articles", "views", "INT DEFAULT 0")
            safe_add_column_if_missing("articles", "publish_date", "DATE NULL")
            safe_add_column_if_missing("articles", "tags", "VARCHAR(255) DEFAULT ''")

            safe_add_column_if_missing("coaches", "personality", "VARCHAR(32) DEFAULT 'gentle'")

            safe_add_column_if_missing("training_record", "calories", "INT DEFAULT 0")

            safe_add_column_if_missing("achievements", "achievement_name", "VARCHAR(128) NOT NULL")

            seed_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
