from flask import Flask
from flask_cors import CORS
import os

from config import Config
from data.seed_data import seed_all
from routes.analytics_routes import analytics_bp
from routes.articles_routes import articles_bp
from routes.auth_routes import auth_bp
from routes.coaches_routes import coaches_bp
from routes.plan_routes import plan_bp
from routes.users_routes import users_bp
from utils.extensions import db, jwt
from utils.response import ok


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    @app.get("/")
    def index():
        return ok({"message": "FitMate API", "docs": "API 根路径: /api", "health": "/api/health"})

    @app.get("/api/health")
    def health():
        return ok({"status": "up"})

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

    with app.app_context():
        from sqlalchemy import text

        dialect = db.engine.dialect.name
        is_sqlite = dialect == "sqlite"
        skip_migrations = os.environ.get("FITMATE_SKIP_MIGRATIONS", "0") == "1"

        if skip_migrations or is_sqlite:
            db.create_all()
            seed_all()
        else:
            # MySQL-specific migration logic: 安全地添加缺失的列，不删除任何数据
            def safe_add_column_if_missing(table, column, col_type):
                try:
                    existing = db.session.execute(
                        text(f"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=:t AND COLUMN_NAME=:c"),
                        {"t": table, "c": column}
                    ).fetchone()
                    if existing:
                        return
                    db.session.execute(text(f"ALTER TABLE {table} ADD COLUMN `{column}` {col_type}"))
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                    print(f"[migration] WARN: {table}.{column}: {e}")

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
            safe_add_column_if_missing("plan_tasks", "reps", "INT NULL")
            safe_add_column_if_missing("plan_tasks", "rest", "VARCHAR(32) NULL")

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
