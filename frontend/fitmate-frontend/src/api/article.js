// src/api/article.js
import request from './request'
import { 
  mockGetArticleList, 
  mockGetArticleDetail, 
  mockToggleArticleLike, 
  mockToggleArticleCollect, 
  mockGetArticleComments, 
  mockAddArticleComment,
  mockGetMyCollections,
  mockGetArticleCategories
} from '../mocks/article.js'

// 开关（非常重要）
const USE_MOCK = false

// 获取文章/视频列表
export function getArticleList(params) {
  if (USE_MOCK) {
    return mockGetArticleList(params)
  }
  return request({
    url: '/api/articles',
    method: 'get',
    params
  })
}

// 获取详情
export function getArticleDetail(id) {
  if (USE_MOCK) {
    return mockGetArticleDetail(id)
  }
  return request({
    url: `/api/articles/${id}`,
    method: 'get'
  })
}

// 点赞
export function toggleArticleLike(id) {
  if (USE_MOCK) {
    return mockToggleArticleLike(id)
  }
  return request({
    url: `/api/articles/${id}/like`,
    method: 'post'
  })
}

// 收藏
export function toggleArticleCollect(id) {
  if (USE_MOCK) {
    return mockToggleArticleCollect(id)
  }
  return request({
    url: `/api/articles/${id}/collect`,
    method: 'post'
  })
}

// 获取评论列表
export function getArticleComments(id, params) {
  if (USE_MOCK) {
    return mockGetArticleComments(id, params)
  }
  return request({
    url: `/api/articles/${id}/comments`,
    method: 'get',
    params
  })
}

// 发表评论
export function addArticleComment(id, data) {
  if (USE_MOCK) {
    return mockAddArticleComment(id, data)
  }
  return request({
    url: `/api/articles/${id}/comments`,
    method: 'post',
    data
  })
}

// 获取我的收藏列表
export function getMyCollections() {
  if (USE_MOCK) {
    return mockGetMyCollections()
  }
  return request({
    url: '/api/articles/collections',
    method: 'get'
  })
}

// 获取分类
export function getArticleCategories() {
  if (USE_MOCK) {
    return mockGetArticleCategories()
  }
  return request({
    url: '/api/articles/categories',
    method: 'get'
  })
}
