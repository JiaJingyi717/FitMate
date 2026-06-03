from datetime import date

from utils.plan_dates import duration_weeks_between, parse_date


def test_parse_date():
    assert parse_date("2026-06-03") == date(2026, 6, 3)
    assert parse_date(date(2026, 6, 3)) == date(2026, 6, 3)


def test_duration_weeks_between():
    assert duration_weeks_between("2026-06-03", "2026-07-01") == 5
    assert duration_weeks_between("2026-06-03", "2026-08-03") == 9
    assert duration_weeks_between("2026-06-03", "2026-06-03") == 1
    assert duration_weeks_between(None, "2026-06-03") == 4
