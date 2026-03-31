// src/mocks/auth.js

export function mockLogin(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '登录成功（mock）',
        data: {
          token: 'mock-token-123456',
          userId: 1,
          username: data.email
        }
      })
    }, 500)
  })
}

export function mockRegister(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '注册成功（mock）',
        data: {
          userId: 2,
          username: data.username,
          email: data.email
        }
      })
    }, 500)
  })
}

export function mockForgotPassword(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '验证码发送成功（mock）'
      })
    }, 500)
  })
}

export function mockResetPassword(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '密码重置成功（mock）'
      })
    }, 500)
  })
}

export function mockLogout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '退出登录成功（mock）'
      })
    }, 500)
  })
}