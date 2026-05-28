from models.plan import TrainingPlan
from models.user import User
from services.coach_context_service import build_coach_user_context
from utils.extensions import db


def test_build_coach_user_context_from_profile(app):
    with app.app_context():
        user = User(
            username="coach_ctx",
            password="hashed",
            name="李明",
            gender="男",
            age=28,
            height=175,
            weight=70,
            goal="增肌",
            coach_gender="male",
            coach_personality="gentle",
        )
        db.session.add(user)
        db.session.commit()

        plan = TrainingPlan(
            user_id=user.id,
            name="四周增肌",
            plan_type="AI生成",
            difficulty="中级",
            status="todo",
        )
        db.session.add(plan)
        db.session.commit()

        ctx = build_coach_user_context(user.id, {})

        assert ctx["name"] == "李明"
        assert ctx["gender"] == "男"
        assert ctx["recent_goals"] == "增肌"
        assert "四周增肌" in ctx["current_plan"]
        assert ctx["coach_gender"] == "男教练"
        assert ctx["coach_personality"] == "温柔鼓励型"
        assert "recent_training" in ctx


def test_request_context_overrides_coach_persona(app):
    with app.app_context():
        user = User(
            username="coach_ov",
            password="hashed",
            coach_gender="female",
            coach_personality="strict",
        )
        db.session.add(user)
        db.session.commit()

        ctx = build_coach_user_context(
            user.id,
            {"coach_gender": "male", "coach_personality": "energetic", "injuries": "膝盖不适"},
        )

        assert ctx["coach_gender"] == "男教练"
        assert ctx["coach_personality"] == "活力四射型"
        assert ctx["injuries"] == "膝盖不适"
