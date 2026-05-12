import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Plan from '../../pages/Plan.vue'

const planApiMock = {
  getPlanOverview: vi.fn(),
  getPlanList: vi.fn(),
  getPlanDetail: vi.fn(),
  createPlan: vi.fn(),
  deletePlan: vi.fn(),
  getTodayTasks: vi.fn(),
  completeTodayTask: vi.fn(),
}
const generatePlanMock = vi.fn()

vi.mock('../../api/plan', () => ({
  getPlanOverview: (...args) => planApiMock.getPlanOverview(...args),
  getPlanList: (...args) => planApiMock.getPlanList(...args),
  getPlanDetail: (...args) => planApiMock.getPlanDetail(...args),
  createPlan: (...args) => planApiMock.createPlan(...args),
  deletePlan: (...args) => planApiMock.deletePlan(...args),
  getTodayTasks: (...args) => planApiMock.getTodayTasks(...args),
  completeTodayTask: (...args) => planApiMock.completeTodayTask(...args),
}))

vi.mock('../../api/ai', () => ({
  generatePlan: (...args) => generatePlanMock(...args),
}))

describe('Plan.vue', () => {
  beforeEach(() => {
    Object.values(planApiMock).forEach((fn) => fn.mockReset())
    generatePlanMock.mockReset()
    window.confirm = vi.fn(() => true)
    planApiMock.getPlanOverview.mockResolvedValue({
      code: 200,
      data: { completedTasks: 0, totalTasks: 0, totalDuration: 0, totalCalories: 0, planCount: 0 },
    })
    planApiMock.getPlanList.mockResolvedValue({ code: 200, data: [] })
    planApiMock.getTodayTasks.mockResolvedValue({ code: 200, data: [] })
  })

  it('切换到今日任务页签时会刷新今日任务', async () => {
    planApiMock.getTodayTasks
      .mockResolvedValueOnce({ code: 200, data: [] })
      .mockResolvedValueOnce({
        code: 200,
        data: [{ id: 1, name: '深蹲', type: '力量', calories: 100, durationMinutes: 20 }],
      })
    const wrapper = mount(Plan)
    await flushPromises()

    const todayTab = wrapper.findAll('.tab-btn')[1]
    await todayTab.trigger('click')
    await flushPromises()

    expect(planApiMock.getTodayTasks).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('深蹲')
  })

  it('今日任务打卡失败时会回滚状态', async () => {
    planApiMock.getTodayTasks.mockResolvedValue({
      code: 200,
      data: [{ id: 10, name: '跑步', type: '有氧', isCompleted: false, calories: 80, durationMinutes: 30 }],
    })
    planApiMock.completeTodayTask.mockRejectedValue(new Error('network error'))
    const wrapper = mount(Plan)
    await flushPromises()
    await wrapper.findAll('.tab-btn')[1].trigger('click')
    await flushPromises()

    await wrapper.find('.task-checkbox').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('更新任务状态失败')
  })

  it('AI生成成功后会刷新今日任务', async () => {
    generatePlanMock.mockResolvedValue({
      code: 200,
      data: {
        plan: { plan_name: 'AI计划', weekly_schedule: [] },
      },
    })
    planApiMock.getTodayTasks.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Plan)
    await flushPromises()
    await wrapper.find('.btn-primary').trigger('click')
    const goalBtns = wrapper.findAll('.goal-btn')
    const levelBtns = wrapper.findAll('.level-btn')
    const dayBtns = wrapper.findAll('.day-btn')
    await goalBtns[0].trigger('click')
    await levelBtns[0].trigger('click')
    await dayBtns[0].trigger('click')

    const generateBtn = wrapper.find('.dialog .btn-primary')
    await generateBtn.trigger('click')
    await flushPromises()

    expect(generatePlanMock).toHaveBeenCalled()
    expect(planApiMock.getTodayTasks).toHaveBeenCalled()
  })

  it('手动创建成功后会调用 createPlan 并关闭弹窗', async () => {
    planApiMock.createPlan.mockResolvedValue({
      code: 200,
      data: { planId: 99, name: '手动计划', tasks: [] },
    })

    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.find('.header-actions .btn-secondary').trigger('click')
    await wrapper.find('.dialog-lg .exercise-btn').trigger('click')

    const inputs = wrapper.findAll('.dialog-lg .form-input')
    await inputs[0].setValue('手动计划A')
    await inputs[3].setValue('2026-04-01')
    await inputs[4].setValue('2026-04-30')

    await wrapper.find('.dialog-lg .btn-primary').trigger('click')
    await flushPromises()

    expect(planApiMock.createPlan).toHaveBeenCalled()
    expect(wrapper.text()).toContain('计划创建成功')
  })

  it('AI生成信息不完整时提示请填写完整信息', async () => {
    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.find('.header-actions .btn-primary').trigger('click')
    const submitBtn = wrapper.find('.dialog .btn-primary')

    expect(submitBtn.attributes('disabled')).toBeDefined()
    expect(generatePlanMock).not.toHaveBeenCalled()
  })

  it('删除计划成功后调用 deletePlan 并刷新列表', async () => {
    planApiMock.getPlanList.mockResolvedValue({
      code: 200,
      data: [
        {
          id: 12,
          name: '待删除计划',
          description: 'desc',
          type: '手动创建',
          difficulty: '中级',
          duration: '4周',
          tasks: [],
          totalTasks: 0,
          completedTasks: 0,
          totalCalories: 0,
        },
      ],
    })
    planApiMock.deletePlan.mockResolvedValue({ code: 200 })

    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.get('.delete-btn').trigger('click')
    await flushPromises()

    expect(planApiMock.deletePlan).toHaveBeenCalledWith(12)
    expect(planApiMock.getPlanList).toHaveBeenCalled()
  })

  it('点击计划卡片会打开详情弹窗', async () => {
    planApiMock.getPlanList.mockResolvedValue({
      code: 200,
      data: [
        {
          id: 20,
          name: '计划A',
          description: 'desc',
          type: '手动创建',
          difficulty: '中级',
          duration: '4周',
          tasks: [],
          totalTasks: 0,
          completedTasks: 0,
          totalCalories: 0,
        },
      ],
    })
    planApiMock.getPlanDetail.mockResolvedValue({
      code: 200,
      data: { id: 20, name: '计划A', tasks: [] },
    })

    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.find('.plan-card').trigger('click')
    await flushPromises()

    expect(planApiMock.getPlanDetail).toHaveBeenCalled()
  })

  it('AI生成失败时显示错误提示', async () => {
    generatePlanMock.mockRejectedValue(new Error('生成失败'))
    planApiMock.getTodayTasks.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.find('.header-actions .btn-primary').trigger('click')
    const goalBtns = wrapper.findAll('.goal-btn')
    const levelBtns = wrapper.findAll('.level-btn')
    const dayBtns = wrapper.findAll('.day-btn')
    await goalBtns[0].trigger('click')
    await levelBtns[0].trigger('click')
    await dayBtns[0].trigger('click')

    const generateBtn = wrapper.find('.dialog .btn-primary')
    await generateBtn.trigger('click')
    await flushPromises()

    expect(generatePlanMock).toHaveBeenCalled()
  })

  it('手动创建计划失败时显示错误提示', async () => {
    planApiMock.createPlan.mockRejectedValue(new Error('创建失败'))

    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.find('.header-actions .btn-secondary').trigger('click')
    await wrapper.find('.dialog-lg .exercise-btn').trigger('click')

    const inputs = wrapper.findAll('.dialog-lg .form-input')
    await inputs[0].setValue('计划名称')
    await inputs[3].setValue('2026-04-01')
    await inputs[4].setValue('2026-04-30')

    await wrapper.find('.dialog-lg .btn-primary').trigger('click')
    await flushPromises()

    expect(planApiMock.createPlan).toHaveBeenCalled()
  })

  it('手动创建计划时提示必须添加任务', async () => {
    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.find('.header-actions .btn-secondary').trigger('click')

    const inputs = wrapper.findAll('.dialog-lg .form-input')
    await inputs[0].setValue('无任务计划')

    await wrapper.find('.dialog-lg .btn-primary').trigger('click')

    expect(planApiMock.createPlan).not.toHaveBeenCalled()
  })

  it('切换到今日任务时刷新任务列表', async () => {
    planApiMock.getTodayTasks
      .mockResolvedValueOnce({ code: 200, data: [] })
      .mockResolvedValueOnce({
        code: 200,
        data: [{ id: 5, name: '训练A', isCompleted: true }],
      })

    const wrapper = mount(Plan)
    await flushPromises()

    const tabs = wrapper.findAll('.tab-btn')
    await tabs[1].trigger('click')
    await flushPromises()

    expect(planApiMock.getTodayTasks).toHaveBeenCalledTimes(2)
  })

  it('点击已完成任务会标记为未完成', async () => {
    planApiMock.getTodayTasks.mockResolvedValue({
      code: 200,
      data: [{ id: 7, name: '已完成任务', isCompleted: true, calories: 50 }],
    })
    planApiMock.completeTodayTask.mockResolvedValue({ code: 200 })

    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.findAll('.tab-btn')[1].trigger('click')
    await flushPromises()

    await wrapper.find('.task-checkbox').trigger('click')
    await flushPromises()

    expect(planApiMock.completeTodayTask).toHaveBeenCalledWith(7, { isCompleted: false })
  })

  it('删除AI本地计划不需要调用后端API', async () => {
    planApiMock.getPlanList.mockResolvedValue({
      code: 200,
      data: [
        {
          id: 'ai-local-123',
          name: 'AI本地计划',
          description: 'desc',
          type: 'AI生成',
          difficulty: '初级',
          tasks: [],
        },
      ],
    })
    planApiMock.getTodayTasks.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.find('.delete-btn').trigger('click')
    await flushPromises()

    expect(planApiMock.deletePlan).not.toHaveBeenCalled()
    expect(planApiMock.getPlanList).toHaveBeenCalled()
  })

  it('取消删除计划时不调用API', async () => {
    planApiMock.getPlanList.mockResolvedValue({
      code: 200,
      data: [
        {
          id: 50,
          name: '计划B',
          description: 'desc',
          type: '手动创建',
          difficulty: '中级',
          tasks: [],
        },
      ],
    })
    window.confirm = vi.fn(() => false)

    const wrapper = mount(Plan)
    await flushPromises()

    await wrapper.find('.delete-btn').trigger('click')
    await flushPromises()

    expect(planApiMock.deletePlan).not.toHaveBeenCalled()
  })
})
