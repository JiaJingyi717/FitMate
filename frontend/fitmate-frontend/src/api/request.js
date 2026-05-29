// src/api/request.js
import axios from 'axios'
import { clearCoachChatSession } from '../utils/coachChatStorage'
import { logApiEvent, logError } from '../utils/logger'

/** 仅浏览器环境跳转登录；Vitest/jsdom 中不调度定时器，避免 CI 报 window is not defined */
function scheduleLoginRedirect() {
  if (typeof window === 'undefined' || import.meta.env.VITEST) {
    return
  }
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, 1500)
}

const service = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：自动带 token
service.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: Date.now() }
    // 优先从 sessionStorage 获取 token（当前会话）
    let token = sessionStorage.getItem('token')
    // 如果 sessionStorage 没有，从 localStorage 获取（记住我）
    if (!token) {
      token = localStorage.getItem('token')
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理后端返回
service.interceptors.response.use(
  (response) => {
    const config = response.config
    const start = config?.metadata?.startTime
    const durationMs = start != null ? Date.now() - start : undefined
    logApiEvent({
      method: config?.method?.toUpperCase(),
      url: config?.url,
      status: response.status,
      durationMs,
      ok: true,
    })

    const res = response.data

    // 处理无数据响应（如 204 No Content）
    if (!res) {
      return { code: 200, message: 'success', data: {} }
    }

    // 后端统一返回 { code, message, data }
    if (res.code !== 200) {
      return Promise.reject(res)
    }

    return res
  },
  (error) => {
    // 统一错误处理，不暴露后端敏感错误详情
    let message = '网络请求失败'

    if (error.response) {
      // 根据 HTTP 状态码返回友好提示
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401: {
          const url = error.config?.url || ''
          const isLoginRequest = url.includes('/auth/login')
          const onLoginPage =
            typeof window !== 'undefined' && window.location.pathname === '/login'
          const apiMessage = error.response.data?.message

          if (isLoginRequest || onLoginPage) {
            message =
              apiMessage === 'invalid username or password'
                ? '账号或密码错误'
                : apiMessage || '账号或密码错误'
          } else {
            message = '登录已过期，请重新登录'
            const userId = localStorage.getItem('userId')
            sessionStorage.removeItem('token')
            localStorage.removeItem('token')
            localStorage.removeItem('tokenExpiry')
            localStorage.removeItem('userId')
            clearCoachChatSession(userId)
            scheduleLoginRedirect()
          }
          break
        }
        case 403:
          message = '无访问权限'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器错误，请稍后重试'
          break
        case 502:
        case 503:
        case 504:
          message = '服务暂不可用，请稍后重试'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时，请检查网络连接'
    } else if (error.request) {
      message = '网络连接失败，请检查网络'
    }

    const start = error.config?.metadata?.startTime
    const durationMs = start != null ? Date.now() - start : undefined
    logApiEvent({
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status ?? 0,
      durationMs,
      ok: false,
    })
    logError('api_request_failed', { message })

    return Promise.reject({ code: error.response?.status || -1, message })
  }
)

export default service
