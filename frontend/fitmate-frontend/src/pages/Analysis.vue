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
          <span class="stat-value">{{ overviewData.totalDuration }}分钟</span>
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
          <span class="stat-value">{{ overviewData.totalCalories }}</span>
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
          <span class="stat-value">{{ overviewData.trainingCount }}次</span>
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
          <span class="stat-value">{{ overviewData.avgDuration }}分钟</span>
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
        <div class="chart-content line-chart">
          <svg class="line-svg" :viewBox="`0 0 ${chartWidth} ${chartHeight}`" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#06b6d4" />
              </linearGradient>
            </defs>
            <!-- Y轴网格线 -->
            <line
              v-for="(y, index) in yGridLines"
              :key="'grid-' + index"
              :x1="padding.left"
              :y1="y"
              :x2="chartWidth - padding.right"
              :y2="y"
              class="grid-line"
            />
            <!-- Y轴标签：右对齐，避免文字向右伸入绘图区与折线重叠 -->
            <text
              v-for="(y, index) in yGridLines"
              :key="'y-label-' + index"
              :x="yAxisLabelX"
              :y="y + 4"
              class="axis-label"
              text-anchor="end"
            >{{ Math.round(maxDuration * (1 - index / 4)) }}分钟</text>
            <!-- 折线 -->
            <polyline
              :points="linePoints"
              class="trend-line"
            />
            <!-- 数据点 -->
            <circle
              v-for="(point, index) in linePointsArr"
              :key="'point-' + index"
              :cx="point.x"
              :cy="point.y"
              :r="point.highlighted ? 6 : 4"
              class="data-point"
              :class="{ highlighted: point.highlighted }"
              @mouseenter="highlightedIndex = index"
              @mouseleave="highlightedIndex = -1"
            />
            <!-- X轴标签 -->
            <text
              v-for="(item, index) in visibleXLabels"
              :key="'x-label-' + index"
              :x="item.x"
              :y="chartHeight - padding.bottom + 20"
              class="axis-label"
              text-anchor="middle"
            >{{ item.label }}</text>
          </svg>
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
import { ref, computed, onMounted, watch } from 'vue'
import { getAnalyticsOverview, getCategoryDistribution, getDurationTrend, getAiSuggestions } from '../api/analytics.js'

const timeRange = ref('7days')
const loading = ref(false)

// API 数据
const overviewData = ref({
  totalDuration: 0,
  totalCalories: 0,
  trainingCount: 0,
  avgDuration: 0
})

const categoryData = ref([])
const trendData = ref([])
const aiSuggestions = ref([])

// 颜色映射
const colorMap = ['#2563eb', '#06b6d4', '#3b82f6', '#60a5fa', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

// 加载数据
const loadData = async () => {
  loading.value = true
  const range = timeRange.value === '7days' ? '7d' : '30d'

  try {
    // 并行请求所有数据
    const [overviewRes, categoryRes, trendRes, aiRes] = await Promise.all([
      getAnalyticsOverview({ range }),
      getCategoryDistribution({ range }),
      getDurationTrend({ range }),
      getAiSuggestions({ range })
    ])

    // 处理总览数据
    if (overviewRes.code === 200 && overviewRes.data) {
      overviewData.value = {
        totalDuration: overviewRes.data.totalDuration || 0,
        totalCalories: overviewRes.data.totalCalories || 0,
        trainingCount: overviewRes.data.trainingCount || 0,
        avgDuration: overviewRes.data.avgDuration || 0
      }
    }

    // 处理分类数据
    if (categoryRes.code === 200 && categoryRes.data) {
      categoryData.value = categoryRes.data.map((item, index) => ({
        id: `cat-${index}`,
        name: item.category,
        value: item.percentage,
        color: colorMap[index % colorMap.length]
      }))
    }

    // 处理趋势数据
    if (trendRes.code === 200 && trendRes.data) {
      trendData.value = trendRes.data.map(item => ({
        label: item.date,
        duration: item.duration
      }))
    }

    // 处理 AI 建议
    if (aiRes.code === 200 && aiRes.data) {
      aiSuggestions.value = aiRes.data.map((suggestion, index) => ({
        id: index + 1,
        title: getSuggestionTitle(suggestion, index),
        description: suggestion,
        gradient: getSuggestionGradient(index),
        iconPath: getSuggestionIcon(index)
      }))
    }
  } catch (error) {
    console.error('加载分析数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取建议标题
const getSuggestionTitle = (suggestion, index) => {
  const titles = ['个性化训练建议', '优化训练方案', '健康提示']
  return titles[index % titles.length]
}

// 获取建议渐变色
const getSuggestionGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #2563eb, #1d4ed8)',
    'linear-gradient(135deg, #0891b2, #06b6d4)',
    'linear-gradient(135deg, #10b981, #059669)'
  ]
  return gradients[index % gradients.length]
}

// 获取建议图标
const getSuggestionIcon = (index) => {
  const icons = [
    '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
    '<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>',
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
  ]
  return icons[index % icons.length]
}

// 转换 API range 参数
const apiRange = computed(() => timeRange.value === '7days' ? '7d' : '30d')

// 监听时间范围变化
watch(timeRange, () => {
  loadData()
})

// 初始化加载
onMounted(() => {
  loadData()
})

// 折线图相关计算属性
const chartWidth = 560
const chartHeight = 200
// 左侧留白：容纳「右对齐」的 Y 轴刻度文字（文字向左延伸，不占用绘图区）
const padding = { top: 20, right: 20, bottom: 40, left: 64 }
const yAxisLabelX = padding.left - 12
const highlightedIndex = ref(-1)

const chartData = computed(() => {
  if (trendData.value.length === 0) return []
  const max = maxDuration.value
  const chartWidthInner = chartWidth - padding.left - padding.right
  const chartHeightInner = chartHeight - padding.top - padding.bottom

  return trendData.value.map((item, index) => {
    const x = padding.left + (index / (trendData.value.length - 1 || 1)) * chartWidthInner
    const y = padding.top + chartHeightInner - (item.duration / max) * chartHeightInner
    return {
      x,
      y,
      label: item.label,
      duration: item.duration,
      highlighted: index === highlightedIndex.value
    }
  })
})

const linePoints = computed(() => {
  return chartData.value.map(p => `${p.x},${p.y}`).join(' ')
})

const linePointsArr = computed(() => chartData.value)

const yGridLines = computed(() => {
  const lines = []
  for (let i = 0; i <= 4; i++) {
    lines.push(padding.top + ((chartHeight - padding.top - padding.bottom) / 4) * i)
  }
  return lines
})

// X轴标签省略逻辑
const visibleXLabels = computed(() => {
  const data = chartData.value
  if (data.length === 0) return []

  const labels = []
  const dataLength = data.length

  // 7天显示所有标签
  if (dataLength <= 7) {
    return data.map((item, index) => ({
      x: item.x,
      label: formatDate(item.label)
    }))
  }

  // 30天每隔几天显示一个
  const interval = Math.ceil(dataLength / 7)
  for (let i = 0; i < dataLength; i += interval) {
    labels.push({
      x: data[i].x,
      label: formatDate(data[i].label)
    })
  }

  return labels
})

// 格式化日期显示
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const pieSegments = computed(() => {
  let currentAngle = 0
  const circumference = 2 * Math.PI * 40

  return categoryData.value.map(item => {
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
  if (trendData.value.length === 0) return 100
  return Math.max(...trendData.value.map(item => item.duration), 1)
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

/* Line Chart */
.line-chart {
  position: relative;
  width: 100%;
}

.line-svg {
  width: 100%;
  height: 200px;
}

.grid-line {
  stroke: #e5e7eb;
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.axis-label {
  font-size: 11px;
  fill: #6b7280;
}

.trend-line {
  fill: none;
  stroke: url(#lineGradient);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.data-point {
  fill: white;
  stroke: #2563eb;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.2s;
}

.data-point:hover,
.data-point.highlighted {
  fill: #2563eb;
  r: 6;
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