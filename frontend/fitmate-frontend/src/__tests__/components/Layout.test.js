import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Layout from '../../components/Layout.vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/home' }),
}))

describe('Layout.vue', () => {
  it('渲染侧边栏和导航项', () => {
    const wrapper = mount(Layout, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
          RouterView: {
            template: '<div class="router-view-stub" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('FitMate')
    expect(wrapper.text()).toContain('AI教练')
    expect(wrapper.find('.router-view-stub').exists()).toBe(true)
  })

  it('点击折叠按钮后应用 collapsed class', async () => {
    const wrapper = mount(Layout, {
      global: {
        stubs: { RouterLink: true, RouterView: true },
      },
    })
    await wrapper.get('.collapse-btn').trigger('click')
    expect(wrapper.find('.sidebar').classes()).toContain('collapsed')
  })
})
