// src/mocks/plan.js

export function mockGetPlanOverview() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取计划总览成功（mock）',
        data: {
          totalPlans: 5,
          activePlans: 2,
          completedPlans: 3
        }
      })
    }, 300)
  })
}

export function mockGetPlanList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取计划列表成功（mock）',
        data: [
          { id: 1, name: '跑步计划', status: 'active' },
          { id: 2, name: '瑜伽计划', status: 'completed' }
        ]
      })
    }, 300)
  })
}

export function mockCreatePlan(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '创建计划成功（mock）',
        data: { planId: 3 }
      })
    }, 300)
  })
}

export function mockGetPlanDetail(planId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取计划详情成功（mock）',
        data: {
          id: planId,
          name: '跑步计划',
          description: '这是一个跑步计划',
          status: 'active'
        }
      })
    }, 300)
  })
}

export function mockDeletePlan(planId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '删除计划成功（mock）'
      })
    }, 300)
  })
}

export function mockGenerateAiPlan(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'AI生成计划成功（mock）',
        data: { planId: 4 }
      })
    }, 300)
  })
}