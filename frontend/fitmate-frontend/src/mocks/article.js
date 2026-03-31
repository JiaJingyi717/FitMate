// src/mocks/article.js

export function mockGetArticleList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取文章列表成功（mock）',
        data: {
          list: [
            { id: 1, title: '跑步入门指南', type: 'article', likes: 120, collects: 50 },
            { id: 2, title: '瑜伽放松视频', type: 'video', likes: 200, collects: 80 }
          ],
          total: 2
        }
      })
    }, 300)
  })
}

export function mockGetArticleDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取文章详情成功（mock）',
        data: {
          id: id,
          title: '跑步入门指南',
          content: '这是文章内容...',
          likes: 120,
          collects: 50
        }
      })
    }, 300)
  })
}

export function mockToggleArticleLike(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '点赞成功（mock）',
        data: { liked: true }
      })
    }, 300)
  })
}

export function mockToggleArticleCollect(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '收藏成功（mock）',
        data: { collected: true }
      })
    }, 300)
  })
}

export function mockGetArticleComments(id, params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取评论成功（mock）',
        data: {
          list: [
            { id: 1, content: '很好看', user: '用户1' },
            { id: 2, content: '学到了', user: '用户2' }
          ],
          total: 2
        }
      })
    }, 300)
  })
}

export function mockAddArticleComment(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '评论成功（mock）',
        data: { commentId: 3 }
      })
    }, 300)
  })
}