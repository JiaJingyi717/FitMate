<template>
  <div class="knowledge-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">健身知识库</h1>
      <p class="page-subtitle">学习专业的健身知识，让训练更科学有效</p>
    </div>

    <!-- Search Bar -->
    <div class="search-card">
      <div class="search-wrapper">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索健身知识、训练教程..."
        />
      </div>
    </div>

    <!-- Categories -->
    <div class="categories">
      <button
        v-for="category in categories"
        :key="category"
        class="category-btn"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <!-- Content Tabs -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <span v-if="tab.icon" v-html="tab.icon"></span>
          {{ tab.label }}
          <span v-if="tab.value === 'bookmarked' && bookmarkedItems.length > 0" class="tab-badge">
            {{ bookmarkedItems.length }}
          </span>
        </button>
      </div>

      <!-- All Content -->
      <div v-show="activeTab === 'all'" class="tab-content">
        <div class="cards-grid">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="knowledge-card"
            @click="goToDetail(item.id)"
          >
            <div class="card-thumbnail" :style="{ background: getGradient(item.category) }">
              <span class="thumbnail-emoji">{{ item.thumbnail }}</span>
              <div v-if="item.type === '视频'" class="play-overlay">
                <div class="play-btn">▶</div>
              </div>
              <span class="type-badge">{{ item.type }}</span>
              <span v-if="item.duration" class="duration-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ item.duration }}
              </span>
              <div class="bookmark-icon" @click.stop="toggleBookmark(item.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" :fill="bookmarkedItems.includes(item.id) ? '#2563eb' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <span class="category-tag">{{ item.category }}</span>
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              <div class="card-stats">
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ formatNumber(item.views) }}
                </span>
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {{ formatNumber(item.likes) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Tab -->
      <div v-show="activeTab === 'video'" class="tab-content">
        <div class="cards-grid">
          <div
            v-for="item in filteredVideoItems"
            :key="item.id"
            class="knowledge-card"
            @click="goToDetail(item.id)"
          >
            <div class="card-thumbnail" :style="{ background: getGradient(item.category) }">
              <span class="thumbnail-emoji">{{ item.thumbnail }}</span>
              <div class="play-overlay">
                <div class="play-btn">▶</div>
              </div>
              <span class="type-badge">视频</span>
              <span v-if="item.duration" class="duration-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ item.duration }}
              </span>
              <div class="bookmark-icon" @click.stop="toggleBookmark(item.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" :fill="bookmarkedItems.includes(item.id) ? '#2563eb' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <span class="category-tag">{{ item.category }}</span>
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              <div class="card-stats">
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ formatNumber(item.views) }}
                </span>
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {{ formatNumber(item.likes) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Tab -->
      <div v-show="activeTab === 'article'" class="tab-content">
        <div class="cards-grid">
          <div
            v-for="item in filteredArticleItems"
            :key="item.id"
            class="knowledge-card"
            @click="goToDetail(item.id)"
          >
            <div class="card-thumbnail" :style="{ background: getGradient(item.category) }">
              <span class="thumbnail-emoji">{{ item.thumbnail }}</span>
              <span class="type-badge">文章</span>
              <div class="bookmark-icon" @click.stop="toggleBookmark(item.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" :fill="bookmarkedItems.includes(item.id) ? '#2563eb' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <span class="category-tag">{{ item.category }}</span>
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              <div class="card-stats">
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ formatNumber(item.views) }}
                </span>
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {{ formatNumber(item.likes) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookmarked Tab -->
      <div v-show="activeTab === 'bookmarked'" class="tab-content">
        <div v-if="bookmarkedItems.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>还没有收藏内容</h3>
          <p>点击内容卡片上的收藏图标，将喜欢的内容添加到收藏夹</p>
        </div>
        <div v-else class="cards-grid">
          <div
            v-for="item in filteredBookmarkedItems"
            :key="item.id"
            class="knowledge-card"
            @click="goToDetail(item.id)"
          >
            <div class="card-thumbnail" :style="{ background: getGradient(item.category) }">
              <span class="thumbnail-emoji">{{ item.thumbnail }}</span>
              <div v-if="item.type === '视频'" class="play-overlay">
                <div class="play-btn">▶</div>
              </div>
              <span class="type-badge">{{ item.type }}</span>
              <span v-if="item.duration" class="duration-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ item.duration }}
              </span>
              <div class="bookmark-icon" @click.stop="toggleBookmark(item.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" :fill="bookmarkedItems.includes(item.id) ? '#2563eb' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <span class="category-tag">{{ item.category }}</span>
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              <div class="card-stats">
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ formatNumber(item.views) }}
                </span>
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {{ formatNumber(item.likes) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('全部')
const activeTab = ref('all')
const bookmarkedItems = ref([1, 3])

const categories = ['全部', '力量训练', '有氧运动', '营养饮食', '拉伸放松', '运动损伤']

const tabs = [
  { value: 'all', label: '全部内容' },
  { value: 'video', label: '视频教程' },
  { value: 'article', label: '文章资讯' },
  { value: 'bookmarked', label: '我的收藏', icon: '📚' }
]

const knowledgeItems = ref([
  {
    id: 1,
    title: '如何正确进行深蹲训练',
    category: '力量训练',
    type: '视频',
    description: '深蹲是力量训练的基础动作，本教程详细讲解正确的深蹲姿势和常见错误。',
    duration: '12:30',
    views: 15234,
    likes: 892,
    thumbnail: '🏋️'
  },
  {
    id: 2,
    title: 'HIIT高强度间歇训练完整指南',
    category: '有氧运动',
    type: '文章',
    description: '了解HIIT训练的原理、好处以及如何制定适合自己的HIIT计划。',
    views: 8932,
    likes: 634,
    thumbnail: '🔥'
  },
  {
    id: 3,
    title: '增肌期营养搭配建议',
    category: '营养饮食',
    type: '文章',
    description: '详细介绍增肌期间应该如何安排饮食，包括蛋白质、碳水化合物和脂肪的摄入比例。',
    views: 12456,
    likes: 1023,
    thumbnail: '🥗'
  },
  {
    id: 4,
    title: '10分钟全身拉伸教程',
    category: '拉伸放松',
    type: '视频',
    description: '运动后的拉伸非常重要，跟随视频一起完成全身拉伸，缓解肌肉紧张。',
    duration: '10:15',
    views: 23456,
    likes: 1567,
    thumbnail: '🧘'
  },
  {
    id: 5,
    title: '跑步新手常见错误与预防',
    category: '有氧运动',
    type: '视频',
    description: '跑步看似简单，但错误的姿势会导致运动损伤。本视频帮你纠正常见错误。',
    duration: '15:20',
    views: 18765,
    likes: 945,
    thumbnail: '🏃'
  },
  {
    id: 6,
    title: '运动后肌肉酸痛如何缓解',
    category: '运动损伤',
    type: '文章',
    description: '了解肌肉酸痛的原因，以及如何通过正确的方法加速恢复。',
    views: 9876,
    likes: 567,
    thumbnail: '💪'
  },
  {
    id: 7,
    title: '核心力量训练动作详解',
    category: '力量训练',
    type: '视频',
    description: '核心力量是所有运动的基础，学习平板支撑、俄罗斯转体等经典核心训练动作。',
    duration: '18:45',
    views: 14532,
    likes: 876,
    thumbnail: '🎯'
  },
  {
    id: 8,
    title: '减脂期饮食计划推荐',
    category: '营养饮食',
    type: '文章',
    description: '科学的减脂饮食不是节食，而是合理控制热量摄入并保证营养均衡。',
    views: 16789,
    likes: 1234,
    thumbnail: '🍎'
  }
])

const gradients = [
  'linear-gradient(135deg, #eff6ff, #ecfeff)',
  'linear-gradient(135deg, #fef3c7, #fef9c3)',
  'linear-gradient(135deg, #dcfce7, #d1fae5)',
  'linear-gradient(135deg, #fce7f3, #fdf2f8)'
]

const getGradient = (category) => {
  const index = categories.indexOf(category) % gradients.length
  return gradients[index]
}

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const toggleBookmark = (id) => {
  if (bookmarkedItems.value.includes(id)) {
    bookmarkedItems.value = bookmarkedItems.value.filter(item => item !== id)
  } else {
    bookmarkedItems.value.push(id)
  }
}

const filteredItems = computed(() => {
  return knowledgeItems.value.filter(item => {
    const matchesCategory = selectedCategory.value === '全部' || item.category === selectedCategory.value
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const filteredVideoItems = computed(() => {
  return filteredItems.value.filter(item => item.type === '视频')
})

const filteredArticleItems = computed(() => {
  return filteredItems.value.filter(item => item.type === '文章')
})

const filteredBookmarkedItems = computed(() => {
  return knowledgeItems.value.filter(item => bookmarkedItems.value.includes(item.id))
})

const goToDetail = (id) => {
  router.push(`/knowledge/${id}`)
}
</script>

<style scoped>
.knowledge-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  color: #6b7280;
  margin-top: 4px;
}

/* Search */
.search-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Categories */
.categories {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.category-btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 20px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

.category-btn.active {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tabs-header {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #2563eb;
  background: #eff6ff;
}

.tab-btn.active {
  color: #2563eb;
  background: #eff6ff;
}

.tab-badge {
  background: #2563eb;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.knowledge-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
}

.knowledge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-thumbnail {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-emoji {
  font-size: 64px;
  transition: transform 0.3s;
}

.knowledge-card:hover .thumbnail-emoji {
  transform: scale(1.1);
}

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.knowledge-card:hover .play-overlay {
  background: rgba(0, 0, 0, 0.3);
}

.play-btn {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #2563eb;
  opacity: 0;
  transition: opacity 0.3s;
}

.knowledge-card:hover .play-btn {
  opacity: 1;
}

.type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.duration-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.bookmark-icon {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #9ca3af;
}

.bookmark-icon:hover {
  transform: scale(1.1);
  color: #2563eb;
}

.card-content {
  padding: 16px;
}

.category-tag {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.card-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #9ca3af;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 8px;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}
</style>