import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '../../components/Button.vue'

describe('Button.vue', () => {
  it('渲染 slot 文本', () => {
    const wrapper = mount(Button, {
      slots: { default: '提交' },
    })
    expect(wrapper.text()).toContain('提交')
  })

  it('点击时触发 click 事件', async () => {
    const wrapper = mount(Button, {
      slots: { default: '点击' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('disabled 时按钮不可点击', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: '禁用' },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
