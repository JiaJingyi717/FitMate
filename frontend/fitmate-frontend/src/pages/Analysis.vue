<template>
  <div class="analysis-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">数据分析</h1>
      <p class="page-subtitle">追踪你的健身进度，用数据驱动训练</p>
    </div>

    <!-- Time Filter Tabs -->
    <div class="time-filter">
      <button
        class="time-btn"
        :class="{ active: timeRange === '7days' }"
        @click="timeRange = '7days'"
      >
        最近7天
      </button>
      <button
        class="time-btn"
        :class="{ active: timeRange === '30days' }"
        @click="timeRange = '30days'"
      >
        最近30天
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card stat-blue">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">总训练时长</span>
          <span class="stat-value">{{ currentStats.totalDuration }}分钟</span>
        </div>
      </div>

      <div class="stat-card stat-cyan">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2c.5 0 1 .2 1.4.6l.2.2c1.8 2.4 4.4 3.2 4.4 6.2 0 2.2-1.8 4-4 4s-4-1.8-4-4"/>
            <path d="M12 2c-.5 0-1 .2-1.4.6l-.2.2c-1.8 2.4-4.4 3.2-4.4 6.2 0 2.2 1.8 4 4 4s4-1.8 4-4"/>
            <path d="M2 12h2m4 0h2m4 0h2m4 0h2"/>
            <path d="M12 12v10"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">消耗卡路里</span>
          <span class="stat-value">{{ currentStats.totalCalories }}</span>
        </div>
      </div>

      <div class="stat-card stat-gradient">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">训练次数</span>
          <span class="stat-value">{{ currentStats.totalWorkouts }}次</span>
        </div>
      </div>

      <div class="stat-card stat-blue-light">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">平均时长</span>
          <span class="stat-value">{{ currentStats.avgDuration }}分钟</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Exercise Distribution -->
      <div class="chart-card">
        <h3 class="chart-title">运动类型分布</h3>
        <div class="chart-content">
          <div class="pie-chart">
            <svg viewBox="0 0 100 100" class="pie-svg">
              <circle
                v-for="(segment, index) in pieSegments"
                :key="index"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                :stroke="segment.color"
                stroke-width="20"
                :stroke-dasharray="segment.dashArray"
                :stroke-dashoffset="segment.offset"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div class="pie-center">
              <span class="pie-total">{{ categoryData.length }}</span>
              <span class="pie-label">种类型</span>
            </div>
          </div>
          <div class="chart-legend">
            <div
              v-for="item in categoryData"
              :key="item.id"
              class="legend-item"
            >
              <span class="legend-color" :style="{ background: item.color }"></span>
              <span class="legend-name">{{ item.name }}</span>
              <span class="legend-value">{{ item.value }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Duration Trend -->
      <div class="chart-card">
        <h3 class="chart-title">训练时长趋势</h3>
        <div class="chart-content bar-chart">
          <div class="bar-container">
            <div
              v-for="(item, index) in trendData"
              :key="index"
              class="bar-wrapper"
            >
              <div class="bar" :style="{ height: getBarHeight(item.duration) + '%' }">
                <span class="bar-value">{{ item.duration }}分钟</span>
              </div>
              <span class="bar-label">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Suggestions -->
    <div class="suggestions-section">
      <h3 class="section-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4m0-4h.01"/>
        </svg>
        AI健身建议
      </h3>
      <div class="suggestions-grid">
        <div
          v-for="suggestion in aiSuggestions"
          :key="suggestion.id"
          class="suggestion-card"
          :style="{ background: suggestion.gradient }"
        >
          <div class="suggestion-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="suggestion.iconPath"></svg>
          </div>
          <div class="suggestion-content">
            <h4>{{ suggestion.title }}</h4>
            <p>{{ suggestion.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement -->
    <div class="achievement-card">
      <div class="achievement-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      </div>
      <div class="achievement-content">
        <h3>本周成就达成！</h3>
        <p>恭喜你完成了本周的训练目标！继续保持，你已经超越了80%的用户。💪</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const timeRange = ref('7days')

const last7DaysData = [
  { id: '7d-1', day: '3/6', duration: 45 },
  { id: '7d-2', day: '3/7', duration: 60 },
  { id: '7d-3', day: '3/8', duration: 30 },
  { id: '7d-4', day: '3/9', duration: 55 },
  { id: '7d-5', day: '3/10', duration: 40 },
  { id: '7d-6', day: '3/11', duration: 75 },
  { id: '7d-7', day: '3/12', duration: 50 }
]

const last30DaysData = [
  { id: '30d-1', date: '2/13-2/19', duration: 245 },
  { id: '30d-2', date: '2/20-2/26', duration: 280 },
  { id: '30d-3', date: '2/27-3/5', duration: 210 },
  { id: '30d-4', date: '3/6-3/12', duration: 355 }
]

const categoryData = [
  { id: 'cat-1', name: '力量训练', value: 35, color: '#2563eb' },
  { id: 'cat-2', name: '有氧运动', value: 30, color: '#06b6d4' },
  { id: 'cat-3', name: 'HIIT', value: 20, color: '#3b82f6' },
  { id: 'cat-4', name: '拉伸放松', value: 15, color: '#60a5fa' }
]

const aiSuggestions = [
  {
    id: 1,
    title: '训练频率优秀',
    description: '本周完成7次训练，达成了设定目标！保持这个节奏能够获得更好的训练效果。',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    iconPath: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>'
  },
  {
    id: 2,
    title: '建议增加力量训练',
    description: '根据数据分析，你的有氧训练占比较高。建议增加力量训练来提升肌肉力量和基础代谢。',
    gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    iconPath: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>'
  },
  {
    id: 3,
    title: '注意训练强度变化',
    description: '连续高强度训练后，建议安排1-2天的低强度恢复训练，避免过度疲劳和运动损伤。',
    gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    iconPath: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
  }
]

const currentStats = computed(() => {
  if (timeRange.value === '7days') {
    const totalDuration = last7DaysData.reduce((sum, item) => sum + item.duration, 0)
    const totalCalories = last7DaysData.reduce((sum, item) => sum + item.duration * 7, 0)
    return {
      totalDuration,
      totalCalories,
      totalWorkouts: 7,
      avgDuration: Math.round(totalDuration / last7DaysData.length)
    }
  } else {
    const totalDuration = last30DaysData.reduce((sum, item) => sum + item.duration, 0)
    const totalCalories = last30DaysData.reduce((sum, item) => sum + item.duration * 7, 0)
    return {
      totalDuration,
      totalCalories,
      totalWorkouts: 22,
      avgDuration: Math.round(totalDuration / last30DaysData.length)
    }
  }
})

const trendData = computed(() => {
  if (timeRange.value === '7days') {
    return last7DaysData.map(item => ({
      label: item.day,
      duration: item.duration
    }))
  } else {
    return last30DaysData.map(item => ({
      label: item.date.split('-')[0],
      duration: item.duration
    }))
  }
})

const pieSegments = computed(() => {
  let currentAngle = 0
  const circumference = 2 * Math.PI * 40

  return categoryData.map(item => {
    const percentage = item.value / 100
    const dashArray = `${circumference * percentage} ${circumference * (1 - percentage)}`
    const offset = -circumference * currentAngle
    currentAngle += percentage

    return {
      color: item.color,
      dashArray,
      offset
    }
  })
})

const maxDuration = computed(() => {
  return Math.max(...trendData.value.map(item => item.duration))
})

const getBarHeight = (duration) => {
  return (duration / maxDuration.value) * 100
}
</script>

<style scoped>
.analysis-page {
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

/* Time Filter */
.time-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.time-btn {
  padding: 10px 24px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.time-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.time-btn.active {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-color: transparent;
  color: white;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-blue {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.stat-cyan {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
  color: white;
}

.stat-gradient {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
}

.stat-blue-light {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
}

.stat-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-top: 4px;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px;
}

.chart-content {
  height: 280px;
}

/* Pie Chart */
.pie-chart {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 20px;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-total {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.pie-label {
  font-size: 12px;
  color: #6b7280;
}

.chart-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-name {
  flex: 1;
  font-size: 13px;
  color: #6b7280;
}

.legend-value {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  padding-top: 20px;
}

.bar-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  gap: 16px;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.bar {
  width: 100%;
  max-width: 60px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  min-height: 20px;
  transition: height 0.5s ease;
}

.bar-value {
  font-size: 11px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.bar-label {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

/* Suggestions */
.suggestions-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.suggestion-card {
  padding: 20px;
  border-radius: 16px;
  color: white;
  display: flex;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.suggestion-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestion-content h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 6px;
}

.suggestion-content p {
  font-size: 13px;
  margin: 0;
  opacity: 0.95;
  line-height: 1.5;
}

/* Achievement */
.achievement-card {
  background: linear-gradient(135deg, #eff6ff, #ecfeff);
  border: 1px solid #bae6fd;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.achievement-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
}

.achievement-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px;
}

.achievement-content p {
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>