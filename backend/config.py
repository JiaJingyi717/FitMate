import os

from dotenv import load_dotenv

load_dotenv()


def _resolve_database_url():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        return "sqlite:///fitmate.db"

    # 本机直接运行时，若误用 Docker 内网地址（db:3306），回退到 SQLite 以保证服务可启动。
    running_in_docker = os.path.exists("/.dockerenv")
    if (not running_in_docker) and "@db:" in db_url:
        return "sqlite:///fitmate.db"
    return db_url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fitmate-dev-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fitmate-jwt-secret")
    # 默认使用 SQLite，确保项目可以零配置启动。
    # 若需要 MySQL，可在环境变量中设置 DATABASE_URL。
    SQLALCHEMY_DATABASE_URI = _resolve_database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
