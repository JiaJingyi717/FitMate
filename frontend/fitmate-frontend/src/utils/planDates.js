/** 格式化为 YYYY-MM-DD（本地时区） */
function formatDateLocal(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 根据起止日期计算计划周数（含首尾日） */
export function computeDurationWeeks(startDateStr, endDateStr, defaultWeeks = 4) {
  if (!startDateStr || !endDateStr) return defaultWeeks
  const start = parseLocalDate(startDateStr)
  const end = parseLocalDate(endDateStr)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return defaultWeeks
  }
  const days = Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.ceil(days / 7))
}

/** 起止日期之间的天数（含首尾） */
export function computeInclusiveDays(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 28
  const start = parseLocalDate(startDateStr)
  const end = parseLocalDate(endDateStr)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return 28
  }
  return Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1
}

/** 默认结束日期：从开始日起 defaultWeeks 周（含首尾共 defaultWeeks×7 天） */
export function defaultEndDateFrom(startDateStr, defaultWeeks = 4) {
  const start = startDateStr ? parseLocalDate(startDateStr) : new Date()
  if (Number.isNaN(start.getTime())) {
    const fallback = new Date()
    fallback.setDate(fallback.getDate() + defaultWeeks * 7 - 1)
    return formatDateLocal(fallback)
  }
  const end = new Date(start)
  end.setDate(end.getDate() + defaultWeeks * 7 - 1)
  return formatDateLocal(end)
}
