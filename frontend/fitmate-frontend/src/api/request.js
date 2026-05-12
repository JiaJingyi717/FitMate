// src/api/request.js
import axios from 'axios'

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
        case 401:
          message = '登录已过期，请重新登录'
          // 清除 token 并跳转登录
          sessionStorage.removeItem('token')
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiry')
          localStorage.removeItem('userId')
          // 延迟跳转，让用户看到错误提示
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
          break
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

    return Promise.reject({ code: error.response?.status || -1, message })
  }
)

export default service
