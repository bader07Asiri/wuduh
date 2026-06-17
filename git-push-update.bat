@echo off
cd /d "C:\Users\alasi\Downloads\wuduh-وضوح"
git add vercel.json
git commit -m "fix: remove secret references from vercel.json"
git push origin main
echo.
echo Done! Now go back to Vercel and click Deploy.
pause
