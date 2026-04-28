import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import KnowledgeDetail from '../../pages/KnowledgeDetail.vue'

const pushMock = vi.fn()
const getArticleDetailMock = vi.fn()
const toggleArticleLikeMock = vi.fn()
const toggleArticleCollectMock = vi.fn()
const getArticleCommentsMock = vi.fn()
const addArticleCommentMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ params: { id: 1 } }),
}))

vi.mock('../../api/article', () => ({
  getArticleDetail: (...args) => getArticleDetailMock(...args),
  toggleArticleLike: (...args) => toggleArticleLikeMock(...args),
  toggleArticleCollect: (...args) => toggleArticleCollectMock(...args),
  getArticleComments: (...args) => getArticleCommentsMock(...args),
  addArticleComment: (...args) => addArticleCommentMock(...args),
}))

describe('KnowledgeDetail.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
    getArticleDetailMock.mockReset()
    toggleArticleLikeMock.mockReset()
    toggleArticleCollectMock.mockReset()
    getArticleCommentsMock.mockReset()
    addArticleCommentMock.mockReset()
    window.alert = vi.fn()
  })

  it('初始化加载详情与评论', async () => {
    getArticleDetailMock.mockResolvedValue({
      code: 200,
      data: {
        id: 1,
        title: '深蹲教学',
        category: '力量',
        description: 'desc',
        content: '# 标题',
        likes: 3,
        relatedArticles: [],
      },
    })
    getArticleCommentsMock.mockResolvedValue({ code: 200, data: [{ id: 1, username: 'u', date: '今天', content: '不错' }] })

    const wrapper = mount(KnowledgeDetail)
    await flushPromises()

    expect(getArticleDetailMock).toHaveBeenCalledWith(1)
    expect(getArticleCommentsMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('深蹲教学')
    expect(wrapper.text()).toContain('不错')
  })

  it('点赞和收藏操作成功会更新页面状态', async () => {
    getArticleDetailMock.mockResolvedValue({
      code: 200,
      data: { id: 1, title: '深蹲教学', content: '内容', likes: 3, relatedArticles: [] },
    })
    getArticleCommentsMock.mockResolvedValue({ code: 200, data: [] })
    toggleArticleLikeMock.mockResolvedValue({ code: 200, data: { isLiked: true, likeCount: 9 } })
    toggleArticleCollectMock.mockResolvedValue({ code: 200, data: { isCollected: true } })

    const wrapper = mount(KnowledgeDetail)
    await flushPromises()

    const actionBtns = wrapper.findAll('.action-btn')
    await actionBtns[0].trigger('click')
    await actionBtns[1].trigger('click')
    await flushPromises()

    expect(toggleArticleLikeMock).toHaveBeenCalledWith(1)
    expect(toggleArticleCollectMock).toHaveBeenCalledWith(1)
    expect(wrapper.text()).toContain('已点赞')
    expect(wrapper.text()).toContain('已收藏')
  })

  it('空评论会提示，评论成功会追加到列表', async () => {
    getArticleDetailMock.mockResolvedValue({
      code: 200,
      data: { id: 1, title: '深蹲教学', content: '内容', likes: 3, relatedArticles: [] },
    })
    getArticleCommentsMock.mockResolvedValue({ code: 200, data: [] })
    addArticleCommentMock.mockResolvedValue({ code: 200, data: { commentId: 101 } })

    const wrapper = mount(KnowledgeDetail)
    await flushPromises()

    await wrapper.get('.submit-comment-btn').trigger('click')
    expect(window.alert).toHaveBeenCalledWith('请输入评论内容')

    await wrapper.get('.comment-textarea').setValue('很实用')
    await wrapper.get('.submit-comment-btn').trigger('click')
    await flushPromises()

    expect(addArticleCommentMock).toHaveBeenCalledWith(1, { content: '很实用' })
    expect(wrapper.text()).toContain('当前用户')
    expect(wrapper.text()).toContain('很实用')
  })
})
