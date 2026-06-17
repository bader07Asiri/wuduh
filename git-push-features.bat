@echo off
cd /d "C:\Users\alasi\Downloads\wuduh-وضوح"

echo Removing lock files...
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\config.lock" 2>nul

echo Adding all changes...
git add -A

echo Committing...
git commit -m "feat: admin subscription management, theme control, PMBoK edition selector"

echo Pushing to GitHub...
git push origin main

echo.
echo Done! Go to Vercel and redeploy.
pause
