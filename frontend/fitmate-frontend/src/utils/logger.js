// src/utils/logger.js
// 统一日志工具，生产环境自动禁用敏感日志

const isDevelopment = import.meta.env.DEV

export const logger = {
  error(context, ...args) {
    if (isDevelopment) {
      console.error(`[${context}]`, ...args)
    }
  },

  warn(context, ...args) {
    if (isDevelopment) {
      console.warn(`[${context}]`, ...args)
    }
  },

  info(context, ...args) {
    if (isDevelopment) {
      console.info(`[${context}]`, ...args)
    }
  },

  debug(context, ...args) {
    if (isDevelopment) {
      console.debug(`[${context}]`, ...args)
    }
  }
}

export default logger
