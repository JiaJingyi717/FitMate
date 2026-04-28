<template>
  <div class="profile-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

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
            <div class="avatar" @click="handleAvatarClick">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="avatar" class="avatar-img" />
              <span v-else class="avatar-emoji">👤</span>
            </div>
            <button class="avatar-edit-btn" @click="handleAvatarClick">
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
              v-model="editForm.name"
              type="text"
              class="edit-input"
              placeholder="姓名"
            />
            <h2 v-else class="name-text">{{ userInfo.name || '未设置昵称' }}</h2>
          </div>

          <div class="user-details">
            <div class="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
              <span>{{ userInfo.email || '未设置' }}</span>
            </div>
            <div class="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <path d="M12 18h.01"/>
              </svg>
              <span>{{ userInfo.phone || '未绑定手机' }}</span>
            </div>
            <div class="detail-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span>加入于 {{ userInfo.joinDate || '--' }}</span>
            </div>
            <div class="detail-item" v-if="userInfo.goal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              <span>健身目标：{{ userInfo.goal }}</span>
            </div>
          </div>
        </div>

        <!-- Edit Buttons -->
        <div class="edit-actions">
          <button
            v-if="isEditing"
            class="cancel-btn"
            @click="cancelEditing"
          >
            取消
          </button>
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
                v-model.number="editForm.height"
                type="number"
                class="edit-input"
                placeholder="175"
              />
              <span class="unit">cm</span>
            </div>
            <div v-else class="stat-value-display">
              <span class="value">{{ userInfo.height || '--' }}</span>
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
                v-model.number="editForm.weight"
                type="number"
                class="edit-input"
                placeholder="70"
              />
              <span class="unit">kg</span>
            </div>
            <div v-else class="stat-value-display">
              <span class="value">{{ userInfo.weight || '--' }}</span>
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
              <span class="value">{{ calculatedBMI || '--' }}</span>
              <span class="bmi-status" :class="getBMIStatus().class">{{ getBMIStatus().status }}</span>
            </div>
          </div>
        </div>

        <!-- Extended Edit Fields -->
        <div v-if="isEditing" class="edit-extended">
          <div class="edit-row">
            <div class="edit-field">
              <label>性别</label>
              <select v-model="editForm.gender" class="edit-input">
                <option :value="null">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="edit-field">
              <label>年龄</label>
              <input
                v-model.number="editForm.age"
                type="number"
                class="edit-input"
                placeholder="28"
              />
            </div>
          </div>
          <div class="edit-row">
            <div class="edit-field">
              <label>所在地</label>
              <input
                v-model="editForm.location"
                type="text"
                class="edit-input"
                placeholder="北京市朝阳区"
              />
            </div>
            <div class="edit-field">
              <label>健身目标</label>
              <select v-model="editForm.goal" class="edit-input">
                <option :value="''">请选择</option>
                <option value="减脂">减脂</option>
                <option value="增肌">增肌</option>
                <option value="塑形">塑形</option>
                <option value="体能提升">体能提升</option>
                <option value="健康维护">健康维护</option>
              </select>
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
        <div v-if="achievements.length === 0" class="empty-state">
          <span class="empty-icon">🏆</span>
          <p>暂无成就数据</p>
        </div>
        <div v-else class="achievements-grid">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card"
            :class="{ earned: achievement.isEarned }"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <h4 class="achievement-name">{{ achievement.name }}</h4>
            <p class="achievement-desc">{{ achievement.description }}</p>
            <span v-if="achievement.isEarned" class="earned-badge">已获得</span>
            <span v-else class="locked-badge">未解锁</span>
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
                @click="toggleSetting('emailNotification')"
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
                @click="toggleSetting('pushNotification')"
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
                @click="toggleSetting('weeklyReport')"
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
            <button class="settings-btn" @click="showPasswordModal = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              修改密码
            </button>
            <button class="settings-btn danger" @click="showDeleteConfirm = true">
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

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="modal-close" @click="showPasswordModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>旧密码</label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              class="form-input"
              placeholder="请输入旧密码"
            />
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="form-input"
              placeholder="请输入新密码（至少6位）"
            />
          </div>
          <div class="form-group">
            <label>确认密码</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="form-input"
              placeholder="请再次输入新密码"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showPasswordModal = false">取消</button>
          <button class="btn-primary" @click="handleChangePassword">确认修改</button>
        </div>
      </div>
    </div>

    <!-- 删除账号确认弹窗 -->
    <Dialog :show="showDeleteConfirm" title="注销账号" size="sm" @update:show="showDeleteConfirm = $event">
      <div class="delete-confirm-content">
        <div class="delete-warning-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <p class="delete-warning-text">确定要注销账号吗？</p>
        <p class="delete-warning-desc">此操作不可恢复，所有数据将被永久删除。</p>
        <div class="delete-confirm-buttons">
          <button class="btn-secondary" @click="showDeleteConfirm = false">取消</button>
          <button class="btn-danger" @click="confirmDeleteAccount">确认注销</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUserProfile, updateUserProfile, updateAvatar, getUserStats, getAchievements, changePassword, deleteAccount } from '../api/user.js'
import Dialog from '../components/Dialog.vue'

const router = useRouter()

// 状态管理
const isEditing = ref(false)
const activeTab = ref('achievements')
const loading = ref(false)
const showPasswordModal = ref(false)
const showDeleteConfirm = ref(false)

// 用户资料
const userInfo = ref({
  id: null,
  username: '',
  email: '',
  phone: '',
  name: '',
  avatar: '',
  gender: null,
  age: null,
  height: null,
  weight: null,
  bmi: null,
  location: '',
  joinDate: '',
  goal: ''
})

// 临时编辑数据
const editForm = ref({})

// 训练统计
const trainingStats = ref([
  { label: '累计训练天数', value: '--', gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)', key: 'totalDays' },
  { label: '总训练时长', value: '--', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', key: 'totalDuration' },
  { label: '消耗卡路里', value: '--', gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', key: 'totalCalories' },
  { label: '完成计划', value: '--', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', key: 'completedPlans' }
])

// 成就列表
const achievements = ref([])

// 设置相关
const settings = ref({
  emailNotification: true,
  pushNotification: true,
  weeklyReport: true
})

// 密码修改表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 初始化
onMounted(() => {
  loadUserProfile()
  loadUserStats()
  loadAchievements()
})

// 加载用户资料
async function loadUserProfile() {
  loading.value = true
  try {
    const res = await getUserProfile()
    if (res.code === 200) {
      userInfo.value = { ...userInfo.value, ...res.data }
      editForm.value = { ...res.data }
    }
  } catch (error) {
    console.error('获取用户资料失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载用户统计
async function loadUserStats() {
  try {
    const res = await getUserStats()
    if (res.code === 200) {
      trainingStats.value = trainingStats.value.map(stat => ({
        ...stat,
        value: formatStatValue(stat.key, res.data[stat.key])
      }))
    }
  } catch (error) {
    console.error('获取用户统计失败:', error)
  }
}

// 格式化统计值
function formatStatValue(key, value) {
  if (value === null || value === undefined) return '--'
  switch (key) {
    case 'totalDuration':
      const hours = Math.floor(value / 60)
      return hours > 0 ? `${hours}小时` : `${value}分钟`
    case 'totalCalories':
      return value.toLocaleString()
    case 'completedPlans':
      return `${value}个`
    case 'totalDays':
      return `${value}天`
    default:
      return value
  }
}

// 加载成就
async function loadAchievements() {
  try {
    const res = await getAchievements()
    if (res.code === 200) {
      achievements.value = res.data || []
    }
  } catch (error) {
    console.error('获取成就列表失败:', error)
  }
}

// 计算BMI
const calculatedBMI = computed(() => {
  if (userInfo.value.height && userInfo.value.weight) {
    const heightInMeters = userInfo.value.height / 100
    const bmi = userInfo.value.weight / (heightInMeters * heightInMeters)
    return bmi.toFixed(1)
  }
  return null
})

// 获取BMI状态
function getBMIStatus() {
  const bmi = parseFloat(calculatedBMI.value)
  if (isNaN(bmi)) return { status: '—', class: '' }
  if (bmi < 18.5) return { status: '偏瘦', class: 'status-blue' }
  if (bmi < 24) return { status: '正常', class: 'status-green' }
  if (bmi < 28) return { status: '偏胖', class: 'status-yellow' }
  return { status: '肥胖', class: 'status-red' }
}

// 开始编辑
function startEditing() {
  editForm.value = { ...userInfo.value }
  isEditing.value = true
}

// 取消编辑
function cancelEditing() {
  isEditing.value = false
  editForm.value = { ...userInfo.value }
}

// 保存资料
async function handleSave() {
  if (isEditing.value) {
    loading.value = true
    try {
      // 构建更新数据（排除不可修改的字段）
      const updateData = {
        name: editForm.value.name,
        gender: editForm.value.gender,
        age: editForm.value.age,
        height: editForm.value.height,
        weight: editForm.value.weight,
        location: editForm.value.location,
        goal: editForm.value.goal
      }

      const res = await updateUserProfile(updateData)
      if (res.code === 200) {
        userInfo.value = { ...userInfo.value, ...updateData }
        isEditing.value = false
        alert('保存成功')
      } else {
        alert(res.message || '保存失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      loading.value = false
    }
  } else {
    startEditing()
  }
}

// 头像点击处理
function handleAvatarClick() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await uploadAvatar(file)
    }
  }
  input.click()
}

// 上传头像
async function uploadAvatar(file) {
  // 简单处理：将文件转为 base64
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const res = await updateAvatar({ avatar: e.target.result })
      if (res.code === 200) {
        userInfo.value.avatar = res.data.avatar
        alert('头像更新成功')
      }
    } catch (error) {
      console.error('头像上传失败:', error)
      alert('头像上传失败')
    }
  }
  reader.readAsDataURL(file)
}

// 修改密码
async function handleChangePassword() {
  if (!passwordForm.value.oldPassword) {
    alert('请输入旧密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    alert('请输入新密码')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    alert('新密码至少6位')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }

  try {
    const res = await changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    if (res.code === 200) {
      alert('密码修改成功')
      showPasswordModal.value = false
      passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    } else {
      alert(res.message || '密码修改失败')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    alert('修改密码失败，请重试')
  }
}

// 确认注销账号
async function confirmDeleteAccount() {
  showDeleteConfirm.value = false

  try {
    const res = await deleteAccount()
    if (res.code === 200) {
      alert('账号已注销')
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      alert(res.message || '注销失败')
    }
  } catch (error) {
    console.error('注销失败:', error)
    alert('注销失败，请重试')
  }
}

// 退出登录
async function handleLogout() {
  if (!confirm('确定要退出登录吗？')) {
    return
  }

  localStorage.removeItem('token')
  router.push('/login')
}

// 通知设置切换
async function toggleSetting(key) {
  settings.value[key] = !settings.value[key]
  // TODO: 调用API保存设置
}
</script>

<style scoped>
/* Loading */
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
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
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

/* 删除账号确认弹窗样式 */
.delete-confirm-content {
  text-align: center;
  padding: 8px 0;
}

.delete-warning-icon {
  margin-bottom: 16px;
}

.delete-warning-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.delete-warning-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.delete-confirm-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-danger {
  padding: 10px 24px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: translateY(-1px);
}

.btn-danger:active {
  transform: translateY(0);
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

/* Extended Edit Fields */
.edit-extended {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #bae6fd;
}

.edit-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 12px;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-field label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.edit-field .edit-input {
  width: 100%;
}

/* Avatar Image */
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

/* Locked Badge */
.locked-badge {
  display: inline-block;
  margin-top: 12px;
  padding: 4px 12px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* Edit Actions */
.edit-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cancel-btn {
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

.cancel-btn:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border: none;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
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

  .edit-row {
    grid-template-columns: 1fr;
  }

  .edit-actions {
    flex-direction: row;
  }
}
</style>