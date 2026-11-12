@echo off
title Housekeeping Store Stock Manager
echo Starting Housekeeping Store Stock App...
cd /d "%~dp0"
start http://localhost:5173
npm run dev
pause
