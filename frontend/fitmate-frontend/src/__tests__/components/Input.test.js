import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from '../../components/Input.vue'

describe('Input.vue', () => {
  it('输入时触发 update:modelValue', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('abc')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events[0]).toEqual(['abc'])
  })

  it('按 Enter 时触发 enter 事件', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } })
    await wrapper.find('input').trigger('keyup.enter')
    expect(wrapper.emitted('enter')).toBeTruthy()
  })
})
