// src/mocks/analytics.js

export function mockGetAnalyticsOverview(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取总览成功（mock）',
        data: {
          totalWorkouts: 45,
          totalDuration: 1800, // 分钟
          totalCalories: 2500,
          weeklyGoal: 5,
          completedThisWeek: 3
        }
      })
    }, 300)
  })
}

export function mockGetCategoryDistribution(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取运动分布成功（mock）',
        data: [
          { category: '跑步', count: 15, percentage: 33 },
          { category: '骑行', count: 10, percentage: 22 },
          { category: '游泳', count: 8, percentage: 18 },
          { category: '瑜伽', count: 7, percentage: 16 },
          { category: '其他', count: 5, percentage: 11 }
        ]
      })
    }, 300)
  })
}

export function mockGetDurationTrend(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取时长趋势成功（mock）',
        data: [
          { date: '2023-10-01', duration: 30 },
          { date: '2023-10-02', duration: 45 },
          { date: '2023-10-03', duration: 60 },
          { date: '2023-10-04', duration: 40 },
          { date: '2023-10-05', duration: 50 }
        ]
      })
    }, 300)
  })
}

export function mockGetAiSuggestions(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取AI建议成功（mock）',
        data: [
          '建议增加有氧运动时间',
          '注意休息和恢复',
          '尝试新的运动类型'
        ]
      })
    }, 300)
  })
}