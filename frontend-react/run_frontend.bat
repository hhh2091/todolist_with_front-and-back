@echo off
setlocal enabledelayedexpansion

REM 创建一个临时批处理文件，用于在当前窗口中执行命令
set TEMP_BAT=%TEMP%\run_frontend_temp.bat

echo @echo off > %TEMP_BAT%
echo setlocal enabledelayedexpansion >> %TEMP_BAT%
echo echo =================================== >> %TEMP_BAT%
echo echo Todo List Frontend Launcher >> %TEMP_BAT%
echo echo =================================== >> %TEMP_BAT%
echo echo. >> %TEMP_BAT%

echo REM 检查Node.js是否安装 >> %TEMP_BAT%
echo where npm ^>nul 2^>nul >> %TEMP_BAT%
echo if %%errorlevel%% neq 0 ( >> %TEMP_BAT%
echo     echo ERROR: npm command not found! >> %TEMP_BAT%
echo     echo. >> %TEMP_BAT%
echo     echo Node.js is not installed or not in your PATH environment variable. >> %TEMP_BAT%
echo     echo Please download and install Node.js from https://nodejs.org/ >> %TEMP_BAT%
echo     echo. >> %TEMP_BAT%
echo     echo After installation, you may need to restart your computer. >> %TEMP_BAT%
echo     echo. >> %TEMP_BAT%
echo     echo Press any key to exit... >> %TEMP_BAT%
echo     pause ^> nul >> %TEMP_BAT%
echo     exit /b 1 >> %TEMP_BAT%
echo ) >> %TEMP_BAT%

echo echo Node.js is installed. Proceeding with frontend startup... >> %TEMP_BAT%
echo echo. >> %TEMP_BAT%

echo REM 切换到前端目录 >> %TEMP_BAT%
echo cd /d "%~dp0" >> %TEMP_BAT%

echo REM 安装依赖 >> %TEMP_BAT%
echo echo Installing dependencies... >> %TEMP_BAT%
echo call npm install >> %TEMP_BAT%
echo if %%errorlevel%% neq 0 ( >> %TEMP_BAT%
echo     echo. >> %TEMP_BAT%
echo     echo ERROR: Failed to install dependencies! >> %TEMP_BAT%
echo     echo Please check the error messages above. >> %TEMP_BAT%
echo     echo. >> %TEMP_BAT%
echo     echo Press any key to exit... >> %TEMP_BAT%
echo     pause ^> nul >> %TEMP_BAT%
echo     exit /b 1 >> %TEMP_BAT%
echo ) >> %TEMP_BAT%

echo REM 启动服务器 >> %TEMP_BAT%
echo echo Starting server... >> %TEMP_BAT%
echo echo. >> %TEMP_BAT%
echo echo The server will start in a new window. >> %TEMP_BAT%
echo echo If the server window closes immediately, there might be an error. >> %TEMP_BAT%
echo echo. >> %TEMP_BAT%
echo echo Press any key to start the server... >> %TEMP_BAT%
echo pause ^> nul >> %TEMP_BAT%

echo REM 使用start命令在新窗口中启动npm start >> %TEMP_BAT%
echo start "Todo List Frontend Server" cmd /k "npm start" >> %TEMP_BAT%

echo echo. >> %TEMP_BAT%
echo echo Frontend server has been started in a new window. >> %TEMP_BAT%
echo echo Press any key to exit this launcher... >> %TEMP_BAT%
echo pause ^> nul >> %TEMP_BAT%

REM 执行临时批处理文件
cmd /k "%TEMP_BAT%"
