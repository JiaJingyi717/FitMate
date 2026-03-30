from flask import Flask
from flask_cors import CORS

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
        db.create_all()
        seed_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
