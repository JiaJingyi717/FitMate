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
from routes.ai_routes import ai_bp
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
    # AI 智能功能
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    with app.app_context():
        from sqlalchemy import text
        from time import sleep

        dialect = db.engine.dialect.name
        is_sqlite = dialect == "sqlite"
        skip_migrations = os.environ.get("FITMATE_SKIP_MIGRATIONS", "0") == "1"

        if skip_migrations or is_sqlite:
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

            # 安全地添加缺失的列
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
            safe_add_column_if_missing("plan_tasks", "reps", "VARCHAR(32) NULL")  # 修改为 VARCHAR 支持 "8-12" 等格式
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
