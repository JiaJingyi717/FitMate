import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '../../api/request'
import {
  getCoachList,
  initCoachSession,
  resetCoachSession,
  sendCoachMessage,
  switchCoach,
} from '../../api/coach'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

describe('api/coach.js', () => {
  beforeEach(() => {
    request.mockReset()
  })

  it('教练列表/初始化会话请求正确', () => {
    getCoachList()
    initCoachSession()
    expect(request).toHaveBeenNthCalledWith(1, { url: '/api/coaches', method: 'get' })
    expect(request).toHaveBeenNthCalledWith(2, { url: '/api/coaches/session/init', method: 'get' })
  })

  it('切换教练、发送消息、重置会话请求正确', () => {
    switchCoach({ coachId: 1 })
    sendCoachMessage({ message: '你好' })
    resetCoachSession()
    expect(request).toHaveBeenNthCalledWith(1, {
      url: '/api/coaches/current',
      method: 'put',
      data: { coachId: 1 },
    })
    expect(request).toHaveBeenNthCalledWith(2, {
      url: '/api/coaches/chat',
      method: 'post',
      data: { message: '你好' },
    })
    expect(request).toHaveBeenNthCalledWith(3, { url: '/api/coaches/session', method: 'delete' })
  })
})
