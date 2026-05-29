/**
 * 前端结构化日志（浏览器控制台 JSON 行，便于联调与作业截图）
 */

const LEVELS = new Set(['debug', 'info', 'warn', 'error'])

function formatDetail(...rest) {
  if (!rest.length) return undefined
  return rest.length === 1 ? rest[0] : rest
}

function emit(level, module, message, extra = {}) {
  const entry = {
    time: new Date().toISOString(),
    level,
    module,
    message,
    ...extra,
  }
  const line = JSON.stringify(entry)
  if (level === 'error') {
    console.error(line)
  } else if (level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

const logger = {
  debug(module, message, ...rest) {
    if (!import.meta.env.DEV) return
    emit('debug', module, message, { detail: formatDetail(...rest) })
  },
  info(module, message, ...rest) {
    emit('info', module, message, { detail: formatDetail(...rest) })
  },
  warn(module, message, ...rest) {
    emit('warn', module, message, { detail: formatDetail(...rest) })
  },
  error(module, message, ...rest) {
    emit('error', module, message, { detail: formatDetail(...rest) })
  },
}

export default logger

export function logDebug(message, extra) {
  logger.debug('app', message, extra)
}

export function logInfo(message, extra) {
  logger.info('app', message, extra)
}

export function logWarn(message, extra) {
  logger.warn('app', message, extra)
}

export function logError(message, extra) {
  logger.error('app', message, extra)
}

/** 记录 API 请求耗时与状态（由 axios 拦截器调用） */
export function logApiEvent({ method, url, status, durationMs, ok }) {
  const level = ok ? 'info' : 'warn'
  if (!LEVELS.has(level)) return
  emit(level, 'api', 'api_request', { method, url, status, durationMs, ok })
}
