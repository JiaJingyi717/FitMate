import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '../../api/request'
import {
  addArticleComment,
  getArticleCategories,
  getArticleComments,
  getArticleDetail,
  getArticleList,
  getMyCollections,
  toggleArticleCollect,
  toggleArticleLike,
} from '../../api/article'

vi.mock('../../api/request', () => ({
  default: vi.fn(),
}))

describe('api/article.js', () => {
  beforeEach(() => {
    request.mockReset()
  })

  it('列表与详情接口路径正确', () => {
    getArticleList({ category: '训练' })
    getArticleDetail(101)
    expect(request).toHaveBeenNthCalledWith(1, {
      url: '/api/articles',
      method: 'get',
      params: { category: '训练' },
    })
    expect(request).toHaveBeenNthCalledWith(2, { url: '/api/articles/101', method: 'get' })
  })

  it('点赞收藏与评论接口路径正确', () => {
    toggleArticleLike(9)
    toggleArticleCollect(9)
    getArticleComments(9, { page: 1 })
    addArticleComment(9, { content: '很好' })

    expect(request).toHaveBeenNthCalledWith(1, { url: '/api/articles/9/like', method: 'post' })
    expect(request).toHaveBeenNthCalledWith(2, { url: '/api/articles/9/collect', method: 'post' })
    expect(request).toHaveBeenNthCalledWith(3, {
      url: '/api/articles/9/comments',
      method: 'get',
      params: { page: 1 },
    })
    expect(request).toHaveBeenNthCalledWith(4, {
      url: '/api/articles/9/comments',
      method: 'post',
      data: { content: '很好' },
    })
  })

  it('收藏列表和分类接口路径正确', () => {
    getMyCollections()
    getArticleCategories()
    expect(request).toHaveBeenNthCalledWith(1, { url: '/api/articles/collections', method: 'get' })
    expect(request).toHaveBeenNthCalledWith(2, { url: '/api/articles/categories', method: 'get' })
  })
})
