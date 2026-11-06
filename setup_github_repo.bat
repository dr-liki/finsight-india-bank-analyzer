@echo off
SET REPO_NAME=%1
IF "%REPO_NAME%"=="" SET REPO_NAME=finsight-india-bank-analyzer

echo === FinSight India: GitHub Repository Generator ===

git init
git branch -M main
git add .
git commit -m "chore: initial commit of FinSight India Android Multi-Bank Analyzer"

where gh >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
  echo GitHub CLI detected. Creating private repository %REPO_NAME% and pushing...
  gh repo create %REPO_NAME% --private --source=. --remote=origin --push
  echo =====================================================
  echo SUCCESS! Repository created and pushed to GitHub.
  echo Check the Actions tab in your GitHub repo to download your compiled APK!
) ELSE (
  echo =====================================================
  echo Local Git repository initialized and committed on branch 'main'.
  echo Run the following commands after creating an empty repo on github.com:
  echo   git remote add origin https://github.com/YOUR_USERNAME/%REPO_NAME%.git
  echo   git push -u origin main
)
pause
