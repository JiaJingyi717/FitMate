// src/mocks/user.js

export function mockGetUserProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取个人资料成功（mock）',
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          avatar: 'avatar.jpg'
        }
      })
    }, 300)
  })
}

export function mockUpdateUserProfile(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '更新个人资料成功（mock）'
      })
    }, 300)
  })
}

export function mockUpdateAvatar(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '更新头像成功（mock）',
        data: { avatarUrl: 'new-avatar.jpg' }
      })
    }, 300)
  })
}

export function mockGetUserStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取用户统计成功（mock）',
        data: {
          totalWorkouts: 50,
          totalDuration: 2000,
          totalCalories: 3000
        }
      })
    }, 300)
  })
}

export function mockGetAchievements() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成就成功（mock）',
        data: [
          { id: 1, name: '首次跑步', unlocked: true },
          { id: 2, name: '坚持一周', unlocked: false }
        ]
      })
    }, 300)
  })
}

export function mockChangePassword(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '修改密码成功（mock）'
      })
    }, 300)
  })
}