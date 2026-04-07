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
            <div v-if="isSpeaking" class="speaking-status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <span>语音回复中...</span>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="messages-container">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-wrapper"
              :class="{ 'user-message': msg.sender === 'user' }"
            >
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
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gender = ref('male')
const personality = ref('gentle')
const inputMessage = ref('')
const isRecording = ref(false)
const isSpeaking = ref(false)
const messagesContainer = ref(null)

const personalities = [
  { value: 'gentle', label: '温柔', icon: '😊', colorClass: 'gentle' },
  { value: 'strict', label: '严格', icon: '⚡', colorClass: 'strict' },
  { value: 'energetic', label: '活力', icon: '✨', colorClass: 'energetic' }
]

const quickSuggestions = [
  { icon: '💪', text: '帮我生成一个训练计划' },
  { icon: '📊', text: '我的训练数据怎么样？' },
  { icon: '📚', text: '如何正确做深蹲？' }
]

const messages = ref([
  {
    id: 1,
    sender: 'coach',
    text: '你好！我是你的AI健身教练，很高兴认识你。让我们一起开始健康之旅吧！我可以帮你制定训练计划、解答健身问题、分析你的数据。有什么我可以帮助你的吗？',
    time: '10:00'
  }
])

const detectIntent = (text) => {
  const lowerText = text.toLowerCase()

  if (lowerText.includes('训练计划') || lowerText.includes('计划') || lowerText.includes('制定')) {
    return {
      title: '训练计划',
      description: '点击查看和创建你的个性化训练计划',
      icon: '📅',
      link: '/plan'
    }
  }

  if (lowerText.includes('数据') || lowerText.includes('分析') || lowerText.includes('统计') || lowerText.includes('进度')) {
    return {
      title: '数据分析',
      description: '查看你的训练数据和进度分析',
      icon: '📊',
      link: '/analysis'
    }
  }

  if (lowerText.includes('知识') || lowerText.includes('学习') || lowerText.includes('怎么') || lowerText.includes('如何')) {
    return {
      title: '健身知识库',
      description: '探索专业的健身知识和教程',
      icon: '📚',
      link: '/knowledge'
    }
  }

  return null
}

const generateAIResponse = (userMessage) => {
  const recommendation = detectIntent(userMessage)
  const lowerMessage = userMessage.toLowerCase()

  let responseText = ''

  if (recommendation) {
    if (recommendation.link === '/plan') {
      const responses = {
        gentle: '当然可以！我可以帮你制定训练计划。根据你的目标和体能状况，我会为你设计最适合的方案。',
        strict: '很好！制定计划是成功的第一步。我会为你设计高效的训练方案，准备好接受挑战了吗？',
        energetic: '太棒了！让我们一起制定一个让你充满活力的训练计划吧！💪'
      }
      responseText = responses[personality.value]
    } else if (recommendation.link === '/analysis') {
      const responses = {
        gentle: '我来帮你查看数据。通过数据分析，我们可以更好地了解你的进步哦~',
        strict: '数据不会说谎！让我们看看你的训练成果，找出还需要改进的地方。',
        energetic: '让我们一起看看你的精彩成绩！你的进步一定会让你惊喜的！🔥'
      }
      responseText = responses[personality.value]
    } else if (recommendation.link === '/knowledge') {
      const responses = {
        gentle: '好问题！我们的知识库里有很多专业的健身知识，我带你去看看~',
        strict: '学习是进步的关键。知识库里有你需要的答案，去好好学习吧！',
        energetic: '太好了！学习让我们变得更强！知识库里有超多有用的内容等着你！'
      }
      responseText = responses[personality.value]
    }
  } else {
    const generalResponses = {
      gentle: '我理解你的想法。让我们一步一步来，不要着急哦~ 💪',
      strict: '很好！保持这样的态度。记住，没有付出就没有收获！',
      energetic: '太棒了！你的热情让我也充满活力！让我们一起加油吧！🔥'
    }
    responseText = generalResponses[personality.value]
  }

  return { text: responseText, recommendation }
}

const handleSendMessage = () => {
  if (!inputMessage.value.trim()) return

  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const newMessage = {
    id: messages.value.length + 1,
    sender: 'user',
    text: inputMessage.value,
    time: timeStr
  }

  messages.value.push(newMessage)
  inputMessage.value = ''

  // Scroll to bottom
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })

  // Simulate AI response
  setTimeout(() => {
    const { text, recommendation } = generateAIResponse(newMessage.text)

    const aiResponse = {
      id: messages.value.length + 1,
      sender: 'coach',
      text: text,
      time: timeStr,
      recommendation: recommendation || undefined
    }

    messages.value.push(aiResponse)

    // Simulate speaking animation
    isSpeaking.value = true
    setTimeout(() => {
      isSpeaking.value = false
    }, 2000 + Math.random() * 1000)

    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }, 1000)
}

const handleVoiceInput = () => {
  isRecording.value = !isRecording.value

  if (!isRecording.value) {
    setTimeout(() => {
      inputMessage.value = '帮我生成一个训练计划'
    }, 2000)
  }
}

const setInputMessage = (text) => {
  inputMessage.value = text
}

const handleRecommendation = (link) => {
  router.push(link)
}
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

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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