@echo off
cd /d "C:\Users\alasi\Downloads\wuduh-وضوح"
echo Working in: %CD%
echo.

echo Removing git lock files...
del /f /q ".git\config.lock" 2>nul
del /f /q ".git\index.lock" 2>nul

echo Configuring git...
git config user.email "info@nailart.sa"
git config user.name "Wuduh"

echo Adding all files...
git add -A

echo Creating initial commit...
git commit -m "initial commit: Wuduh project"

echo.
echo Done! Git repository is ready.
pause
