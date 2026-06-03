"""运动时长解析与估算测试。"""

from utils.exercise_duration import estimate_duration_minutes, resolve_duration_minutes


class TestExerciseDuration:
    def test_estimate_strength_from_sets_reps_rest(self):
        minutes = estimate_duration_minutes(
            {"sets": 4, "reps": "10-12", "rest": "60秒"}
        )
        assert minutes >= 1

    def test_estimate_plank_from_hold_reps(self):
        minutes = estimate_duration_minutes(
            {"sets": 3, "reps": "45-60秒", "rest": "30秒"}
        )
        assert minutes >= 1

    def test_resolve_uses_duration_minutes_when_present(self):
        minutes, duration_str = resolve_duration_minutes({"duration_minutes": 8})
        assert minutes == 8
        assert duration_str == "8分钟"

    def test_resolve_estimates_when_duration_zero(self):
        minutes, _ = resolve_duration_minutes(
            {"duration": 0, "sets": 3, "reps": "12-15", "rest": "60秒"}
        )
        assert minutes >= 1

    def test_resolve_ai_strength_exercise_without_duration(self):
        minutes, _ = resolve_duration_minutes(
            {
                "name": "罗马尼亚硬拉",
                "sets": 4,
                "reps": "10-12",
                "rest": "90秒",
                "calories": 55,
            }
        )
        assert minutes >= 1
