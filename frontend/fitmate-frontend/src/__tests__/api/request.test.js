import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestUseMock = vi.fn()
const responseUseMock = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: requestUseMock },
        response: { use: responseUseMock },
      },
    })),
  },
}))

describe('api/request.js', () => {
  beforeEach(() => {
    vi.resetModules()
    requestUseMock.mockClear()
    responseUseMock.mockClear()
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

  it('响应拦截器处理空响应和异常 code', async () => {
    await import('../../api/request')
    const onResponse = responseUseMock.mock.calls[0][0]

    expect(onResponse({ data: null })).toEqual({ code: 200, message: 'success', data: {} })
    await expect(onResponse({ data: { code: 500, message: 'fail' } })).rejects.toEqual({
      code: 500,
      message: 'fail',
    })
  })
})
