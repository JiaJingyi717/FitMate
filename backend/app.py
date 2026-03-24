from flask import Flask
from flask_cors import CORS

from config import Config
from data.seed_data import seed_knowledge
from routes.ai_routes import ai_bp
from routes.knowledge_routes import knowledge_bp
from routes.plan_routes import plan_bp
from routes.stats_routes import stats_bp
from routes.user_routes import user_bp
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

    app.register_blueprint(user_bp, url_prefix="/api")
    app.register_blueprint(ai_bp, url_prefix="/api")
    app.register_blueprint(plan_bp, url_prefix="/api")
    app.register_blueprint(knowledge_bp, url_prefix="/api")
    app.register_blueprint(stats_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()
        seed_knowledge()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
