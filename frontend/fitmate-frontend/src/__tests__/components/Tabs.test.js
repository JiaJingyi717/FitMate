import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tabs from '../../components/Tabs.vue'

const tabs = [
  { label: '全部计划', value: 'all' },
  { label: '今日任务', value: 'today' },
]

describe('Tabs.vue', () => {
  it('渲染 tab 标题', () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'all', tabs },
    })
    expect(wrapper.text()).toContain('全部计划')
    expect(wrapper.text()).toContain('今日任务')
  })

  it('点击 tab 时触发 update:modelValue', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'all', tabs },
    })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['today'])
  })
})
