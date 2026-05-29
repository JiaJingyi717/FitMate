# 监控配置贡献说明

姓名：赵一诺
学号：2320100819
日期：2026-05-29

## 我完成的工作

### 1. 日志配置

- [x] 结构化日志格式
  编写 `frontend/fitmate-frontend/src/utils/logger.js`，实现前端日志 JSON 输出，字段包括 `time`、`level`、`module`、`message`、`detail`，供各页面使用。
- [x] 日志级别配置
  提供 `debug`、`info`、`warn`、`error` 等日志等级，同时支持命名导出 `logApiEvent`、`logError`，供 axios 拦截器使用。

### 2. 健康检查

- [x] /health 端点实现
  通过 Nginx 配置 `location /health` 反向代理到 `backend:5000/health`，浏览器可直接通过 80 端口访问。
- [x] 健康检查逻辑
  验证浏览器访问 `/health` 页面返回正常结果，确保前端能正确展示后端健康状态。

### 3. 指标收集

- [x] 请求计数
  axios 拦截器记录每次请求的 method、url、status、ok。
- [x] 响应时间
  请求前记录 `startTime`，响应后计算耗时 `durationMs`。
- [x] 错误率
  响应失败时调用 `logApiEvent`（`ok: false`）和 `logError` 输出错误信息，便于观察接口错误情况。

## PR 链接

- PR #70: https://github.com/JiaJingyi717/FitMate/pull/70

## 遇到的问题和解决

1. 问题：`npm run build` 报错 `"default" is not exported by src/utils/logger.js`。
   解决：增加 `export default logger`，同时保留命名导出，修复 Docker 镜像构建。
2. 问题：接口请求失败时控制台无可观测信息。
   解决：在响应拦截器 catch 分支调用 `logApiEvent(ok: false)` 和 `logError`。
3. 问题：云端仍显示旧页面，Console 无新日志。
   解决：上传新代码，执行 `docker compose -f compose.prod.yaml up -d --build` 并强刷浏览器缓存。

## 心得体会

前端监控关键在于**统一入口埋点**，避免页面重复写日志。日志既支持默认导出（业务页使用）又支持命名导出（拦截器使用），兼顾可维护性与构建要求。通过 Nginx 反代 `/health`，前端可直接验证健康状态，便于线上监控和演示。此次实践加深了我对前端日志管理、API 请求监控及生产环境验证的理解。
