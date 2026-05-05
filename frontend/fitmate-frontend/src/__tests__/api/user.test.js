import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '../../api/request'
import {
  changePassword,
  deleteAccount,
  getAchievements,
  getUserProfile,
  getUserStats,
  updateAvatar,
  updateUserProfile,
} from '../../api/user'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

describe('api/user.js', () => {
  beforeEach(() => {
    request.mockReset()
  })

  it('资料与统计接口路径正确', () => {
    getUserProfile()
    getUserStats()
    getAchievements()
    expect(request).toHaveBeenNthCalledWith(1, { url: '/api/users/profile', method: 'get' })
    expect(request).toHaveBeenNthCalledWith(2, { url: '/api/users/stats', method: 'get' })
    expect(request).toHaveBeenNthCalledWith(3, { url: '/api/users/achievements', method: 'get' })
  })

  it('更新资料、头像、密码与删号接口路径正确', () => {
    updateUserProfile({ name: 'A' })
    updateAvatar({ avatar: 'base64' })
    changePassword({ oldPassword: '1', newPassword: '2' })
    deleteAccount()
    expect(request).toHaveBeenNthCalledWith(1, {
      url: '/api/users/profile',
      method: 'put',
      data: { name: 'A' },
    })
    expect(request).toHaveBeenNthCalledWith(2, {
      url: '/api/users/profile/avatar',
      method: 'put',
      data: { avatar: 'base64' },
    })
    expect(request).toHaveBeenNthCalledWith(3, {
      url: '/api/users/password/change',
      method: 'post',
      data: { oldPassword: '1', newPassword: '2' },
    })
    expect(request).toHaveBeenNthCalledWith(4, { url: '/api/users/account', method: 'delete' })
  })
})
