<template>
  <div class="login-page">
    <div class="login-card">
      <h2>FitMate 登录</h2>

      <input
        v-model="email"
        type="text"
        placeholder="请输入邮箱"
      />

      <input
        v-model="password"
        type="password"
        placeholder="请输入密码"
      />

      <button @click="handleLogin">登录</button>

      <p>没有账号？去注册</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '../api/auth'

const email = ref('')
const password = ref('')

async function handleLogin() {
  try {
    const res = await login({
      email: email.value,
      password: password.value
    })

    console.log('登录成功：', res)

    // 如果后端返回了 token，就存起来
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token)
    }

    alert('登录成功')
  } catch (error) {
    console.error('登录失败：', error)
    alert('登录失败')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fb;
}

.login-card {
  width: 360px;
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 24px;
}

.login-card input {
  width: 100%;
  height: 42px;
  margin-bottom: 16px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-sizing: border-box;
}

.login-card button {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 8px;
  background: #409eff;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.login-card p {
  margin-top: 16px;
  text-align: center;
  color: #666;
}
</style>