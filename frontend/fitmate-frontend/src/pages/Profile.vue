<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">个人中心</h1>
      <p class="page-subtitle">管理你的个人信息和偏好设置</p>
    </div>

    <!-- Profile Card -->
    <div class="profile-card">
      <div class="profile-header">
        <!-- Avatar -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <div class="avatar">
              <span class="avatar-emoji">👤</span>
            </div>
            <button class="avatar-edit-btn" @click="isEditing = !isEditing">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- User Info -->
        <div class="user-info">
          <div class="user-name">
            <input
              v-if="isEditing"
              v-model="userInfo.name"
              type="text"
              class="edit-input"
              placeholder="姓名"
            />
            <h2 v-else class="name-text">{{ userInfo.name }}</h2>
          </div>

          <div class="user-details">
            <div class="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
              <input
                v-if="isEditing"
                v-model="userInfo.email"
                type="email"
                class="edit-input inline"
                placeholder="邮箱"
              />
              <span v-else>{{ userInfo.email }}</span>
            </div>
            <div class="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <path d="M12 18h.01"/>
              </svg>
              <input
                v-if="isEditing"
                v-model="userInfo.phone"
                type="tel"
                class="edit-input inline"
                placeholder="手机号"
              />
              <span v-else>{{ userInfo.phone }}</span>
            </div>
            <div class="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span>加入于 {{ userInfo.joinDate }}</span>
            </div>
          </div>
        </div>

        <!-- Edit Button -->
        <button
          class="edit-btn"
          :class="{ active: isEditing }"
          @click="handleSave"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          {{ isEditing ? '保存' : '编辑' }}
        </button>
      </div>

      <!-- Body Stats -->
      <div class="body-stats">
        <h3 class="section-title">身体数据</h3>
        <div class="stats-row">
          <!-- Height -->
          <div class="stat-item">
            <label class="stat-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12h2m4 0h12M12 2v2m0 18v2"/>
                <rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
              身高
            </label>
            <div v-if="isEditing" class="edit-wrapper">
              <input
                v-model.number="userInfo.height"
                type="number"
                class="edit-input"
                placeholder="175"
              />
              <span class="unit">cm</span>
            </div>
            <div v-else class="stat-value-display">
              <span class="value">{{ userInfo.height }}</span>
              <span class="unit">厘米</span>
            </div>
          </div>

          <!-- Weight -->
          <div class="stat-item">
            <label class="stat-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              体重
            </label>
            <div v-if="isEditing" class="edit-wrapper">
              <input
                v-model.number="userInfo.weight"
                type="number"
                class="edit-input"
                placeholder="70"
              />
              <span class="unit">kg</span>
            </div>
            <div v-else class="stat-value-display">
              <span class="value">{{ userInfo.weight }}</span>
              <span class="unit">千克</span>
            </div>
          </div>

          <!-- BMI -->
          <div class="stat-item">
            <label class="stat-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              BMI指数
            </label>
            <div class="stat-value-display bmi-display">
              <span class="value">{{ calculateBMI() }}</span>
              <span class="bmi-status" :class="getBMIStatus().class">{{ getBMIStatus().status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Training Stats -->
    <div class="training-stats">
      <div
        v-for="stat in trainingStats"
        :key="stat.label"
        class="training-stat-card"
        :style="{ background: stat.gradient }"
      >
        <span class="training-stat-label">{{ stat.label }}</span>
        <span class="training-stat-value">{{ stat.value }}</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'achievements' }"
          @click="activeTab = 'achievements'"
        >
          成就徽章
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          设置
        </button>
      </div>

      <!-- Achievements Tab -->
      <div v-show="activeTab === 'achievements'" class="tab-content">
        <div class="achievements-grid">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card"
            :class="{ earned: achievement.earned }"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <h4 class="achievement-name">{{ achievement.name }}</h4>
            <p class="achievement-desc">{{ achievement.description }}</p>
            <span v-if="achievement.earned" class="earned-badge">已获得</span>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-show="activeTab === 'settings'" class="tab-content">
        <!-- Notification Settings -->
        <div class="settings-section">
          <h3 class="settings-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            通知设置
          </h3>
          <div class="settings-list">
            <div class="settings-item">
              <div class="settings-info">
                <span class="settings-label">邮件通知</span>
                <span class="settings-desc">接收训练提醒和周报邮件</span>
              </div>
              <button
                class="toggle-btn"
                :class="{ active: settings.emailNotification }"
                @click="settings.emailNotification = !settings.emailNotification"
              >
                <span class="toggle-dot"></span>
              </button>
            </div>
            <div class="settings-item">
              <div class="settings-info">
                <span class="settings-label">推送通知</span>
                <span class="settings-desc">接收APP推送通知</span>
              </div>
              <button
                class="toggle-btn"
                :class="{ active: settings.pushNotification }"
                @click="settings.pushNotification = !settings.pushNotification"
              >
                <span class="toggle-dot"></span>
              </button>
            </div>
            <div class="settings-item">
              <div class="settings-info">
                <span class="settings-label">周报通知</span>
                <span class="settings-desc">每周接收训练数据周报</span>
              </div>
              <button
                class="toggle-btn"
                :class="{ active: settings.weeklyReport }"
                @click="settings.weeklyReport = !settings.weeklyReport"
              >
                <span class="toggle-dot"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="settings-section">
          <h3 class="settings-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            隐私与安全
          </h3>
          <div class="settings-list">
            <button class="settings-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              修改密码
            </button>
            <button class="settings-btn danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              注销账号
            </button>
          </div>
        </div>

        <!-- Logout -->
        <div class="logout-section">
          <button class="logout-btn" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isEditing = ref(false)
const activeTab = ref('achievements')

const userInfo = ref({
  name: '李明',
  email: 'liming@example.com',
  phone: '138****8888',
  height: 175,
  weight: 70,
  joinDate: '2024年1月'
})

const settings = ref({
  emailNotification: true,
  pushNotification: true,
  weeklyReport: true
})

const achievements = ref([
  { id: 1, name: '坚持之星', description: '连续训练7天', icon: '⭐', earned: true },
  { id: 2, name: '燃脂达人', description: '累计消耗10000卡路里', icon: '🔥', earned: true },
  { id: 3, name: '力量之王', description: '完成100次力量训练', icon: '💪', earned: true },
  { id: 4, name: '马拉松挑战', description: '跑步累计100公里', icon: '🏃', earned: false },
  { id: 5, name: '早起鸟', description: '早晨6点前训练30次', icon: '🌅', earned: false },
  { id: 6, name: '健身大师', description: '累计训练365天', icon: '🏆', earned: false }
])

const trainingStats = [
  { label: '累计训练天数', value: '89天', gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
  { label: '总训练时长', value: '156小时', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)' },
  { label: '消耗卡路里', value: '23,456', gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)' },
  { label: '完成计划', value: '12个', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }
]

const calculateBMI = () => {
  if (userInfo.value.height && userInfo.value.weight) {
    const heightInMeters = userInfo.value.height / 100
    const bmi = userInfo.value.weight / (heightInMeters * heightInMeters)
    return bmi.toFixed(1)
  }
  return '—'
}

const getBMIStatus = () => {
  const bmi = parseFloat(calculateBMI())
  if (isNaN(bmi)) return { status: '—', class: '' }
  if (bmi < 18.5) return { status: '偏瘦', class: 'status-blue' }
  if (bmi < 24) return { status: '正常', class: 'status-green' }
  if (bmi < 28) return { status: '偏胖', class: 'status-yellow' }
  return { status: '肥胖', class: 'status-red' }
}

const handleSave = () => {
  if (isEditing.value) {
    // Save logic here
    alert('保存成功')
  }
  isEditing.value = !isEditing.value
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    router.push('/login')
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
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

/* Profile Card */
.profile-card {
  background: linear-gradient(135deg, #eff6ff, #ecfeff);
  border: 1px solid #e0f2fe;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-emoji {
  font-size: 56px;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.avatar-edit-btn:hover {
  transform: scale(1.05);
}

.user-info {
  flex: 1;
}

.user-name {
  margin-bottom: 16px;
}

.name-text {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.edit-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.edit-input.inline {
  width: auto;
  min-width: 200px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.edit-btn {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.edit-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.edit-btn.active {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-color: transparent;
  color: white;
}

/* Body Stats */
.body-stats {
  border-top: 1px solid #bae6fd;
  padding-top: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.stat-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.edit-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-wrapper .edit-input {
  width: 80px;
}

.stat-value-display {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat-value-display .value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.stat-value-display .unit {
  font-size: 13px;
  color: #9ca3af;
}

.bmi-display {
  flex-direction: column;
  gap: 4px;
}

.bmi-status {
  font-size: 13px;
  font-weight: 500;
}

.status-blue { color: #2563eb; }
.status-green { color: #22c55e; }
.status-yellow { color: #eab308; }
.status-red { color: #ef4444; }

/* Training Stats */
.training-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.training-stat-card {
  padding: 20px;
  border-radius: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.training-stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.training-stat-value {
  font-size: 28px;
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
  padding: 16px;
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
  padding: 24px;
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.achievement-card {
  padding: 24px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  text-align: center;
  background: #f9fafb;
  opacity: 0.6;
  transition: all 0.3s;
}

.achievement-card.earned {
  border-color: #fcd34d;
  background: linear-gradient(135deg, #fef3c7, #fef9c3);
  opacity: 1;
}

.achievement-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.achievement-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px;
}

.achievement-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.earned-badge {
  display: inline-block;
  margin-top: 12px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* Settings */
.settings-section {
  margin-bottom: 24px;
}

.settings-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-list {
  background: #f9fafb;
  border-radius: 12px;
  overflow: hidden;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.settings-label {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.settings-desc {
  font-size: 12px;
  color: #9ca3af;
}

.toggle-btn {
  width: 48px;
  height: 28px;
  background: #d1d5db;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
}

.toggle-dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 12px;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-btn.active .toggle-dot {
  transform: translateX(20px);
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s;
}

.settings-btn:hover {
  background: #f3f4f6;
}

.settings-btn.danger {
  color: #dc2626;
}

.settings-btn.danger:hover {
  background: #fef2f2;
}

.logout-section {
  padding-top: 16px;
}

.logout-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-details {
    align-items: center;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .training-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>