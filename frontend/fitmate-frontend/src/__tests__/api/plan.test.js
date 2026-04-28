import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '../../api/request'
import {
  addTaskToPlan,
  completeTodayTask,
  createPlan,
  deletePlan,
  generateAiPlan,
  getPlanDetail,
  getPlanList,
  getPlanOverview,
  getTodayTasks,
  removeTaskFromPlan,
} from '../../api/plan'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

describe('api/plan.js', () => {
  beforeEach(() => {
    request.mockReset()
  })

  it('getTodayTasks 请求今日任务接口', () => {
    getTodayTasks()
    expect(request).toHaveBeenCalledWith({
      url: '/api/plans/today',
      method: 'get',
    })
  })

  it('completeTodayTask 带 taskId 与 data 调用 patch', () => {
    completeTodayTask(123, { isCompleted: true })
    expect(request).toHaveBeenCalledWith({
      url: '/api/plans/today/123/complete',
      method: 'patch',
      data: { isCompleted: true },
    })
  })

  it('overview/list/detail/delete/create/generate 路径正确', () => {
    getPlanOverview()
    getPlanList()
    getPlanDetail(7)
    deletePlan(7)
    createPlan({ name: '计划A' })
    generateAiPlan({ goal: '减脂' })

    expect(request).toHaveBeenNthCalledWith(1, { url: '/api/plans/overview', method: 'get' })
    expect(request).toHaveBeenNthCalledWith(2, { url: '/api/plans', method: 'get' })
    expect(request).toHaveBeenNthCalledWith(3, { url: '/api/plans/7', method: 'get' })
    expect(request).toHaveBeenNthCalledWith(4, { url: '/api/plans/7', method: 'delete' })
    expect(request).toHaveBeenNthCalledWith(5, {
      url: '/api/plans',
      method: 'post',
      data: { name: '计划A' },
    })
    expect(request).toHaveBeenNthCalledWith(6, {
      url: '/api/plans/ai-generate',
      method: 'post',
      data: { goal: '减脂' },
    })
  })

  it('addTaskToPlan/removeTaskFromPlan 路径正确', () => {
    addTaskToPlan(9, { name: '深蹲' })
    removeTaskFromPlan(9, { taskId: 100 })
    expect(request).toHaveBeenNthCalledWith(1, {
      url: '/api/plans/9/tasks',
      method: 'post',
      data: { name: '深蹲' },
    })
    expect(request).toHaveBeenNthCalledWith(2, {
      url: '/api/plans/9/tasks',
      method: 'delete',
      data: { taskId: 100 },
    })
  })
})
