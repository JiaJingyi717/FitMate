// src/api/ai.js
import request from './request'

// 检查 AI 服务状态
export function checkAIHealth() {
  return request({
    url: '/api/ai/health',
    method: 'get'
  })
}

// 生成训练计划（AI生成需要更长时间）
export function generatePlan(data) {
  return request({
    url: '/api/ai/generate-plan',
    method: 'post',
    timeout: 120000, // 120秒超时
    data: {
      goal: data.goal || '综合健身',
      level: data.level || '有基础',
      days_per_week: data.daysPerWeek || 4,
      duration: data.duration || 4,
      preferences: data.preferences || '均衡',
      restrictions: data.restrictions || '',
      notes: data.notes || '',
      save: data.save !== undefined ? data.save : true,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      training_days: data.training_days || ''
    }
  })
}

// 获取饮食建议
export function getDietAdvice(data) {
  return request({
    url: '/api/ai/diet-advice',
    method: 'post',
    data: {
      goal: data.goal || '综合健身',
      weight: data.weight || 70,
      height: data.height || 170,
      age: data.age || 25,
      gender: data.gender || '男',
      activity_level: data.activityLevel || '中度',
      training_info: data.trainingInfo || null
    }
  })
}

// AI 教练对话
export function askCoach(messages, context = {}) {
  return request({
    url: '/api/ai/coach/chat',
    method: 'post',
    timeout: 120000, // AI 对话可能较慢，单独放宽超时
    data: {
      messages: messages,
      context: context
    }
  })
}

// 训练进度分析
export function analyzeProgress(data) {
  return request({
    url: '/api/ai/progress-analysis',
    method: 'post',
    data: {
      completed_tasks: data.completedTasks || 0,
      total_tasks: data.totalTasks || 0,
      total_duration: data.totalDuration || 0,
      total_calories: data.totalCalories || 0,
      plan_count: data.planCount || 0,
      completion_rate: data.completionRate || 0,
      recent_activities: data.recentActivities || ''
    }
  })
}
