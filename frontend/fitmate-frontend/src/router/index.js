import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Home from '../pages/Home.vue'
import Plan from '../pages/Plan.vue'
import Knowledge from '../pages/Knowledge.vue'
import Analysis from '../pages/Analysis.vue'
import Profile from '../pages/Profile.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home },
  { path: '/plan', component: Plan },
  { path: '/knowledge', component: Knowledge },
  { path: '/analysis', component: Analysis },
  { path: '/profile', component: Profile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router