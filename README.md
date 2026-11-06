# FinSight India — Android Multi-Bank Statement Analyzer

![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-10b981)
![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Capacitor%206%20%7C%20Tailwind-3b82f6)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20On--Device%20Processing-f59e0b)

**FinSight India** is an offline-first Android and Web financial analytics application built with React, Vite, Tailwind CSS, and Capacitor. It ingests multiple `.xlsx`, `.pdf` (including password-protected statements), and `.csv` bank statements simultaneously, automatically identifies major Indian banks (**SBI, HDFC, ICICI, Axis, Kotak**), normalizes and deduplicates transactions, and visualizes cash flows across **Daywise, Monthwise, Quarterly, and Yearly** horizons.

---

## Key Features

- **Multi-Format Batch Ingestion**: Upload `.xlsx`, `.xls`, `.csv`, and `.pdf` statements simultaneously using client-side SheetJS (`xlsx`) and Mozilla `pdfjs-dist`.
- **Multi-Bank Auto-Detection**: Automatically detects narration patterns and column headers for **SBI, HDFC Bank, ICICI Bank, Axis Bank, and Kotak Mahindra Bank**.
- **Automated Rule-Based Categorization**: Segregates transactions into Indian spending verticals (*Food & Dining, Groceries & Quick Commerce, Investments & SIP, Fuel & Transport, Bills & Utilities, Healthcare & Medical, Shopping & Books, Salary & Income*) and payment channels (`UPI`, `NEFT`, `IMPS`, `NACH`, `POS`).
- **Multi-Horizon Time Segregation**: Instant toggle between **Daily (`YYYY-MM-DD`)**, **Monthly (`YYYY-MM`)**, **Quarterly (`YYYY-Q1..Q4`)**, and **Yearly (`YYYY`)** cash-flow aggregations.
- **Zero-Server Privacy**: 100% of file parsing and analytics execute locally on your device. No financial data ever leaves your phone or browser.
- **Automated Cloud APK CI/CD**: Pre-configured GitHub Actions workflow (`.github/workflows/build-apk.yml`) compiles an installable Android `app-debug.apk` on every push.

---

## Repository Structure

```text
finsight-india-bank-analyzer/
├── .github/
│   └── workflows/
│       └── build-apk.yml          # Automated GitHub Actions Android APK build pipeline
├── docs/
│   ├── ARCHITECTURE.md            # Data pipeline, bank parsers, and privacy architecture
│   └── BANK_FORMATS.md            # Supported Indian bank statement schemas & column mappings
├── src/
│   ├── App.jsx                    # Core Multi-Bank Analyzer UI, parsers & Recharts views
│   ├── main.jsx                   # React DOM entry point
│   └── index.css                  # Tailwind CSS directives & mobile viewport styling
├── .gitignore                     # Git ignore rules for Node, Vite, and Android Gradle
├── LICENSE                        # MIT License
├── README.md                      # Project documentation
├── build_apk.bat                  # One-click local APK build script (Windows)
├── build_apk.sh                   # One-click local APK build script (macOS / Linux)
├── capacitor.config.json          # Capacitor Android configuration (com.finsight.bankanalyzer)
├── index.html                     # Mobile-optimized HTML shell
├── package.json                   # Project dependencies and build scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── vite.config.js                 # Vite bundler configuration
```

---

## Getting Started

### 1. Cloud APK Build (No Android Studio Required)
1. Push this repository to GitHub.
2. Navigate to the **Actions** tab in your GitHub repository.
3. Select **Build Android APK** and click **Run workflow**.
4. Once complete (~2 minutes), download **`FinSight-India-Debug-APK`** (`app-debug.apk`) from the **Artifacts** section and install it on your Android device.

### 2. Local Development & APK Compilation
Ensure you have **Node.js 20+** installed (plus **Java JDK 17** and **Android SDK** for local APK compilation).

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production web bundle & compile Android APK (macOS/Linux)
chmod +x build_apk.sh && ./build_apk.sh
```

On Windows, run `build_apk.bat`. The generated APK will be output to `android/app/build/outputs/apk/debug/app-debug.apk`.
