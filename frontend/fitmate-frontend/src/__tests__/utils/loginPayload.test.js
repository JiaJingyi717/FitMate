import { describe, expect, it } from 'vitest'
import { buildLoginPayload } from '../../utils/loginPayload'

describe('buildLoginPayload', () => {
  it('邮箱走 email 字段', () => {
    expect(buildLoginPayload('a@b.com', '123456')).toEqual({
      email: 'a@b.com',
      password: '123456',
    })
  })

  it('11 位手机号走 phone 字段', () => {
    expect(buildLoginPayload('13800138000', '123456')).toEqual({
      phone: '13800138000',
      password: '123456',
    })
  })

  it('普通用户名走 username 字段', () => {
    expect(buildLoginPayload('test', '123456')).toEqual({
      username: 'test',
      password: '123456',
    })
  })
})
