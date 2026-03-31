// src/api/request.js
import axios from 'axios'

const service = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：自动带 token
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
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