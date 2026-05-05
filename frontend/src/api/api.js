/**
 * FitMate 前端 API 封装
 * 基础地址: http://127.0.0.1:5000
 *
 * 使用方式:
 *   import api from '@/api/api'
 *   const res = await api.auth.login({ username: 'xxx', password: 'xxx' })
 *   const { code, data, msg } = res.data
 */

import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:5000'

// ---------------------------------------------------------------------------
// Axios 实例
// ---------------------------------------------------------------------------
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器：自动附加 JWT Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitmate_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：401 时自动跳转登录页（可选）
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitmate_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ---------------------------------------------------------------------------
// Auth 认证模块
// ---------------------------------------------------------------------------
export const auth = {
  /** POST /api/users/register */
  register: (data) => request.post('/api/users/register', data),

  /** POST /api/auth/login */
  login: (data) => request.post('/api/auth/login', data),

  /** POST /api/auth/logout */
  logout: () => request.post('/api/auth/logout'),
}

// ---------------------------------------------------------------------------
// Profile 个人中心模块
// ---------------------------------------------------------------------------
export const profile = {
  /** GET /api/users/profile */
  get: () => request.get('/api/users/profile'),

  /** PUT /api/users/profile */
  update: (data) => request.put('/api/users/profile', data),

  /** GET /api/users/stats */
  stats: () => request.get('/api/users/stats'),

  /** GET /api/users/achievements */
  achievements: () => request.get('/api/users/achievements'),

  /** POST /api/users/password/change */
  changePassword: (data) => request.post('/api/users/password/change', data),

  /** DELETE /api/users/account */
  deleteAccount: () => request.delete('/api/users/account'),
}

// ---------------------------------------------------------------------------
// Coaches AI 教练模块
// ---------------------------------------------------------------------------
export const coaches = {
  /** GET /api/coaches */
  list: () => request.get('/api/coaches'),

  /** GET /api/coaches/session/init */
  initSession: () => request.get('/api/coaches/session/init'),

  /** PUT /api/coaches/current */
  switch: (data) => request.put('/api/coaches/current', data),

  /** POST /api/coaches/chat */
  chat: (data) => request.post('/api/coaches/chat', data),

  /** DELETE /api/coaches/session */
  resetSession: () => request.delete('/api/coaches/session'),
}

// ---------------------------------------------------------------------------
// Plans 训练计划模块
// ---------------------------------------------------------------------------
export const plans = {
  /** GET /api/plans/overview */
  overview: () => request.get('/api/plans/overview'),

  /** GET /api/plans */
  list: () => request.get('/api/plans'),

  /** GET /api/plans/:id */
  detail: (id) => request.get(`/api/plans/${id}`),

  /** POST /api/plans */
  create: (data) => request.post('/api/plans', data),

  /** POST /api/plans/ai-generate */
  aiGenerate: (data) => request.post('/api/plans/ai-generate', data),

  /** DELETE /api/plans/:id */
  delete: (id) => request.delete(`/api/plans/${id}`),

  /** GET /api/plans/today */
  todayTasks: () => request.get('/api/plans/today'),

  /** PATCH /api/plans/today/:taskId/complete */
  completeTask: (taskId, data) => request.patch(`/api/plans/today/${taskId}/complete`, data),
}

// ---------------------------------------------------------------------------
// Articles 知识库模块
// ---------------------------------------------------------------------------
export const articles = {
  /** GET /api/articles?category=&keyword= */
  list: (params) => request.get('/api/articles', { params }),

  /** GET /api/articles/:id */
  detail: (id) => request.get(`/api/articles/${id}`),

  /** POST /api/articles/:id/like */
  like: (id) => request.post(`/api/articles/${id}/like`),

  /** POST /api/articles/:id/collect */
  collect: (id) => request.post(`/api/articles/${id}/collect`),

  /** GET /api/articles/:id/comments */
  comments: (id) => request.get(`/api/articles/${id}/comments`),

  /** POST /api/articles/:id/comments */
  addComment: (id, data) => request.post(`/api/articles/${id}/comments`, data),

  /** GET /api/articles/collections */
  collections: () => request.get('/api/articles/collections'),
}

// ---------------------------------------------------------------------------
// Analytics 数据分析模块
// ---------------------------------------------------------------------------
export const analytics = {
  /** GET /api/analytics/overview?range=7d */
  overview: (params) => request.get('/api/analytics/overview', { params }),

  /** GET /api/analytics/category-distribution?range=7d */
  categoryDistribution: (params) =>
    request.get('/api/analytics/category-distribution', { params }),

  /** GET /api/analytics/duration-trend?range=7d */
  durationTrend: (params) => request.get('/api/analytics/duration-trend', { params }),

  /** GET /api/analytics/ai-suggestions?range=7d */
  aiSuggestions: (params) => request.get('/api/analytics/ai-suggestions', { params }),
}

// ---------------------------------------------------------------------------
// 默认导出（方便直接解构使用）
// ---------------------------------------------------------------------------
export default {
  auth,
  profile,
  coaches,
  plans,
  articles,
  analytics,
}
