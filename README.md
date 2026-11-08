# FinSight India — Android Multi-Bank Statement Analyzer

![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-10b981?style=flat-square)
![Release](https://img.shields.io/badge/Release-v1.7.0-0ea5e9?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Vite%205%20%7C%20Tailwind%203%20%7C%20Capacitor%206-6366f1?style=flat-square)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20On--Device%20%7C%20Zero%20Cloud-f59e0b?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)

**FinSight India** is a fast, privacy-first, offline-native Android and Web financial intelligence application designed specifically for the Indian banking and payments ecosystem. It ingests statements across major Indian banks (**State Bank of India, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Union Bank of India**, and custom accounts) in `.xlsx`, `.xls`, `.csv`, and `.pdf` (including password-protected files) simultaneously, normalizes data client-side, detects internal transfers, categorizes cash flows, and produces rich visualizations and executive export reports.

---

## Key Features & Capabilities (v1.7.0)

### 1. Multi-Format Batch Statement Ingestion
- **Simultaneous File Parsing**: Ingest multiple statements across different banks and accounts in a single batch.
- **Broad File Format Support**: Client-side parsing of Excel spreadsheets (`.xlsx`, `.xls`), CSV statements (`.csv`), and PDF statements (`.pdf`).
- **Interactive Password-Protected PDF Decryption**: Decrypts password-protected Indian bank PDFs directly in your browser or phone memory.
- **Robust Schema Normalization**: Scans header metadata, normalizes Indian date formats (`DD/MM/YYYY`, `DD-MM-YYYY`, ISO), extracts transaction channels (`UPI`, `NEFT`, `IMPS`, `NACH`, `POS`, `ATM`), and eliminates duplicate entries across overlapping statements.

### 2. Smart Bank Transfer Matching & Management
- **Automatic Cross-Bank Transfer Pairing**: Automatically identifies money moved between your own accounts (e.g. ₹25,000 debited from HDFC matching ₹25,000 credited into SBI within a configurable clearing window).
- **Synchronized 'Bank Transfer' Tagging**: Automatically assigns both debit and credit legs of a transfer to the `'Bank Transfer'` category in real time.
- **Double-Counting Elimination**: An internal transfer exclusion toggle instantly excludes internal fund movements from your total income and total expense figures.
- **Interactive Transfer Manager**: Inspect paired transfers, configure clearing delays (Same Day to 5 Days), unlink false positives (with automatic category reset), or manually link transfers with non-standard narrations.
- **Scoped Transactions Focus**: Transfer alerts and management controls are housed exclusively within the Transactions (`LEDGER`) tab.

### 3. Direction-Aware & Token-Bounded Auto-Categorization
- **Direction-Scoped Rules**: Evaluation rules have explicit direction constraints (`CREDIT`, `DEBIT`, `BOTH`), preventing credits (e.g. interest, salary, refunds, cashbacks) from accidentally receiving debit categories, and vice versa.
- **Discrete Token-Boundary Regular Expressions**: Keywords are evaluated using bounded regex patterns `(^|[^a-z0-9])keyword([^a-z0-9]|$)` instead of naive substring matching, eliminating false positives (e.g. `ola` no longer incorrectly triggers on city names like *Kolkata* or *Solapur*).
- **Persistent Manual Overrides**: User category modifications in the transaction edit modal are stamped with `isManualCategory: true` and permanently survive application restarts, data refreshes, and rule updates.
- **Comprehensive Interactive Rules Editor**: Create, update, or remove keyword rules with live re-evaluation against your ledger.
- **Custom Categories Suite**: Add custom categories with customizable color swatches; renames cascade dynamically to all assigned transactions.

### 4. Dual Category Analysis & Net Flow Intelligence
- **Spend Breakdown (Outflows)**: Interactive Donut and Bar charts visualizing debit distribution, percentage weights, channel breakdowns (UPI vs. POS vs. NACH), and top merchants/payees.
- **Earnings Breakdown (Inflows)**: Dedicated credit analysis isolating primary income streams, interest credits, cashbacks, refunds, and top payers.
- **Spend vs. Earning Net Flow Comparison**: A unified comparison grid showing incoming vs. outgoing amounts and net cash surplus/deficit per category.
- **Mobile-Responsive Layout**: Built with horizontal scroll support (`overflow-x-auto`) and text-overflow protection (`min-w-0 flex-1 truncate`) so descriptions and amounts never blow out mobile screens.

### 5. Multi-Select Duration & Category Filtering
- **Multi-Select Temporal Filters**: Filter your ledger and metrics across multi-selected periods:
  - **Weekwise**: Compare multiple individual calendar weeks.
  - **Monthwise**: Multi-select arbitrary months (e.g., compare April and October).
  - **Quarterwise**: Group by fiscal or calendar quarters (`Q1`, `Q2`, `Q3`, `Q4`).
  - **Yearwise**: Multi-select fiscal years.
  - **Quick Presets & Custom**: Instant presets (`Last 7 Days`, `Last 30 Days`, `This Month`, `Last 3 Months`, `This Year`, `All Time`) plus a custom date range picker.
- **Multi-Option Category Filter in Ledger**: Select multiple spending verticals simultaneously with live transaction counter badges, real-time category search, and a single-tap clear button.

### 6. Universal Formatted Export Suite
- **Screen-Centered Export Modal**: A fixed, touch-friendly modal dialog replacing off-screen dropdown menus on mobile devices.
- **Printable PDF Statement Reports**: Executive statement reports generated via `jspdf` and `jspdf-autotable` featuring slate branding, statement metadata, KPI summary cards (Total Outflow, Total Inflow, Net Balance), alternating shaded transaction rows, and running page numbers.
- **Formatted Excel Workbooks (`.xlsx`)**: Structured spreadsheets with currency-formatted amounts, category headers, and automated sum formulas.
- **Universal RFC 4180 CSV**: Clean comma-separated exports with UTF-8 BOM encoding for seamless compatibility across Excel, Google Sheets, and accounting software.
- **Native Android Save & Share Sheet**: Integrates `@capacitor/filesystem` and `@capacitor/share` to write exported files to cache and launch the native Android Share Sheet ("Save to Downloads", Google Drive, WhatsApp, etc.), completely bypassing WebView download restrictions.

### 7. Granular Backup & Restore Engine
- **Full Client-Side JSON Backups**: Export your entire financial profile into an encrypted or portable JSON file.
- **Granular Restoration**: Selectively restore Banks, Statement Files metadata, Custom Categories, Auto-Categorization Rules, and/or Transactions.

### 8. Material Design 3 Compliance & Polish
- **MD3 Adaptive Launcher Icons**: Full compliance with Android 13+ theming, providing background, foreground, and monochrome vector and raster drawables.
- **Universal File Manager Icon Visibility**: High-resolution raster PNG mipmaps and drawables across all density buckets (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) coupled with explicit activity/application attributes ensure thumbnail visibility in Files by Google, Samsung My Files, and third-party file managers.
- **Conflict-Free Updates**: Built and signed with a persistent release keystore and monotonic version codes to allow seamless updates over existing installations.
- **Clean Top App Bar**: A minimalist, clutter-free header focused on branding, version indicators, and summary counters.

---

## 100% Private & Offline Architecture

Your financial records are strictly personal. FinSight India is designed from the ground up on an **Air-Gapped Privacy Model**:

| Property | FinSight India Implementation |
| --- | --- |
| **Server Backend** | None. Zero cloud servers, APIs, or remote databases. |
| **Data Storage** | 100% local inside your browser / device `localStorage`. |
| **File Parsing** | In-memory processing via SheetJS and PDF.js; statements never leave your device. |
| **Network Requests** | Zero telemetry, zero analytics trackers, zero advertising SDKs. |
| **Internet Permission** | Only used to resolve external PDF worker CDN scripts if not locally cached. |

---

## Repository Structure

```text
finsight-india-bank-analyzer/
├── .github/
│   └── workflows/
│       └── build-apk.yml          # GitHub Actions CI for building & signing Android APKs
├── android/                       # Capacitor Android native project (gitignored build artifact)
├── android-manifest/
│   └── AndroidManifest.xml        # Master Android Manifest with MD3 & File Manager icon declarations
├── android-res/                   # Master Android resource bucket (MD3 Adaptive XMLs & raster PNGs)
│   ├── drawable/                  # Vector background, foreground, monochrome drawables
│   ├── drawable-{density}/        # Density raster icons (mdpi to xxxhdpi)
│   ├── mipmap/                    # Base mipmap raster icons
│   └── mipmap-{density}/          # MD3 mipmap raster icons & foregrounds
├── certs/                         # Persistent release keystore & signing configurations
├── docs/
│   ├── ARCHITECTURE.md            # Technical pipeline & privacy architectural details
│   └── BANK_FORMATS.md            # Indian bank statement schemas & column mapping definitions
├── src/
│   ├── App.jsx                    # Single-file unified React UI, transaction pipeline & Recharts views
│   ├── main.jsx                   # React 18 DOM root entry point
│   └── index.css                  # Tailwind CSS styling, custom scrollbars & mobile animations
├── index.html                     # Mobile viewport HTML5 template & brand assets
├── package.json                   # Dependencies, Capacitor plugins, and build scripts
├── PROJECT_CONTEXT.md             # Developer context, release milestones, and architecture log
├── RELEASE_NOTES.md               # Detailed changelog across all FinSight India versions
├── tailwind.config.js             # Tailwind CSS design system configuration
└── vite.config.js                 # Vite production bundler configuration
```

---

## Download & Installation

### Option 1: Download Signed Release APK (Recommended)
Download the latest production release directly to your Android device from the Releases page:
- **Latest Release**: [FinSight India Releases on GitHub](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)
- **Asset**: `FinSight-India-v1.7.0-release-signed.apk` (Installable directly over any previous version)

### Option 2: Automated Cloud CI/CD Build
1. Fork or push changes to your GitHub repository on `main`.
2. The GitHub Actions workflow (`.github/workflows/build-apk.yml`) automatically compiles and signs a fresh release APK using Temurin Java JDK 17 and Node 20.
3. Download the signed APK artifact directly from the **Actions** run summary.

---

## Local Development & Compilation

### Prerequisites
- **Node.js**: v20 or newer
- **Java JDK**: 17 (Eclipse Temurin recommended)
- **Android SDK / Android Studio** (only required if compiling native APKs locally)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/dr-liki/finsight-india-bank-analyzer.git
cd finsight-india-bank-analyzer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build web production bundle
npm run build

# 5. Sync web bundle to Android platform
npx cap sync android

# 6. Compile signed Android APK with Gradle (Windows PowerShell)
Set-Location android
./gradlew assembleRelease
```

---

## Supported Indian Banks

FinSight India includes automated header detection and statement normalization for:
- **State Bank of India (SBI)** (`.xlsx`, `.xls`, `.csv`, `.pdf`)
- **HDFC Bank** (`.xlsx`, `.xls`, `.csv`, `.pdf`)
- **ICICI Bank** (`.xlsx`, `.xls`, `.csv`, `.pdf`)
- **Axis Bank** (`.xlsx`, `.xls`, `.csv`, `.pdf`)
- **Kotak Mahindra Bank** (`.xlsx`, `.xls`, `.csv`, `.pdf`)
- **Union Bank of India (UBI)** (`.xlsx`, `.xls`, `.csv`, `.pdf`)
- **Custom / Other Banks**: Any bank statement with standard Date, Narration/Description, and Debit/Credit columns can be mapped and ingested seamlessly.

---

## License

This project is licensed under the [MIT License](LICENSE).
