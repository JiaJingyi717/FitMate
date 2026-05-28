#!/usr/bin/env sh
# 云服务器上更新 FitMate（拉取代码 + 拉取/重建容器）
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  echo "❌ 缺少 .env，请先 cp .env.example .env 并配置。"
  exit 1
fi

if [ -d .git ]; then
  echo "📥 git pull..."
  git pull --ff-only || true
fi

# shellcheck disable=SC1091
. ./.env 2>/dev/null || true

if [ -n "${BACKEND_IMAGE:-}" ] && [ -n "${FRONTEND_IMAGE:-}" ]; then
  echo "📦 使用 GHCR 镜像拉取部署..."
  docker compose -f compose.prod.yaml pull
  docker compose -f compose.prod.yaml up -d --no-build
else
  echo "🔨 本地构建部署..."
  docker compose -f compose.prod.yaml up -d --build
fi

echo "⏳ 等待健康检查..."
sleep 25
docker compose -f compose.prod.yaml ps
echo "✅ 更新完成。访问 http://localhost:${HTTP_PORT:-80}"
