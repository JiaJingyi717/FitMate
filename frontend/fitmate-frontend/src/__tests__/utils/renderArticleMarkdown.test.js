import { describe, expect, it } from 'vitest'
import { estimateReadingMinutes, renderArticleMarkdown } from '../../utils/renderArticleMarkdown'

describe('renderArticleMarkdown', () => {
  it('渲染标题、列表与引用', () => {
    const md = `## 损伤预防要点
- 充分热身
1. 循序渐进
> 疼痛即停止`
    const html = renderArticleMarkdown(md)
    expect(html).toContain('<h2')
    expect(html).toContain('<ul')
    expect(html).toContain('<ol')
    expect(html).toContain('<blockquote')
    expect(html).toContain('充分热身')
  })

  it('渲染表格与加粗', () => {
    const md = `| 部位 | 建议 |
| --- | --- |
| 膝 | **休息** |`
    const html = renderArticleMarkdown(md)
    expect(html).toContain('<table')
    expect(html).toContain('<strong>休息</strong>')
  })

  it('转义 HTML 防 XSS', () => {
    const html = renderArticleMarkdown('<script>alert(1)</script>')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('estimateReadingMinutes', () => {
  it('短文本至少 1 分钟', () => {
    expect(estimateReadingMinutes('短')).toBe(1)
  })

  it('长文本按字数估算', () => {
    const long = '字'.repeat(1200)
    expect(estimateReadingMinutes(long)).toBeGreaterThanOrEqual(3)
  })
})
