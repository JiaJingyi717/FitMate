import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Card from '../../components/Card.vue'

describe('Card.vue', () => {
  it('渲染 slot 内容', () => {
    const wrapper = mount(Card, { slots: { default: '<p>内容</p>' } })
    expect(wrapper.text()).toContain('内容')
  })

  it('接收 customClass 和 gradientClass', () => {
    const wrapper = mount(Card, {
      props: { customClass: 'my-card', gradientClass: 'bg-blue' },
    })
    expect(wrapper.classes()).toContain('my-card')
    expect(wrapper.classes()).toContain('bg-blue')
  })
})
