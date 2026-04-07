<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6.5 6.5h11M6.5 17.5h11M4 10.5v3M20 10.5v3M6.5 4v16M17.5 4v16M9.5 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14.5 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          </svg>
        </div>
        <h1 class="logo-title">FitMate</h1>
        <p class="logo-subtitle">AI驱动的智能健身助手</p>
      </div>

      <!-- Login/Register Card -->
      <div class="auth-card">
        <!-- Tabs -->
        <div class="auth-tabs">
          <button
            class="auth-tab"
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            登录
          </button>
          <button
            class="auth-tab"
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            注册
          </button>
        </div>

        <!-- Login Form -->
        <div v-show="activeTab === 'login'" class="auth-form">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label">邮箱</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
                <input
                  v-model="loginForm.email"
                  type="email"
                  placeholder="请输入邮箱"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input v-model="rememberMe" type="checkbox" class="checkbox" />
                记住我
              </label>
              <a href="#" class="forgot-link">忘记密码？</a>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>登录</span>
            </button>
          </form>
        </div>

        <!-- Register Form -->
        <div v-show="activeTab === 'register'" class="auth-form">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label class="form-label">姓名</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                </svg>
                <input
                  v-model="registerForm.name"
                  type="text"
                  placeholder="请输入姓名"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">邮箱</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
                <input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="请输入邮箱"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">手机号</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <path d="M12 18h.01"/>
                </svg>
                <input
                  v-model="registerForm.phone"
                  type="tel"
                  placeholder="请输入手机号"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">确认密码</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input v-model="agreeTerms" type="checkbox" class="checkbox" required />
                <span>我已阅读并同意 <a href="#" class="link">用户协议</a> 和 <a href="#" class="link">隐私政策</a></span>
              </label>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>注册</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <p class="footer-text">
        © 2026 FitMate. 让AI助力你的健身之旅
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../api/auth'

const router = useRouter()
const activeTab = ref('login')
const loading = ref(false)
const rememberMe = ref(false)
const agreeTerms = ref(false)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

async function handleLogin() {
  loading.value = true
  try {
    const res = await login({
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token)
    }

    alert('登录成功')
    router.push('/home')
  } catch (error) {
    console.error('登录失败：', error)
    alert('登录失败，请检查邮箱和密码')
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致！')
    return
  }

  loading.value = true
  try {
    await register({
      name: registerForm.value.name,
      email: registerForm.value.email,
      phone: registerForm.value.phone,
      password: registerForm.value.password
    })

    alert('注册成功，请登录')
    activeTab.value = 'login'
    loginForm.value.email = registerForm.value.email
  } catch (error) {
    console.error('注册失败：', error)
    alert('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 50%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
  color: white;
}

.logo-title {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.logo-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0f2fe;
}

.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  background: #f3f4f6;
  border-radius: 10px;
  margin-bottom: 24px;
}

.auth-tab {
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-tab:hover {
  color: #374151;
}

.auth-tab.active {
  background: white;
  color: #2563eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.auth-form {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #6b7280;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  cursor: pointer;
}

.forgot-link {
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #1d4ed8;
}

.link {
  color: #2563eb;
  text-decoration: none;
}

.link:hover {
  color: #1d4ed8;
}

.submit-btn {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #0891b2);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.footer-text {
  text-align: center;
  color: #6b7280;
  font-size: 13px;
  margin-top: 24px;
}
</style>