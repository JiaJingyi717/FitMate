// src/mocks/coach.js

export function mockGetCoachList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取教练列表成功（mock）',
        data: [
          { id: 1, name: '教练A', description: '专业跑步教练' },
          { id: 2, name: '教练B', description: '瑜伽专家' }
        ]
      })
    }, 300)
  })
}

export function mockInitCoachSession() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '初始化会话成功（mock）',
        data: { sessionId: 'mock-session-123' }
      })
    }, 300)
  })
}

export function mockSwitchCoach(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '切换教练成功（mock）',
        data: { coachId: data.coachId }
      })
    }, 300)
  })
}

export function mockSendCoachMessage(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '发送消息成功（mock）',
        data: {
          reply: '这是AI教练的回复',
          messageId: 'mock-msg-456'
        }
      })
    }, 300)
  })
}

export function mockResetCoachSession() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '重置会话成功（mock）'
      })
    }, 300)
  })
}