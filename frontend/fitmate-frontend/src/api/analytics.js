// src/api/analytics.js
import request from './request'
import { mockGetAnalyticsOverview, mockGetCategoryDistribution, mockGetDurationTrend, mockGetAiSuggestions } from '../mocks/analytics.js'

// 开关（非常重要）
const USE_MOCK = true

// 总览
export function getAnalyticsOverview(params) {
  if (USE_MOCK) {
    return mockGetAnalyticsOverview(params)
  }
  return request({
    url: '/api/analytics/overview',
    method: 'get',
    params
  })
}

// 运动分布
export function getCategoryDistribution(params) {
  if (USE_MOCK) {
    return mockGetCategoryDistribution(params)
  }
  return request({
    url: '/api/analytics/category-distribution',
    method: 'get',
    params
  })
}

// 时长趋势
export function getDurationTrend(params) {
  if (USE_MOCK) {
    return mockGetDurationTrend(params)
  }
  return request({
    url: '/api/analytics/duration-trend',
    method: 'get',
    params
  })
}

// AI 建议
export function getAiSuggestions(params) {
  if (USE_MOCK) {
    return mockGetAiSuggestions(params)
  }
  return request({
    url: '/api/analytics/ai-suggestions',
    method: 'get',
    params
  })
}