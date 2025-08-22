@echo off
echo Starting Todo List frontend service...

REM Check if Node.js is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm command not found. Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo After installation, restart this script.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Start server
echo Starting server...
npm start

pause