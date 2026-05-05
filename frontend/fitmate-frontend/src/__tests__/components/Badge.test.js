import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Badge from '../../components/Badge.vue'

describe('Badge.vue', () => {
  it('渲染 slot 文本', () => {
    const wrapper = mount(Badge, { slots: { default: '标签' } })
    expect(wrapper.text()).toContain('标签')
  })

  it('variant 与 size class 生效', () => {
    const wrapper = mount(Badge, { props: { variant: 'solid', size: 'sm' } })
    const cls = wrapper.classes()
    expect(cls).toContain('badge-solid')
    expect(cls).toContain('badge-sm')
  })
})
