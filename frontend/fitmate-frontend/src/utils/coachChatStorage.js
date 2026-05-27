/** AI 教练对话：按用户 ID 存入 sessionStorage，本次浏览器会话内切换页面不丢失 */

const PREFIX = 'fitmate_coach_chat_'

export function getCoachChatStorageKey(userId) {
  const id =
    userId ??
    (typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null)
  return `${PREFIX}${id || 'guest'}`
}

export function saveCoachChatSession(payload, userId) {
  if (typeof sessionStorage === 'undefined' || !payload) return
  if (!Array.isArray(payload.messages) || payload.messages.length === 0) return
  try {
    sessionStorage.setItem(
      getCoachChatStorageKey(userId),
      JSON.stringify({
        messages: payload.messages ?? [],
        gender: payload.gender,
        personality: payload.personality,
        updatedAt: Date.now(),
      })
    )
  } catch {
    // 存储满或隐私模式：忽略，不影响聊天
  }
}

export function loadCoachChatSession(userId) {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(getCoachChatStorageKey(userId))
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!Array.isArray(data.messages) || data.messages.length === 0) {
      return null
    }
    return data
  } catch {
    return null
  }
}

export function clearCoachChatSession(userId) {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(getCoachChatStorageKey(userId))
}
