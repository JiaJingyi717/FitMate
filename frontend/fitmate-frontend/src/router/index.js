import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Home from '../pages/Home.vue'
import Plan from '../pages/Plan.vue'
import Knowledge from '../pages/Knowledge.vue'
import KnowledgeDetail from '../pages/KnowledgeDetail.vue'
import Analysis from '../pages/Analysis.vue'
import Profile from '../pages/Profile.vue'

// 路由鉴权守卫
function requireAuth(to, from, next) {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token')
  const tokenExpiry = localStorage.getItem('tokenExpiry')

  // 检查 token 是否存在
  if (!token) {
    next('/login')
    return
  }

  // 检查 token 过期时间
  if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    // token 已过期，清除并跳转登录
    sessionStorage.removeItem('token')
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiry')
    localStorage.removeItem('userId')
    next('/login')
    return
  }

  next()
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { path: '/plan', component: Plan, meta: { requiresAuth: true } },
  { path: '/knowledge', component: Knowledge },
  { path: '/knowledge/:id', component: KnowledgeDetail },
  { path: '/analysis', component: Analysis, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    requireAuth(to, from, next)
  } else {
    next()
  }
})

export default router
