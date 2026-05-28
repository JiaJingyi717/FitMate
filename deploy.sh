#!/usr/bin/env sh
set -eu

echo "🚀 FitMate 生产部署（compose.prod.yaml）..."

if [ ! -f .env ]; then
  echo "❌ 缺少 .env，请复制 .env.example 并填写 MYSQL_ROOT_PASSWORD、SECRET_KEY 等。"
  exit 1
fi

if [ ! -f secrets/db_password.txt ]; then
  echo "⚠️  未找到 secrets/db_password.txt，正在从示例创建（请尽快修改密码）。"
  mkdir -p secrets
  cp secrets/db_password.txt.example secrets/db_password.txt
fi

docker compose -f compose.prod.yaml up -d --build

echo "⏳ 等待健康检查..."
sleep 20

docker compose -f compose.prod.yaml ps

echo "✅ 部署完成。浏览器访问 http://localhost:${HTTP_PORT:-80}"
