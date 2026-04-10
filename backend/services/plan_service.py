from datetime import date, datetime, timezone

from models.plan import TrainingPlan
from models.plan_task import PlanTask
from models.record import TrainingRecord
from services.coach_service import generate_ai_plan_content
from utils.extensions import db


def list_plan_overview(user_id: int):
    today = date.today()
    total_plans = db.session.query(TrainingPlan).filter_by(user_id=user_id).count()
    done_plans = db.session.query(TrainingPlan).filter_by(user_id=user_id, status="done").count()

    today_tasks = (
        db.session.query(PlanTask)
        .join(TrainingPlan, PlanTask.plan_id == TrainingPlan.id)
        .filter(TrainingPlan.user_id == user_id, PlanTask.target_date == today)
        .count()
    )
    done_today = (
        db.session.query(PlanTask)
        .join(TrainingPlan, PlanTask.plan_id == TrainingPlan.id)
        .filter(TrainingPlan.user_id == user_id, PlanTask.target_date == today, PlanTask.is_completed == True)
        .count()
    )

    today_records = (
        TrainingRecord.query
        .filter_by(user_id=user_id, record_date=today)
        .all()
    )
    total_duration = sum(r.duration for r in today_records)
    total_calories = sum(r.calories for r in today_records)

    return {
        "completedTasks": done_today,
        "totalTasks": today_tasks,
        "totalDuration": total_duration,
        "totalCalories": total_calories,
        "planCount": total_plans,
    }


def list_training_plans(user_id: int):
    plans = TrainingPlan.query.filter_by(user_id=user_id).order_by(TrainingPlan.id.desc()).all()
    result = []
    for p in plans:
        tasks = db.session.query(PlanTask).filter_by(plan_id=p.id).all()
        total_tasks = len(tasks)
        completed_tasks = sum(1 for t in tasks if t.is_completed)
        progress = int(completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        total_cal = sum(t.calories for t in tasks if t.is_completed)

        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "type": p.plan_type,
            "difficulty": p.difficulty,
            "duration": p.duration_str,
        "startDate": p.start_date.isoformat() if p.start_date else None,
        "endDate": p.end_date.isoformat() if p.end_date else None,
        "status": p.status,
        "totalTasks": total_tasks,
        "completedTasks": completed_tasks,
        "progress": progress,
        "totalCalories": total_cal,
        "createdAt": p.created_at.isoformat(),
    })
    return result


def get_plan_detail(plan_id: int, user_id: int):
    plan = TrainingPlan.query.filter_by(id=plan_id, user_id=user_id).first()
    if not plan:
        return None

    tasks = db.session.query(PlanTask).filter_by(plan_id=plan_id).all()
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.is_completed)
    progress = int(completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    total_cal = sum(t.calories for t in tasks if t.is_completed)

    week_days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

    weekly_schedule = []
    task_by_week = {}

    for t in tasks:
        if t.target_date:
            week_num = (t.target_date - (plan.start_date or date.today())).days // 7 + 1
            day_of_week = week_days[t.target_date.weekday()]
            if week_num not in task_by_week:
                task_by_week[week_num] = []
            task_by_week[week_num].append({
                "id": t.id,
                "name": t.name,
                "type": t.task_type,
                "duration": t.duration_str or f"{t.duration}分钟",
                "durationMinutes": t.duration,
                "calories": t.calories,
                "sets": t.sets,
                "reps": t.reps,
                "rest": t.rest,
                "isCompleted": t.is_completed,
                "planId": t.plan_id,
            })

    for week_num in sorted(task_by_week.keys()):
        days_map = {}
        for t in task_by_week[week_num]:
            if t["name"]:
                day_idx = len(days_map)
                day_label = week_days[day_idx % 7]
                if day_label not in days_map:
                    days_map[day_label] = []
                days_map[day_label].append(t)

        week_days_list = []
        for day_name in week_days:
            if day_name in days_map:
                week_days_list.append({
                    "date": f"W{week_num}",
                    "dayOfWeek": day_name,
                    "tasks": days_map[day_name],
                })

        weekly_schedule.append({
            "weekNumber": week_num,
            "days": week_days_list,
        })

    return {
        "id": plan.id,
        "name": plan.name,
        "description": plan.description,
        "type": plan.plan_type,
        "difficulty": plan.difficulty,
        "duration": plan.duration_str,
        "startDate": plan.start_date.isoformat() if plan.start_date else None,
        "endDate": plan.end_date.isoformat() if plan.end_date else None,
        "status": plan.status,
        "progress": progress,
        "totalTasks": total_tasks,
        "completedTasks": completed_tasks,
        "totalCalories": total_cal,
        "tasks": [
            {
                "id": t.id,
                "name": t.name,
                "type": t.task_type,
                "duration": t.duration_str or f"{t.duration}分钟",
                "durationMinutes": t.duration,
                "calories": t.calories,
                "sets": t.sets,
                "reps": t.reps,
                "rest": t.rest,
                "isCompleted": t.is_completed,
                "planId": t.plan_id,
            }
            for t in tasks
        ],
        "weeklySchedule": weekly_schedule,
        "createdAt": plan.created_at.isoformat(),
    }


def create_training_plan(user_id: int, payload: dict):
    from datetime import datetime as dt
    start = payload.get("startDate")
    end = payload.get("endDate")

    start_date = None
    end_date = None
    if start:
        try:
            start_date = dt.strptime(start, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            start_date = None
    if end:
        try:
            end_date = dt.strptime(end, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            end_date = None

    plan = TrainingPlan(
        user_id=user_id,
        name=payload.get("name", "").strip(),
        description=payload.get("description", ""),
        plan_type=payload.get("type", "手动创建"),
        difficulty=payload.get("difficulty", "中级"),
        duration_str=payload.get("duration", ""),
        start_date=start_date,
        end_date=end_date,
        status=payload.get("status", "todo"),
    )
    db.session.add(plan)
    db.session.commit()
    return plan


def update_training_plan(plan, payload: dict):
    from datetime import datetime as dt
    plan.name = payload.get("name", plan.name)
    plan.description = payload.get("description", plan.description)
    plan.status = payload.get("status", plan.status)
    plan.plan_type = payload.get("type", plan.plan_type)
    plan.difficulty = payload.get("difficulty", plan.difficulty)
    plan.duration_str = payload.get("duration", plan.duration_str)
    start = payload.get("startDate")
    end = payload.get("endDate")
    if start:
        try:
            plan.start_date = dt.strptime(start, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            pass
    if end:
        try:
            plan.end_date = dt.strptime(end, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            pass
    db.session.commit()


def delete_plan(plan):
    db.session.query(PlanTask).filter_by(plan_id=plan.id).delete()
    db.session.delete(plan)
    db.session.commit()


def ai_generate_plan(user_id: int, payload: dict, save: bool = True):
    goal = payload.get("goal", "综合体能提升")
    level = payload.get("level", "有基础")
    days_per_week = payload.get("daysPerWeek", 4)
    time_per_day = payload.get("timePerDay", 45)
    training_days = payload.get("trainingDays", [])
    additional = payload.get("additionalRequirements", "")

    tasks = generate_ai_plan_content(goal, level, days_per_week, time_per_day, training_days, additional)

    if not save:
        return {
            "planId": None,
            "name": f"AI智能{goal}计划",
            "description": f"基于你的目标定制的科学{goal}方案",
            "difficulty": "中级" if level == "有基础" else ("初级" if level == "初学者" else "高级"),
            "duration": f"{days_per_week * 4}周",
            "tasks": tasks,
            "weeklySchedule": None,
        }

    from datetime import date, timedelta
    start_date = date.today()
    if payload.get("startDate"):
        try:
            from datetime import datetime
            start_date = datetime.strptime(payload["startDate"], "%Y-%m-%d").date()
        except (ValueError, TypeError):
            start_date = date.today()

    plan = TrainingPlan(
        user_id=user_id,
        name=f"AI智能{goal}计划",
        description=f"由AI生成的{goal}训练计划",
        plan_type="AI生成",
        difficulty="中级" if level == "有基础" else ("初级" if level == "初学者" else "高级"),
        duration_str=f"{days_per_week * 4}周",
        start_date=start_date,
        end_date=start_date + timedelta(days=days_per_week * 28),
        status="todo",
    )
    db.session.add(plan)
    db.session.flush()

    for task_data in tasks:
        task = PlanTask(
            plan_id=plan.id,
            name=task_data["name"],
            task_type=task_data["type"],
            duration=task_data["duration"],
            duration_str=task_data.get("duration_str", f"{task_data['duration']}分钟"),
            calories=task_data.get("calories", 0),
            sets=task_data.get("sets"),
            reps=task_data.get("reps"),
            rest=task_data.get("rest"),
            target_date=start_date,
        )
        db.session.add(task)

    db.session.commit()

    saved_tasks = db.session.query(PlanTask).filter_by(plan_id=plan.id).all()
    return {
        "planId": plan.id,
        "name": plan.name,
        "description": plan.description,
        "difficulty": plan.difficulty,
        "duration": plan.duration_str,
        "tasks": [
            {
                "id": t.id,
                "name": t.name,
                "type": t.task_type,
                "duration": t.duration_str or f"{t.duration}分钟",
                "durationMinutes": t.duration,
                "calories": t.calories,
                "sets": t.sets,
                "reps": t.reps,
                "rest": t.rest,
                "isCompleted": False,
                "planId": t.plan_id,
            }
            for t in saved_tasks
        ],
        "weeklySchedule": None,
    }


def list_plan_tasks(user_id: int):
    plan_ids = db.select(TrainingPlan.id).where(TrainingPlan.user_id == user_id).scalar_subquery()
    tasks = (
        db.session.query(PlanTask)
        .filter(PlanTask.plan_id.in_(plan_ids), PlanTask.target_date == date.today())
        .all()
    )
    return [
        {
            "id": t.id,
            "name": t.name,
            "type": t.task_type,
            "duration": t.duration_str or f"{t.duration}分钟",
            "durationMinutes": t.duration,
            "calories": t.calories,
            "sets": t.sets,
            "reps": t.reps,
            "rest": t.rest,
            "isCompleted": t.is_completed,
            "planId": t.plan_id,
        }
        for t in tasks
    ]


def check_in_task(user_id: int, task: PlanTask, is_completed: bool):
    task.is_completed = is_completed
    task.completed_at = datetime.now(timezone.utc) if is_completed else None

    record = None
    if is_completed:
        record = TrainingRecord(
            user_id=user_id,
            plan_id=task.plan_id,
            duration=task.duration,
            exercise_type=task.task_type,
            calories=task.calories,
            record_date=date.today(),
        )
        db.session.add(record)
    db.session.commit()
    return record


def add_task_to_plan(plan_id: int, user_id: int, task_data: dict):
    plan = TrainingPlan.query.filter_by(id=plan_id, user_id=user_id).first()
    if not plan:
        return None
    from datetime import date as dt
    task = PlanTask(
        plan_id=plan_id,
        name=task_data.get("name", task_data.get("title", "")),
        task_type=task_data.get("type", task_data.get("exerciseType", "综合")),
        duration=task_data.get("durationMinutes", task_data.get("duration", 30)),
        duration_str=task_data.get("duration", f"{task_data.get('durationMinutes', 30)}分钟"),
        calories=task_data.get("calories", 0),
        sets=task_data.get("sets"),
        reps=task_data.get("reps"),
        rest=task_data.get("rest"),
        description=task_data.get("description", ""),
        target_date=plan.start_date or dt.today(),
    )
    db.session.add(task)
    db.session.commit()
    return task


def remove_task_from_plan(plan_id: int, user_id: int, task_id: int):
    plan = TrainingPlan.query.filter_by(id=plan_id, user_id=user_id).first()
    if not plan:
        return False
    task = PlanTask.query.filter_by(id=task_id, plan_id=plan_id).first()
    if not task:
        return False
    db.session.delete(task)
    db.session.commit()
    return True
