// src/mocks/article.js

// 模拟文章/视频列表数据
const mockArticles = [
  {
    id: 1,
    title: '如何正确进行深蹲训练',
    category: '力量训练',
    type: 'video',
    description: '深蹲是力量训练的基础动作，本教程详细讲解正确的深蹲姿势和常见错误。',
    thumbnail: '🏋️',
    videoUrl: '',
    duration: '12:30',
    views: 15234,
    likes: 892,
    commentCount: 12,
    author: '官方',
    publishDate: '2026-03-01',
    isLiked: false,
    isCollected: false
  },
  {
    id: 2,
    title: 'HIIT高强度间歇训练完整指南',
    category: '有氧运动',
    type: 'article',
    description: '了解HIIT训练的原理、好处以及如何制定适合自己的HIIT计划。',
    thumbnail: '🔥',
    videoUrl: null,
    duration: null,
    views: 8932,
    likes: 634,
    commentCount: 8,
    author: '官方',
    publishDate: '2026-03-02',
    isLiked: false,
    isCollected: false
  },
  {
    id: 3,
    title: '增肌期营养搭配建议',
    category: '营养饮食',
    type: 'article',
    description: '详细介绍增肌期间应该如何安排饮食，包括蛋白质、碳水化合物和脂肪的摄入比例。',
    thumbnail: '🥗',
    videoUrl: null,
    duration: null,
    views: 12456,
    likes: 1023,
    commentCount: 15,
    author: '官方',
    publishDate: '2026-03-03',
    isLiked: false,
    isCollected: false
  },
  {
    id: 4,
    title: '10分钟全身拉伸教程',
    category: '拉伸放松',
    type: 'video',
    description: '运动后的拉伸非常重要，跟随视频一起完成全身拉伸，缓解肌肉紧张。',
    thumbnail: '🧘',
    videoUrl: '',
    duration: '10:15',
    views: 23456,
    likes: 1567,
    commentCount: 23,
    author: '官方',
    publishDate: '2026-03-04',
    isLiked: false,
    isCollected: false
  },
  {
    id: 5,
    title: '跑步新手常见错误与预防',
    category: '有氧运动',
    type: 'video',
    description: '跑步看似简单，但错误的姿势会导致运动损伤。本视频帮你纠正常见错误。',
    thumbnail: '🏃',
    videoUrl: '',
    duration: '15:20',
    views: 18765,
    likes: 945,
    commentCount: 18,
    author: '官方',
    publishDate: '2026-03-05',
    isLiked: false,
    isCollected: false
  },
  {
    id: 6,
    title: '运动后肌肉酸痛如何缓解',
    category: '运动损伤',
    type: 'article',
    description: '了解肌肉酸痛的原因，以及如何通过正确的方法加速恢复。',
    thumbnail: '💪',
    videoUrl: null,
    duration: null,
    views: 9876,
    likes: 567,
    commentCount: 6,
    author: '官方',
    publishDate: '2026-03-06',
    isLiked: false,
    isCollected: false
  },
  {
    id: 7,
    title: '核心力量训练动作详解',
    category: '力量训练',
    type: 'video',
    description: '核心力量是所有运动的基础，学习平板支撑、俄罗斯转体等经典核心训练动作。',
    thumbnail: '🎯',
    videoUrl: '',
    duration: '18:45',
    views: 14532,
    likes: 876,
    commentCount: 11,
    author: '官方',
    publishDate: '2026-03-07',
    isLiked: false,
    isCollected: false
  },
  {
    id: 8,
    title: '减脂期饮食计划推荐',
    category: '营养饮食',
    type: 'article',
    description: '科学的减脂饮食不是节食，而是合理控制热量摄入并保证营养均衡。',
    thumbnail: '🍎',
    videoUrl: null,
    duration: null,
    views: 16789,
    likes: 1234,
    commentCount: 19,
    author: '官方',
    publishDate: '2026-03-08',
    isLiked: false,
    isCollected: false
  },
  {
    id: 9,
    title: '哑铃训练完整教程',
    category: '力量训练',
    type: 'video',
    description: '居家哑铃训练指南，涵盖胸部、背部、腿部等多个部位的训练动作。',
    thumbnail: '🏆',
    videoUrl: '',
    duration: '25:00',
    views: 19876,
    likes: 1432,
    commentCount: 25,
    author: '官方',
    publishDate: '2026-03-09',
    isLiked: false,
    isCollected: false
  },
  {
    id: 10,
    title: '办公室白领健身指南',
    category: '拉伸放松',
    type: 'article',
    description: '长时间久坐导致的颈椎、腰椎问题如何通过简单运动改善。',
    thumbnail: '💻',
    videoUrl: null,
    duration: null,
    views: 11234,
    likes: 789,
    commentCount: 14,
    author: '官方',
    publishDate: '2026-03-10',
    isLiked: false,
    isCollected: false
  }
]

// 模拟文章详情数据
const mockArticleDetails = {
  1: {
    id: 1,
    title: '如何正确进行深蹲训练',
    category: '力量训练',
    type: 'video',
    description: '深蹲是力量训练的基础动作，本教程详细讲解正确的深蹲姿势和常见错误。',
    thumbnail: '🏋️',
    content: '',
    videoUrl: 'https://example.com/videos/squat.mp4',
    duration: '12:30',
    views: 15234,
    likes: 892,
    commentCount: 12,
    author: '官方',
    publishDate: '2026-03-01',
    tags: ['深蹲', '力量训练', '健身入门', '腿部训练'],
    isLiked: false,
    isCollected: false,
    relatedArticles: [
      { id: 7, title: '核心力量训练动作详解', thumbnail: '🎯', category: '力量训练' },
      { id: 2, title: 'HIIT高强度间歇训练完整指南', thumbnail: '🔥', category: '有氧运动' },
      { id: 4, title: '10分钟全身拉伸教程', thumbnail: '🧘', category: '拉伸放松' }
    ]
  },
  2: {
    id: 2,
    title: 'HIIT高强度间歇训练完整指南',
    category: '有氧运动',
    type: 'article',
    description: '了解HIIT训练的原理、好处以及如何制定适合自己的HIIT计划。',
    thumbnail: '🔥',
    content: `# HIIT高强度间歇训练完整指南

## 什么是HIIT？

HIIT（High-Intensity Interval Training）即高强度间歇训练，是一种在短时间内进行高强度运动和低强度恢复交替进行的训练方式。

## HIIT的好处

- **节省时间**：每次训练只需15-30分钟
- **燃脂效果好**：训练后持续燃脂可达24小时
- **提高心肺功能**：有效提升心肺耐力
- **无需器械**：可以徒手完成

## 如何制定HIIT计划

### 初学者建议

- 运动时间：20秒
- 休息时间：40秒
- 循环次数：4-6组

### 有基础者建议

- 运动时间：30秒
- 休息时间：30秒
- 循环次数：8-10组

## 注意事项

1. 训练前充分热身
2. 动作质量比数量更重要
3. 循序渐进增加强度
4. 给身体足够的恢复时间`,
    videoUrl: null,
    duration: null,
    views: 8932,
    likes: 634,
    commentCount: 8,
    author: '官方',
    publishDate: '2026-03-02',
    tags: ['HIIT', '有氧运动', '高强度训练', '减脂'],
    isLiked: false,
    isCollected: false,
    relatedArticles: [
      { id: 5, title: '跑步新手常见错误与预防', thumbnail: '🏃', category: '有氧运动' },
      { id: 8, title: '减脂期饮食计划推荐', thumbnail: '🍎', category: '营养饮食' },
      { id: 1, title: '如何正确进行深蹲训练', thumbnail: '🏋️', category: '力量训练' }
    ]
  },
  3: {
    id: 3,
    title: '增肌期营养搭配建议',
    category: '营养饮食',
    type: 'article',
    description: '详细介绍增肌期间应该如何安排饮食，包括蛋白质、碳水化合物和脂肪的摄入比例。',
    thumbnail: '🥗',
    content: `# 增肌期营养搭配建议

## 基础原理

增肌的核心是热量盈余，即摄入的热量要大于消耗的热量。

## 三大营养素比例

### 蛋白质
- 建议摄入量：每公斤体重1.6-2.2克
- 推荐食物：鸡胸肉、牛肉、鱼虾、鸡蛋、豆腐

### 碳水化合物
- 建议摄入量：每公斤体重4-6克
- 推荐食物：米饭、面条、红薯、燕麦

### 脂肪
- 建议摄入量：每公斤体重0.8-1.2克
- 推荐食物：坚果、橄榄油、牛油果

## 饮食建议

1. **少食多餐**：每天5-6餐
2. **训练前后补充**：训练前摄入碳水，训练后补充蛋白质
3. **充足睡眠**：每天7-9小时`,
    videoUrl: null,
    duration: null,
    views: 12456,
    likes: 1023,
    commentCount: 15,
    author: '官方',
    publishDate: '2026-03-03',
    tags: ['增肌', '营养饮食', '蛋白质', '健身饮食'],
    isLiked: false,
    isCollected: false,
    relatedArticles: [
      { id: 8, title: '减脂期饮食计划推荐', thumbnail: '🍎', category: '营养饮食' },
      { id: 1, title: '如何正确进行深蹲训练', thumbnail: '🏋️', category: '力量训练' },
      { id: 7, title: '核心力量训练动作详解', thumbnail: '🎯', category: '力量训练' }
    ]
  }
}

// 模拟评论数据
const mockComments = {
  1: [
    { id: 1, userId: 101, username: '健身达人', avatar: '', content: '讲解非常详细，对我帮助很大！', likes: 23, createdAt: '2026-03-01T14:30:00', date: '2天前' },
    { id: 2, userId: 102, username: '运动新手', avatar: '', content: '终于知道深蹲的正确姿势了，谢谢！', likes: 15, createdAt: '2026-03-01T16:45:00', date: '2天前' },
    { id: 3, userId: 103, username: '肌肉狂人', avatar: '', content: '建议配合哑铃一起训练效果更好', likes: 8, createdAt: '2026-03-02T09:20:00', date: '1天前' }
  ],
  2: [
    { id: 4, userId: 104, username: '减脂战士', avatar: '', content: 'HIIT真的很有效果，我已经瘦了5斤！', likes: 31, createdAt: '2026-03-02T11:00:00', date: '1天前' },
    { id: 5, userId: 105, username: '健康生活', avatar: '', content: '请问初学者每天做几组合适？', likes: 12, createdAt: '2026-03-02T15:30:00', date: '1天前' }
  ],
  3: [
    { id: 6, userId: 106, username: '营养师小王', avatar: '', content: '蛋白质摄入量建议很科学', likes: 18, createdAt: '2026-03-03T10:00:00', date: '5小时前' }
  ]
}

// 获取文章列表
export function mockGetArticleList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let list = [...mockArticles]

      // 分类筛选
      if (params.category && params.category !== '全部') {
        list = list.filter(item => item.category === params.category)
      }

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        list = list.filter(item =>
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
        )
      }

      // 类型筛选
      if (params.type) {
        list = list.filter(item => item.type === params.type)
      }

      resolve({
        code: 200,
        message: '获取文章列表成功',
        data: list
      })
    }, 300)
  })
}

// 获取文章详情
export function mockGetArticleDetail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const article = mockArticleDetails[id] || mockArticles.find(item => item.id === parseInt(id))
      if (article) {
        resolve({
          code: 200,
          message: '获取文章详情成功',
          data: article
        })
      } else {
        resolve({
          code: 404,
          message: '文章不存在',
          data: null
        })
      }
    }, 300)
  })
}

// 点赞/取消点赞
export function mockToggleArticleLike(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = mockArticles.find(item => item.id === parseInt(id))
      if (article) {
        article.isLiked = !article.isLiked
        article.likes += article.isLiked ? 1 : -1
      }
      resolve({
        code: 200,
        message: article?.isLiked ? '点赞成功' : '取消点赞成功',
        data: {
          likeCount: article?.likes || 0,
          isLiked: article?.isLiked || false
        }
      })
    }, 200)
  })
}

// 收藏/取消收藏
export function mockToggleArticleCollect(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = mockArticles.find(item => item.id === parseInt(id))
      if (article) {
        article.isCollected = !article.isCollected
      }
      resolve({
        code: 200,
        message: article?.isCollected ? '收藏成功' : '取消收藏成功',
        data: {
          collectCount: 50, // 模拟收藏数
          isCollected: article?.isCollected || false
        }
      })
    }, 200)
  })
}

// 获取评论列表
export function mockGetArticleComments(id, params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const comments = mockComments[id] || []
      const page = params?.page || 1
      const pageSize = params?.pageSize || 20
      const start = (page - 1) * pageSize
      const end = start + pageSize

      resolve({
        code: 200,
        message: '获取评论成功',
        data: {
          comments: comments.slice(start, end),
          total: comments.length,
          page: page,
          pageSize: pageSize
        }
      })
    }, 300)
  })
}

// 发表评论
export function mockAddArticleComment(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment = {
        id: Date.now(),
        userId: 1,
        username: '当前用户',
        avatar: '',
        content: data.content,
        likes: 0,
        createdAt: new Date().toISOString(),
        date: '刚刚'
      }

      if (!mockComments[id]) {
        mockComments[id] = []
      }
      mockComments[id].unshift(newComment)

      resolve({
        code: 200,
        message: '评论成功',
        data: {
          commentId: newComment.id
        }
      })
    }, 300)
  })
}

// 获取我的收藏列表
export function mockGetMyCollections() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const collected = mockArticles.filter(item => item.isCollected)
      resolve({
        code: 200,
        message: '获取收藏列表成功',
        data: collected
      })
    }, 300)
  })
}

// 获取分类列表
export function mockGetArticleCategories() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [
        { name: '力量训练', count: 3 },
        { name: '有氧运动', count: 2 },
        { name: '营养饮食', count: 2 },
        { name: '拉伸放松', count: 2 },
        { name: '运动损伤', count: 1 }
      ]
      resolve({
        code: 200,
        message: '获取分类列表成功',
        data: categories
      })
    }, 200)
  })
}
