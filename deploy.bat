@echo off
setlocal
cd /d "%~dp0"

echo [FitMate] 生产部署 compose.prod.yaml ...

if not exist ".env" (
  echo 缺少 .env，请先 copy .env.example .env 并填写 MYSQL_ROOT_PASSWORD 等。
  exit /b 1
)

if not exist "secrets\db_password.txt" (
  echo 未找到 secrets\db_password.txt，从示例复制...
  if not exist "secrets" mkdir secrets
  copy /Y "secrets\db_password.txt.example" "secrets\db_password.txt"
)

docker compose -f compose.prod.yaml up -d --build
if errorlevel 1 exit /b 1

echo 等待健康检查...
timeout /t 20 /nobreak >nul

docker compose -f compose.prod.yaml ps
echo.
echo 完成。浏览器访问 http://localhost:80
endlocal
