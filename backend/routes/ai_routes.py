"""
AI 智能功能路由
包含：生成训练计划、饮食建议、AI教练、进度分析
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.ai_service import get_ai_client
from routes._shared import ok, fail

ai_bp = Blueprint("ai", __name__)


@ai_bp.post("/generate-plan")
@jwt_required()
def generate_plan():
    """
    生成个性化训练计划

    请求体：
    {
        "goal": "增肌/减脂/塑形/综合健身",
        "level": "新手/有基础/专业",
        "days_per_week": 4,
        "duration": 4,
        "preferences": "有氧为主/力量为主/均衡",
        "restrictions": "膝盖不好/无器械/...",
        "notes": "其他需求说明"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return fail("请求参数不能为空", 400)

        # 获取用户基本信息（如果有）
        user_id = int(get_jwt_identity())

        # 构建用户画像
        user_profile = {
            "goal": data.get("goal", "综合健身"),
            "level": data.get("level", "有基础"),
            "days_per_week": data.get("days_per_week", 4),
            "duration": data.get("duration", 4),
            "preferences": data.get("preferences", "均衡"),
            "restrictions": data.get("restrictions", ""),
            "notes": data.get("notes", ""),
        }

        # 调用 AI 服务
        ai_client = get_ai_client()
        result = ai_client.generate_plan(user_profile)

        return ok(data=result)

    except ValueError as e:
        return fail(str(e), 400)
    except TimeoutError as e:
        return fail(str(e), 504)
    except ConnectionError as e:
        return fail(str(e), 503)
    except Exception as e:
        print(f"[AI] 生成计划异常: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return fail(f"生成计划失败: {str(e)}", 500)


@ai_bp.post("/diet-advice")
@jwt_required()
def get_diet_advice():
    """
    获取饮食建议

    请求体：
    {
        "goal": "增肌/减脂/塑形",
        "weight": 70,
        "height": 170,
        "age": 25,
        "gender": "男/女",
        "activity_level": "久坐/轻度/中度/高度",
        "training_info": {
            "daily_calories": 300,
            "training_days": 4
        }
    }
    """
    try:
        data = request.get_json()
        if not data:
            return fail("请求参数不能为空", 400)

        user_profile = {
            "goal": data.get("goal", "综合健身"),
            "weight": data.get("weight", 70),
            "height": data.get("height", 170),
            "age": data.get("age", 25),
            "gender": data.get("gender", "男"),
            "activity_level": data.get("activity_level", "中度"),
        }

        training_info = data.get("training_info")

        ai_client = get_ai_client()
        result = ai_client.diet_advice(user_profile, training_info)

        return ok(data=result)

    except ValueError as e:
        return fail(str(e), 400)
    except TimeoutError as e:
        return fail(str(e), 504)
    except ConnectionError as e:
        return fail(str(e), 503)
    except Exception as e:
        print(f"[AI] 饮食建议异常: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return fail(f"获取饮食建议失败: {str(e)}", 500)


@ai_bp.post("/coach/chat")
@jwt_required()
def fitness_coach_chat():
    """
    AI 健身教练对话

    请求体：
    {
        "messages": [
            {"role": "user", "content": "用户问题"},
            {"role": "assistant", "content": "AI回复（对话历史）"}
        ],
        "context": {
            "fitness_level": "有基础",
            "current_plan": "增肌计划",
            "recent_goals": "增加卧推重量",
            "injuries": "无"
        }
    }
    """
    try:
        data = request.get_json()
        if not data:
            return fail("请求参数不能为空", 400)

        messages = data.get("messages", [])
        if not messages:
            return fail("消息列表不能为空", 400)

        # 获取用户上下文
        context = data.get("context", {})

        ai_client = get_ai_client()
        result = ai_client.fitness_coach(messages, context)

        return ok(data={
            "content": result["content"],
            "usage": result.get("usage", {})
        })

    except ValueError as e:
        return fail(str(e), 400)
    except TimeoutError as e:
        return fail(str(e), 504)
    except ConnectionError as e:
        return fail(str(e), 503)
    except Exception as e:
        print(f"[AI] 教练对话异常: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return fail(f"AI 教练响应失败: {str(e)}", 500)


@ai_bp.post("/progress-analysis")
@jwt_required()
def analyze_progress():
    """
    分析训练进度并给出建议

    请求体：
    {
        "completed_tasks": 12,
        "total_tasks": 20,
        "total_duration": 300,
        "total_calories": 2500,
        "plan_count": 2,
        "completion_rate": 60,
        "recent_activities": "近期活动描述（可选）"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return fail("请求参数不能为空", 400)

        ai_client = get_ai_client()
        result = ai_client.progress_analysis(data)

        return ok(data=result)

    except ValueError as e:
        return fail(str(e), 400)
    except TimeoutError as e:
        return fail(str(e), 504)
    except ConnectionError as e:
        return fail(str(e), 503)
    except Exception as e:
        print(f"[AI] 进度分析异常: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return fail(f"进度分析失败: {str(e)}", 500)


@ai_bp.get("/health")
def health_check():
    """检查 AI 服务状态"""
    try:
        ai_client = get_ai_client()
        return ok(data={
            "status": "ready",
            "model": ai_client.model,
            "api_base": ai_client.api_base
        })
    except ValueError as e:
        return ok(data={
            "status": "not_configured",
            "message": "请在 .env 文件中配置 QWEN_API_KEY"
        })
    except Exception as e:
        return fail(f"AI 服务异常: {str(e)}", 503)
