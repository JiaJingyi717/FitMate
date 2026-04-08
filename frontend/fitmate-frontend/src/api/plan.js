// src/api/plan.js
import request from './request'
import {
  mockGetPlanOverview,
  mockGetPlanList,
  mockCreatePlan,
  mockGetPlanDetail,
  mockDeletePlan,
  mockGenerateAiPlan,
  mockGetTodayTasks,
  mockCompleteTodayTask
} from '../mocks/plan.js'

// 开关（非常重要）
const USE_MOCK = true

// 获取顶部概览
export function getPlanOverview() {
  if (USE_MOCK) {
    return mockGetPlanOverview()
  }
  return request({
    url: '/api/plans/overview',
    method: 'get'
  })
}

// 获取计划列表
export function getPlanList() {
  if (USE_MOCK) {
    return mockGetPlanList()
  }
  return request({
    url: '/api/plans',
    method: 'get'
  })
}

// 手动创建计划
export function createPlan(data) {
  if (USE_MOCK) {
    return mockCreatePlan(data)
  }
  return request({
    url: '/api/plans',
    method: 'post',
    data
  })
}

// 获取计划详情
export function getPlanDetail(planId) {
  if (USE_MOCK) {
    return mockGetPlanDetail(planId)
  }
  return request({
    url: `/api/plans/${planId}`,
    method: 'get'
  })
}

// 删除计划
export function deletePlan(planId) {
  if (USE_MOCK) {
    return mockDeletePlan(planId)
  }
  return request({
    url: `/api/plans/${planId}`,
    method: 'delete'
  })
}

// AI 生成计划
export function generateAiPlan(data) {
  if (USE_MOCK) {
    return mockGenerateAiPlan(data)
  }
  return request({
    url: '/api/plans/ai-generate',
    method: 'post',
    data
  })
}

// 获取今日任务
export function getTodayTasks() {
  if (USE_MOCK) {
    return mockGetTodayTasks()
  }
  return request({
    url: '/api/plans/today',
    method: 'get'
  })
}

// 今日任务打卡 / 取消打卡
export function completeTodayTask(taskId, data) {
  if (USE_MOCK) {
    return mockCompleteTodayTask(taskId, data)
  }
  return request({
    url: `/api/plans/today/${taskId}/complete`,
    method: 'patch',
    data
  })
}

// 添加任务到计划
export function addTaskToPlan(planId, data) {
  return request({
    url: `/api/plans/${planId}/tasks`,
    method: 'post',
    data
  })
}

// 从计划中删除任务
export function removeTaskFromPlan(planId, data) {
  return request({
    url: `/api/plans/${planId}/tasks`,
    method: 'delete',
    data
  })
}