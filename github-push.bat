@echo off
cd /d "C:\Users\alasi\Downloads\wuduh-وضوح"
echo Working in: %CD%
echo.

echo Connecting to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/bader07Asiri/wuduh.git

echo Renaming branch to main...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo.
echo Done! Project is now on GitHub.
pause
