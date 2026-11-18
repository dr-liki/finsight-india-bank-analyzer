# FinSight India — Multi-Bank Statement Analyzer

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-10b981?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)
[![Release](https://img.shields.io/badge/Release-v2.3.0-0ea5e9?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/tag/v2.3.0)
[![Design](https://img.shields.io/badge/Design-Material%20Design%203-8b5cf6?style=flat-square)](https://m3.material.io/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20%7C%20Zero%20Cloud-f59e0b?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

**FinSight India** is a high-performance, 100% offline financial intelligence and multi-bank statement analysis application engineered specifically for the Indian banking ecosystem. It provides unified cashflow visibility, automated transaction categorization, internal inter-bank transfer reconciliation, true statement balance accounting, and visual spending analytics across accounts — all completely client-side with zero cloud dependencies.

---

## 📥 Download & Installation

### Android APK
Download the signed release APK directly to your Android device (Android 5.1 / API 22 through Android 15 / API 35):

* ⬇️ **[Download FinSight India v2.3.0 Signed APK](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/download/v2.3.0/FinSight-India-v2.3.0-release-signed.apk)** *(3.99 MB — Installable over any prior build)*
* 📦 **[View All GitHub Releases](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)**

### Web Application
FinSight India can also run directly in any modern desktop or mobile browser as a Progressive Web App (PWA) with full offline functionality.

---

## 🌟 Core Modules & Capabilities

### 1. Multi-Format Statement Ingestion Engine
* **Universal Format Support**: Parses statements in **Excel (`.xlsx`, `.xls`)**, **Comma-Separated Values (`.csv`)**, and **Adobe PDF (`.pdf`)** format.
* **Encrypted Statement Decryption**: Native modal prompt to decrypt password-protected bank PDF statements (e.g., date of birth, PAN, or account number passwords) in-memory using Mozilla PDF.js.
* **Automated Indian Bank Detection**: Heuristic detection algorithms identify bank layouts (SBI, HDFC, ICICI, Axis, Kotak, UBI, etc.) from statement metadata and column headers.
* **Intelligent Header Stripping**: Scans the leading rows of uploaded spreadsheets to eliminate disclaimers, branch addresses, and metadata blocks, isolating genuine tabular data.

### 2. True Running Balance Accounting Engine
* **Opening / Initial Balance Reverse-Deduction**: Accurately determines the true opening balance of an account before the earliest recorded transaction occurred:
  $$\text{If earliest transaction was a CREDIT: } \text{Initial Balance} = \text{First Recorded Balance} - \text{Amount}$$
  $$\text{If earliest transaction was a DEBIT: } \text{Initial Balance} = \text{First Recorded Balance} + \text{Amount}$$
* **Closing / Latest Balance Anchoring**: Direct anchor to the closing running balance extracted from uploaded statements.
* **Balance Display in Ledger**: Every transaction captures its respective closing running balance (`Bal: ₹XX,XXX.XX`) and presents it directly alongside category information.
* **Manual Overrides & Auto-Recalculation**: Interactive balance editor modal allows fine-tuning baseline figures or recalculating figures directly from statement matrices.

### 3. Smart Inter-Bank Transfers (Anti-Double-Counting)
* **Automated Transfer Matching**: Identifies self-transfers between personal accounts (e.g., transferring ₹25,000 from SBI to HDFC via UPI or IMPS) by matching opposite transaction types, identical amounts, and a configurable clearing window ($0$ to $5$ days).
* **Transfer Exclusion Toggle**: Excludes self-account transfers from total spending and total income calculations, preventing artificial inflation of monthly cashflow.
* **Interactive Transfer Management**: Inspect linked pairs, unlink false positives with persistent memory, and manually pair candidate counterpart transactions.

### 4. Direction-Aware Auto-Categorization Engine
* **Token-Boundary Regex Compilation**: Evaluates narration keywords using strict token boundaries `(^|[^a-z0-9])(keyword)([^a-z0-9]|$)` to prevent false positives (e.g., matching `ola` inside city names like *Kolkata* or *Solapur*).
* **Directional Scoping**: Rules are assigned directional constraints (`CREDIT`, `DEBIT`, or `BOTH`). Credits (salaries, refunds, interest) are never erroneously assigned debit categories (dining, utilities).
* **Persistent Manual Tags**: Manual category changes are tagged with `isManualCategory: true`, ensuring user classifications permanently survive background rule evaluations and app restarts.

### 5. Multi-Dimensional Ledger & Filtering
* **Optimized 3-Line Transaction Cards**:
  * **Line 1 (Core Facts)**: Transaction Date, Bank account badge, Payment Channel badge (UPI, NEFT, IMPS, ATM, POS, CARD, NET, CASH), Transfer badge, and signed Amount.
  * **Line 2 (Complete Narration)**: Transaction description rendered completely with zero truncation or text clipping.
  * **Line 3 (Category & Actions)**: Multi-select checkbox on far left, clickable Category badge, statement balance (`Bal: ₹...`), and Edit/Delete buttons on far right.
* **Granular Duration Filtering**:
  * **Multi-Select Periods**: Filter across **Weekwise**, **Monthwise**, **Quarterwise**, and **Yearwise** periods with itemized transaction counts.
  * **Quick Presets**: Instant one-tap time windows including **This Week**, **This Month**, **This Quarter**, and **This Year**, plus Last 7 Days, Last 30 Days, and Last 3 Months.
  * **Custom Date Range**: Dual date pickers with quick Clear Dates and one-tap duration reset.
* **Pinned Sticky Bulk Actions**: Selecting multiple transactions pins the **Change Category** and **Delete** action bar to the top of the viewport (`sticky top-2 z-30`), keeping controls accessible while scrolling.

### 6. Spend & Earning Analytics Workspace
* **Dual Breakdown Views**: Independent Donut charts and percentage breakdowns for Spend Outflow (debits) and Earning Inflow (credits).
* **Clickable Merchant & Payer Drill-Down**: Tapping any merchant or income source launches an interactive transaction drill-down modal displaying all matching transactions.
* **Net Flow Comparison Table**: Category-by-category balance table displaying Spend, Earning, and Net Cash Balance (Surplus vs Deficit) with tabular numerals and one-tap ledger filtering.

### 7. Formatted Export Suite & Native Android Sharing
* **Print-Ready PDF Statements**: Formatted executive reports with slate branding headers, KPI summary cards, and alternating shaded transaction rows via `jspdf` and `jspdf-autotable`.
* **Styled Excel Workbooks (`.xlsx`)**: Multi-column spreadsheets with automated column widths and summary totals rows via SheetJS.
* **RFC 4180 CSV**: Standardized CSV with UTF-8 Byte Order Mark (`\uFEFF`) for seamless compatibility with Microsoft Excel, Google Sheets, and tax software.
* **Native Android Share Sheet**: Routes exported documents through `@capacitor/filesystem` and `@capacitor/share`, launching the Android native share sheet to save directly to Downloads, Drive, or messaging apps.

### 8. Granular Backup & Restore Manager
* **Complete Workspace Export**: One-click download of a structured JSON backup file (`FinSight_India_Backup_vX.X.X_YYYY-MM-DD.json`).
* **Itemized Restoration Selection**: Granular item selection allowing selective import of Banks, Statement Files metadata, Custom Categories, Auto-Categorization Rules, and Transactions Ledger.
* **Flexible Import Modes**: Choose between *Merge with existing records* or *Clean replace entire workspace*.

---

## 🎨 Android Material Design 3 (Material You)

FinSight India is built from the ground up following official **Android Material Design 3 (MD3)** design tokens and ergonomics:

| Element | Specification |
| :--- | :--- |
| **Surface Hierarchy** | 5 tonal layers: `surface` (#0f131a), `container-low` (#151922), `container` (#1b202a), `container-high` (#222733), and `container-highest` (#292f3d). |
| **Bottom Navigation Bar** | Standard 80dp height with active indicator pills (`w-14 h-8 rounded-full bg-emerald-500/25 text-emerald-300`) and scale feedback. |
| **Top App Bar** | Minimal 64dp header with vector brand logo, version badge, and focused primary Export action. |
| **Touch Targets** | Conforms to Android accessibility standards with minimum $48 \times 48\text{px}$ touch targets across all buttons and chips. |
| **Cards & Geometry** | Fluid `rounded-3xl` (28px) and `rounded-2xl` container radiuses with subtle outline borders. |

---

## 🔒 Air-Gapped Privacy & Security

FinSight India operates under a strict, verifiable client-side privacy architecture:

```
[ Bank Statements ] ──> [ In-Memory Parser ] ──> [ Local Calculations ] ──> [ localStorage ]
                                                           │
                                                           └──> [ 0 Network Requests ]
```

* **Zero Cloud Transmission**: Statements, balances, narrations, and transactions are never transmitted over the internet.
* **Zero External Servers**: No backend servers, third-party databases, cloud functions, or analytics SDKs.
* **In-Memory File Processing**: Statement files are parsed directly in device memory; raw files are not uploaded anywhere.
* **Local Persistent Storage**: All application data resides securely in device `localStorage`.
* **Zero Telemetry**: No trackers, cookies, advertising SDKs, or session recording scripts.

---

## 🏦 Supported Indian Banks

Pre-configured column parsers, date normalizers, and narration cleaners for:

| Bank | Statement Formats Supported | Header Auto-Detection |
| :--- | :--- | :--- |
| **State Bank of India (SBI)** | Excel (`.xlsx`, `.xls`), CSV, PDF | ✅ Auto-detected |
| **HDFC Bank** | Excel (`.xlsx`, `.xls`), CSV, PDF | ✅ Auto-detected |
| **ICICI Bank** | Excel (`.xlsx`, `.xls`), CSV, PDF | ✅ Auto-detected |
| **Axis Bank** | Excel (`.xlsx`, `.xls`), CSV, PDF | ✅ Auto-detected |
| **Kotak Mahindra Bank** | Excel (`.xlsx`, `.xls`), CSV, PDF | ✅ Auto-detected |
| **Union Bank of India (UBI)**| Excel (`.xlsx`, `.xls`), CSV, PDF | ✅ Auto-detected |
| **Generic Indian Bank Statements** | Any file with Date, Narration, and Debit/Credit columns | ✅ Dynamic mapping |

---

## 🛠️ Technology Stack & Architecture

* **Frontend Framework**: React 18 (Hooks, Functional Architecture, Memoization)
* **Build Tooling**: Vite 5
* **Mobile Runtime**: Capacitor 6 (Android WebView Bridge)
* **Styling**: Tailwind CSS 3 + Material Design 3 Theme Engine
* **Icons**: `lucide-react`
* **Charts & Data Visualization**: `recharts`
* **Spreadsheet Engine**: SheetJS (`xlsx`)
* **PDF Extraction**: Mozilla `pdfjs-dist` (v3.11 with CDN Web Worker)
* **Report Generation**: `jspdf` + `jspdf-autotable`
* **Native Android Plugins**: `@capacitor/filesystem`, `@capacitor/share`
* **CI/CD Build System**: GitHub Actions (`ubuntu-latest`, Node 20, Java JDK 17 Temurin, Android Gradle)

---

## 💻 Local Development & Build Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ recommended)
* **npm**: v9.0.0 or higher
* **Java JDK**: Version 17 (required for Android APK compilation)
* **Android Studio & SDK**: Android SDK Platform 34+ (for local Android builds)

### Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/dr-liki/finsight-india-bank-analyzer.git
cd finsight-india-bank-analyzer

# 2. Install project dependencies
npm install

# 3. Start local development server with Hot Module Replacement
npm run dev

# 4. Compile production web bundle
npm run build

# 5. Build web assets and synchronize with Capacitor Android
npm run android:sync
```

### Building Android APK Locally

```bash
# Navigate to the Android project directory
cd android

# Compile debug APK
./gradlew assembleDebug

# Compile release APK (requires keystore configuration)
./gradlew assembleRelease
```

---

## 📄 Release Documentation

For a detailed changelog documenting incremental delta modifications across versions, refer to [RELEASE_NOTES.md](RELEASE_NOTES.md).

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
