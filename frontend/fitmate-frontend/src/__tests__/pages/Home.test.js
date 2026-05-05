import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Home from '../../pages/Home.vue'

const pushMock = vi.fn()
const askCoachMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('../../api/ai', () => ({
  askCoach: (...args) => askCoachMock(...args),
}))

describe('Home.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
    askCoachMock.mockReset()
    window.SpeechRecognition = undefined
    window.webkitSpeechRecognition = undefined
  })

  it('发送消息成功后显示 AI 回复', async () => {
    askCoachMock.mockResolvedValue({
      code: 200,
      data: { content: '这是AI回复' },
    })
    const wrapper = mount(Home)
    await wrapper.find('.chat-input').setValue('帮我做计划')
    await wrapper.find('.send-btn').trigger('click')
    await flushPromises()

    expect(askCoachMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('这是AI回复')
  })

  it('超时错误时显示超时提示文案', async () => {
    const timeoutError = new Error('timeout of 10000ms exceeded')
    timeoutError.code = 'ECONNABORTED'
    askCoachMock.mockRejectedValue(timeoutError)
    const wrapper = mount(Home)
    await wrapper.find('.chat-input').setValue('测试超时')
    await wrapper.find('.send-btn').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('AI响应较慢，请稍后重试（已延长超时时间）')
    expect(wrapper.text()).toContain('AI响应超时，请稍后重试。')
  })

  it('点击推荐卡片会触发路由跳转', async () => {
    askCoachMock.mockResolvedValue({
      code: 200,
      data: { content: '去训练计划页看看' },
    })
    const wrapper = mount(Home)
    await wrapper.find('.chat-input').setValue('帮我生成一个训练计划')
    await wrapper.find('.send-btn').trigger('click')
    await flushPromises()

    const card = wrapper.find('.recommendation-card')
    expect(card.exists()).toBe(true)
    await card.trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/plan')
  })

  it('普通错误时显示通用失败文案', async () => {
    askCoachMock.mockRejectedValue(new Error('network down'))
    const wrapper = mount(Home)
    await wrapper.find('.chat-input').setValue('随便问一个问题')
    await wrapper.find('.send-btn').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('发送失败，请检查网络后重试')
    expect(wrapper.text()).toContain('抱歉，我现在无法回复你，请稍后再试。')
  })

  it('点击重置会话后恢复欢迎语', async () => {
    window.confirm = vi.fn(() => true)
    askCoachMock.mockResolvedValue({ code: 200, data: { content: '收到' } })

    const wrapper = mount(Home)
    await wrapper.find('.chat-input').setValue('测试消息')
    await wrapper.find('.send-btn').trigger('click')
    await flushPromises()

    expect(wrapper.find('.reset-btn').exists()).toBe(true)
    await wrapper.find('.reset-btn').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('我是你的AI健身教练')
  })
})
