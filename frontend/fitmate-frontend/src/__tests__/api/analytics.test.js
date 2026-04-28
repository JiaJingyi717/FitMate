import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '../../api/request'
import {
  getAiSuggestions,
  getAnalyticsOverview,
  getCategoryDistribution,
  getDurationTrend,
} from '../../api/analytics'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

describe('api/analytics.js', () => {
  beforeEach(() => {
    request.mockReset()
  })

  it('overview/category/trend/suggestions 调用正确接口', () => {
    const params = { range: '7d' }
    getAnalyticsOverview(params)
    getCategoryDistribution(params)
    getDurationTrend(params)
    getAiSuggestions(params)

    expect(request).toHaveBeenNthCalledWith(1, { url: '/api/analytics/overview', method: 'get', params })
    expect(request).toHaveBeenNthCalledWith(2, {
      url: '/api/analytics/category-distribution',
      method: 'get',
      params,
    })
    expect(request).toHaveBeenNthCalledWith(3, { url: '/api/analytics/duration-trend', method: 'get', params })
    expect(request).toHaveBeenNthCalledWith(4, { url: '/api/analytics/ai-suggestions', method: 'get', params })
  })
})
