import { describe, expect, it } from 'vitest'
import { resolveVideoSource } from '../../utils/videoSource'

describe('resolveVideoSource', () => {
  it('识别 MP4 直链', () => {
    const r = resolveVideoSource('https://cdn.example.com/a.mp4')
    expect(r.kind).toBe('direct')
    expect(r.playUrl).toContain('.mp4')
  })

  it('识别本站静态路径', () => {
    const r = resolveVideoSource('/videos/demo.mp4')
    expect(r.kind).toBe('direct')
  })

  it('识别 B 站 BV 号', () => {
    const r = resolveVideoSource('https://www.bilibili.com/video/BV1xx411c7mD')
    expect(r.kind).toBe('embed')
    expect(r.embedUrl).toContain('player.bilibili.com')
    expect(r.embedUrl).toContain('BV1xx411c7mD')
  })

  it('空链接返回 empty', () => {
    expect(resolveVideoSource('').kind).toBe('empty')
  })
})
