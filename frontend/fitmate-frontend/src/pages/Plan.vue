<template>
  <div class="plan-page">
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-toast">
      {{ errorMessage }}
    </div>

    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">训练计划</h1>
          <p class="page-subtitle">管理你的健身训练计划</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" @click="showAIDialog = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            AI生成计划
          </button>
          <button class="btn-secondary" @click="showManualDialog = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            手动创建
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-blue">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">已完成任务</span>
          <span class="stat-value">{{ stats.completed }}/{{ stats.total }}</span>
        </div>
      </div>

      <div class="stat-card stat-cyan">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">训练时长</span>
          <span class="stat-value">{{ stats.totalDuration }}分钟</span>
        </div>
      </div>

      <div class="stat-card stat-gradient">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2c.5 0 1 .2 1.4.6l.2.2c1.8 2.4 4.4 3.2 4.4 6.2 0 2.2-1.8 4-4 4s-4-1.8-4-4"/>
            <path d="M12 2c-.5 0-1 .2-1.4.6l-.2.2c-1.8 2.4-4.4 3.2-4.4 6.2 0 2.2 1.8 4 4 4s4-1.8 4-4"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">消耗卡路里</span>
          <span class="stat-value">{{ stats.totalCalories }}</span>
        </div>
      </div>

      <div class="stat-card stat-blue-light">
        <div class="stat-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">训练计划</span>
          <span class="stat-value">{{ plans.length }}</span>
        </div>
      </div>
    </div>

    <!-- Plans List -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          全部计划
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'today' }"
          @click="switchToTodayTab"
        >
          今日任务
        </button>
      </div>

      <!-- All Plans -->
      <div v-show="activeTab === 'all'" class="tab-content">
        <div v-if="plans.length === 0" class="empty-state">
          <div class="empty-icon">🏋️</div>
          <h3>还没有训练计划</h3>
          <p>开始创建你的第一个训练计划吧！</p>
        </div>
        <div v-else class="plans-list">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="plan-card"
            :class="{ ended: isPlanEnded(plan) }"
            @click="openPlanDetail(plan)"
          >
            <div class="plan-header">
              <div class="plan-info">
                <h3 class="plan-name">{{ plan.name }}</h3>
                <div class="plan-badges">
                  <span class="badge" :class="plan.type === 'AI生成' ? 'badge-ai' : 'badge-manual'">
                    <svg v-if="plan.type === 'AI生成'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    {{ plan.type }}
                  </span>
                  <span class="badge" :class="'badge-' + plan.difficulty">{{ plan.difficulty }}</span>
                  <span v-if="isPlanEnded(plan)" class="badge badge-ended">已结束</span>
                </div>
              </div>
              <button class="delete-btn" @click.stop="deletePlan(plan.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
            <p class="plan-desc">{{ plan.description }}</p>
            <div class="plan-meta">
              <span>📅 {{ plan.duration }}</span>
              <span>💪 {{ plan.tasks.length }}次训练</span>
              <span>🔥 {{ getPlanCalories(plan) }}卡路里</span>
            </div>
            <div class="plan-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getPlanProgress(plan) + '%' }"></div>
              </div>
              <span class="progress-text">{{ getPlanCompleted(plan) }}/{{ getPlanTotal(plan) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Tasks -->
      <div v-show="activeTab === 'today'" class="tab-content">
        <div class="today-tasks">
          <h3 class="section-title">今日训练任务</h3>
          <div v-if="todayTasksComputed.length === 0" class="empty-state">
            <p>今天还没有训练任务</p>
          </div>
          <div v-else class="tasks-list">
            <div
              v-for="task in todayTasksComputed"
              :key="task.id"
              class="task-item"
              :class="{ completed: task.completed }"
            >
              <button class="task-checkbox" @click="toggleTaskComplete(task)">
                <svg v-if="task.completed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </button>
              <div class="task-info">
                <span class="task-name">{{ task.name }}</span>
                <div class="task-meta">
                  <span>⏱️ {{ task.duration || task.durationMinutes + '分钟' }}</span>
                  <span>🔥 {{ task.calories }}卡</span>
                  <span v-if="task.sets">💪 {{ task.sets }}组×{{ task.reps }}次</span>
                </div>
              </div>
              <span class="task-type">{{ task.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Generation Dialog -->
    <div v-if="showAIDialog" class="dialog-overlay" @click.self="showAIDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            AI智能生成训练计划
          </h3>
          <button class="dialog-close" @click="showAIDialog = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-section">
            <label class="form-label">你的健身目标是什么？</label>
            <div class="goal-grid">
              <button
                v-for="goal in goals"
                :key="goal.value"
                class="goal-btn"
                :class="{ active: aiForm.goal === goal.value }"
                @click="aiForm.goal = goal.value"
              >
                <span class="goal-icon">{{ goal.icon }}</span>
                <span class="goal-label">{{ goal.label }}</span>
              </button>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">你的健身水平？</label>
            <div class="level-grid">
              <button
                v-for="level in levels"
                :key="level"
                class="level-btn"
                :class="{ active: aiForm.level === level }"
                @click="aiForm.level = level"
              >
                {{ level }}
              </button>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">每周训练哪几天？</label>
            <div class="days-grid">
              <button
                v-for="day in daysOfWeek"
                :key="day"
                class="day-btn"
                :class="{ active: aiForm.trainingDays.includes(day) }"
                @click="toggleDay(day)"
              >
                {{ day.slice(1) }}
              </button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">计划开始日期</label>
              <input v-model="aiForm.startDate" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">计划结束日期</label>
              <input v-model="aiForm.endDate" type="date" class="form-input" />
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">额外要求（可选）</label>
            <textarea
              v-model="aiForm.additionalRequirements"
              class="form-textarea"
              placeholder="例如：希望加强核心训练、避免膝盖压力大的动作..."
            ></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-outline" @click="showAIDialog = false">取消</button>
          <button
            class="btn-primary"
            :disabled="!canGenerateAI"
            @click="generateAIPlan"
          >
            生成计划
          </button>
        </div>
      </div>
    </div>

    <!-- Manual Creation Dialog -->
    <div v-if="showManualDialog" class="dialog-overlay" @click.self="showManualDialog = false">
      <div class="dialog dialog-lg">
        <div class="dialog-header">
          <h3 class="dialog-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6.5 6.5h11M6.5 17.5h11M4 10.5v3M20 10.5v3M6.5 4v16M17.5 4v16"/>
            </svg>
            手动创建训练计划
          </h3>
          <button class="dialog-close" @click="showManualDialog = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-section">
            <label class="form-label">计划名称 *</label>
            <input v-model="manualForm.name" type="text" class="form-input" placeholder="例如：周一胸部训练" />
          </div>

          <div class="form-section">
            <label class="form-label">计划描述</label>
            <input v-model="manualForm.description" type="text" class="form-input" placeholder="简单描述这个训练计划" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">计划周期</label>
              <input v-model="manualForm.duration" type="text" class="form-input" placeholder="例如：4周" />
            </div>
            <div class="form-group">
              <label class="form-label">难度等级</label>
              <select v-model="manualForm.difficulty" class="form-select">
                <option value="初级">初级</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">开始日期 *</label>
              <input v-model="manualForm.startDate" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">结束日期 *</label>
              <input v-model="manualForm.endDate" type="date" class="form-input" />
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">训练动作列表</label>
            <div v-if="manualTasks.length > 0" class="task-list">
              <div v-for="(task, index) in manualTasks" :key="index" class="task-list-item">
                <span class="task-number">{{ index + 1 }}</span>
                <div class="task-details">
                  <span class="task-name">{{ task.name }}</span>
                  <span class="task-info">{{ task.type }} · {{ task.duration }} · {{ task.calories }}卡</span>
                </div>
                <button class="remove-btn" @click="removeTask(index)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">从训练库选择动作</label>
            <div class="exercise-grid">
              <button
                v-for="exercise in presetExercises"
                :key="exercise.name"
                class="exercise-btn"
                @click="addPresetExercise(exercise)"
              >
                <span class="exercise-name">{{ exercise.name }}</span>
                <span class="exercise-meta">{{ exercise.type }} · {{ exercise.duration }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-outline" @click="showManualDialog = false">取消</button>
          <button
            class="btn-primary"
            :disabled="!canSaveManual"
            @click="saveManualPlan"
          >
            保存计划
          </button>
        </div>
      </div>
    </div>

    <!-- Plan Detail Dialog -->
    <div v-if="showPlanDetail" class="dialog-overlay" @click.self="showPlanDetail = false">
      <div class="dialog dialog-xl">
        <div class="dialog-header">
          <h3 class="dialog-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {{ selectedPlan?.name }}
          </h3>
          <button class="dialog-close" @click="showPlanDetail = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <div v-if="selectedPlan" class="plan-detail">
            <div class="detail-header">
              <div class="detail-badges">
                <span class="badge" :class="'badge-' + selectedPlan.difficulty">{{ selectedPlan.difficulty }}</span>
                <span class="badge" :class="selectedPlan.type === 'AI生成' ? 'badge-ai' : 'badge-manual'">
                  {{ selectedPlan.type }}
                </span>
                <span v-if="selectedPlan.status === 'expired'" class="badge badge-ended">已结束</span>
              </div>
              <p class="detail-desc">{{ selectedPlan.description }}</p>
              <div class="detail-stats">
                <span>📅 {{ selectedPlan.duration }}</span>
                <span>💪 {{ selectedPlan.totalTasks || selectedPlan.tasks?.length || 0 }}个动作</span>
                <span>🔥 {{ selectedPlan.totalCalories || 0 }}卡路里</span>
                <span v-if="selectedPlan.progress !== undefined">{{ selectedPlan.progress }}%完成</span>
              </div>
            </div>

            <!-- 按周显示训练排程 -->
            <div v-if="selectedPlan.weeklySchedule?.length" class="detail-schedule">
              <h4 class="section-subtitle">每周训练计划</h4>

              <div
                v-for="week in selectedPlan.weeklySchedule"
                :key="week.weekNumber"
                class="week-section"
              >
                <div class="week-header">
                  <h5 class="week-title">{{ week.weekLabel }}</h5>
                  <span class="week-info">
                    {{ week.trainingDays }}个训练日 · {{ week.restDays }}个休息日
                  </span>
                </div>

                <div class="week-days">
                  <div
                    v-for="day in week.days"
                    :key="day.date"
                    class="day-card"
                    :class="{
                      'rest-day': day.isRestDay,
                      'today': day.isToday,
                      'past': day.isPast
                    }"
                  >
                    <div class="day-header">
                      <span class="day-date">{{ day.dayOfWeek }}</span>
                      <span class="day-label">{{ day.dateStr || day.date }}</span>
                    </div>

                    <!-- 休息日 -->
                    <div v-if="day.isRestDay" class="rest-content">
                      <span class="rest-icon">😴</span>
                      <span class="rest-text">休息日</span>
                    </div>

                    <!-- 训练日 -->
                    <div v-else class="training-content">
                      <div v-if="day.tasks?.length" class="day-tasks">
                        <div
                          v-for="task in day.tasks"
                          :key="task.id"
                          class="day-task-item"
                          :class="{ completed: task.isCompleted }"
                        >
                          <span class="task-check">
                            <svg v-if="task.isCompleted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span v-else class="task-dot"></span>
                          </span>
                          <div class="task-content">
                            <span class="task-name">{{ task.name }}</span>
                            <span class="task-meta">
                              {{ task.duration }}
                              <template v-if="task.sets"> · {{ task.sets }}组×{{ task.reps }}次</template>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div v-else class="no-tasks">暂无任务</div>

                      <div class="day-summary">
                        <span>⏱️ {{ day.totalDuration || 0 }}分钟</span>
                        <span>🔥 {{ day.totalCalories || 0 }}卡</span>
                        <span v-if="day.progress > 0">{{ day.progress }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 兜底：简单任务列表 -->
            <div v-else-if="selectedPlan.tasks?.length" class="detail-tasks">
              <h4 class="section-subtitle">训练内容</h4>
              <div class="detail-task-list">
                <div
                  v-for="(task, index) in selectedPlan.tasks"
                  :key="task.id || index"
                  class="detail-task-item"
                  :class="{ completed: task.isCompleted || task.completed }"
                >
                  <div class="detail-task-number">{{ index + 1 }}</div>
                  <div class="detail-task-info">
                    <span class="detail-task-name">{{ task.name }}</span>
                    <div class="detail-task-meta">
                      <span>🏷️ {{ task.type }}</span>
                      <span>⏱️ {{ task.duration }}</span>
                      <span v-if="task.sets">💪 {{ task.sets }}组×{{ task.reps }}次</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 无任务提示 -->
            <div v-else class="empty-detail">
              <p>暂无训练计划内容</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getPlanOverview,
  getPlanList,
  getPlanDetail,
  createPlan,
  deletePlan as apiDeletePlan,
  getTodayTasks,
  completeTodayTask
} from '../api/plan'
import { generatePlan } from '../api/ai'

const activeTab = ref('all')
const showAIDialog = ref(false)
const showManualDialog = ref(false)
const showPlanDetail = ref(false)
const selectedPlan = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

// 显示错误提示
function showError(msg) {
  errorMessage.value = msg
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}

// 显示成功提示
function showSuccess(msg) {
  errorMessage.value = msg
  // 临时改为绿色（通过修改 class）
  const toast = document.querySelector('.error-toast')
  if (toast) {
    toast.style.background = '#f0fdf4'
    toast.style.borderColor = '#bbf7d0'
    toast.style.color = '#16a34a'
  }
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}

// 概览数据
const overviewStats = ref({
  completedTasks: 0,
  totalTasks: 0,
  totalDuration: 0,
  totalCalories: 0,
  planCount: 0
})

const goals = [
  { value: '减脂', icon: '🔥', label: '减脂' },
  { value: '增肌', icon: '💪', label: '增肌' },
  { value: '塑形', icon: '⭐', label: '塑形' }
]

const levels = ['初学者', '有基础', '健身达人']
const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const aiForm = ref({
  goal: '',
  level: '',
  trainingDays: [],
  startDate: '',
  endDate: '',
  additionalRequirements: ''
})

const manualForm = ref({
  name: '',
  description: '',
  duration: '',
  difficulty: '中级',
  startDate: '',
  endDate: ''
})

const manualTasks = ref([])

const presetExercises = [
  { name: '跑步', type: '有氧', duration: '20分钟', calories: 200 },
  { name: '快走', type: '有氧', duration: '30分钟', calories: 150 },
  { name: '跳绳', type: '有氧', duration: '15分钟', calories: 180 },
  { name: '波比跳', type: 'HIIT', duration: '12分钟', calories: 150, sets: 5, reps: 10 },
  { name: '开合跳', type: 'HIIT', duration: '10分钟', calories: 120, sets: 4, reps: 30 },
  { name: '俯卧撑', type: '胸部', duration: '10分钟', calories: 80, sets: 3, reps: 12 },
  { name: '深蹲', type: '腿部', duration: '15分钟', calories: 100, sets: 4, reps: 15 },
  { name: '平板支撑', type: '核心', duration: '8分钟', calories: 60, sets: 3, reps: 60 },
  { name: '卷腹', type: '核心', duration: '10分钟', calories: 70, sets: 3, reps: 20 }
]

// 计划列表
const plans = ref([])

// 今日任务
const todayTasks = ref([])

// 加载概览数据
async function loadOverview() {
  try {
    const res = await getPlanOverview()
    console.log('📈 getPlanOverview 响应:', res)
    if (res.code === 200 && res.data) {
      overviewStats.value = {
        completedTasks: res.data.completedTasks || 0,
        totalTasks: res.data.totalTasks || 0,
        totalDuration: res.data.totalDuration || 0,
        totalCalories: res.data.totalCalories || 0,
        planCount: res.data.planCount || 0
      }
      console.log('✅ overviewStats 已更新:', overviewStats.value)
    } else {
      console.warn('⚠️ 概览响应格式异常:', res)
    }
  } catch (error) {
    console.error('❌ 加载概览失败:', error)
  }
}

// 加载计划列表
async function loadPlanList() {
  console.log('🔄 正在加载计划列表...')
  isLoading.value = true
  try {
    const res = await getPlanList()
    console.log('📋 getPlanList 响应:', res)
    if (res && res.code === 200 && res.data) {
      console.log('📊 原始数据:', res.data)
      // 安全地处理数据，确保不会因为字段类型错误而崩溃
      if (Array.isArray(res.data)) {
        plans.value = res.data.map(p => {
          try {
            return {
              id: p.id || p.planId,
              name: p.name || '未命名计划',
              description: p.description || '',
              type: p.type || '手动创建',
              duration: p.duration || '',
              difficulty: p.difficulty || '中级',
              startDate: p.startDate || p.start_date || '',
              endDate: p.endDate || p.end_date || '',
              tasks: Array.isArray(p.tasks) ? p.tasks : [],
              progress: Number(p.progress) || 0,
              totalTasks: Number(p.totalTasks) || 0,
              completedTasks: Number(p.completedTasks) || 0,
              weeklySchedule: Array.isArray(p.weeklySchedule) ? p.weeklySchedule : [],
              totalCalories: Number(p.totalCalories) || 0
            }
          } catch (mapError) {
            console.error('❌ 单个计划映射失败:', p, mapError)
            return null
          }
        }).filter(p => p !== null)
        console.log('✅ plans 已更新，长度:', plans.value.length)
      } else {
        console.warn('⚠️ res.data 不是数组:', typeof res.data)
        plans.value = []
      }
    } else {
      console.warn('⚠️ 响应格式异常:', res)
    }
  } catch (error) {
    console.error('❌ 加载计划列表失败:', error)
    console.error('❌ error.message:', error.message)
    console.error('❌ error.stack:', error.stack)
    showError('加载计划失败，请刷新重试')
  } finally {
    isLoading.value = false
  }
}

// 加载今日任务
async function loadTodayTasks() {
  try {
    const res = await getTodayTasks()
    if (res.code === 200 && res.data) {
      todayTasks.value = res.data.map(t => ({
        ...t,
        completed: t.isCompleted || false
      }))
      // 更新今日任务总数
      overviewStats.value.totalTasks = todayTasks.value.length
    }
  } catch (error) {
    console.error('加载今日任务失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadOverview()
  loadPlanList()
  loadTodayTasks()
})

const stats = computed(() => {
  return {
    completed: overviewStats.value.completedTasks,
    total: overviewStats.value.totalTasks,
    totalDuration: overviewStats.value.totalDuration,
    totalCalories: overviewStats.value.totalCalories,
    planCount: overviewStats.value.planCount
  }
})

function getTodayMeta() {
  const now = new Date()
  const todayDate = now.toISOString().split('T')[0]
  const dayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return {
    todayDate,
    todayDayLabel: dayLabels[now.getDay()]
  }
}

function buildTodayTasksFromPlans() {
  const { todayDate, todayDayLabel } = getTodayMeta()
  const todayPlanTasks = []

  plans.value.forEach((plan) => {
    // 优先从周计划结构中按日期取今天任务
    if (Array.isArray(plan.weeklySchedule) && plan.weeklySchedule.length > 0) {
      plan.weeklySchedule.forEach((week) => {
        ;(week.days || []).forEach((day) => {
          if (day.isRestDay) return
          const isToday = day.date === todayDate || day.dayOfWeek === todayDayLabel
          if (!isToday) return
          ;(day.tasks || []).forEach((task) => {
            todayPlanTasks.push({
              ...task,
              planName: plan.name
            })
          })
        })
      })
      return
    }

    // 兜底：仅接受明确标记到今天日期的任务，避免把整周任务都展示出来
    ;(plan.tasks || []).forEach((task) => {
      const taskDate = task.target_date || task.targetDate || task.date
      if (taskDate && String(taskDate).startsWith(todayDate)) {
        todayPlanTasks.push({
          ...task,
          planName: plan.name
        })
      }
    })
  })

  return todayPlanTasks
}

// 今日任务计算属性
const todayTasksComputed = computed(() => {
  if (todayTasks.value.length > 0) {
    return todayTasks.value
  }
  // 降级：从计划中仅提取“今天”的任务
  return buildTodayTasksFromPlans()
})

const canGenerateAI = computed(() => {
  // 只需要目标、水平和训练天数，日期可选
  return aiForm.value.goal && aiForm.value.level && aiForm.value.trainingDays.length > 0
})

const canSaveManual = computed(() => {
  return manualForm.value.name && manualTasks.value.length > 0 && manualForm.value.startDate && manualForm.value.endDate
})

const switchToTodayTab = async () => {
  activeTab.value = 'today'
  await loadTodayTasks()
}

const isPlanEnded = (plan) => {
  if (!plan.endDate) return false
  const today = new Date()
  const endDate = new Date(plan.endDate)
  return today > endDate
}

const getPlanCalories = (plan) => {
  return plan.tasks.reduce((sum, t) => sum + t.calories, 0)
}

// 直接使用后端返回的进度数据
const getPlanProgress = (plan) => {
  return plan.progress ?? 0
}

const getPlanCompleted = (plan) => {
  return plan.completedTasks ?? 0
}

const getPlanTotal = (plan) => {
  return plan.totalTasks ?? 0
}

const toggleDay = (day) => {
  if (aiForm.value.trainingDays.includes(day)) {
    aiForm.value.trainingDays = aiForm.value.trainingDays.filter(d => d !== day)
  } else {
    aiForm.value.trainingDays.push(day)
  }
}

const toggleTaskComplete = async (task) => {
  // 兼容 isCompleted 和 completed 属性
  const currentCompleted = task.isCompleted ?? task.completed ?? false
  const newCompleted = !currentCompleted

  // 先更新UI（同时更新两个属性以确保兼容性）
  task.isCompleted = newCompleted
  task.completed = newCompleted

  // 同时更新今日任务列表
  const todayTask = todayTasks.value.find(t => t.id === task.id)
  if (todayTask) {
    todayTask.isCompleted = newCompleted
    todayTask.completed = newCompleted
  }

  // 更新概览统计
  if (newCompleted) {
    overviewStats.value.completedTasks++
  } else {
    overviewStats.value.completedTasks--
  }

  try {
    await completeTodayTask(task.id, { isCompleted: newCompleted })
  } catch (error) {
    console.error('更新任务状态失败:', error)
    // 回滚UI
    task.isCompleted = currentCompleted
    task.completed = currentCompleted
    if (todayTask) {
      todayTask.isCompleted = currentCompleted
      todayTask.completed = currentCompleted
    }
    // 回滚统计
    if (newCompleted) {
      overviewStats.value.completedTasks--
    } else {
      overviewStats.value.completedTasks++
    }
    showError('更新任务状态失败')
  }
}

const deletePlan = async (planId) => {
  // 防抖锁：防止重复点击
  if (deletePlan.executing && deletePlan.executing.has(planId)) {
    console.log('⚠️ 删除操作正在进行中，请勿重复点击')
    return
  }

  // 创建锁
  if (!deletePlan.executing) {
    deletePlan.executing = new Set()
  }
  deletePlan.executing.add(planId)

  console.log('🔴 [删除开始] planId:', planId)

  if (!confirm('确定要删除这个计划吗？')) {
    deletePlan.executing.delete(planId)
    return
  }

  // 找到要删除的计划（用于回滚）
  const planToRemove = plans.value.find(p => p.id === planId)
  console.log('🔴 找到要删除的计划:', planToRemove)
  if (!planToRemove) return

  // 乐观更新：先更新 UI，给用户即时反馈
  plans.value = plans.value.filter(p => p.id !== planId)
  overviewStats.value.planCount--
  console.log('🔴 UI 已更新，当前 plans 数量:', plans.value.length)

  // 本地 AI 计划（ID 以 ai- 开头）不需要调用后端 API
  if (planId.toString().startsWith('ai-')) {
    console.log('🔴 本地 AI 计划，直接完成删除')
    deletePlan.executing.delete(planId)
    // 只刷新今日任务（不需要刷新计划列表，因为 AI 计划不在后端）
    try {
      await loadTodayTasks()
      console.log('🔴 今日任务已刷新')
    } catch (e) {
      console.error('⚠️ 刷新今日任务失败:', e)
    }
    return
  }

  try {
    console.log('🔴 调用 apiDeletePlan...')
    const res = await apiDeletePlan(planId)
    console.log('🔴 API 响应:', res)
    console.log('🔴 响应类型:', typeof res)
    console.log('🔴 res.code:', res?.code)

    // 如果后端返回明确的业务错误码
    if (res && res.code && res.code !== 200) {
      console.error('🔴 业务错误，code:', res.code, 'message:', res.message)
      throw new Error(res.message || '删除失败')
    }

    // 删除成功，尝试刷新数据（即使刷新失败也不影响删除结果）
    console.log('🔴 删除成功，开始刷新数据...')
    try {
      const results = await Promise.all([loadPlanList(), loadOverview(), loadTodayTasks()])
      console.log('🔴 刷新完成，results:', results)
    } catch (refreshError) {
      console.error('⚠️ 刷新数据失败（但删除可能已成功）:', refreshError)
      console.error('⚠️ refreshError.stack:', refreshError.stack)
      // 不抛出异常，不回滚 UI
    } finally {
      // 释放锁
      deletePlan.executing.delete(planId)
    }
  } catch (error) {
    console.error('❌ 删除计划捕获到异常:', error)
    console.error('❌ error.name:', error.name)
    console.error('❌ error.message:', error.message)
    console.error('❌ error.response:', error.response)

    // 回滚 UI
    plans.value.unshift(planToRemove)
    overviewStats.value.planCount++
    console.log('❌ UI 已回滚')
    showError('删除计划失败，请刷新页面确认')
  } finally {
    // 确保锁被释放（无论成功还是失败）
    if (deletePlan.executing && deletePlan.executing.has(planId)) {
      deletePlan.executing.delete(planId)
    }
  }
}

const openPlanDetail = async (plan) => {
  // 本地 AI 计划（ID 以 ai- 开头）已经有完整数据，直接使用
  if (plan.id.toString().startsWith('ai-')) {
    selectedPlan.value = plan
    showPlanDetail.value = true
    return
  }

  isLoading.value = true
  try {
    const res = await getPlanDetail(plan.id)
    if (res.code === 200 && res.data) {
      selectedPlan.value = res.data
      showPlanDetail.value = true
    }
  } catch (error) {
    console.error('获取计划详情失败:', error)
    showError('加载计划详情失败')
  } finally {
    isLoading.value = false
  }
}

const generateAIPlan = async () => {
  if (!canGenerateAI.value) {
    showError('请填写完整信息')
    return
  }

  isLoading.value = true

  try {
    // 获取或设置默认日期
    const today = new Date().toISOString().split('T')[0]
    const defaultEndDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // 训练天数直接使用已选择的日期数组
    const trainingDaysStr = aiForm.value.trainingDays.join('、')
    
    const requestData = {
      goal: aiForm.value.goal,
      level: aiForm.value.level,
      daysPerWeek: aiForm.value.trainingDays.length,
      duration: 4,
      preferences: '均衡',
      restrictions: aiForm.value.additionalRequirements,
      notes: '',
      save: true,
      start_date: aiForm.value.startDate || today,
      end_date: aiForm.value.endDate || defaultEndDate,
      training_days: trainingDaysStr
    }
    console.log('📤 AI 请求数据:', requestData)
    
    // 调用 AI API 生成计划
    const res = await generatePlan(requestData)

    if (res.code === 200 && res.data) {
      const difficultyMap = { '初学者': '初级', '有基础': '中级', '健身达人': '高级' }

      // 从 AI 返回的训练计划中提取任务
      let tasks = []
      let weeklySchedule = []
      let planId = null
      let savedPlan = null

      // 检查是否有已保存的计划
      if (res.data.saved_plan) {
        savedPlan = res.data.saved_plan
        planId = savedPlan.plan_id
      }

      if (res.data.plan && res.data.plan.weekly_schedule) {
        // 解析 AI 返回的训练计划格式
        // AI 返回的是扁平数组 [{day: "周一", ...}, {day: "周三", ...}]
        const aiPlan = res.data.plan
        const daysData = aiPlan.weekly_schedule

        // 获取用户选择的训练日
        const selectedDays = aiForm.value.trainingDays || []
        const allDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const trainingDaysSet = new Set(selectedDays)

        // 解析开始日期
        const startDateStr = savedPlan?.start_date || aiForm.value.startDate
        const startDate = startDateStr ? new Date(startDateStr) : new Date()

        // 按周分组，每周7天，填充休息日
        const weeks = []
        let currentWeek = []
        let currentDate = new Date(startDate)

        // 如果开始日期不是周日，调整到对应周的周日
        const dayOfWeek = currentDate.getDay()
        const daysToSunday = dayOfWeek
        currentDate.setDate(currentDate.getDate() - daysToSunday)

        for (let i = 0; i < 28; i++) { // 4周 = 28天
          const date = new Date(currentDate)
          date.setDate(currentDate.getDate() + i)

          const dayName = allDays[date.getDay()]
          const dateKey = date.toISOString().split('T')[0]

          // 查找这一天是否有训练任务
          const dayData = daysData.find(d => {
            if (d.date === dateKey) return true
            if (d.day === dayName) return true
            return false
          })

          if (trainingDaysSet.has(dayName) && dayData) {
            // 训练日
            currentWeek.push({
              date: dateKey,
              day: dayName,
              dayOfWeek: dayName,
              isRestDay: false,
              exercises: dayData.exercises || [],
              tasks: (dayData.exercises || []).map((ex, exIdx) => ({
                id: `ai-${Date.now()}-${i}-${exIdx}`,
                name: ex.name,
                type: ex.type || '综合',
                duration: ex.duration || 30,
                durationMinutes: ex.duration || 30,
                calories: ex.calories || 0,
                sets: ex.sets,
                reps: ex.reps,
                rest: ex.rest,
                isCompleted: false
              })),
              totalDuration: dayData.estimated_calories || 0,
              totalCalories: dayData.estimated_calories || 0
            })
          } else {
            // 休息日
            currentWeek.push({
              date: dateKey,
              day: dayName,
              dayOfWeek: dayName,
              isRestDay: true,
              exercises: [],
              tasks: [],
              totalDuration: 0,
              totalCalories: 0
            })
          }

          if (currentWeek.length === 7) {
            weeks.push(currentWeek)
            currentWeek = []
          }
        }

        weeklySchedule = weeks.map((weekDays, weekIdx) => ({
          weekNumber: weekIdx + 1,
          weekLabel: `第${weekIdx + 1}周`,
          trainingDays: weekDays.filter(d => !d.isRestDay).length,
          restDays: weekDays.filter(d => d.isRestDay).length,
          days: weekDays
        }))

        tasks = weeklySchedule.flatMap(w => w.days.flatMap(d => d.tasks))
      }

      // 如果有保存的计划，获取保存的 ID
      if (!planId && res.data.saved_plan_id) {
        planId = res.data.saved_plan_id
      }

      const newPlan = {
        id: planId || `ai-${Date.now()}`,
        name: res.data.plan?.plan_name || savedPlan?.plan_name || `AI智能${aiForm.value.goal}计划`,
        description: res.data.plan?.description || savedPlan?.description || `基于${aiForm.value.goal}目标的AI训练计划`,
        type: 'AI生成',
        duration: res.data.plan?.duration_weeks ? `${res.data.plan.duration_weeks}周` : `${aiForm.value.trainingDays.length * 4}周`,
        difficulty: res.data.plan?.difficulty || savedPlan?.difficulty || difficultyMap[aiForm.value.level] || '中级',
        startDate: savedPlan?.start_date || aiForm.value.startDate || new Date().toISOString().split('T')[0],
        endDate: savedPlan?.end_date || aiForm.value.endDate || '',
        tasks: tasks,
        weeklySchedule: weeklySchedule,
        totalTasks: tasks.length,
        totalCalories: tasks.reduce((sum, t) => sum + (t.calories || 0), 0)
      }

      plans.value.unshift(newPlan)
      overviewStats.value.planCount++

      // 关闭弹窗
      showAIDialog.value = false

      // 重置表单
      aiForm.value = {
        goal: '',
        level: '',
        trainingDays: [],
        startDate: '',
        endDate: '',
        additionalRequirements: ''
      }

      showSuccess('AI计划生成成功！')

      // 生成后立即同步后端“今日任务”，避免页面仍显示空列表
      await loadTodayTasks()
    } else {
      throw new Error(res.message || '生成失败')
    }
  } catch (error) {
    console.error('AI生成计划失败:', error)
    showError(error.message || '生成计划失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const addPresetExercise = (exercise) => {
  manualTasks.value.push({ ...exercise })
}

const removeTask = (index) => {
  manualTasks.value.splice(index, 1)
}

const saveManualPlan = async () => {
  if (!canSaveManual.value) {
    showError('请填写计划名称并添加至少一个训练任务')
    return
  }

  isLoading.value = true

  try {
    const res = await createPlan({
      name: manualForm.value.name,
      description: manualForm.value.description || '自定义训练计划',
      difficulty: manualForm.value.difficulty,
      startDate: manualForm.value.startDate,
      endDate: manualForm.value.endDate,
      tasks: manualTasks.value.map(t => ({
        name: t.name,
        type: t.type,
        duration: t.duration,
        durationMinutes: parseInt(t.duration) || 0,
        calories: t.calories,
        sets: t.sets || null,
        reps: t.reps || null
      }))
    })

    if (res.code === 200 && res.data) {
      const newPlan = {
        ...res.data,
        id: res.data.planId
      }

      plans.value.unshift(newPlan)
      overviewStats.value.planCount++

      // 关闭弹窗（不打开详情页，直接回到列表）
      showManualDialog.value = false

      // 重置表单
      manualForm.value = {
        name: '',
        description: '',
        duration: '',
        difficulty: '中级',
        startDate: '',
        endDate: ''
      }
      manualTasks.value = []

      // 自动刷新计划列表和概览
      await Promise.all([loadPlanList(), loadOverview()])

      // 显示成功提示
      showSuccess('计划创建成功！')
    } else {
      throw new Error(res.message || '创建失败')
    }
  } catch (error) {
    console.error('创建计划失败:', error)
    showError(error.message || '创建计划失败，请重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.plan-page {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.error-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  z-index: 900;
  animation: slideDown 0.3s ease;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.page-subtitle {
  color: #6b7280;
  margin: 4px 0 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  border-color: #2563eb;
  color: #2563eb;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-blue { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; }
.stat-cyan { background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; }
.stat-gradient { background: linear-gradient(135deg, #2563eb, #06b6d4); color: white; }
.stat-blue-light { background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; }

.stat-icon {
  width: 48px;
  height: 48px;
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
  font-size: 24px;
  font-weight: 700;
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  flex: 1;
  padding: 14px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #2563eb;
  background: #f3f4f6;
}

.tab-btn.active {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
  margin-bottom: -1px;
}

.tab-content {
  padding: 20px;
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

/* Plans List */
.plans-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.plan-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.plan-card.ended {
  opacity: 0.7;
  background: #f9fafb;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.plan-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px;
}

.plan-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-ai {
  background: #dbeafe;
  color: #2563eb;
}

.badge-manual {
  background: #f3f4f6;
  color: #6b7280;
}

.badge-初级 { background: #d1fae5; color: #059669; }
.badge-中级 { background: #fef3c7; color: #d97706; }
.badge-高级 { background: #fee2e2; color: #dc2626; }
.badge-ended { background: #e5e7eb; color: #6b7280; }

.delete-btn {
  padding: 8px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

.plan-desc {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 12px;
}

.plan-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 12px;
}

.plan-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

/* Today's Tasks */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;
}

.task-item.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.task-checkbox {
  width: 28px;
  height: 28px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  transition: all 0.2s;
}

.task-item.completed .task-checkbox {
  background: #22c55e;
  border-color: #22c55e;
  color: white;
}

.task-info {
  flex: 1;
}

.task-name {
  font-weight: 500;
  color: #1f2937;
  display: block;
  margin-bottom: 4px;
}

.task-item.completed .task-name {
  text-decoration: line-through;
  color: #9ca3af;
}

.task-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.task-type {
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 12px;
  color: #6b7280;
}

/* Dialog */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.dialog {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: dialogIn 0.3s ease;
}

.dialog-lg { max-width: 720px; }
.dialog-xl { max-width: 900px; }

@keyframes dialogIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-close {
  padding: 8px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.dialog-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-outline {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  border-color: #2563eb;
  color: #2563eb;
}

/* Form */
.form-section {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.goal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.goal-btn {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.goal-btn:hover {
  border-color: #2563eb;
}

.goal-btn.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.goal-icon {
  font-size: 32px;
}

.goal-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.level-grid, .days-grid {
  display: flex;
  gap: 8px;
}

.level-btn, .day-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.level-btn:hover, .day-btn:hover {
  border-color: #2563eb;
}

.level-btn.active, .day-btn.active {
  border-color: #2563eb;
  background: #2563eb;
  color: white;
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.task-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.task-number {
  width: 28px;
  height: 28px;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.task-details {
  flex: 1;
}

.task-name {
  font-weight: 500;
  color: #1f2937;
  display: block;
}

.task-info {
  font-size: 12px;
  color: #9ca3af;
}

.remove-btn {
  padding: 6px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Exercise Grid */
.exercise-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.exercise-btn {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.exercise-btn:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.exercise-name {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  display: block;
}

.exercise-meta {
  font-size: 11px;
  color: #9ca3af;
}

/* Plan Detail */
.detail-header {
  background: linear-gradient(135deg, #eff6ff, #ecfeff);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.detail-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.detail-desc {
  color: #6b7280;
  margin: 0 0 12px;
}

.detail-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}

.section-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
}

.detail-task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 12px;
}

.detail-task-item.completed {
  background: #f0fdf4;
}

.detail-task-number {
  width: 28px;
  height: 28px;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.detail-task-info {
  flex: 1;
}

.detail-task-name {
  font-weight: 500;
  color: #1f2937;
  display: block;
  margin-bottom: 4px;
}

.detail-task-item.completed .detail-task-name {
  text-decoration: line-through;
  color: #9ca3af;
}

.detail-task-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #9ca3af;
}

/* 计划详情 - 每周排程 */
.detail-schedule {
  margin-top: 24px;
}

.week-section {
  margin-bottom: 24px;
  background: #f9fafb;
  border-radius: 16px;
  padding: 16px;
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.week-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.week-info {
  font-size: 12px;
  color: #6b7280;
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  min-height: 120px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.day-card:hover {
  border-color: #2563eb;
}

.day-card.rest-day {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.day-card.today {
  border-color: #2563eb;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.day-card.past {
  opacity: 0.7;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.day-date {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.day-label {
  font-size: 11px;
  color: #9ca3af;
}

.rest-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 30px);
  gap: 4px;
}

.rest-icon {
  font-size: 20px;
}

.rest-text {
  font-size: 11px;
  color: #9ca3af;
}

.training-content {
  display: flex;
  flex-direction: column;
}

.day-tasks {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.day-task-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
}

.task-check {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #22c55e;
}

.task-dot {
  width: 6px;
  height: 6px;
  background: #d1d5db;
  border-radius: 50%;
  margin-top: 5px;
}

.day-task-item.completed .task-name {
  text-decoration: line-through;
  color: #9ca3af;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-name {
  display: block;
  color: #1f2937;
  font-weight: 500;
  line-height: 1.3;
}

.task-meta {
  display: block;
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
}

.no-tasks {
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  padding: 8px;
}

.day-summary {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e5e7eb;
  font-size: 10px;
  color: #6b7280;
}

.empty-detail {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .exercise-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .week-days {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
  }

  .btn-primary, .btn-secondary {
    flex: 1;
    justify-content: center;
  }

  .week-days {
    grid-template-columns: repeat(2, 1fr);
  }

  .dialog-xl {
    max-width: 95vw;
  }
}

@media (max-width: 480px) {
  .week-days {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .goal-grid {
    grid-template-columns: 1fr;
  }

  .exercise-grid {
    grid-template-columns: 1fr;
  }
}
</style>