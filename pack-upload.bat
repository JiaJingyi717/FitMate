@echo off
setlocal
cd /d "%~dp0"

echo [FitMate] 打包 fitmate-upload.tar.gz（不含 .env / node_modules）...

if exist "fitmate-upload.tar.gz" del /f "fitmate-upload.tar.gz"

tar -czf fitmate-upload.tar.gz ^
  --exclude=node_modules ^
  --exclude=.git ^
  --exclude=frontend/fitmate-frontend/node_modules ^
  --exclude=frontend/fitmate-frontend/dist ^
  --exclude=frontend/fitmate-frontend/coverage ^
  --exclude=backend/.env ^
  --exclude=backend/htmlcov ^
  --exclude=backend/.pytest_cache ^
  --exclude=.env ^
  .

if errorlevel 1 (
  echo 打包失败。
  exit /b 1
)

for %%A in ("fitmate-upload.tar.gz") do echo 完成：%%~nxA （约 %%~zA 字节）
echo 下一步：scp fitmate-upload.tar.gz root@你的服务器IP:/tmp/
endlocal
