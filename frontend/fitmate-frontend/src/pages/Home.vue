<template>
  <div class="ai-coach-page">
    <div class="page-header">
      <h1 class="page-title">AI健身教练</h1>
      <p class="page-subtitle">随时为你答疑解惑，制定个性化训练方案</p>
    </div>

    <div class="coach-layout">
      <!-- Left: Digital Coach Avatar -->
      <div class="coach-sidebar">
        <div class="coach-card">
          <!-- Coach Avatar -->
          <div class="avatar-wrapper">
            <div class="avatar-circle">
              <span class="avatar-emoji">{{ gender === 'male' ? '👨‍💼' : '👩‍💼' }}</span>
              <div v-if="isSpeaking" class="speaking-indicator">
                <span v-for="i in 3" :key="i" class="sound-bar"></span>
              </div>
            </div>
          </div>

          <!-- Coach Settings -->
          <div class="coach-settings">
            <!-- Gender Selection -->
            <div class="setting-row">
              <button
                class="setting-btn"
                :class="{ active: gender === 'male' }"
                @click="gender = 'male'"
              >
                👨 男教练
              </button>
              <button
                class="setting-btn"
                :class="{ active: gender === 'female' }"
                @click="gender = 'female'"
              >
                👩 女教练
              </button>
            </div>

            <!-- Personality Selection -->
            <div class="setting-row">
              <button
                v-for="p in personalities"
                :key="p.value"
                class="personality-btn"
                :class="[{ active: personality === p.value }, p.colorClass]"
                @click="personality = p.value"
              >
                <span v-html="p.icon"></span>
                {{ p.label }}
              </button>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="status-badge">
            <span class="status-dot"></span>
            在线服务中
          </div>
        </div>
      </div>

      <!-- Right: Chat Interface -->
      <div class="chat-section">
        <div class="chat-card">
          <!-- Chat Header -->
          <div class="chat-header">
            <h3 class="chat-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              AI教练对话
            </h3>
            <div class="header-actions">
              <div v-if="isSpeaking" class="speaking-status">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
                <span>回复中...</span>
              </div>
              <button v-if="messages.length > 1" class="reset-btn" @click="handleResetSession" title="新对话">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                新对话
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="messages-container">
            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <!-- Loading State -->
            <div v-if="isLoading && messages.length === 0" class="loading-state">
              <div class="loading-spinner"></div>
              <span>正在连接教练...</span>
            </div>

            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-wrapper"
              :class="{ 'user-message': msg.sender === 'user', 'system-message': msg.sender === 'system' }"
            >
              <!-- 系统消息 -->
              <div v-if="msg.sender === 'system'" class="message-bubble system-bubble">
                <p class="message-text">{{ msg.text }}</p>
              </div>

              <!-- 普通消息 -->
              <template v-else>
                <div class="message-bubble" :class="{ 'user-bubble': msg.sender === 'user' }">
                  <p class="message-text">{{ msg.text }}</p>
                  <span class="message-time">{{ msg.time }}</span>
                </div>

                <!-- Recommendation Card -->
                <div v-if="msg.recommendation" class="recommendation-card" @click="handleRecommendation(msg.recommendation.link)">
                  <span class="recommendation-icon">{{ msg.recommendation.icon }}</span>
                  <div class="recommendation-content">
                    <h4 class="recommendation-title">{{ msg.recommendation.title }}</h4>
                    <p class="recommendation-desc">{{ msg.recommendation.description }}</p>
                  </div>
                  <svg class="recommendation-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </template>
            </div>
          </div>

          <!-- Input Area -->
          <div class="input-area">
            <div class="input-wrapper">
              <input
                v-model="inputMessage"
                type="text"
                class="chat-input"
                :placeholder="isRecording ? '正在录音...' : '输入你的问题，或点击麦克风语音输入'"
                :disabled="isRecording"
                @keyup.enter="handleSendMessage"
              />
              <button
                class="voice-btn"
                :class="{ recording: isRecording }"
                @click="handleVoiceInput"
              >
                <svg v-if="!isRecording" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <button
                class="send-btn"
                :disabled="!inputMessage.trim() || isRecording"
                @click="handleSendMessage"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>

            <!-- Quick Suggestions -->
            <div class="quick-suggestions">
              <button
                v-for="suggestion in quickSuggestions"
                :key="suggestion.text"
                class="suggestion-btn"
                @click="setInputMessage(suggestion.text)"
              >
                <span>{{ suggestion.icon }}</span>
                {{ suggestion.text }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { askCoach } from '../api/ai'

const router = useRouter()

// 状态
const gender = ref('male')
const personality = ref('gentle')
const inputMessage = ref('')
const isRecording = ref(false)
const isSpeaking = ref(false)
const isLoading = ref(false)
const messagesContainer = ref(null)
const errorMessage = ref('')
const isVoiceSupported = ref(true)
let recognition = null

// 个性化设置选项
const personalities = [
  { value: 'gentle', label: '温柔', icon: '😊', colorClass: 'gentle' },
  { value: 'strict', label: '严格', icon: '⚡', colorClass: 'strict' },
  { value: 'energetic', label: '活力', icon: '✨', colorClass: 'energetic' }
]

// 快捷建议
const quickSuggestions = [
  { icon: '💪', text: '帮我生成一个训练计划' },
  { icon: '📊', text: '我的训练数据怎么样？' },
  { icon: '📚', text: '如何正确做深蹲？' }
]

// 消息列表
const messages = ref([])

// 意图检测 - 识别用户消息中的导航意图
const detectIntent = (text) => {
  const lowerText = text.toLowerCase()

  if (lowerText.includes('训练计划') || lowerText.includes('计划') || lowerText.includes('制定') ||
      lowerText.includes('生成') || lowerText.includes('安排')) {
    return {
      title: '训练计划',
      description: '点击查看和创建你的个性化训练计划',
      icon: '📅',
      link: '/plan'
    }
  }

  if (lowerText.includes('数据') || lowerText.includes('分析') || lowerText.includes('统计') ||
      lowerText.includes('进度') || lowerText.includes('怎么样')) {
    return {
      title: '数据分析',
      description: '查看你的训练数据和进度分析',
      icon: '📊',
      link: '/analysis'
    }
  }

  if (lowerText.includes('知识') || lowerText.includes('学习') || lowerText.includes('深蹲') ||
      lowerText.includes('怎么') || lowerText.includes('如何') || lowerText.includes('教程')) {
    return {
      title: '健身知识库',
      description: '探索专业的健身知识和教程',
      icon: '📚',
      link: '/knowledge'
    }
  }

  return null
}

// 显示错误提示
function showError(msg) {
  errorMessage.value = msg
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 获取当前时间字符串
function getTimeStr() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

// 初始化会话 - 加载欢迎语
function initWelcome() {
  const coachNames = { male: '小帅教练', female: '小雅教练' }
  const personalityNames = { gentle: '温柔鼓励型', strict: '严格激励型', energetic: '活力四射型' }

  messages.value = [{
    id: 1,
    sender: 'coach',
    text: `你好！我是你的AI健身教练${coachNames[gender.value]}（${personalityNames[personality.value]}）。很高兴认识你！\n\n我可以帮你：\n• 制定个性化训练计划\n• 解答健身动作要领\n• 提供饮食建议\n\n有什么我可以帮助你的吗？`,
    time: getTimeStr()
  }]
}

// 监听教练设置变化，重新初始化欢迎语
watch([gender, personality], () => {
  initWelcome()
})

// 发送消息
async function handleSendMessage() {
  const text = inputMessage.value.trim()
  if (!text || isLoading.value) return

  const timeStr = getTimeStr()

  // 添加用户消息
  const userMsg = {
    id: Date.now(),
    sender: 'user',
    text: text,
    time: timeStr
  }
  messages.value.push(userMsg)
  inputMessage.value = ''
  scrollToBottom()

  isLoading.value = true
  isSpeaking.value = true

  // 构建消息历史
  const history = messages.value
    .filter(m => m.sender !== 'system')
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }))

  // 添加上下文信息
  const context = {
    coach_gender: gender.value,
    coach_personality: personality.value
  }

  try {
    const res = await askCoach(history, context)

    if (res.code === 200 && res.data) {
      const reply = res.data.content || res.data.reply || '抱歉，我现在无法回复你。'

      // 如果API没有返回推荐卡片，则根据用户消息意图检测
      const intentRecommendation = detectIntent(text)

      // 添加AI回复
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'coach',
        text: reply,
        time: getTimeStr(),
        recommendation: intentRecommendation
      }
      messages.value.push(aiMsg)
    } else {
      throw new Error(res.message || '获取回复失败')
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    // 尝试检测意图并添加推荐卡片
    const intentRecommendation = detectIntent(text)

    // 添加错误消息
    messages.value.push({
      id: Date.now() + 1,
      sender: 'coach',
      text: '抱歉，我现在无法回复你，请稍后再试。',
      time: getTimeStr(),
      recommendation: intentRecommendation
    })
  } finally {
    isLoading.value = false
    isSpeaking.value = false
    scrollToBottom()
  }
}

// 初始化语音识别
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    isVoiceSupported.value = false
    console.warn('当前浏览器不支持语音识别')
    return null
  }

  const recognizer = new SpeechRecognition()
  recognizer.lang = 'zh-CN'
  recognizer.continuous = false
  recognizer.interimResults = true
  recognizer.maxAlternatives = 1

  recognizer.onresult = (event) => {
    let finalTranscript = ''
    let interimTranscript = ''

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript
      } else {
        interimTranscript += transcript
      }
    }

    if (finalTranscript) {
      inputMessage.value = finalTranscript
    }
  }

  recognizer.onend = () => {
    isRecording.value = false
  }

  recognizer.onerror = (event) => {
    console.error('语音识别错误:', event.error)
    isRecording.value = false

    switch (event.error) {
      case 'not-allowed':
        showError('请允许麦克风权限')
        break
      case 'no-speech':
        showError('未检测到语音，请重试')
        break
      case 'network':
        showError('网络错误，请检查网络连接')
        break
      default:
        showError('语音识别失败，请重试')
    }
  }

  return recognizer
}

// 语音输入
async function handleVoiceInput() {
  if (!isVoiceSupported.value) {
    showError('当前浏览器不支持语音识别，请使用 Chrome 浏览器')
    return
  }

  if (isRecording.value && recognition) {
    recognition.stop()
    isRecording.value = false
    return
  }

  try {
    if (!recognition) {
      recognition = initSpeechRecognition()
    }

    if (!recognition) {
      showError('语音识别初始化失败')
      return
    }

    isRecording.value = true
    recognition.start()

  } catch (error) {
    console.error('启动语音识别失败:', error)
    isRecording.value = false
    showError('无法启动语音识别，请检查麦克风权限')
  }
}

// 设置输入框内容
const setInputMessage = (text) => {
  inputMessage.value = text
}

// 处理推荐卡片点击
const handleRecommendation = (link) => {
  router.push(link)
}

// 重置会话
function handleResetSession() {
  if (confirm('确定要清空聊天记录并开始新对话吗？')) {
    messages.value = []
    initWelcome()
    scrollToBottom()
  }
}

// 页面加载时初始化
onMounted(() => {
  initWelcome()
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  isVoiceSupported.value = !!SpeechRecognition
})
</script>

<style scoped>
.ai-coach-page {
  max-width: 1200px;
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

.coach-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
}

/* Coach Sidebar */
.coach-sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.coach-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0f2fe;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-circle {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.avatar-emoji {
  font-size: 80px;
}

.speaking-indicator {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 4px;
  align-items: flex-end;
}

.sound-bar {
  width: 4px;
  height: 8px;
  background: white;
  border-radius: 2px;
  animation: soundWave 0.6s ease-in-out infinite alternate;
}

.sound-bar:nth-child(1) { animation-delay: 0s; }
.sound-bar:nth-child(2) { animation-delay: 0.1s; }
.sound-bar:nth-child(3) { animation-delay: 0.2s; }

@keyframes soundWave {
  0% { height: 8px; }
  100% { height: 20px; }
}

.coach-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.setting-btn {
  padding: 8px 16px;
  border: none;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.setting-btn:hover {
  background: #e5e7eb;
}

.setting-btn.active {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
}

.personality-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s;
}

.personality-btn:hover {
  background: #e5e7eb;
}

.personality-btn.active.gentle {
  background: linear-gradient(135deg, #60a5fa, #22d3ee);
  color: white;
}

.personality-btn.active.strict {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.personality-btn.active.energetic {
  background: linear-gradient(135deg, #0891b2, #2563eb);
  color: white;
}

.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #86efac;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Chat Section */
.chat-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.chat-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.speaking-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #2563eb;
  font-size: 13px;
}

.speaking-status svg {
  animation: pulse 1s infinite;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 16px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 13px;
  text-align: center;
  margin-bottom: 8px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  animation: messageIn 0.3s ease;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-wrapper.user-message {
  align-items: flex-end;
}

.message-wrapper.system-message {
  align-items: center;
}

.system-bubble {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px dashed #93c5fd;
  color: #0369a1;
  font-size: 13px;
  text-align: center;
}

.message-bubble {
  max-width: 85%;
  padding: 14px 18px;
  background: #f3f4f6;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
}

.user-bubble {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
  border-radius: 18px;
  border-bottom-right-radius: 4px;
}

.message-text {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message-time {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 6px;
}

.user-bubble .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.recommendation-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  padding: 14px;
  background: linear-gradient(135deg, #eff6ff, #ecfeff);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.recommendation-card:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  transform: translateX(4px);
}

.recommendation-icon {
  font-size: 28px;
}

.recommendation-content {
  flex: 1;
}

.recommendation-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px;
}

.recommendation-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.recommendation-arrow {
  color: #2563eb;
  flex-shrink: 0;
}

/* Input Area */
.input-area {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.voice-btn, .send-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.voice-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.voice-btn:hover {
  background: #e5e7eb;
}

.voice-btn.recording {
  background: #ef4444;
  color: white;
  animation: pulse 1s infinite;
}

.send-btn {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Quick Suggestions */
.quick-suggestions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.suggestion-btn {
  padding: 8px 14px;
  background: #eff6ff;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  color: #2563eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.suggestion-btn:hover {
  background: #dbeafe;
}

/* Responsive */
@media (max-width: 900px) {
  .coach-layout {
    grid-template-columns: 1fr;
  }

  .coach-sidebar {
    position: static;
  }

  .coach-card {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .avatar-wrapper {
    margin-bottom: 0;
  }

  .avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 24px;
  }

  .avatar-emoji {
    font-size: 40px;
  }

  .coach-settings {
    flex: 1;
  }

  .status-badge {
    margin-top: 0;
  }
}
</style>
