/**
 * FitMate API 响应类型定义（供 TypeScript 项目参考）
 * 对应 backend/utils/response.py 的 ok() 和 fail() 统一格式
 */

// 统一响应包装
export interface ApiResponse<T = any> {
  code: number      // 200=成功，其他=业务错误
  message: string   // 状态描述
  data: T           // 业务数据（失败时为空对象 {}
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export interface RegisterResponse {
  userId: number
}
export interface LoginResponse {
  token: string
  userId: number
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export interface UserProfile {
  id: number
  username: string
  nickname: string
  avatar: string
  gender: string
  height: number | null
  weight: number | null
  age: number | null
  goal: string
  currentCoachId: number | null
}
export interface SportDistribution {
  name: string
  value: number
}
export interface StatsData {
  totalDuration: number
  trainingCount: number
  sportDistribution: SportDistribution[]
}
export interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  badgeType: 'bronze' | 'silver' | 'gold'
  isEarned: boolean
}

// ---------------------------------------------------------------------------
// Coaches
// ---------------------------------------------------------------------------
export interface Coach {
  id: number
  name: string
  gender: 'male' | 'female'
  style: string
  avatar: string
  introduction: string
}
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
export interface SessionInitData {
  sessionId: number
  coach: Coach | null
  messages: ChatMessage[]
}

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------
export interface PlanTask {
  id: number
  title: string
  description: string
  duration: number       // 分钟
  exerciseType: string
  targetDate: string | null
  isCompleted: boolean
}
export interface TrainingPlan {
  id: number
  planName: string
  description: string
  status: string
  createdAt: string
  tasks?: PlanTask[]
}
export interface PlanOverview {
  totalPlans: number
  donePlans: number
  todayTasks: number
  doneToday: number
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------
export interface Article {
  id: number
  title: string
  category: string
  coverImage: string
  videoUrl: string
  likeCount: number
  collectCount: number
  commentCount: number
  author: string
  createdAt: string
  content?: string        // 详情接口才有
}
export interface ArticleComment {
  id: number
  userId: number
  username: string
  avatar: string
  content: string
  createdAt: string
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------
export interface CategoryDistribution {
  name: string
  value: number
  percentage: number
}
export interface DurationTrend {
  date: string
  duration: number
}
export interface AiSuggestion {
  suggestions: string[]
}
