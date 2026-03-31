// src/api/auth.js
import request from './request'
import { mockLogin, mockRegister, mockForgotPassword, mockResetPassword, mockLogout } from '../mocks/auth.js'

// 开关（非常重要）
const USE_MOCK = true
// 注册
export function register(data) {
  if (USE_MOCK) {
    return mockRegister(data)
  }
  return request({
    url: '/api/users/register',
    method: 'post',
    data
  })
}

// 登录
export function login(data) {
     if (USE_MOCK) {
    return mockLogin(data)
  }
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 忘记密码：发送验证码
export function forgotPassword(data) {
  if (USE_MOCK) {
    return mockForgotPassword(data)
  }
  return request({
    url: '/api/auth/forgot-password',
    method: 'post',
    data
  })
}

// 重置密码
export function resetPassword(data) {
  if (USE_MOCK) {
    return mockResetPassword(data)
  }
  return request({
    url: '/api/auth/reset-password',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  if (USE_MOCK) {
    return mockLogout()
  }
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}