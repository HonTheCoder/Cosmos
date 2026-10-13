@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required for the developer edition.
  echo Or open COSMOS_OFFLINE.html now, with no installation.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing development packages. Internet access is required for this step.
  call npm install
  if errorlevel 1 (
    echo Installation failed. You can still open COSMOS_OFFLINE.html.
    pause
    exit /b 1
  )
)
echo Starting COSMOS at http://localhost:5173
start "" "http://localhost:5173"
call npm run dev
pause
