"""根据 AI/任务字段解析或估算单项运动时长（分钟）。"""

from __future__ import annotations

import re
from typing import Any


def _parse_rest_seconds(rest: Any) -> int:
    if rest is None or rest == "":
        return 60
    text = str(rest).strip().lower()
    nums = [int(x) for x in re.findall(r"\d+", text)]
    if not nums:
        return 60
    value = sum(nums) // len(nums)
    if "分" in text or "min" in text:
        return value * 60
    return value


def _parse_reps_seconds(reps: Any) -> int | None:
    if reps is None or reps == "":
        return None
    text = str(reps).strip().lower()
    if "秒" not in text and "s" not in text:
        return None
    nums = [int(x) for x in re.findall(r"\d+", text)]
    if not nums:
        return None
    return sum(nums) // len(nums)


def _parse_reps_count(reps: Any) -> int:
    if reps is None or reps == "":
        return 10
    nums = [int(x) for x in re.findall(r"\d+", str(reps))]
    if not nums:
        return 10
    return max(1, sum(nums) // len(nums))


def _parse_sets(sets: Any) -> int:
    if sets is None or sets == "":
        return 3
    try:
        return max(1, int(sets))
    except (TypeError, ValueError):
        return 3


def extract_duration_minutes(exercise: dict) -> int | None:
    for key in ("duration_minutes", "total_duration_minutes", "durationMinutes", "duration"):
        val = exercise.get(key)
        if val is None or val == "":
            continue

        if isinstance(val, (int, float)):
            minutes = int(round(float(val)))
            if minutes > 0:
                return minutes
            continue

        text = str(val).strip()
        if "秒" in text:
            nums = [int(x) for x in re.findall(r"\d+", text)]
            if nums:
                avg_sec = sum(nums) // len(nums)
                sets = _parse_sets(exercise.get("sets"))
                return max(1, round(sets * avg_sec / 60))
            continue

        if "分" in text or "min" in text.lower():
            match = re.search(r"\d+", text)
            if match:
                return max(1, int(match.group()))
            continue

        match = re.search(r"\d+", text)
        if match:
            return max(1, int(match.group()))

    return None


def estimate_duration_minutes(exercise: dict) -> int:
    sets = _parse_sets(exercise.get("sets"))
    hold_sec = _parse_reps_seconds(exercise.get("reps"))
    rest_sec = _parse_rest_seconds(exercise.get("rest"))

    if hold_sec is not None:
        total_sec = sets * hold_sec + max(0, sets - 1) * rest_sec
        return max(1, round(total_sec / 60))

    reps = _parse_reps_count(exercise.get("reps"))
    work_sec = sets * reps * 3
    rest_total = max(0, sets - 1) * rest_sec
    return max(1, round((work_sec + rest_total) / 60))


def resolve_duration_minutes(exercise: dict) -> tuple[int, str]:
    minutes = extract_duration_minutes(exercise)
    if not minutes or minutes <= 0:
        minutes = estimate_duration_minutes(exercise)
    minutes = max(1, int(minutes))
    return minutes, f"{minutes}分钟"


def resolve_task_duration(task) -> tuple[int, str]:
    return resolve_duration_minutes(
        {
            "duration": task.duration,
            "duration_minutes": task.duration,
            "sets": task.sets,
            "reps": task.reps,
            "rest": task.rest,
        }
    )


def effective_record_duration(record) -> int:
    if record.duration and record.duration > 0:
        return record.duration
    task_id = getattr(record, "task_id", None)
    if task_id:
        from models.plan_task import PlanTask
        from utils.extensions import db

        task = db.session.get(PlanTask, task_id)
        if task:
            minutes, _ = resolve_task_duration(task)
            return minutes
    return 0
