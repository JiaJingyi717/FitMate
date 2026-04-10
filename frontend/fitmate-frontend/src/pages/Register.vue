<template>
  <div class="register-page">
    <div class="register-container">
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

      <!-- Register Card -->
      <div class="auth-card">
        <h2 class="auth-title">创建新账号</h2>
        <p class="auth-subtitle">填写以下信息完成注册</p>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label class="form-label">姓名</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
              <input
                v-model="form.name"
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
                v-model="form.email"
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
                v-model="form.phone"
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
                v-model="form.password"
                type="password"
                placeholder="请输入密码（至少6位）"
                class="form-input"
                required
                minlength="6"
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
                v-model="form.confirmPassword"
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
            <span v-else>立即注册</span>
          </button>

          <p class="login-link">
            已有账号？ <router-link to="/login" class="link">立即登录</router-link>
          </p>
        </form>
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
import { register } from '../api/auth'

const router = useRouter()
const loading = ref(false)
const agreeTerms = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    alert('两次输入的密码不一致！')
    return
  }

  if (form.value.password.length < 6) {
    alert('密码长度至少为6位！')
    return
  }

  loading.value = true
  try {
    await register({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password
    })

    alert('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败：', error)
    alert('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 50%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 420px;
}

.logo-section {
  text-align: center;
  margin-bottom: 24px;
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

.auth-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin: 0 0 8px;
}

.auth-subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 24px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
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
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  cursor: pointer;
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
  margin-top: 8px;
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

.login-link {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-top: 8px;
}

.footer-text {
  text-align: center;
  color: #6b7280;
  font-size: 13px;
  margin-top: 24px;
}
</style>