@echo off
echo === FinSight India: Automated Android APK Builder ===
call npm install
call npm run build
if not exist "android" (
  call npx cap add android
)
call npx cap sync android
if exist "android-res" (
  xcopy /s /y "android-res\*" "android\app\src\main\res\"
)
cd android
call gradlew.bat assembleDebug
echo =====================================================
echo SUCCESS! Your installable APK is located at:
echo android\app\build\outputs\apk\debug\app-debug.apk
pause
