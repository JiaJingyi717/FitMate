import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '../../api/request'
import { analyzeProgress, askCoach, checkAIHealth, generatePlan, getDietAdvice } from '../../api/ai'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

describe('api/ai.js', () => {
  beforeEach(() => {
    request.mockReset()
  })

  it('askCoach 使用正确路径与超时配置', () => {
    askCoach([{ role: 'user', content: '你好' }], { coach_personality: 'gentle' })
    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/ai/coach/chat',
        method: 'post',
        timeout: 120000,
      })
    )
  })

  it('generatePlan 发送映射后的请求参数', () => {
    generatePlan({ goal: '增肌', level: '有基础', daysPerWeek: 4, save: true })
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/ai/generate-plan',
        method: 'post',
        timeout: 120000,
        data: expect.objectContaining({
          goal: '增肌',
          level: '有基础',
          days_per_week: 4,
          save: true,
        }),
      })
    )
  })

  it('checkAIHealth 调用健康检查接口', () => {
    checkAIHealth()
    expect(request).toHaveBeenCalledWith({
      url: '/api/ai/health',
      method: 'get',
    })
  })

  it('getDietAdvice 会映射并填充默认参数', () => {
    getDietAdvice({ goal: '减脂', weight: 60 })
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/ai/diet-advice',
        method: 'post',
        data: expect.objectContaining({
          goal: '减脂',
          weight: 60,
          height: 170,
          age: 25,
          gender: '男',
          activity_level: '中度',
        }),
      })
    )
  })

  it('analyzeProgress 会转换为后端字段格式', () => {
    analyzeProgress({
      completedTasks: 8,
      totalTasks: 10,
      totalDuration: 180,
      totalCalories: 1200,
      planCount: 2,
      completionRate: 80,
      recentActivities: '最近状态不错',
    })

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/ai/progress-analysis',
        method: 'post',
        data: {
          completed_tasks: 8,
          total_tasks: 10,
          total_duration: 180,
          total_calories: 1200,
          plan_count: 2,
          completion_rate: 80,
          recent_activities: '最近状态不错',
        },
      })
    )
  })
})
