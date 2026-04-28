import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Analysis from '../../pages/Analysis.vue'

const getAnalyticsOverviewMock = vi.fn()
const getCategoryDistributionMock = vi.fn()
const getDurationTrendMock = vi.fn()
const getAiSuggestionsMock = vi.fn()
const analyzeProgressMock = vi.fn()

vi.mock('../../api/analytics.js', () => ({
  getAnalyticsOverview: (...args) => getAnalyticsOverviewMock(...args),
  getCategoryDistribution: (...args) => getCategoryDistributionMock(...args),
  getDurationTrend: (...args) => getDurationTrendMock(...args),
  getAiSuggestions: (...args) => getAiSuggestionsMock(...args),
}))

vi.mock('../../api/ai', () => ({
  analyzeProgress: (...args) => analyzeProgressMock(...args),
}))

describe('Analysis.vue', () => {
  beforeEach(() => {
    getAnalyticsOverviewMock.mockReset()
    getCategoryDistributionMock.mockReset()
    getDurationTrendMock.mockReset()
    getAiSuggestionsMock.mockReset()
    analyzeProgressMock.mockReset()
  })

  it('初始化加载分析数据并渲染标题', async () => {
    getAnalyticsOverviewMock.mockResolvedValue({ code: 200, data: { totalDuration: 120, totalCalories: 500, trainingCount: 3, avgDuration: 40 } })
    getCategoryDistributionMock.mockResolvedValue({ code: 200, data: [{ category: '力量', percentage: 60 }] })
    getDurationTrendMock.mockResolvedValue({ code: 200, data: [{ date: '04-01', duration: 40 }] })
    getAiSuggestionsMock.mockResolvedValue({ code: 200, data: ['保持训练'] })
    analyzeProgressMock.mockResolvedValue({ code: 200, data: { analysis: { summary: '状态不错' } } })

    const wrapper = mount(Analysis)
    await flushPromises()

    expect(getAnalyticsOverviewMock).toHaveBeenCalled()
    expect(analyzeProgressMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('数据分析')
    expect(wrapper.text()).toContain('状态不错')
  })
})
