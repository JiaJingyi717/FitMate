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

    // 你的后端统一返回 { code, message, data }
    if (res.code !== 200) {
      console.error(res.message || '请求失败')
      return Promise.reject(res)
    }

    return res
  },
  (error) => {
    console.error(error.response?.data?.message || error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service