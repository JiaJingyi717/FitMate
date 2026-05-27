import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearCoachChatSession,
  getCoachChatStorageKey,
  loadCoachChatSession,
  saveCoachChatSession,
} from '../../utils/coachChatStorage'

describe('coachChatStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
    localStorage.setItem('userId', '42')
  })

  it('按用户 ID 读写对话', () => {
    const messages = [{ id: 1, sender: 'user', text: '你好', time: '10:00' }]
    saveCoachChatSession({ messages, gender: 'male', personality: 'gentle' })

    const loaded = loadCoachChatSession()
    expect(loaded.messages).toEqual(messages)
    expect(loaded.gender).toBe('male')
    expect(getCoachChatStorageKey()).toBe('fitmate_coach_chat_42')
  })

  it('清空后无法加载', () => {
    saveCoachChatSession({ messages: [{ id: 1, sender: 'coach', text: 'hi', time: '10:00' }] })
    clearCoachChatSession()
    expect(loadCoachChatSession()).toBeNull()
  })

  it('空消息列表不应覆盖已有会话', () => {
    const existing = [{ id: 1, sender: 'user', text: '保留', time: '10:01' }]
    saveCoachChatSession({ messages: existing, gender: 'male', personality: 'gentle' })
    saveCoachChatSession({ messages: [], gender: 'male', personality: 'gentle' })
    expect(loadCoachChatSession().messages).toEqual(existing)
  })
})
