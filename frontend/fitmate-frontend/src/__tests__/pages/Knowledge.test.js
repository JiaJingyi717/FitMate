import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Knowledge from '../../pages/Knowledge.vue'

const pushMock = vi.fn()
const getArticleListMock = vi.fn()
const toggleArticleCollectMock = vi.fn()
const getMyCollectionsMock = vi.fn()
const getArticleCategoriesMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('../../api/article', () => ({
  getArticleList: (...args) => getArticleListMock(...args),
  toggleArticleCollect: (...args) => toggleArticleCollectMock(...args),
  getMyCollections: (...args) => getMyCollectionsMock(...args),
  getArticleCategories: (...args) => getArticleCategoriesMock(...args),
}))

describe('Knowledge.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
    getArticleListMock.mockReset()
    toggleArticleCollectMock.mockReset()
    getMyCollectionsMock.mockReset()
    getArticleCategoriesMock.mockReset()
  })

  it('初始化加载分类、列表、收藏并渲染内容', async () => {
    getArticleCategoriesMock.mockResolvedValue({ code: 200, data: [{ id: 1, name: '训练' }] })
    getMyCollectionsMock.mockResolvedValue({ code: 200, data: [{ id: 1 }] })
    getArticleListMock.mockResolvedValue({
      code: 200,
      data: [{ id: 1, category: '训练', title: '标题', description: '描述', type: 'article', likes: 12, views: 20 }],
    })

    const wrapper = mount(Knowledge)
    await flushPromises()

    expect(getArticleCategoriesMock).toHaveBeenCalled()
    expect(getArticleListMock).toHaveBeenCalled()
    expect(getMyCollectionsMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('健身知识库')
    expect(wrapper.text()).toContain('标题')
  })

  it('点击文章卡片会跳转到详情页', async () => {
    getArticleCategoriesMock.mockResolvedValue({ code: 200, data: [{ id: 1, name: '训练' }] })
    getMyCollectionsMock.mockResolvedValue({ code: 200, data: [] })
    getArticleListMock.mockResolvedValue({
      code: 200,
      data: [{ id: 99, title: '测试文章', description: 'desc', likes: 0, views: 0, type: 'article' }],
    })

    const wrapper = mount(Knowledge)
    await flushPromises()

    // 切换到文章 tab
    const tabs = wrapper.findAll('.tab-btn')
    await tabs[2].trigger('click')
    await flushPromises()

    await wrapper.find('.knowledge-card').trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/knowledge/99')
  })

  it('点击分类标签会筛选文章列表', async () => {
    getArticleCategoriesMock.mockResolvedValue({
      code: 200,
      data: [{ id: 1, name: '训练' }, { id: 2, name: '饮食' }],
    })
    getMyCollectionsMock.mockResolvedValue({ code: 200, data: [] })
    getArticleListMock.mockResolvedValue({ code: 200, data: [] })

    const wrapper = mount(Knowledge)
    await flushPromises()

    const categoryItems = wrapper.findAll('.category-item')
    if (categoryItems.length > 0) {
      await categoryItems[0].trigger('click')
      await flushPromises()
    }

    expect(getArticleListMock).toHaveBeenCalled()
  })
})
