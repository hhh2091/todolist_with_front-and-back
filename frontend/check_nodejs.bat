@echo off
setlocal enabledelayedexpansion

echo ===================================
echo Node.js Installation Checker
echo ===================================
echo.

REM Try to get Node.js version
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is NOT installed or not in PATH!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo After installation, you may need to restart your computer
    echo or command prompt to update the PATH environment variable.
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo Node.js is installed. Version: !NODE_VERSION!
    echo.
    
    REM Check npm version
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo npm is installed. Version: !NPM_VERSION!
    echo.
    
    echo Your Node.js installation appears to be working correctly.
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b 0
)