@echo off
echo Starting Todo List Frontend...

REM Make sure the window stays open
cmd /c "cd /d "%~dp0" && npm install && npm start"