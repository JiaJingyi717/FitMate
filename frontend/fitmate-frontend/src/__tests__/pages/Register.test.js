import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Register from '../../pages/Register.vue'

const pushMock = vi.fn()
const registerMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('../../api/auth', () => ({
  register: (...args) => registerMock(...args),
}))

describe('Register.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
    registerMock.mockReset()
    window.alert = vi.fn()
  })

  it('密码不一致时阻止提交', async () => {
    const wrapper = mount(Register, { global: { stubs: { RouterLink: true } } })
    const inputs = wrapper.findAll('input.form-input')
    await inputs[0].setValue('测试')
    await inputs[1].setValue('test@example.com')
    await inputs[2].setValue('13800138000')
    await inputs[3].setValue('123456')
    await inputs[4].setValue('654321')
    await wrapper.find('form').trigger('submit.prevent')
    expect(registerMock).not.toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalled()
  })

  it('注册成功后跳转登录页', async () => {
    registerMock.mockResolvedValue({ code: 200 })
    const wrapper = mount(Register, { global: { stubs: { RouterLink: true } } })
    const inputs = wrapper.findAll('input.form-input')
    await inputs[0].setValue('测试')
    await inputs[1].setValue('test@example.com')
    await inputs[2].setValue('13800138000')
    await inputs[3].setValue('123456')
    await inputs[4].setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(registerMock).toHaveBeenCalledWith({
      name: '测试',
      email: 'test@example.com',
      phone: '13800138000',
      password: '123456',
    })
    expect(pushMock).toHaveBeenCalledWith('/login')
  })
})
