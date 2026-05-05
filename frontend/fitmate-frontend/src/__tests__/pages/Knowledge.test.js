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
    getArticleCategoriesMock.mockResolvedValue({ code: 200, data: [{ name: '训练' }] })
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
})
