// src/api/coach.js
import request from './request'
import { mockGetCoachList, mockInitCoachSession, mockSwitchCoach, mockSendCoachMessage, mockResetCoachSession } from '../mocks/coach.js'

// 开关（非常重要）
const USE_MOCK = true

// 获取教练列表
export function getCoachList() {
  if (USE_MOCK) {
    return mockGetCoachList()
  }
  return request({
    url: '/api/coaches',
    method: 'get'
  })
}

// 初始化教练会话页面
export function initCoachSession() {
  if (USE_MOCK) {
    return mockInitCoachSession()
  }
  return request({
    url: '/api/coaches/session/init',
    method: 'get'
  })
}

// 切换当前教练
export function switchCoach(data) {
  if (USE_MOCK) {
    return mockSwitchCoach(data)
  }
  return request({
    url: '/api/coaches/current',
    method: 'put',
    data
  })
}

// 发送消息给 AI 教练
export function sendCoachMessage(data) {
  if (USE_MOCK) {
    return mockSendCoachMessage(data)
  }
  return request({
    url: '/api/coaches/chat',
    method: 'post',
    data
  })
}

// 重置会话
export function resetCoachSession() {
  if (USE_MOCK) {
    return mockResetCoachSession()
  }
  return request({
    url: '/api/coaches/session',
    method: 'delete'
  })
}