import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Profile from '../../pages/Profile.vue'

const pushMock = vi.fn()
const getUserProfileMock = vi.fn()
const updateUserProfileMock = vi.fn()
const updateAvatarMock = vi.fn()
const getUserStatsMock = vi.fn()
const getAchievementsMock = vi.fn()
const changePasswordMock = vi.fn()
const deleteAccountMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('../../api/user.js', () => ({
  getUserProfile: (...args) => getUserProfileMock(...args),
  updateUserProfile: (...args) => updateUserProfileMock(...args),
  updateAvatar: (...args) => updateAvatarMock(...args),
  getUserStats: (...args) => getUserStatsMock(...args),
  getAchievements: (...args) => getAchievementsMock(...args),
  changePassword: (...args) => changePasswordMock(...args),
  deleteAccount: (...args) => deleteAccountMock(...args),
}))

describe('Profile.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
    getUserProfileMock.mockReset()
    updateUserProfileMock.mockReset()
    updateAvatarMock.mockReset()
    getUserStatsMock.mockReset()
    getAchievementsMock.mockReset()
    changePasswordMock.mockReset()
    deleteAccountMock.mockReset()
    window.alert = vi.fn()
  })

  it('初始化加载个人资料、统计和成就', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '测试用户', email: 'a@b.com', height: 170, weight: 65 } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: { totalDays: 3, totalDuration: 90, totalCalories: 300, completedPlans: 1 } })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [{ id: 1, name: '新手', description: '完成一次训练', icon: '🏅', isEarned: true }] })

    const wrapper = mount(Profile, {
      global: {
        stubs: {
          Dialog: { template: '<div><slot /></div>' },
        },
      },
    })
    await flushPromises()

    expect(getUserProfileMock).toHaveBeenCalled()
    expect(getUserStatsMock).toHaveBeenCalled()
    expect(getAchievementsMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('个人中心')
    expect(wrapper.text()).toContain('测试用户')
  })

  it('编辑后保存资料会调用 updateUserProfile', async () => {
    getUserProfileMock.mockResolvedValue({
      code: 200,
      data: { name: '旧名字', email: 'a@b.com', height: 170, weight: 65, goal: '减脂' },
    })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })
    updateUserProfileMock.mockResolvedValue({ code: 200 })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.get('.edit-btn').trigger('click')
    await wrapper.get('input.edit-input').setValue('新名字')
    await wrapper.get('.edit-btn').trigger('click')
    await flushPromises()

    expect(updateUserProfileMock).toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalledWith('保存成功')
  })

  it('修改密码缺少旧密码时直接提示', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.findAll('.settings-btn')[0].trigger('click')
    await wrapper.get('.modal-content .btn-primary').trigger('click')

    expect(changePasswordMock).not.toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalledWith('请输入旧密码')
  })

  it('退出登录会清 token 并跳转登录页', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })
    window.confirm = vi.fn(() => true)
    localStorage.setItem('token', 'abc')

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.get('.logout-btn').trigger('click')

    expect(localStorage.getItem('token')).toBeNull()
    expect(pushMock).toHaveBeenCalledWith('/login')
  })

  it('修改密码两次不一致时给出提示', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.findAll('.settings-btn')[0].trigger('click')
    const pwdInputs = wrapper.findAll('.modal-content .form-input')
    await pwdInputs[0].setValue('oldpass')
    await pwdInputs[1].setValue('newpass1')
    await pwdInputs[2].setValue('newpass2')
    await wrapper.get('.modal-content .btn-primary').trigger('click')

    expect(changePasswordMock).not.toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalledWith('两次密码输入不一致')
  })

  it('修改密码成功会调用接口并关闭弹窗', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })
    changePasswordMock.mockResolvedValue({ code: 200 })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.findAll('.settings-btn')[0].trigger('click')
    const pwdInputs = wrapper.findAll('.modal-content .form-input')
    await pwdInputs[0].setValue('oldpass')
    await pwdInputs[1].setValue('newpass')
    await pwdInputs[2].setValue('newpass')
    await wrapper.get('.modal-content .btn-primary').trigger('click')
    await flushPromises()

    expect(changePasswordMock).toHaveBeenCalledWith({ oldPassword: 'oldpass', newPassword: 'newpass' })
    expect(window.alert).toHaveBeenCalledWith('密码修改成功')
  })

  it('注销账号成功会跳转到登录页', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })
    deleteAccountMock.mockResolvedValue({ code: 200 })
    localStorage.setItem('token', 'abc')

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.get('.btn-danger').trigger('click')
    await flushPromises()

    expect(deleteAccountMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/login')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('BMI 计算正确', async () => {
    getUserProfileMock.mockResolvedValue({
      code: 200,
      data: { name: '用户', height: 170, weight: 57.8 }, // 170cm, 57.8kg -> BMI = 20
    })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('20.0')
    expect(wrapper.text()).toContain('正常')
  })

  it('BMI 偏瘦状态', async () => {
    getUserProfileMock.mockResolvedValue({
      code: 200,
      data: { name: '用户', height: 180, weight: 50 }, // BMI < 18.5
    })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('偏瘦')
  })

  it('BMI 肥胖状态', async () => {
    getUserProfileMock.mockResolvedValue({
      code: 200,
      data: { name: '用户', height: 160, weight: 80 }, // BMI > 28
    })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('肥胖')
  })

  it('成就列表正确渲染', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({
      code: 200,
      data: [
        { id: 1, name: '新手', description: '完成一次训练', icon: '🏅', isEarned: true },
        { id: 2, name: '坚持', description: '连续7天训练', icon: '🔥', isEarned: false },
      ],
    })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('新手')
    expect(wrapper.text()).toContain('坚持')
  })

  it('头像上传测试', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户', avatar: 'old-avatar.png' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })
    updateAvatarMock.mockResolvedValue({ code: 200, data: { avatar: 'new-avatar.png' } })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    // 验证头像元素存在
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('修改密码新密码少于6位时提示', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.findAll('.settings-btn')[0].trigger('click')
    const pwdInputs = wrapper.findAll('.modal-content .form-input')
    await pwdInputs[0].setValue('oldpass')
    await pwdInputs[1].setValue('123') // 新密码少于6位
    await pwdInputs[2].setValue('123')
    await wrapper.get('.modal-content .btn-primary').trigger('click')

    expect(changePasswordMock).not.toHaveBeenCalled()
    expect(window.alert).toHaveBeenCalledWith('新密码至少6位')
  })

  it('修改密码成功关闭弹窗', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '用户' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })
    changePasswordMock.mockResolvedValue({ code: 200 })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.findAll('.settings-btn')[0].trigger('click')
    const pwdInputs = wrapper.findAll('.modal-content .form-input')
    await pwdInputs[0].setValue('oldpass')
    await pwdInputs[1].setValue('newpass')
    await pwdInputs[2].setValue('newpass')
    await wrapper.get('.modal-content .btn-primary').trigger('click')
    await flushPromises()

    expect(wrapper.find('.modal-content').exists()).toBe(false)
  })

  it('保存资料失败时显示错误', async () => {
    getUserProfileMock.mockResolvedValue({ code: 200, data: { name: '旧名字', email: 'a@b.com' } })
    getUserStatsMock.mockResolvedValue({ code: 200, data: {} })
    getAchievementsMock.mockResolvedValue({ code: 200, data: [] })
    updateUserProfileMock.mockResolvedValue({ code: 400, message: '更新失败' })

    const wrapper = mount(Profile, {
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    })
    await flushPromises()

    await wrapper.get('.edit-btn').trigger('click')
    await wrapper.get('input.edit-input').setValue('新名字')
    await wrapper.get('.edit-btn').trigger('click')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith('更新失败')
  })
})
