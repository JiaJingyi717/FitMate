// src/mocks/analytics.js

// 生成最近N天的日期数组
function getRecentDates(days) {
  const dates = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

// 生成随机数据
function generateRandomData(count, min, max) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export function mockGetAnalyticsOverview(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const range = params?.range || '7d'
      const is7Days = range === '7d'

      // 7天和30天返回不同数据
      const overviewData = is7Days ? {
        totalWorkouts: 8,
        totalDuration: 420,
        totalCalories: 2850,
        weeklyGoal: 5,
        completedThisWeek: 4,
        trainingCount: 8,
        avgDuration: 52
      } : {
        totalWorkouts: 28,
        totalDuration: 1680,
        totalCalories: 11400,
        weeklyGoal: 5,
        completedThisWeek: 18,
        trainingCount: 28,
        avgDuration: 60
      }

      resolve({
        code: 200,
        message: '获取总览成功（mock）',
        data: overviewData
      })
    }, 300)
  })
}

export function mockGetCategoryDistribution(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const range = params?.range || '7d'
      const is7Days = range === '7d'

      // 7天和30天返回不同分布
      const distributionData = is7Days ? [
        { category: '力量训练', count: 3, percentage: 37 },
        { category: '有氧运动', count: 2, percentage: 25 },
        { category: 'HIIT', count: 2, percentage: 25 },
        { category: '瑜伽拉伸', count: 1, percentage: 13 }
      ] : [
        { category: '力量训练', count: 10, percentage: 36 },
        { category: '有氧运动', count: 8, percentage: 29 },
        { category: 'HIIT', count: 5, percentage: 18 },
        { category: '瑜伽拉伸', count: 3, percentage: 11 },
        { category: '其他', count: 2, percentage: 6 }
      ]

      resolve({
        code: 200,
        message: '获取运动分布成功（mock）',
        data: distributionData
      })
    }, 300)
  })
}

export function mockGetDurationTrend(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const range = params?.range || '7d'
      const is7Days = range === '7d'

      const days = is7Days ? 7 : 30
      const dates = getRecentDates(days)
      const durations = is7Days
        ? [45, 60, 30, 55, 40, 75, 50]  // 固定7天数据
        : [45, 60, 30, 55, 40, 75, 50, 35, 65, 45, 55, 70, 40, 50, 60, 45, 35, 55, 65, 40, 50, 55, 45, 60, 35, 50, 45, 55, 40, 50]  // 固定30天数据

      const trendData = dates.map((date, index) => ({
        date: date,
        duration: durations[index]
      }))

      resolve({
        code: 200,
        message: '获取时长趋势成功（mock）',
        data: trendData
      })
    }, 300)
  })
}

export function mockGetAiSuggestions(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const range = params?.range || '7d'
      const is7Days = range === '7d'

      // 7天和30天返回不同建议
      const suggestions = is7Days ? [
        '本周训练频率良好，建议继续保持每天30-60分钟的中等强度训练',
        '你的有氧运动占比较高，建议增加力量训练以提升肌肉力量和基础代谢',
        '注意训练后的拉伸放松，可以帮助肌肉恢复并减少酸痛'
      ] : [
        '本月训练总时长达标，但建议增加力量训练比例至40%以上',
        '你的训练周期较为规律，继续保持会有更好的健身效果',
        '建议每两周尝试一次新的运动方式，可以激活不同的肌肉群',
        '注意在连续高强度训练后安排1-2天休息，避免过度训练'
      ]

      resolve({
        code: 200,
        message: '获取AI建议成功（mock）',
        data: suggestions
      })
    }, 300)
  })
}
