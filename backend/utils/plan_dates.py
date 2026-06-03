"""训练计划日期范围工具"""

from datetime import date, datetime


def parse_date(value):
    if value is None:
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, str):
        try:
            return datetime.strptime(value[:10], "%Y-%m-%d").date()
        except ValueError:
            return None
    return None


def duration_weeks_between(start, end, default=4):
    """根据起止日期（含首尾）计算计划周数。"""
    start_date = parse_date(start)
    end_date = parse_date(end)
    if not start_date or not end_date or end_date < start_date:
        return default
    days = (end_date - start_date).days + 1
    return max(1, (days + 6) // 7)
