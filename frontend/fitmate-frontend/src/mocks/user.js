// src/mocks/user.js

// 模拟用户数据存储（用于持久化mock测试）
let mockUserData = {
  id: 1,
  username: 'liming',
  email: 'liming@example.com',
  phone: '138****8888',
  name: '李明',
  avatar: '',
  gender: 'male',
  age: 28,
  height: 175,
  weight: 70,
  bmi: 22.9,
  location: '北京市朝阳区',
  joinDate: '2024年1月',
  goal: '减脂',
  currentCoachId: 1
}

let mockStatsData = {
  totalDays: 89,
  totalDuration: 9360,
  totalCalories: 23456,
  completedPlans: 12
}

let mockAchievementsData = [
  { id: 1, name: '坚持之星', description: '连续训练7天', icon: '⭐', badgeType: 'bronze', isEarned: true },
  { id: 2, name: '燃脂达人', description: '累计消耗10000卡路里', icon: '🔥', badgeType: 'silver', isEarned: true },
  { id: 3, name: '力量之王', description: '完成100次力量训练', icon: '💪', badgeType: 'gold', isEarned: true },
  { id: 4, name: '马拉松挑战', description: '跑步累计100公里', icon: '🏃', badgeType: 'silver', isEarned: false },
  { id: 5, name: '早起鸟', description: '早晨6点前训练30次', icon: '🌅', badgeType: 'bronze', isEarned: false },
  { id: 6, name: '健身大师', description: '累计训练365天', icon: '🏆', badgeType: 'gold', isEarned: false }
]

// 获取个人资料
export function mockGetUserProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: { ...mockUserData }
      })
    }, 300)
  })
}

// 更新个人资料
export function mockUpdateUserProfile(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockUserData = { ...mockUserData, ...data }
      resolve({
        code: 200,
        message: '更新个人资料成功'
      })
    }, 300)
  })
}

// 更新头像
export function mockUpdateAvatar(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockUserData.avatar = data.avatar || 'new-avatar.jpg'
      resolve({
        code: 200,
        message: '更新头像成功',
        data: {
          avatar: mockUserData.avatar
        }
      })
    }, 300)
  })
}

// 获取用户统计
export function mockGetUserStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: { ...mockStatsData }
      })
    }, 300)
  })
}

// 获取成就列表
export function mockGetAchievements() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: [...mockAchievementsData]
      })
    }, 300)
  })
}

// 修改密码
export function mockChangePassword(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.oldPassword === 'wrong_password') {
        resolve({
          code: 400,
          message: '旧密码错误'
        })
      } else {
        resolve({
          code: 200,
          message: '修改密码成功'
        })
      }
    }, 500)
  })
}

// 注销账号
export function mockDeleteAccount() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '注销账号成功'
      })
    }, 500)
  })
}
