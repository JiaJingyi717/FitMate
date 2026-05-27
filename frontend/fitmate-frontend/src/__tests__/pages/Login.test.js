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

  it('使用用户名登录时发送 username 字段', async () => {
    loginMock.mockResolvedValue({
      code: 200,
      data: { token: 'token-1', userId: 1 },
    })
    const wrapper = mount(Login)
    const inputs = wrapper.findAll('input.form-input')
    await inputs[0].setValue('test')
    await inputs[1].setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(loginMock).toHaveBeenCalledWith({ username: 'test', password: '123456' })
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

  it('登录时勾选记住我会保存到 localStorage', async () => {
    loginMock.mockResolvedValue({
      code: 200,
      data: { token: 'local-storage-token', userId: 99 },
    })
    const wrapper = mount(Login)
    const inputs = wrapper.findAll('input.form-input')
    await inputs[0].setValue('test@example.com')
    await inputs[1].setValue('123456')

    // 查找并点击记住我 checkbox
    const rememberCheckbox = wrapper.find('input[type="checkbox"]')
    await rememberCheckbox.setChecked(true)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(localStorage.getItem('token')).toBe('local-storage-token')
    expect(sessionStorage.getItem('token')).toBeNull()
  })

  it('登录时不勾选记住我会保存到 sessionStorage', async () => {
    loginMock.mockResolvedValue({
      code: 200,
      data: { token: 'session-token', userId: 99 },
    })
    const wrapper = mount(Login)
    const inputs = wrapper.findAll('input.form-input')
    await inputs[0].setValue('test@example.com')
    await inputs[1].setValue('123456')
    // 不勾选记住我（默认不勾选）

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(sessionStorage.getItem('token')).toBe('session-token')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('登录失败时显示错误提示', async () => {
    loginMock.mockResolvedValue({
      code: 400,
      message: '账号或密码错误',
    })
    const wrapper = mount(Login)
    const inputs = wrapper.findAll('input.form-input')
    await inputs[0].setValue('test@example.com')
    await inputs[1].setValue('wrongpassword')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('账号或密码错误')
  })

  it('注册密码确认不一致时提示错误', async () => {
    const wrapper = mount(Login)
    const tabs = wrapper.findAll('.auth-tab')
    await tabs[1].trigger('click')

    const inputs = wrapper.findAll('input.form-input')
    await inputs[2].setValue('测试用户')
    await inputs[3].setValue('reg@test.com')
    await inputs[4].setValue('13800138000')
    await inputs[5].setValue('123456')
    await inputs[6].setValue('different') // 密码确认不一致

    // 勾选协议
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setChecked(true)

    const forms = wrapper.findAll('form')
    await forms[1].trigger('submit.prevent')

    expect(wrapper.text()).toContain('两次输入的密码不一致')
  })

  it('注册密码过短时提示错误', async () => {
    const wrapper = mount(Login)
    const tabs = wrapper.findAll('.auth-tab')
    await tabs[1].trigger('click')

    const inputs = wrapper.findAll('input.form-input')
    await inputs[2].setValue('测试用户')
    await inputs[3].setValue('reg@test.com')
    await inputs[4].setValue('13800138000')
    await inputs[5].setValue('123') // 密码少于6位
    await inputs[6].setValue('123')

    // 勾选协议
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setChecked(true)

    const forms = wrapper.findAll('form')
    await forms[1].trigger('submit.prevent')

    expect(wrapper.text()).toContain('密码至少需要6位')
  })

  it('注册成功后跳转到首页', async () => {
    registerMock.mockResolvedValue({
      code: 200,
      data: { token: 'register-token', userId: 100 },
    })
    const wrapper = mount(Login)
    const tabs = wrapper.findAll('.auth-tab')
    await tabs[1].trigger('click')
    await flushPromises()

    // 填写注册表单
    const inputs = wrapper.findAll('input.form-input')
    await inputs[2].setValue('测试用户')
    await inputs[3].setValue('reg@test.com')
    await inputs[4].setValue('13800138000')
    await inputs[5].setValue('123456')
    await inputs[6].setValue('123456')

    // 勾选协议
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[checkboxes.length - 1].setChecked(true)

    const forms = wrapper.findAll('form')
    await forms[1].trigger('submit.prevent')
    await flushPromises()

    expect(registerMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/home')
  })
})
