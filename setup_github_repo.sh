#!/usr/bin/env bash
set -e

REPO_NAME="${1:-finsight-india-bank-analyzer}"
VISIBILITY="${2:---private}"

echo "=== FinSight India: GitHub Repository Generator ==="

if ! command -v git &> /dev/null; then
  echo "Error: 'git' is not installed. Please install Git first."
  exit 1
fi

git init
git branch -M main
git add .
git commit -m "chore: initial commit of FinSight India Android Multi-Bank Analyzer"

if command -v gh &> /dev/null; then
  echo "GitHub CLI (gh) detected. Creating repository '$REPO_NAME' ($VISIBILITY) and pushing..."
  gh repo create "$REPO_NAME" "$VISIBILITY" --source=. --remote=origin --push
  echo "====================================================="
  echo "SUCCESS! Repository created and pushed."
  echo "GitHub Actions is now building your Android APK under the 'Actions' tab!"
else
  echo "====================================================="
  echo "Local Git repository initialized and committed on branch 'main'."
  echo "To push to GitHub, either install GitHub CLI ('gh auth login') or run:"
  echo "  git remote add origin https://github.com/<your-username>/$REPO_NAME.git"
  echo "  git push -u origin main"
fi
