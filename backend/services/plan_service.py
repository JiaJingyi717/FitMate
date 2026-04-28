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

    # Python weekday(): 周一=0, 周二=1, ... , 周日=6
    week_days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    day_map = {"周一": 0, "周二": 1, "周三": 2, "周四": 3, "周五": 4, "周六": 5, "周日": 6}

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
                "target_date": t.target_date,
            })

    for week_num in sorted(task_by_week.keys()):
        # 按星期几分组任务
        days_tasks_map = {}
        for task_dict in task_by_week[week_num]:
            if task_dict["name"]:
                target_date = task_dict.get("target_date")
                day_idx = target_date.weekday() if target_date else 0
                day_label = week_days[day_idx]
                if day_label not in days_tasks_map:
                    days_tasks_map[day_label] = []
                days_tasks_map[day_label].append(task_dict)

        # 构建每周7天的数据，包括休息日
        week_days_list = []
        for day_idx, day_name in enumerate(week_days):
            day_tasks = days_tasks_map.get(day_name, [])
            week_days_list.append({
                "date": f"W{week_num}D{day_idx + 1}",
                "dayOfWeek": day_name,
                "isRestDay": len(day_tasks) == 0,
                "tasks": day_tasks,
            })

        weekly_schedule.append({
            "weekNumber": week_num,
            "weekLabel": f"第{week_num}周",
            "trainingDays": len([d for d in week_days_list if not d["isRestDay"]]),
            "restDays": len([d for d in week_days_list if d["isRestDay"]]),
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
    try:
        # 先删除关联的训练记录
        deleted_records = TrainingRecord.query.filter_by(plan_id=plan.id).delete()
        print(f"[delete_plan] 删除了 {deleted_records} 条训练记录")

        # 再删除关联的计划任务
        deleted_tasks = db.session.query(PlanTask).filter_by(plan_id=plan.id).delete()
        print(f"[delete_plan] 删除了 {deleted_tasks} 个计划任务")

        # 删除计划本身
        db.session.delete(plan)
        print(f"[delete_plan] 标记删除计划 id={plan.id}")

        # 提交事务
        db.session.commit()
        print(f"[delete_plan] 事务提交成功，计划 id={plan.id} 已删除")
    except Exception as e:
        print(f"[delete_plan] 发生异常: {type(e).__name__}: {e}")
        db.session.rollback()
        print(f"[delete_plan] 事务已回滚")
        raise


def ai_generate_plan(user_id: int, payload: dict, save: bool = True):
    print(f"[DEBUG ai_generate_plan] 接收到的 payload: {payload}")

    goal = payload.get("goal", "综合体能提升")
    level = payload.get("level", "有基础")
    days_per_week = payload.get("daysPerWeek", 4)
    time_per_day = payload.get("timePerDay", 45)
    # 兼容前端发送的 snake_case 和 camelCase 格式
    training_days_input = payload.get("trainingDays") or payload.get("training_days", [])
    additional = payload.get("additionalRequirements") or payload.get("restrictions", "")

    print(f"[DEBUG ai_generate_plan] training_days_input: {training_days_input}, 类型: {type(training_days_input)}")

    # 如果 training_days 是数组，转换为字符串
    if isinstance(training_days_input, list):
        training_days_str = "、".join(training_days_input)
    else:
        training_days_str = str(training_days_input) if training_days_input else ""

    print(f"[DEBUG ai_generate_plan] training_days_str: {training_days_str}")

    tasks = generate_ai_plan_content(goal, level, days_per_week, time_per_day, training_days_input, additional)
    print(f"[DEBUG ai_generate_plan] generate_ai_plan_content 返回 tasks 数量: {len(tasks) if tasks else 0}")
    print(f"[DEBUG ai_generate_plan] tasks 内容: {tasks}")

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

    # 兼容前端发送的 snake_case 和 camelCase 格式
    start_date_raw = payload.get("startDate") or payload.get("start_date")
    end_date_raw = payload.get("endDate") or payload.get("end_date")
    print(f"[DEBUG ai_generate_plan] start_date: {start_date_raw}, end_date: {end_date_raw}")

    # 将扁平的任务列表转换为 weekly_schedule 格式
    # 只构建一周期望的训练日配置，save_ai_plan 会展开到 4 周
    weekly_schedule = []
    if training_days_input and len(training_days_input) > 0:
        print(f"[DEBUG ai_generate_plan] 正在构建 weekly_schedule，用户选择了 {len(training_days_input)} 个训练日")
        # 使用轮转分配，保证所有练习都能分配到训练日，且每日内容不完全重复
        daily_buckets = {day_name: [] for day_name in training_days_input}
        for idx, task in enumerate(tasks):
            day_name = training_days_input[idx % len(training_days_input)]
            daily_buckets[day_name].append({
                "name": task.get("name", ""),
                "type": task.get("type", "综合"),
                "duration": task.get("duration", 30),
                "duration_str": task.get("duration_str", f"{task.get('duration', 30)}分钟"),
                "calories": task.get("calories", 0),
                "sets": task.get("sets"),
                "reps": task.get("reps"),
                "rest": task.get("rest"),
                "description": "",
            })

        for day_name in training_days_input:
            day_exercises = daily_buckets.get(day_name, [])
            if not day_exercises:
                continue
            weekly_schedule.append({
                "day": day_name,
                "exercises": day_exercises,
                "estimated_calories": sum(ex.get("calories", 0) for ex in day_exercises),
            })
    else:
        # 如果没有指定训练日，将所有任务作为一天的练习
        weekly_schedule.append({
            "day": "周一",
            "exercises": [{
                "name": t.get("name", ""),
                "type": t.get("type", "综合"),
                "duration": t.get("duration", 30),
                "duration_str": t.get("duration_str", f"{t.get('duration', 30)}分钟"),
                "calories": t.get("calories", 0),
                "sets": t.get("sets"),
                "reps": t.get("reps"),
                "rest": t.get("rest"),
                "description": "",
            } for t in tasks],
            "estimated_calories": sum(t.get("calories", 0) for t in tasks),
        })

    # 构建 plan_data 供 save_ai_plan 使用
    plan_data = {
        "plan_name": f"AI智能{goal}计划",
        "description": f"由AI生成的{goal}训练计划",
        "duration_weeks": 4,
        "difficulty": "中级" if level == "有基础" else ("初级" if level == "初学者" else "高级"),
        "weekly_schedule": weekly_schedule,
    }
    print(f"[DEBUG ai_generate_plan] 最终 weekly_schedule: {weekly_schedule}")

    # 使用 save_ai_plan 正确保存计划（会按训练日分配日期）
    print(f"[DEBUG ai_generate_plan] 准备调用 save_ai_plan, training_days={training_days_str}")
    saved_result = save_ai_plan(
        user_id=user_id,
        plan_data=plan_data,
        goal=goal,
        level=level,
        start_date=start_date_raw,
        end_date=end_date_raw,
        training_days=training_days_str
    )

    # 返回保存结果
    saved_plan_id = saved_result.get("plan_id")
    return {
        "planId": saved_plan_id,
        "plan": saved_result,  # 保持与前端期望的格式一致
        "name": saved_result.get("plan_name"),
        "description": saved_result.get("description"),
        "difficulty": saved_result.get("difficulty"),
        "duration": saved_result.get("duration_str"),
        "tasks": [],  # 任务已保存到数据库
        "weeklySchedule": saved_result.get("weekly_schedule"),
        "saved_plan": saved_result,
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


def save_ai_plan(user_id: int, plan_data: dict, goal: str, level: str, start_date=None, end_date=None, training_days: str = "") -> dict:
    """
    保存 AI 生成的训练计划到数据库

    Args:
        user_id: 用户ID
        plan_data: AI 返回的训练计划数据
        goal: 健身目标
        level: 健身水平
        start_date: 开始日期（可选）
        end_date: 结束日期（可选）
        training_days: 用户选择的训练日（如"周一、周三、周五"）

    Returns:
        保存后的计划信息
    """
    from datetime import timedelta

    print(f"[DEBUG] save_ai_plan called with start_date={start_date}, end_date={end_date}")
    print(f"[DEBUG] plan_data weekly_schedule: {plan_data.get('weekly_schedule', [])}")

    plan_name = plan_data.get("plan_name", f"AI智能{goal}计划")
    description = plan_data.get("description", f"由AI生成的{goal}训练计划")
    duration_weeks = plan_data.get("duration_weeks", 4)
    difficulty = plan_data.get("difficulty", "中级")
    weekly_schedule = plan_data.get("weekly_schedule", [])
    print(f"[DEBUG save_ai_plan] training_days 参数: '{training_days}'")
    print(f"[DEBUG save_ai_plan] weekly_schedule 条目数: {len(weekly_schedule)}")
    print(f"[DEBUG save_ai_plan] weekly_schedule days: {[d.get('day') for d in weekly_schedule]}")

    # 处理难度映射
    difficulty_map = {
        "初级": "初级",
        "中级": "中级",
        "高级": "高级",
        "初学者": "初级",
        "有基础": "中级",
        "健身达人": "高级",
    }
    difficulty = difficulty_map.get(difficulty, "中级")

    # 处理开始日期
    if start_date:
        if isinstance(start_date, str):
            try:
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            except (ValueError, TypeError):
                start_date = date.today()
        elif not isinstance(start_date, date):
            start_date = date.today()
    else:
        start_date = date.today()

    # 处理结束日期
    if end_date:
        if isinstance(end_date, str):
            try:
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            except (ValueError, TypeError):
                end_date = start_date + timedelta(days=duration_weeks * 7)
        elif not isinstance(end_date, date):
            end_date = start_date + timedelta(days=duration_weeks * 7)
    else:
        end_date = start_date + timedelta(days=duration_weeks * 7)

    # 计算总卡路里
    total_calories = 0
    for day_data in weekly_schedule:
        total_calories += day_data.get("estimated_calories", 0)

    # 创建训练计划
    plan = TrainingPlan(
        user_id=user_id,
        name=plan_name,
        description=description,
        plan_type="AI生成",
        difficulty=difficulty,
        duration_str=f"{duration_weeks}周",
        start_date=start_date,
        end_date=end_date,
        total_calories=total_calories,
        status="todo",
    )
    db.session.add(plan)
    db.session.flush()

    # 根据 weekly_schedule 创建每日任务
    # 与 Python weekday() 保持一致：周一=0 ... 周日=6
    day_map = {"周一": 0, "周二": 1, "周三": 2, "周四": 3, "周五": 4, "周六": 5, "周日": 6}
    
    # 解析用户选择的训练日顺序
    user_day_order = []
    user_day_set = set()  # 用于快速查找
    if training_days:
        for day in training_days.split('、'):
            day = day.strip()
            if day in day_map:
                user_day_order.append(day)
                user_day_set.add(day)
    
    # 如果 user_day_order 为空，从 weekly_schedule 获取（不应该发生）
    if not user_day_order:
        for day_data in weekly_schedule:
            day_name = day_data.get("day", "")
            if day_name in day_map:
                user_day_order.append(day_name)
                user_day_set.add(day_name)
    
    print(f"[DEBUG save_ai_plan] 用户选择的训练日: {user_day_order}")
    
    # 过滤 weekly_schedule，只保留用户选择的训练日
    filtered_schedule = [d for d in weekly_schedule if d.get("day") in user_day_set]
    print(f"[DEBUG save_ai_plan] AI返回的训练日: {[d.get('day') for d in weekly_schedule]}")
    print(f"[DEBUG save_ai_plan] 过滤后的训练日: {[d.get('day') for d in filtered_schedule]}")
    
    # 建立 day_name -> day_data 的映射（只包含用户选择的日期）
    day_data_map = {}
    for day_data in filtered_schedule:
        day_name = day_data.get("day", "")
        if day_name and day_name in user_day_set:
            day_data_map[day_name] = day_data
    
    # 计算每个训练日的下一个出现日期（从 start_date 开始）
    def get_next_date(start, day_of_week):
        """获取从 start 日期开始的下一个指定星期几的日期"""
        days_ahead = day_of_week - start.weekday()
        if days_ahead < 0:
            days_ahead += 7
        return start + timedelta(days=days_ahead)
    
    # 为每个训练日计算目标日期
    day_target_dates = {}
    for day_name in day_data_map.keys():
        if day_name in day_map:
            day_of_week = day_map[day_name]
            target_date = get_next_date(start_date, day_of_week)
            day_target_dates[day_name] = target_date
    
    print(f"[DEBUG save_ai_plan] day_target_dates: {day_target_dates}")
    print(f"[DEBUG save_ai_plan] start_date: {start_date}, start_date.weekday(): {start_date.weekday()}")
    
    # 按周和用户选择的训练日顺序创建任务
    num_weeks = max(1, duration_weeks)
    for week_idx in range(num_weeks):
        # 对于每周，按用户选择的训练日顺序处理
        week_day_count = 0
        for day_idx, day_name in enumerate(user_day_order):
            if day_name not in day_data_map:
                continue
            
            day_data = day_data_map[day_name]
            
            # 获取该日对应的目标日期
            if day_name in day_target_dates:
                base_date = day_target_dates[day_name]
                target_date = base_date + timedelta(days=week_idx * 7)
            else:
                day_offset = day_map.get(day_name, week_idx % 7)
                target_date = start_date + timedelta(days=week_idx * 7 + day_offset)

            exercises = day_data.get("exercises", [])
            print(f"[DEBUG] week={week_idx}, day_name={day_name}, target_date={target_date}, exercises_count={len(exercises)}")
            for ex in exercises:
                # 处理 duration - 可能是数字或字符串
                duration_val = ex.get("duration", 30)
                if isinstance(duration_val, str):
                    # 从字符串提取数字
                    import re
                    match = re.search(r'\d+', duration_val)
                    duration_int = int(match.group()) if match else 30
                    duration_str_val = duration_val
                else:
                    duration_int = int(duration_val) if duration_val else 30
                    duration_str_val = f"{duration_int}分钟"

                # 处理 sets - 可能是数字
                sets_val = ex.get("sets")
                if sets_val is not None and not isinstance(sets_val, int):
                    try:
                        sets_val = int(sets_val)
                    except (ValueError, TypeError):
                        sets_val = None

                task = PlanTask(
                    plan_id=plan.id,
                    name=ex.get("name", ""),
                    task_type=ex.get("type", "综合"),
                    duration=duration_int,
                    duration_str=duration_str_val,
                    calories=ex.get("calories", 0) or 0,
                    sets=sets_val,
                    reps=str(ex.get("reps")) if ex.get("reps") is not None else None,
                    rest=str(ex.get("rest")) if ex.get("rest") is not None else None,
                    description=ex.get("description", ""),
                    target_date=target_date,
                )
                db.session.add(task)

    db.session.commit()

    # 查询刚创建的所有任务
    created_tasks = db.session.query(PlanTask).filter_by(plan_id=plan.id).order_by(PlanTask.target_date).all()

    # 将任务按日期组织成 weekly_schedule 格式
    from collections import defaultdict
    tasks_by_date = defaultdict(list)
    for task in created_tasks:
        date_key = task.target_date.isoformat() if task.target_date else "unknown"
        tasks_by_date[date_key].append({
            "name": task.name,
            "type": task.task_type,
            "duration": task.duration,
            "duration_str": task.duration_str or f"{task.duration}分钟",
            "calories": task.calories or 0,
            "sets": task.sets,
            "reps": task.reps,
            "rest": task.rest,
        })

    # 构建 weekly_schedule（按用户选择的训练日顺序）
    return_weekly_schedule = []
    for week_idx in range(num_weeks):
        for day_name in user_day_order:
            if day_name in day_target_dates:
                target_date = day_target_dates[day_name] + timedelta(days=week_idx * 7)
                date_key = target_date.isoformat()
                day_exercises = tasks_by_date.get(date_key, [])
                if day_exercises:
                    return_weekly_schedule.append({
                        "day": day_name,
                        "date": date_key,
                        "exercises": day_exercises,
                        "estimated_calories": sum(ex.get("calories", 0) for ex in day_exercises),
                    })

    print(f"[DEBUG save_ai_plan] 返回的 weekly_schedule 条目数: {len(return_weekly_schedule)}")

    return {
        "plan_id": plan.id,
        "plan_name": plan.name,
        "description": plan.description,
        "difficulty": plan.difficulty,
        "duration_str": plan.duration_str,
        "start_date": plan.start_date.isoformat() if plan.start_date else None,
        "end_date": plan.end_date.isoformat() if plan.end_date else None,
        "weekly_schedule": return_weekly_schedule,
    }
