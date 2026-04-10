// src/mocks/plan.js
// 训练计划模块 Mock 数据
// 参考 api.yaml 训练计划模块规范

// ==================== 辅助函数 ====================

// 生成唯一ID
let idCounter = 100
function generateId() {
  return ++idCounter
}

// 格式化日期为 M.d 格式
function formatDateMd(date) {
  return `${date.getMonth() + 1}.${date.getDate()}`
}

// 格式化日期为完整中文格式
function formatDateStr(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 星期映射
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// 生成每日训练安排
function generateDailySchedule(date, dayIndex, trainingTypes, isRestDay = false) {
  const tasks = []
  let totalDuration = 0
  let totalCalories = 0

  if (!isRestDay && trainingTypes && trainingTypes.length > 0) {
    let taskId = 1
    // 每天生成2-3个任务
    const numTasks = Math.min(trainingTypes.length, 3)
    for (let i = 0; i < numTasks; i++) {
      const type = trainingTypes[i]
      const typeTasks = taskTemplates[type]
      if (typeTasks && typeTasks.length > 0) {
        const task = typeTasks[Math.floor(Math.random() * typeTasks.length)]
        tasks.push({
          id: taskId++,
          name: task.name,
          type: type,
          duration: task.duration,
          durationMinutes: task.durationMinutes,
          calories: task.calories,
          sets: task.sets || null,
          reps: task.reps || null,
          rest: task.rest || null,
          isCompleted: false,
          planId: null
        })
        totalDuration += task.durationMinutes
        totalCalories += task.calories
      }
    }
  }

  // 如果训练日但没有任务，添加默认任务
  if (!isRestDay && tasks.length === 0) {
    tasks.push({
      id: 1,
      name: '热身运动',
      type: '热身',
      duration: '10分钟',
      durationMinutes: 10,
      calories: 60,
      sets: null,
      reps: null,
      rest: null,
      isCompleted: false,
      planId: null
    })
    totalDuration = 10
    totalCalories = 60
  }

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  return {
    date: formatDateMd(date),
    dateStr: formatDateStr(date),
    dayOfWeek: weekDays[dayIndex],
    isRestDay: isRestDay,
    isToday: false,
    isPast: date < todayStart,
    totalDuration: totalDuration,
    totalCalories: totalCalories,
    completedTasks: 0,
    totalTasks: tasks.length,
    progress: 0,
    tasks: tasks
  }
}

// 生成完整每周排程
function generateWeeklySchedule(startDate, trainingDaysOfWeek, trainingTypes, weekNumber) {
  const days = []
  let trainingDayCount = 0

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dayIndex = date.getDay()
    const dayName = weekDays[dayIndex]

    // 判断是否为休息日
    const isRestDay = !trainingDaysOfWeek.includes(dayName)

    // 当天训练类型（根据训练日索引分配不同类型）
    const dayTypes = trainingTypes.slice(trainingDayCount % trainingTypes.length, (trainingDayCount % trainingTypes.length) + 2)

    const dailySchedule = generateDailySchedule(date, dayIndex, dayTypes, isRestDay)
    days.push(dailySchedule)

    if (!isRestDay) trainingDayCount++
  }

  // 计算本周统计
  const trainingDaysCount = days.filter(d => !d.isRestDay).length
  const restDaysCount = 7 - trainingDaysCount

  return {
    weekNumber: weekNumber,
    weekLabel: `第${weekNumber}周`,
    startDate: formatDateMd(startDate),
    endDate: formatDateMd(new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)),
    trainingDays: trainingDaysCount,
    restDays: restDaysCount,
    days: days
  }
}

// 生成完整4周排程
function generateFullSchedule(startDate, trainingDaysOfWeek, totalWeeks = 4) {
  const weeklySchedule = []
  const allTasks = []

  for (let week = 0; week < totalWeeks; week++) {
    const weekStart = new Date(startDate)
    weekStart.setDate(startDate.getDate() + week * 7)

    // 每周的训练类型组合（避免重复）
    const weekTypes = [
      ['热身', '有氧', 'HIIT', '核心', '拉伸'],
      ['热身', '有氧', 'HIIT', '核心', '拉伸'],
      ['热身', '胸部', '背部', '腿部', '拉伸'],
      ['热身', '核心', 'HIIT', '有氧', '拉伸']
    ][week % 4]

    const weekSchedule = generateWeeklySchedule(weekStart, trainingDaysOfWeek, weekTypes, week + 1)
    weeklySchedule.push(weekSchedule)

    // 收集所有任务
    weekSchedule.days.forEach(day => {
      day.tasks.forEach(task => {
        allTasks.push({ ...task, planId: null })
      })
    })
  }

  return { weeklySchedule, allTasks }
}

// 模拟任务模板
const taskTemplates = {
  有氧: [
    { name: '热身慢跑', duration: '10分钟', durationMinutes: 10, calories: 80 },
    { name: '快走', duration: '20分钟', durationMinutes: 20, calories: 120 },
    { name: '跑步', duration: '30分钟', durationMinutes: 30, calories: 250 },
    { name: '跳绳', duration: '15分钟', durationMinutes: 15, calories: 180 },
    { name: '骑行', duration: '40分钟', durationMinutes: 40, calories: 300 }
  ],
  HIIT: [
    { name: '开合跳', duration: '10分钟', durationMinutes: 10, calories: 120, sets: 4, reps: 30, rest: '30秒' },
    { name: '波比跳', duration: '12分钟', durationMinutes: 12, calories: 150, sets: 5, reps: 10, rest: '30秒' },
    { name: '高抬腿', duration: '8分钟', durationMinutes: 8, calories: 100, sets: 4, reps: 40, rest: '20秒' },
    { name: '登山者', duration: '10分钟', durationMinutes: 10, calories: 130, sets: 3, reps: 20, rest: '30秒' }
  ],
  胸部: [
    { name: '俯卧撑', duration: '10分钟', durationMinutes: 10, calories: 80, sets: 4, reps: 15, rest: '60秒' },
    { name: '杠铃卧推', duration: '20分钟', durationMinutes: 20, calories: 140, sets: 4, reps: 12, rest: '90秒' },
    { name: '哑铃飞鸟', duration: '15分钟', durationMinutes: 15, calories: 90, sets: 3, reps: 12, rest: '60秒' },
    { name: '双杠臂屈伸', duration: '12分钟', durationMinutes: 12, calories: 100, sets: 3, reps: 10, rest: '60秒' }
  ],
  背部: [
    { name: '引体向上', duration: '15分钟', durationMinutes: 15, calories: 110, sets: 4, reps: 8, rest: '90秒' },
    { name: '杠铃硬拉', duration: '20分钟', durationMinutes: 20, calories: 150, sets: 4, reps: 10, rest: '90秒' },
    { name: '哑铃划船', duration: '15分钟', durationMinutes: 15, calories: 100, sets: 3, reps: 12, rest: '60秒' },
    { name: '高位下拉', duration: '12分钟', durationMinutes: 12, calories: 90, sets: 4, reps: 12, rest: '60秒' }
  ],
  腿部: [
    { name: '深蹲', duration: '15分钟', durationMinutes: 15, calories: 110, sets: 4, reps: 15, rest: '60秒' },
    { name: '杠铃深蹲', duration: '20分钟', durationMinutes: 20, calories: 150, sets: 4, reps: 10, rest: '90秒' },
    { name: '弓步蹲', duration: '12分钟', durationMinutes: 12, calories: 100, sets: 3, reps: 12, rest: '60秒' },
    { name: '腿举', duration: '15分钟', durationMinutes: 15, calories: 120, sets: 4, reps: 15, rest: '60秒' },
    { name: '腿弯举', duration: '10分钟', durationMinutes: 10, calories: 70, sets: 3, reps: 12, rest: '60秒' }
  ],
  核心: [
    { name: '平板支撑', duration: '8分钟', durationMinutes: 8, calories: 60, sets: 3, reps: 60, rest: '30秒' },
    { name: '卷腹', duration: '10分钟', durationMinutes: 10, calories: 70, sets: 3, reps: 20, rest: '30秒' },
    { name: '仰卧抬腿', duration: '10分钟', durationMinutes: 10, calories: 80, sets: 3, reps: 15, rest: '30秒' },
    { name: '俄罗斯转体', duration: '8分钟', durationMinutes: 8, calories: 60, sets: 3, reps: 20, rest: '30秒' }
  ],
  拉伸: [
    { name: '全身拉伸', duration: '10分钟', durationMinutes: 10, calories: 40 },
    { name: '腿部拉伸', duration: '8分钟', durationMinutes: 8, calories: 30 },
    { name: '肩部拉伸', duration: '5分钟', durationMinutes: 5, calories: 20 }
  ],
  热身: [
    { name: '动态拉伸', duration: '5分钟', durationMinutes: 5, calories: 30 },
    { name: '关节活动', duration: '5分钟', durationMinutes: 5, calories: 25 },
    { name: '轻量热身', duration: '5分钟', durationMinutes: 5, calories: 35 }
  ]
}

// 根据目标生成训练任务
function generateTasksByGoal(goal, daysPerWeek) {
  const tasks = []
  const planTaskTemplates = {
    '减脂': ['热身', '有氧', 'HIIT', '核心', '拉伸'],
    '增肌': ['热身', '胸部', '背部', '腿部', '拉伸'],
    '塑形': ['热身', '有氧', '核心', 'HIIT', '拉伸'],
    '综合体能提升': ['热身', '有氧', '胸部', '背部', '腿部', '核心', '拉伸']
  }

  const types = planTaskTemplates[goal] || planTaskTemplates['综合体能提升']
  let taskId = 1

  // 每周生成对应类型的训练
  for (let i = 0; i < daysPerWeek; i++) {
    // 每天选择2-3个类型的动作
    const dayTypes = types.slice(1, Math.min(1 + Math.floor(Math.random() * 2) + 2, types.length))

    dayTypes.forEach(type => {
      const typeTasks = taskTemplates[type]
      if (typeTasks && typeTasks.length > 0) {
        const task = typeTasks[Math.floor(Math.random() * typeTasks.length)]
        tasks.push({
          id: taskId++,
          name: task.name,
          type: type,
          duration: task.duration,
          durationMinutes: task.durationMinutes,
          calories: task.calories,
          sets: task.sets || null,
          reps: task.reps || null,
          rest: task.rest || null,
          isCompleted: false,
          planId: null
        })
      }
    })
  }

  return tasks
}

// ==================== Mock 函数 ====================

// 获取训练计划页顶部统计概览
export function mockGetPlanOverview() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取计划总览成功（mock）',
        data: {
          completedTasks: 4,
          totalTasks: 8,
          totalDuration: 95,
          totalCalories: 680,
          planCount: 2
        }
      })
    }, 300)
  })
}

// 获取训练计划列表
export function mockGetPlanList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - 10)
      const endDate = new Date(today)
      endDate.setDate(today.getDate() + 18)

      const startDate2 = new Date(today)
      startDate2.setDate(today.getDate() - 30)
      const endDate2 = new Date(today)
      endDate2.setDate(today.getDate() - 2)

      resolve({
        code: 200,
        message: '获取计划列表成功（mock）',
        data: [
          {
            id: 1,
            name: '燃脂减肥计划',
            description: '针对减脂目标的综合训练计划，包含有氧和HIIT高强度间歇训练',
            type: 'AI生成',
            difficulty: '中级',
            duration: '4周',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            status: 'todo',
            totalTasks: 16,
            completedTasks: 6,
            progress: 37,
            totalCalories: 1250,
            createdAt: startDate.toISOString()
          },
          {
            id: 2,
            name: '力量增肌计划',
            description: '专注于肌肉增长的力量训练方案，针对主要肌群进行系统训练',
            type: '手动创建',
            difficulty: '高级',
            duration: '8周',
            startDate: startDate2.toISOString().split('T')[0],
            endDate: endDate2.toISOString().split('T')[0],
            status: 'expired',
            totalTasks: 24,
            completedTasks: 20,
            progress: 83,
            totalCalories: 2800,
            createdAt: startDate2.toISOString()
          }
        ]
      })
    }, 300)
  })
}

// 手动创建训练计划
export function mockCreatePlan(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 简单验证
      if (!data.name || !data.startDate || !data.endDate) {
        reject({
          code: 400,
          message: '参数不完整，请填写必填项'
        })
        return
      }

      const newPlanId = generateId()
      const startDate = new Date(data.startDate)
      const { weeklySchedule, allTasks } = generateFullSchedule(startDate, ['周一', '周三', '周五', '周六'], 4)

      // 更新任务ID
      let globalTaskId = newPlanId * 1000
      weeklySchedule.forEach(week => {
        week.days.forEach(day => {
          day.tasks.forEach(task => {
            task.id = globalTaskId++
            task.planId = newPlanId
          })
        })
      })

      // 计算总时长和卡路里
      const totalDuration = weeklySchedule.reduce((sum, week) => {
        return sum + week.days.reduce((daySum, day) => daySum + day.totalDuration, 0)
      }, 0)
      const totalCalories = weeklySchedule.reduce((sum, week) => {
        return sum + week.days.reduce((daySum, day) => daySum + day.totalCalories, 0)
      }, 0)

      resolve({
        code: 200,
        message: '创建计划成功（mock）',
        data: {
          planId: newPlanId,
          name: data.name,
          description: data.description || '自定义训练计划',
          type: '手动创建',
          difficulty: data.difficulty || '中级',
          duration: data.duration || '4周',
          startDate: data.startDate,
          endDate: data.endDate,
          status: 'todo',
          progress: 0,
          totalTasks: allTasks.length,
          completedTasks: 0,
          totalCalories: totalCalories,
          totalDuration: totalDuration,
          tasks: allTasks.map(t => ({ ...t, planId: newPlanId })),
          weeklySchedule: weeklySchedule
        }
      })
    }, 300)
  })
}

// 获取训练计划详情（含每周每日排程）
export function mockGetPlanDetail(planId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!planId) {
        reject({
          code: 400,
          message: '计划ID不能为空'
        })
        return
      }

      // 创建基准日期（以今天为基准，生成4周的计划）
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 计划1：减脂计划（进行中）
      if (planId === 1) {
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 10)
        const endDate = new Date(today)
        endDate.setDate(today.getDate() + 18)

        const trainingDays = ['周一', '周三', '周五', '周六']
        const { weeklySchedule, allTasks } = generateFullSchedule(startDate, trainingDays, 4)

        // 更新任务ID和planId
        let globalTaskId = 1
        let completedCount = 0
        weeklySchedule.forEach(week => {
          week.days.forEach(day => {
            day.tasks.forEach(task => {
              task.id = globalTaskId++
              task.planId = 1
            })

            // 标记已过日期的任务为已完成
            if (day.isPast && !day.isRestDay) {
              day.tasks.forEach(task => {
                task.isCompleted = true
                completedCount++
              })
              day.completedTasks = day.tasks.length
              day.progress = day.tasks.length > 0 ? 100 : 0
            }

            // 标记今天
            if (day.date === formatDateMd(today)) {
              day.isToday = true
            }
          })

          // 计算每周统计
          week.days.forEach(day => {
            if (!day.isRestDay) {
              week.totalDuration = (week.totalDuration || 0) + day.totalDuration
              week.totalCalories = (week.totalCalories || 0) + day.totalCalories
            }
          })
        })

        // 计算整体统计
        const totalTasks = allTasks.length
        const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
        const totalCalories = weeklySchedule.reduce((sum, week) => {
          return sum + week.days.reduce((daySum, day) => daySum + (day.isPast ? day.totalCalories : 0), 0)
        }, 0)

        resolve({
          code: 200,
          message: '获取计划详情成功（mock）',
          data: {
            id: 1,
            name: '燃脂减肥计划',
            description: '针对减脂目标的综合训练计划，包含有氧和HIIT高强度间歇训练，帮助你科学高效地减少体脂',
            type: 'AI生成',
            difficulty: '中级',
            duration: '4周',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            status: 'todo',
            progress: progress,
            totalTasks: totalTasks,
            completedTasks: completedCount,
            totalCalories: totalCalories,
            createdAt: startDate.toISOString(),
            tasks: allTasks.map(t => ({ ...t, planId: 1, isCompleted: t.isCompleted })),
            weeklySchedule: weeklySchedule
          }
        })
      }
      // 计划2：力量增肌计划（已过期）
      else if (planId === 2) {
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - 40)
        const endDate = new Date(today)
        endDate.setDate(today.getDate() - 4)

        const trainingDays = ['周二', '周四', '周六']
        const { weeklySchedule, allTasks } = generateFullSchedule(startDate, trainingDays, 4)

        // 所有任务都标记为已完成
        let globalTaskId = 100
        weeklySchedule.forEach(week => {
          week.days.forEach(day => {
            day.tasks.forEach(task => {
              task.id = globalTaskId++
              task.planId = 2
              task.isCompleted = true
            })
            day.completedTasks = day.tasks.length
            day.progress = day.tasks.length > 0 ? 100 : 0
          })
        })

        resolve({
          code: 200,
          message: '获取计划详情成功（mock）',
          data: {
            id: 2,
            name: '力量增肌计划',
            description: '专注于肌肉增长的力量训练方案，针对主要肌群进行系统训练，逐步提升力量水平',
            type: '手动创建',
            difficulty: '高级',
            duration: '8周',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            status: 'expired',
            progress: 100,
            totalTasks: allTasks.length,
            completedTasks: allTasks.length,
            totalCalories: 3200,
            createdAt: startDate.toISOString(),
            tasks: allTasks.map(t => ({ ...t, planId: 2, isCompleted: true })),
            weeklySchedule: weeklySchedule
          }
        })
      }
      // 默认计划（新创建的或未识别的计划）
      else {
        const startDate = new Date(today)
        const endDate = new Date(today)
        endDate.setDate(today.getDate() + 27)

        // 为新计划生成4周排程
        const trainingDays = ['周一', '周三', '周五', '周六']
        const { weeklySchedule, allTasks } = generateFullSchedule(startDate, trainingDays, 4)

        // 更新任务ID
        let globalTaskId = planId * 1000
        weeklySchedule.forEach(week => {
          week.days.forEach(day => {
            day.tasks.forEach(task => {
              task.id = globalTaskId++
              task.planId = planId
            })
          })
        })

        resolve({
          code: 200,
          message: '获取计划详情成功（mock）',
          data: {
            id: planId,
            name: '新训练计划',
            description: '自定义训练计划，开始你的健身之旅',
            type: '手动创建',
            difficulty: '中级',
            duration: '4周',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            status: 'todo',
            progress: 0,
            totalTasks: allTasks.length,
            completedTasks: 0,
            totalCalories: 0,
            createdAt: startDate.toISOString(),
            tasks: allTasks.map(t => ({ ...t, planId: planId })),
            weeklySchedule: weeklySchedule
          }
        })
      }
    }, 300)
  })
}

// 删除训练计划
export function mockDeletePlan(planId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!planId) {
        reject({
          code: 400,
          message: '计划ID不能为空'
        })
        return
      }
      resolve({
        code: 200,
        message: '删除计划成功（mock）'
      })
    }, 300)
  })
}

// AI 生成训练计划
export function mockGenerateAiPlan(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const goal = data?.goal || '综合体能提升'
      const level = data?.level || '有基础'
      const daysPerWeek = data?.daysPerWeek || 4
      const timePerDay = data?.timePerDay || 45
      const trainingDays = data?.trainingDays || ['周一', '周三', '周五', '周六']
      const save = data?.save ?? false

      // 根据目标调整难度
      const difficultyMap = { '初学者': '初级', '有基础': '中级', '健身达人': '高级' }
      const difficulty = difficultyMap[level] || '中级'

      // 计算周期
      let startDate = data?.startDate
      let endDate = data?.endDate
      if (!startDate || !endDate) {
        startDate = new Date().toISOString().split('T')[0]
        const end = new Date()
        end.setDate(end.getDate() + 28)
        endDate = end.toISOString().split('T')[0]
      }

      // 生成训练类型映射
      const goalTrainingTypes = {
        '减脂': ['热身', '有氧', 'HIIT', '核心', '拉伸'],
        '增肌': ['热身', '胸部', '背部', '腿部', '拉伸'],
        '塑形': ['热身', '有氧', '核心', 'HIIT', '拉伸'],
        '综合体能提升': ['热身', '有氧', '胸部', '背部', '腿部', '核心', '拉伸']
      }
      const trainingTypes = goalTrainingTypes[goal] || goalTrainingTypes['综合体能提升']

      // 使用辅助函数生成完整排程
      const startDateObj = new Date(startDate)
      const { weeklySchedule, allTasks } = generateFullSchedule(startDateObj, trainingDays, 4)

      // 生成计划ID
      const newPlanId = save ? generateId() : null

      // 更新任务ID
      let globalTaskId = generateId()
      weeklySchedule.forEach(week => {
        week.days.forEach(day => {
          day.tasks.forEach(task => {
            task.id = globalTaskId++
            task.planId = save ? newPlanId : null
          })
        })
      })

      const goalNames = {
        '减脂': 'AI智能减脂计划',
        '增肌': 'AI力量增肌计划',
        '塑形': 'AI综合塑形计划',
        '综合体能提升': 'AI综合提升计划'
      }

      // 计算总卡路里和总时长
      const totalDuration = weeklySchedule.reduce((sum, week) => {
        return sum + week.days.reduce((daySum, day) => daySum + day.totalDuration, 0)
      }, 0)
      const totalCalories = weeklySchedule.reduce((sum, week) => {
        return sum + week.days.reduce((daySum, day) => daySum + day.totalCalories, 0)
      }, 0)

      resolve({
        code: 200,
        message: 'AI生成计划成功（mock）',
        data: {
          planId: newPlanId,
          name: goalNames[goal] || 'AI智能训练计划',
          description: `基于${goal}目标的个性化训练方案，每周训练${daysPerWeek}天，每次约${timePerDay}分钟`,
          difficulty: difficulty,
          duration: '4周',
          startDate: startDate,
          endDate: endDate,
          totalDuration: totalDuration,
          totalCalories: totalCalories,
          totalTasks: allTasks.length,
          tasks: allTasks,
          weeklySchedule: weeklySchedule
        }
      })
    }, 500)
  })
}

// 获取今日训练任务列表
export function mockGetTodayTasks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟获取今日任务（从计划详情中筛选）
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][today.getDay()]

      // 生成今日任务（模拟从计划1中获取）
      const tasks = [
        {
          id: 201,
          name: '全身拉伸',
          type: '拉伸',
          duration: '10分钟',
          durationMinutes: 10,
          calories: 40,
          sets: null,
          reps: null,
          rest: null,
          isCompleted: false,
          planId: 1
        },
        {
          id: 202,
          name: '快走',
          type: '有氧',
          duration: '20分钟',
          durationMinutes: 20,
          calories: 120,
          sets: null,
          reps: null,
          rest: null,
          isCompleted: false,
          planId: 1
        },
        {
          id: 203,
          name: '高抬腿',
          type: 'HIIT',
          duration: '8分钟',
          durationMinutes: 8,
          calories: 100,
          sets: 4,
          reps: 40,
          rest: '20秒',
          isCompleted: false,
          planId: 1
        },
        {
          id: 204,
          name: '卷腹',
          type: '核心',
          duration: '10分钟',
          durationMinutes: 10,
          calories: 70,
          sets: 3,
          reps: 20,
          rest: '30秒',
          isCompleted: false,
          planId: 1
        }
      ]

      resolve({
        code: 200,
        message: '获取今日任务成功（mock）',
        data: tasks
      })
    }, 300)
  })
}

// 今日任务打卡完成 / 取消完成
export function mockCompleteTodayTask(taskId, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!taskId) {
        reject({
          code: 400,
          message: '任务ID不能为空'
        })
        return
      }

      const isCompleted = data?.isCompleted ?? true
      resolve({
        code: 200,
        message: isCompleted ? '打卡成功（mock）' : '取消打卡成功（mock）',
        data: {
          recordId: isCompleted ? generateId() : null,
          taskId: taskId
        }
      })
    }, 200)
  })
}

// 添加任务到计划
export function mockAddTaskToPlan(planId, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!planId) {
        reject({
          code: 400,
          message: '计划ID不能为空'
        })
        return
      }

      if (!data?.task) {
        reject({
          code: 400,
          message: '任务数据不能为空'
        })
        return
      }

      const newTaskId = generateId()
      resolve({
        code: 200,
        message: '添加任务成功（mock）',
        data: { taskId: newTaskId }
      })
    }, 300)
  })
}

// 从计划中删除任务
export function mockRemoveTaskFromPlan(planId, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!planId) {
        reject({
          code: 400,
          message: '计划ID不能为空'
        })
        return
      }

      if (!data?.taskId) {
        reject({
          code: 400,
          message: '任务ID不能为空'
        })
        return
      }

      resolve({
        code: 200,
        message: '删除任务成功（mock）'
      })
    }, 300)
  })
}
