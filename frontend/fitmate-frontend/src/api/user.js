// src/api/user.js
import request from './request'
import { mockGetUserProfile, mockUpdateUserProfile, mockUpdateAvatar, mockGetUserStats, mockGetAchievements, mockChangePassword } from '../mocks/user.js'

// 开关（非常重要）
const USE_MOCK = true

// 获取个人资料
export function getUserProfile() {
  if (USE_MOCK) {
    return mockGetUserProfile()
  }
  return request({
    url: '/api/users/profile',
    method: 'get'
  })
}

// 更新个人资料
export function updateUserProfile(data) {
  if (USE_MOCK) {
    return mockUpdateUserProfile(data)
  }
  return request({
    url: '/api/users/profile',
    method: 'put',
    data
  })
}

// 更新头像
export function updateAvatar(data) {
  if (USE_MOCK) {
    return mockUpdateAvatar(data)
  }
  return request({
    url: '/api/users/profile/avatar',
    method: 'put',
    data
  })
}

// 获取用户统计
export function getUserStats() {
  if (USE_MOCK) {
    return mockGetUserStats()
  }
  return request({
    url: '/api/users/stats',
    method: 'get'
  })
}

// 获取成就列表
export function getAchievements() {
  if (USE_MOCK) {
    return mockGetAchievements()
  }
  return request({
    url: '/api/users/achievements',
    method: 'get'
  })
}

// 修改密码
export function changePassword(data) {
  if (USE_MOCK) {
    return mockChangePassword(data)
  }
  return request({
    url: '/api/users/password/change',
    method: 'post',
    data
  })
}

// 注销账号
export function deleteAccount() {
  return request({
    url: '/api/users/account',
    method: 'delete'
  })
}