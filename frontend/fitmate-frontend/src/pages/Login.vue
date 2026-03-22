<template>
  <div class="login-page">
    <div class="login-card">
      <h2>FitMate 登录</h2>
      <input type="text" placeholder="请输入账号" />
      <input type="password" placeholder="请输入密码" />
      <button>登录</button>
      <p>没有账号？去注册</p>
    </div>
  </div>
</template>

<script setup>
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
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
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
  border: 1px solid #ddd;
  border-radius: 8px;
}

.login-card button {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.login-card p {
  text-align: center;
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}
</style>