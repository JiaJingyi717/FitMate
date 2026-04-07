<template>
  <div class="plan-page">
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
          @click="activeTab = 'today'"
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
          <div v-if="todayTasks.length === 0" class="empty-state">
            <p>今天还没有训练任务</p>
          </div>
          <div v-else class="tasks-list">
            <div
              v-for="task in todayTasks"
              :key="task.id"
              class="task-item"
              :class="{ completed: task.completed }"
            >
              <button class="task-checkbox" @click="toggleTaskComplete(task.id)">
                <svg v-if="task.completed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </button>
              <div class="task-info">
                <span class="task-name">{{ task.name }}</span>
                <div class="task-meta">
                  <span>⏱️ {{ task.duration }}</span>
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
              </div>
              <p class="detail-desc">{{ selectedPlan.description }}</p>
              <div class="detail-stats">
                <span>📅 {{ selectedPlan.duration }}</span>
                <span>💪 {{ selectedPlan.tasks.length }}个动作</span>
                <span>🔥 {{ getPlanCalories(selectedPlan) }}卡路里</span>
              </div>
            </div>

            <div class="detail-tasks">
              <h4 class="section-subtitle">训练内容</h4>
              <div class="detail-task-list">
                <div
                  v-for="(task, index) in selectedPlan.tasks"
                  :key="index"
                  class="detail-task-item"
                  :class="{ completed: task.completed }"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')
const showAIDialog = ref(false)
const showManualDialog = ref(false)
const showPlanDetail = ref(false)
const selectedPlan = ref(null)

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

const plans = ref([
  {
    id: 1,
    name: '燃脂减肥计划',
    description: '针对减脂目标的综合训练计划',
    type: 'AI生成',
    duration: '4周',
    difficulty: '中级',
    tasks: [
      { id: 1, name: '热身跑步', type: '有氧', duration: '10分钟', calories: 80, completed: true },
      { id: 2, name: '波比跳', type: 'HIIT', duration: '15分钟', calories: 150, completed: true, sets: 5, reps: 10 },
      { id: 3, name: '平板支撑', type: '核心', duration: '5分钟', calories: 40, completed: false, sets: 3, reps: 60 },
      { id: 4, name: '慢跑放松', type: '有氧', duration: '10分钟', calories: 70, completed: false }
    ]
  },
  {
    id: 2,
    name: '力量增肌计划',
    description: '专注于肌肉增长的力量训练',
    type: '手动创建',
    duration: '8周',
    difficulty: '高级',
    tasks: [
      { id: 5, name: '深蹲', type: '腿部', duration: '20分钟', calories: 120, completed: false, sets: 4, reps: 12 },
      { id: 6, name: '卧推', type: '胸部', duration: '20分钟', calories: 110, completed: false, sets: 4, reps: 10 },
      { id: 7, name: '硬拉', type: '背部', duration: '20分钟', calories: 130, completed: false, sets: 3, reps: 8 }
    ]
  }
])

const stats = computed(() => {
  const allTasks = plans.value.flatMap(p => p.tasks)
  const completed = allTasks.filter(t => t.completed).length
  const total = allTasks.length
  const totalCalories = allTasks.filter(t => t.completed).reduce((sum, t) => sum + t.calories, 0)
  const totalDuration = allTasks.filter(t => t.completed).reduce((sum, t) => {
    const mins = parseInt(t.duration)
    return sum + (isNaN(mins) ? 0 : mins)
  }, 0)
  return { completed, total, totalCalories, totalDuration }
})

const todayTasks = computed(() => {
  return plans.value.flatMap(p => p.tasks.map(t => ({ ...t, planName: p.name })))
})

const canGenerateAI = computed(() => {
  return aiForm.value.goal && aiForm.value.level && aiForm.value.startDate && aiForm.value.endDate
})

const canSaveManual = computed(() => {
  return manualForm.value.name && manualTasks.value.length > 0 && manualForm.value.startDate && manualForm.value.endDate
})

const isPlanEnded = (plan) => {
  if (!plan.endDate) return false
  const today = new Date()
  const endDate = new Date(plan.endDate)
  return today > endDate
}

const getPlanCalories = (plan) => {
  return plan.tasks.reduce((sum, t) => sum + t.calories, 0)
}

const getPlanProgress = (plan) => {
  const total = plan.tasks.length
  const completed = plan.tasks.filter(t => t.completed).length
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

const getPlanCompleted = (plan) => {
  return plan.tasks.filter(t => t.completed).length
}

const getPlanTotal = (plan) => {
  return plan.tasks.length
}

const toggleDay = (day) => {
  if (aiForm.value.trainingDays.includes(day)) {
    aiForm.value.trainingDays = aiForm.value.trainingDays.filter(d => d !== day)
  } else {
    aiForm.value.trainingDays.push(day)
  }
}

const toggleTaskComplete = (taskId) => {
  plans.value.forEach(plan => {
    const task = plan.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
    }
  })
}

const deletePlan = (planId) => {
  if (confirm('确定要删除这个计划吗？')) {
    plans.value = plans.value.filter(p => p.id !== planId)
  }
}

const openPlanDetail = (plan) => {
  selectedPlan.value = plan
  showPlanDetail.value = true
}

const generateAIPlan = () => {
  const goalTemplates = {
    '减脂': {
      name: 'AI智能减脂计划',
      description: '基于你的目标定制的科学减脂方案',
      tasks: [
        { id: Date.now() + 1, name: '热身慢跑', type: '有氧', duration: '10分钟', calories: 80, completed: false },
        { id: Date.now() + 2, name: '开合跳', type: 'HIIT', duration: '10分钟', calories: 120, completed: false, sets: 4, reps: 30 },
        { id: Date.now() + 3, name: '波比跳', type: 'HIIT', duration: '12分钟', calories: 150, completed: false, sets: 5, reps: 10 }
      ]
    },
    '增肌': {
      name: 'AI智能增肌计划',
      description: '基于你的体能水平设计的力量训练方案',
      tasks: [
        { id: Date.now() + 1, name: '动态拉伸', type: '热身', duration: '5分钟', calories: 30, completed: false },
        { id: Date.now() + 2, name: '杠铃深蹲', type: '腿部', duration: '20分钟', calories: 140, completed: false, sets: 4, reps: 10 },
        { id: Date.now() + 3, name: '卧推', type: '胸部', duration: '20分钟', calories: 120, completed: false, sets: 4, reps: 8 }
      ]
    },
    '塑形': {
      name: 'AI智能塑形计划',
      description: '结合力量和有氧的综合塑形方案',
      tasks: [
        { id: Date.now() + 1, name: '热身运动', type: '热身', duration: '5分钟', calories: 40, completed: false },
        { id: Date.now() + 2, name: '深蹲', type: '腿部', duration: '15分钟', calories: 100, completed: false, sets: 3, reps: 15 },
        { id: Date.now() + 3, name: '俯卧撑', type: '胸部', duration: '10分钟', calories: 80, completed: false, sets: 3, reps: 12 }
      ]
    }
  }

  const template = goalTemplates[aiForm.value.goal]
  const difficultyMap = { '初学者': '初级', '有基础': '中级', '健身达人': '高级' }

  const newPlan = {
    id: Date.now(),
    name: template.name,
    description: template.description,
    type: 'AI生成',
    duration: `${aiForm.value.trainingDays.length * 4}周`,
    difficulty: difficultyMap[aiForm.value.level] || '中级',
    startDate: aiForm.value.startDate,
    endDate: aiForm.value.endDate,
    tasks: template.tasks
  }

  plans.value.unshift(newPlan)
  showAIDialog.value = false

  // Reset form
  aiForm.value = {
    goal: '',
    level: '',
    trainingDays: [],
    startDate: '',
    endDate: '',
    additionalRequirements: ''
  }

  alert('计划生成成功！')
}

const addPresetExercise = (exercise) => {
  manualTasks.value.push({ ...exercise })
}

const removeTask = (index) => {
  manualTasks.value.splice(index, 1)
}

const saveManualPlan = () => {
  const newPlan = {
    id: Date.now(),
    name: manualForm.value.name,
    description: manualForm.value.description || '自定义训练计划',
    type: '手动创建',
    duration: manualForm.value.duration || '自定义',
    difficulty: manualForm.value.difficulty,
    startDate: manualForm.value.startDate,
    endDate: manualForm.value.endDate,
    tasks: manualTasks.value.map((t, i) => ({ ...t, id: Date.now() + i }))
  }

  plans.value.unshift(newPlan)
  showManualDialog.value = false

  // Reset form
  manualForm.value = {
    name: '',
    description: '',
    duration: '',
    difficulty: '中级',
    startDate: '',
    endDate: ''
  }
  manualTasks.value = []

  alert('计划保存成功！')
}
</script>

<style scoped>
.plan-page {
  max-width: 1200px;
  margin: 0 auto;
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
  z-index: 1000;
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

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .exercise-grid {
    grid-template-columns: repeat(2, 1fr);
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