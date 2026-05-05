import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Dialog from '../../components/Dialog.vue'

describe('Dialog.vue', () => {
  it('show=true 时显示标题和内容', () => {
    const wrapper = mount(Dialog, {
      props: { show: true, title: '测试弹窗' },
      slots: { default: '<div>内容</div>' },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })
    expect(wrapper.text()).toContain('测试弹窗')
    expect(wrapper.text()).toContain('内容')
  })

  it('点击关闭按钮触发 close 与 update:show', async () => {
    const wrapper = mount(Dialog, {
      props: { show: true, title: '测试弹窗' },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })
    await wrapper.find('.dialog-close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('update:show')).toBeTruthy()
    expect(wrapper.emitted('update:show')[0]).toEqual([false])
  })
})
