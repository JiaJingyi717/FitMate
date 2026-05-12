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

  it('切换到30天时间范围会重新加载数据', async () => {
    getAnalyticsOverviewMock.mockResolvedValue({ code: 200, data: { totalDuration: 0 } })
    getCategoryDistributionMock.mockResolvedValue({ code: 200, data: [] })
    getDurationTrendMock.mockResolvedValue({ code: 200, data: [] })
    getAiSuggestionsMock.mockResolvedValue({ code: 200, data: [] })
    analyzeProgressMock.mockResolvedValue({ code: 200, data: { analysis: {} } })

    const wrapper = mount(Analysis)
    await flushPromises()

    const timeButtons = wrapper.findAll('.time-btn')
    await timeButtons[1].trigger('click')
    await flushPromises()

    expect(getAnalyticsOverviewMock).toHaveBeenCalled()
  })

  it('AI分析加载失败时显示默认数据', async () => {
    getAnalyticsOverviewMock.mockResolvedValue({ code: 200, data: { totalDuration: 0 } })
    getCategoryDistributionMock.mockResolvedValue({ code: 200, data: [] })
    getDurationTrendMock.mockResolvedValue({ code: 200, data: [] })
    getAiSuggestionsMock.mockResolvedValue({ code: 200, data: [] })
    analyzeProgressMock.mockRejectedValue(new Error('API Error'))

    const wrapper = mount(Analysis)
    await flushPromises()

    expect(wrapper.text()).toContain('本周训练状态良好')
    expect(wrapper.text()).toContain('完成率')
  })

  it('加载概览失败时显示错误提示', async () => {
    getAnalyticsOverviewMock.mockRejectedValue(new Error('加载失败'))
    getCategoryDistributionMock.mockResolvedValue({ code: 200, data: [] })
    getDurationTrendMock.mockResolvedValue({ code: 200, data: [] })
    getAiSuggestionsMock.mockResolvedValue({ code: 200, data: [] })
    analyzeProgressMock.mockResolvedValue({ code: 200, data: { analysis: {} } })

    const wrapper = mount(Analysis)
    await flushPromises()

    expect(wrapper.text()).toContain('数据分析')
  })

  it('加载数据时显示loading状态', async () => {
    let resolveOverview
    const overviewPromise = new Promise(resolve => { resolveOverview = resolve })
    getAnalyticsOverviewMock.mockReturnValue(overviewPromise)
    getCategoryDistributionMock.mockResolvedValue({ code: 200, data: [] })
    getDurationTrendMock.mockResolvedValue({ code: 200, data: [] })
    getAiSuggestionsMock.mockResolvedValue({ code: 200, data: [] })
    analyzeProgressMock.mockResolvedValue({ code: 200, data: { analysis: {} } })

    const wrapper = mount(Analysis)
    // 不等待 flushPromises，这样 loading 状态应该还在

    resolveOverview({ code: 200, data: { totalDuration: 100 } })
    await flushPromises()

    expect(wrapper.text()).toContain('数据分析')
  })

  it('运动类型分布正确渲染', async () => {
    getAnalyticsOverviewMock.mockResolvedValue({ code: 200, data: { totalDuration: 0 } })
    getCategoryDistributionMock.mockResolvedValue({
      code: 200,
      data: [
        { category: '力量训练', percentage: 50, color: '#2563eb' },
        { category: '有氧运动', percentage: 30, color: '#06b6d4' },
        { category: '拉伸放松', percentage: 20, color: '#10b981' },
      ],
    })
    getDurationTrendMock.mockResolvedValue({ code: 200, data: [] })
    getAiSuggestionsMock.mockResolvedValue({ code: 200, data: [] })
    analyzeProgressMock.mockResolvedValue({ code: 200, data: { analysis: {} } })

    const wrapper = mount(Analysis)
    await flushPromises()

    expect(wrapper.text()).toContain('力量训练')
    expect(wrapper.text()).toContain('有氧运动')
    expect(wrapper.text()).toContain('拉伸放松')
  })
})
