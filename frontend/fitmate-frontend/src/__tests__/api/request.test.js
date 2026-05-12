import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestUseMock = vi.fn()
const responseUseMock = vi.fn()

function createAxiosInstanceMock() {
  return {
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: requestUseMock, eject: vi.fn() },
      response: { use: responseUseMock, eject: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
  }
}

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => createAxiosInstanceMock()),
  },
}))

describe('api/request.js', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    sessionStorage.clear()
    localStorage.clear()
  })

  it('注册请求和响应拦截器', async () => {
    await import('../../api/request')
    expect(requestUseMock).toHaveBeenCalledTimes(1)
    expect(responseUseMock).toHaveBeenCalledTimes(1)
  })

  it('请求拦截器会优先读取 sessionStorage token', async () => {
    await import('../../api/request')
    const onRequest = requestUseMock.mock.calls[0][0]

    sessionStorage.setItem('token', 'session-token')
    localStorage.setItem('token', 'local-token')
    const config = { headers: {} }
    const out = onRequest(config)

    expect(out.headers.Authorization).toBe('Bearer session-token')
  })

  it('请求拦截器从 localStorage 获取 token', async () => {
    await import('../../api/request')
    const onRequest = requestUseMock.mock.calls[0][0]

    localStorage.setItem('token', 'local-token')
    const config = { headers: {} }
    const out = onRequest(config)

    expect(out.headers.Authorization).toBe('Bearer local-token')
  })

  it('请求拦截器无 token 时不设置 Authorization', async () => {
    await import('../../api/request')
    const onRequest = requestUseMock.mock.calls[0][0]

    const config = { headers: {} }
    const out = onRequest(config)

    expect(out.headers.Authorization).toBeUndefined()
  })

  it('请求拦截器错误时 reject', async () => {
    await import('../../api/request')
    const onRequestError = requestUseMock.mock.calls[0][1]
    const error = new Error('config error')

    await expect(onRequestError(error)).rejects.toThrow('config error')
  })

  it('响应拦截器处理空响应和异常 code', async () => {
    await import('../../api/request')
    const onResponse = responseUseMock.mock.calls[0][0]

    expect(onResponse({ data: null })).toEqual({ code: 200, message: 'success', data: {} })
    await expect(onResponse({ data: { code: 500, message: 'fail' } })).rejects.toEqual({
      code: 500,
      message: 'fail',
    })
  })

  it('响应拦截器处理 200 成功响应', async () => {
    await import('../../api/request')
    const onResponse = responseUseMock.mock.calls[0][0]
    const response = { data: { code: 200, message: 'ok', data: { id: 1 } } }

    expect(onResponse(response)).toEqual(response.data)
  })

  it('响应拦截器处理 401 未授权错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = {
      response: { status: 401, data: { message: 'Unauthorized' } }
    }

    sessionStorage.setItem('token', 'test-token')
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('tokenExpiry', '123')
    localStorage.setItem('userId', '123')

    await expect(onResponseError(error)).rejects.toEqual({
      code: 401,
      message: '登录已过期，请重新登录',
    })

    expect(sessionStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('tokenExpiry')).toBeNull()
    expect(localStorage.getItem('userId')).toBeNull()
  })

  it('响应拦截器处理 403 无权限错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = { response: { status: 403 } }

    await expect(onResponseError(error)).rejects.toEqual({
      code: 403,
      message: '无访问权限',
    })
  })

  it('响应拦截器处理 404 资源不存在错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = { response: { status: 404 } }

    await expect(onResponseError(error)).rejects.toEqual({
      code: 404,
      message: '请求资源不存在',
    })
  })

  it('响应拦截器处理 400 请求参数错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = { response: { status: 400 } }

    await expect(onResponseError(error)).rejects.toEqual({
      code: 400,
      message: '请求参数错误',
    })
  })

  it('响应拦截器处理 500 服务器错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = { response: { status: 500 } }

    await expect(onResponseError(error)).rejects.toEqual({
      code: 500,
      message: '服务器错误，请稍后重试',
    })
  })

  it('响应拦截器处理 502/503/504 服务不可用错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]

    for (const status of [502, 503, 504]) {
      const error = { response: { status } }
      await expect(onResponseError(error)).rejects.toEqual({
        code: status,
        message: '服务暂不可用，请稍后重试',
      })
    }
  })

  it('响应拦截器处理其他 HTTP 错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = {
      response: { status: 418, data: { message: 'I am a teapot' } }
    }

    await expect(onResponseError(error)).rejects.toEqual({
      code: 418,
      message: 'I am a teapot',
    })
  })

  it('响应拦截器处理请求超时错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = { code: 'ECONNABORTED' }

    await expect(onResponseError(error)).rejects.toEqual({
      code: -1,
      message: '请求超时，请检查网络连接',
    })
  })

  it('响应拦截器处理网络连接失败错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = { request: {} }

    await expect(onResponseError(error)).rejects.toEqual({
      code: -1,
      message: '网络连接失败，请检查网络',
    })
  })

  it('响应拦截器处理未知错误', async () => {
    await import('../../api/request')
    const onResponseError = responseUseMock.mock.calls[0][1]
    const error = {}

    await expect(onResponseError(error)).rejects.toEqual({
      code: -1,
      message: '网络请求失败',
    })
  })
})
