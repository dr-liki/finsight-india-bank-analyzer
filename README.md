# FinSight India — Android Multi-Bank Statement Analyzer

This repository contains the complete Capacitor + React Android project for **FinSight India**, supporting multi-file `.xlsx`, `.pdf`, and `.csv` bank statement parsing across Indian banks (HDFC, SBI, ICICI, Axis, Kotak) with Daywise, Monthwise, Quarterly, and Yearly segregation.

## Option 1: Build APK in the Cloud without installing Android Studio (GitHub Actions)
1. Create a new repository on GitHub and upload the contents of this ZIP file.
2. Replace `src/App.jsx` with the full `App.jsx` code from the Canvas preview if you made custom edits, or use the pre-bundled full analyzer in `src/App.jsx`.
3. Go to the **Actions** tab in your GitHub repository and run the **Build Android APK** workflow.
4. Once finished (~2 minutes), download **`FinSight-India-Debug-APK`** (`app-debug.apk`) from the workflow Artifacts section and install it directly on your Android phone.

## Option 2: One-Click Local APK Build (Windows / macOS / Linux)
Prerequisites: Node.js 18+ and Android SDK / Android Studio installed.

- **Windows**: Double-click `build_apk.bat`
- **macOS / Linux**: Run `chmod +x build_apk.sh && ./build_apk.sh`

The compiled APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`
