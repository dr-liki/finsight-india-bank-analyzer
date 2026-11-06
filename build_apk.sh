#!/usr/bin/env bash
set -e
echo "=== FinSight India: Automated Android APK Builder ==="
npm install
npm run build
if [ ! -d "android" ]; then
  npx cap add android
fi
npx cap sync android
cd android
chmod +x gradlew
./gradlew assembleDebug
echo "====================================================="
echo "SUCCESS! Your installable APK is located at:"
echo "android/app/build/outputs/apk/debug/app-debug.apk"
