<template>
  <div class="detail-page">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack">
      <span>←</span> 返回知识库
    </button>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 文章内容 -->
      <div class="content-area">
        <!-- 文章头部 -->
        <div class="article-header">
          <span :class="['type-badge', article.type === 'video' ? 'video' : 'article']">
            {{ article.type === 'video' ? '🎬 视频教程' : '📝 文章' }}
          </span>

          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-desc">{{ article.description }}</p>

          <!-- 元信息 -->
          <div class="meta-info">
            <span class="meta-item">📅 {{ article.publishDate }}</span>
            <span class="meta-item">👁️ {{ formatNumber(article.views) }} 浏览</span>
            <span class="meta-item">❤️ {{ formatNumber(article.likes) }} 点赞</span>
            <span v-if="article.duration" class="meta-item">⏱️ {{ article.duration }}</span>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button
              :class="['action-btn', { active: isLiked }]"
              @click="handleLike"
            >
              {{ isLiked ? '❤️ 已点赞' : '🤍 点赞' }}
            </button>
            <button
              :class="['action-btn', { active: isCollected }]"
              @click="handleCollect"
            >
              {{ isCollected ? '⭐ 已收藏' : '☆ 收藏' }}
            </button>
            <button class="action-btn">
              📤 分享
            </button>
          </div>
        </div>

        <!-- 视频播放器 -->
        <div v-if="article.type === 'video'" class="video-player">
          <div class="video-placeholder">
            <span class="video-emoji">{{ article.thumbnail }}</span>
            <div class="play-overlay">
              <span class="play-btn">▶️</span>
            </div>
          </div>
          <div class="video-info">
            <h3>视频简介</h3>
            <p>{{ article.description }}</p>
            <div class="video-tip">
              <p>💡 <strong>提示：</strong>建议使用全屏模式观看以获得最佳体验。</p>
            </div>
          </div>
        </div>

        <!-- 文章正文 -->
        <div v-else class="article-content">
          <div class="content-body" v-html="renderedContent"></div>
        </div>

        <!-- 标签 -->
        <div v-if="article.tags && article.tags.length > 0" class="tags-section">
          <span class="section-title">相关标签：</span>
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <!-- 评论区域 -->
        <div class="comments-section">
          <h3 class="section-title">
            💬 评论 ({{ commentsTotal || comments.length }})
          </h3>

          <!-- 评论输入 -->
          <div class="comment-input">
            <textarea
              v-model="newComment"
              class="comment-textarea"
              placeholder="写下你的评论..."
              rows="3"
            ></textarea>
            <button class="submit-comment-btn" @click="submitComment">
              发表评论
            </button>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <span class="comment-avatar">{{ comment.avatar || '👤' }}</span>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.username }}</span>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <button class="comment-like-btn">
                  👍 {{ comment.likes }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 分类卡片 -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">分类</h3>
          <span class="category-badge">{{ article.category }}</span>
        </div>

        <!-- 相关推荐 -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">相关推荐</h3>
          <div class="related-list">
            <div
              v-for="item in relatedArticles"
              :key="item.id"
              class="related-item"
              @click="goToDetail(item.id)"
            >
              <span class="related-thumb">{{ item.thumbnail }}</span>
              <div class="related-info">
                <h4 class="related-title">{{ item.title }}</h4>
                <span class="related-category">{{ item.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getArticleDetail, toggleArticleLike, toggleArticleCollect, getArticleComments, addArticleComment } from '../api/article'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const article = reactive({
  id: null,
  title: '',
  category: '',
  type: 'article',
  description: '',
  content: '',
  thumbnail: '',
  duration: '',
  views: 0,
  likes: 0,
  commentCount: 0,
  publishDate: '',
  tags: [],
  videoUrl: '',
  author: ''
})
const isLiked = ref(false)
const isCollected = ref(false)
const comments = ref([])
const newComment = ref('')
const relatedArticles = ref([])
const commentsTotal = ref(0)

// 计算属性
const renderedContent = computed(() => {
  if (!article.content) return ''
  return article.content
    .split('\n')
    .map(line => {
      if (line.startsWith('# ')) {
        return `<h1 class="content-h1">${line.slice(2)}</h1>`
      } else if (line.startsWith('## ')) {
        return `<h2 class="content-h2">${line.slice(3)}</h2>`
      } else if (line.startsWith('### ')) {
        return `<h3 class="content-h3">${line.slice(4)}</h3>`
      } else if (line.startsWith('- ')) {
        return `<li class="content-li">${line.slice(2)}</li>`
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return `<p class="content-bold">${line.slice(2, -2)}</p>`
      } else if (line.trim() === '') {
        return ''
      } else {
        return `<p class="content-p">${line}</p>`
      }
    })
    .join('')
})

// 方法
function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function goBack() {
  router.push('/knowledge')
}

function goToDetail(id) {
  router.push(`/knowledge/${id}`)
}

async function handleLike() {
  try {
    const res = await toggleArticleLike(article.id)
    if (res.code === 200) {
      isLiked.value = res.data.isLiked
      article.likes = res.data.likeCount
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

async function handleCollect() {
  try {
    const res = await toggleArticleCollect(article.id)
    if (res.code === 200) {
      isCollected.value = res.data.isCollected
    }
  } catch (error) {
    console.error('收藏失败:', error)
  }
}

async function submitComment() {
  if (!newComment.value.trim()) {
    alert('请输入评论内容')
    return
  }

  try {
    const res = await addArticleComment(article.id, {
      content: newComment.value
    })
    if (res.code === 200) {
      comments.value.unshift({
        id: res.data.commentId,
        username: '当前用户',
        avatar: '',
        content: newComment.value,
        likes: 0,
        date: '刚刚'
      })
      article.commentCount += 1
      newComment.value = ''
      alert('评论成功')
    }
  } catch (error) {
    console.error('评论失败:', error)
    alert('评论失败')
  }
}

async function loadArticleDetail() {
  loading.value = true
  try {
    const res = await getArticleDetail(route.params.id)
    if (res.code === 200 && res.data) {
      Object.assign(article, res.data)
      isLiked.value = res.data.isLiked || false
      isCollected.value = res.data.isCollected || false

      // 加载相关推荐
      if (res.data.relatedArticles) {
        relatedArticles.value = res.data.relatedArticles
      }

      // 加载评论
      await loadComments()
    }
  } catch (error) {
    console.error('加载文章详情失败:', error)
  } finally {
    loading.value = false
  }
}

async function loadComments() {
  try {
    const res = await getArticleComments(route.params.id, { page: 1, pageSize: 20 })
    if (res.code === 200 && res.data) {
      // 兼容不同的响应格式
      if (Array.isArray(res.data)) {
        comments.value = res.data
      } else if (res.data.comments) {
        comments.value = res.data.comments
        commentsTotal.value = res.data.total || 0
      } else if (res.data.list) {
        comments.value = res.data.list
        commentsTotal.value = res.data.total || 0
      }
    }
  } catch (error) {
    console.error('加载评论失败:', error)
  }
}

// 监听路由变化
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadArticleDetail()
  }
})

// 初始化
onMounted(() => {
  loadArticleDetail()
})
</script>

<style scoped>
/* 基础布局 */
.detail-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 返回按钮 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

/* 主内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

/* 文章区域 */
.content-area {
  min-width: 0;
}

.article-header {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.type-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
}

.type-badge.video {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  color: white;
}

.type-badge.article {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.article-desc {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.meta-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #6b7280;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding-top: 20px;
}

.action-btn {
  padding: 10px 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.action-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* 视频播放器 */
.video-player {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.video-placeholder {
  position: relative;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-emoji {
  font-size: 120px;
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.play-btn {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.play-btn:hover {
  transform: scale(1.1);
}

.video-info {
  padding: 24px;
}

.video-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.video-info p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.video-tip {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 16px;
}

.video-tip p {
  margin: 0;
  font-size: 14px;
  color: #1e40af;
}

/* 文章内容 */
.article-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.content-body {
  color: #374151;
  line-height: 1.8;
}

.content-body :deep(.content-h1) {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 32px 0 16px 0;
}

.content-body :deep(.content-h2) {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin: 24px 0 12px 0;
}

.content-body :deep(.content-h3) {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 20px 0 8px 0;
}

.content-body :deep(.content-p) {
  margin: 12px 0;
}

.content-body :deep(.content-li) {
  margin: 8px 0 8px 24px;
  list-style: disc;
}

.content-body :deep(.content-bold) {
  font-weight: 600;
  color: #1f2937;
}

/* 标签 */
.tags-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.tag {
  padding: 6px 14px;
  background: #f3f4f6;
  border-radius: 16px;
  font-size: 13px;
  color: #4b5563;
}

/* 评论区域 */
.comments-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comments-section .section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
  display: block;
}

.comment-input {
  margin-bottom: 24px;
}

.comment-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
}

.comment-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.submit-comment-btn {
  margin-top: 12px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-comment-btn:hover {
  opacity: 0.9;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.comment-avatar {
  font-size: 32px;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.comment-date {
  font-size: 12px;
  color: #9ca3af;
}

.comment-text {
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.comment-like-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.comment-like-btn:hover {
  background: #e5e7eb;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.category-badge {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.related-item:hover {
  background: #f3f4f6;
}

.related-thumb {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.related-info {
  flex: 1;
  min-width: 0;
}

.related-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.related-item:hover .related-title {
  color: #3b82f6;
}

.related-category {
  font-size: 12px;
  color: #9ca3af;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .sidebar-card {
    flex: 1;
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .detail-page {
    padding: 16px;
  }

  .article-header {
    padding: 20px;
  }

  .article-title {
    font-size: 24px;
  }

  .meta-info {
    flex-direction: column;
    gap: 8px;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
    justify-content: center;
  }

  .article-content,
  .video-info,
  .comments-section {
    padding: 20px;
  }

  .sidebar {
    flex-direction: column;
  }

  .sidebar-card {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .article-title {
    font-size: 20px;
  }

  .content-body :deep(.content-h1) {
    font-size: 22px;
  }

  .content-body :deep(.content-h2) {
    font-size: 18px;
  }

  .action-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
