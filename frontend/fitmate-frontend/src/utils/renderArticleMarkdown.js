/** 知识库文章轻量 Markdown 渲染（无第三方依赖） */

function escapeHtml(text) {
  if (!text) return ''
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return String(text).replace(/[&<>"']/g, (m) => map[m])
}

function renderInline(text) {
  let safe = escapeHtml(text)
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return safe
}

function isTableSeparator(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim())
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

function renderTable(rows) {
  if (!rows.length) return ''
  const head = parseTableRow(rows[0])
  const body = rows.slice(1).map(parseTableRow)
  const ths = head.map((c) => `<th>${renderInline(c)}</th>`).join('')
  const trs = body
    .map((cells) => `<tr>${cells.map((c) => `<td>${renderInline(c)}</td>`).join('')}</tr>`)
    .join('')
  return `<div class="content-table-wrap"><table class="content-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`
}

function renderBlock(line) {
  const trimmed = line.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('# ')) {
    return `<h1 class="content-h1">${renderInline(trimmed.slice(2))}</h1>`
  }
  if (trimmed.startsWith('## ')) {
    return `<h2 class="content-h2">${renderInline(trimmed.slice(3))}</h2>`
  }
  if (trimmed.startsWith('### ')) {
    return `<h3 class="content-h3">${renderInline(trimmed.slice(4))}</h3>`
  }
  if (trimmed.startsWith('> ')) {
    return `<blockquote class="content-quote"><p>${renderInline(trimmed.slice(2))}</p></blockquote>`
  }
  if (/^\d+\.\s/.test(trimmed)) {
    return `<li class="content-oli" data-ol>${renderInline(trimmed.replace(/^\d+\.\s/, ''))}</li>`
  }
  if (trimmed.startsWith('- ')) {
    return `<li class="content-li" data-ul>${renderInline(trimmed.slice(2))}</li>`
  }
  return `<p class="content-p">${renderInline(trimmed)}</p>`
}

function wrapListItems(html) {
  return html
    .replace(/(<li class="content-li" data-ul>[\s\S]*?<\/li>\n?)+/g, (m) =>
      `<ul class="content-ul">${m.replace(/ data-ul/g, '')}</ul>`
    )
    .replace(/(<li class="content-oli" data-ol>[\s\S]*?<\/li>\n?)+/g, (m) =>
      `<ol class="content-ol">${m.replace(/ data-ol/g, '')}</ol>`
    )
}

export function renderArticleMarkdown(text) {
  if (!text) return ''

  const lines = text.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim().startsWith('|')) {
      const tableRows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!isTableSeparator(lines[i])) {
          tableRows.push(lines[i])
        }
        i += 1
      }
      blocks.push(renderTable(tableRows))
      continue
    }
    blocks.push(renderBlock(line))
    i += 1
  }

  return wrapListItems(blocks.join('\n'))
}

export function estimateReadingMinutes(text) {
  const len = (text || '').replace(/\s/g, '').length
  return Math.max(1, Math.ceil(len / 400))
}
