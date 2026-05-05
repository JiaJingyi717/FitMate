import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '../../api/request'
import { forgotPassword, login, logout, register, resetPassword } from '../../api/auth'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

describe('api/auth.js', () => {
  beforeEach(() => {
    request.mockReset()
  })

  it('register 调用注册接口', () => {
    register({ email: 'a@b.com', password: '123456' })
    expect(request).toHaveBeenCalledWith({
      url: '/api/users/register',
      method: 'post',
      data: { email: 'a@b.com', password: '123456' },
    })
  })

  it('login 调用登录接口', () => {
    login({ email: 'a@b.com', password: '123456' })
    expect(request).toHaveBeenCalledWith({
      url: '/api/auth/login',
      method: 'post',
      data: { email: 'a@b.com', password: '123456' },
    })
  })

  it('forgotPassword / resetPassword / logout 路径正确', () => {
    forgotPassword({ email: 'a@b.com' })
    resetPassword({ email: 'a@b.com', code: '123456', newPassword: 'abcdef' })
    logout()

    expect(request).toHaveBeenNthCalledWith(1, {
      url: '/api/auth/forgot-password',
      method: 'post',
      data: { email: 'a@b.com' },
    })
    expect(request).toHaveBeenNthCalledWith(2, {
      url: '/api/auth/reset-password',
      method: 'post',
      data: { email: 'a@b.com', code: '123456', newPassword: 'abcdef' },
    })
    expect(request).toHaveBeenNthCalledWith(3, {
      url: '/api/auth/logout',
      method: 'post',
    })
  })
})
