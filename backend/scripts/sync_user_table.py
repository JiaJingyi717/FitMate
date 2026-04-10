"""
补全 users 表缺失列（与 models.user.User 一致）。
db.create_all() 不会修改已有表结构；若数据库是旧版建表，需运行本脚本或手动 ALTER。

用法（在 backend 目录下）:
    python -m scripts.sync_user_table
"""
from sqlalchemy import inspect, text

from app import app
from models.user import User
from utils.extensions import db


def _mysql_add_column(name: str, ddl: str) -> str:
    return f"ALTER TABLE users ADD COLUMN {name} {ddl}"


def _sqlite_add_column(name: str, ddl: str) -> str:
    return f"ALTER TABLE users ADD COLUMN {name} {ddl}"


# 与 User 模型字段一致（id/username/password 假定已存在）
_COLUMNS = [
    ("name", "VARCHAR(64) DEFAULT ''", "TEXT NOT NULL DEFAULT ''"),
    ("avatar", "VARCHAR(255) DEFAULT ''", "TEXT NOT NULL DEFAULT ''"),
    ("gender", "VARCHAR(16) DEFAULT ''", "TEXT NOT NULL DEFAULT ''"),
    ("height", "FLOAT NULL", "REAL"),
    ("weight", "FLOAT NULL", "REAL"),
    ("age", "INTEGER NULL", "INTEGER"),
    ("location", "VARCHAR(128) DEFAULT ''", "TEXT NOT NULL DEFAULT ''"),
    ("goal", "VARCHAR(128) DEFAULT ''", "TEXT NOT NULL DEFAULT ''"),
    ("current_coach_id", "INTEGER NULL", "INTEGER"),
    ("coach_gender", "VARCHAR(16) NULL", "TEXT"),
    ("coach_personality", "VARCHAR(32) NULL", "TEXT"),
    ("join_date", "DATETIME NULL", "DATETIME"),
    ("created_at", "DATETIME NULL", "DATETIME"),
]


def main() -> None:
    with app.app_context():
        insp = inspect(db.engine)
        if not insp.has_table("users"):
            print("表 users 不存在，请先启动应用一次让 create_all 建表。")
            return

        existing = {c["name"] for c in insp.get_columns("users")}
        dialect = db.engine.dialect.name

        for name, mysql_ddl, sqlite_ddl in _COLUMNS:
            if name in existing:
                continue
            ddl = mysql_ddl if dialect == "mysql" else sqlite_ddl
            stmt = (
                _mysql_add_column(name, ddl)
                if dialect == "mysql"
                else _sqlite_add_column(name, ddl)
            )
            print(f"执行: {stmt}")
            db.session.execute(text(stmt))
            db.session.commit()
            print(f"已添加列: {name}")

        # 再次检查（重新 reflect，避免缓存）
        insp2 = inspect(db.engine)
        existing_after = {c["name"] for c in insp2.get_columns("users")}
        model_cols = {c.name for c in User.__table__.columns}
        missing = model_cols - existing_after
        if missing:
            print(f"警告: 仍缺少列 {missing}")
        else:
            print("users 表列已与模型对齐。")


if __name__ == "__main__":
    main()
