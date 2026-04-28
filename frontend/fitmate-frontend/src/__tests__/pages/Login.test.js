import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from '../../pages/Login.vue'

const pushMock = vi.fn()
const loginMock = vi.fn()
const registerMock = vi.fn()
const logoutMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('../../api/auth', () => ({
  login: (...args) => loginMock(...args),
  register: (...args) => registerMock(...args),
  logout: (...args) => logoutMock(...args),
}))

describe('Login.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
    loginMock.mockReset()
    registerMock.mockReset()
    logoutMock.mockReset()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('登录成功后跳转到 /home', async () => {
    loginMock.mockResolvedValue({
      code: 200,
      data: { token: 'token-1', userId: 99 },
    })
    const wrapper = mount(Login)
    const inputs = wrapper.findAll('input.form-input')
    await inputs[0].setValue('test@example.com')
    await inputs[1].setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(loginMock).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' })
    expect(pushMock).toHaveBeenCalledWith('/home')
  })

  it('登录参数为空时显示错误提示', async () => {
    const wrapper = mount(Login)
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('请输入账号和密码')
  })

  it('注册未勾选协议时提示错误', async () => {
    const wrapper = mount(Login)
    const tabs = wrapper.findAll('.auth-tab')
    await tabs[1].trigger('click')
    const inputs = wrapper.findAll('input.form-input')
    await inputs[2].setValue('测试用户')
    await inputs[3].setValue('reg@test.com')
    await inputs[4].setValue('13800138000')
    await inputs[5].setValue('123456')
    await inputs[6].setValue('123456')
    const forms = wrapper.findAll('form')
    await forms[1].trigger('submit.prevent')
    expect(wrapper.text()).toContain('请阅读并同意用户协议和隐私政策')
  })
})
