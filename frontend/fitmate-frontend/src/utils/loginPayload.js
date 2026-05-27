/** 根据用户输入构造登录请求体（邮箱 / 手机号 / 用户名） */
export function buildLoginPayload(identifier, password) {
  const id = (identifier || '').trim()
  const payload = { password }

  if (!id) {
    return payload
  }
  if (id.includes('@')) {
    payload.email = id
  } else if (/^1\d{10}$/.test(id)) {
    payload.phone = id
  } else {
    payload.username = id
  }
  return payload
}
