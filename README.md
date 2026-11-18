# FinSight India — Multi-Bank Statement Analyzer

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-10b981?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)
[![Release](https://img.shields.io/badge/Release-v2.1.0-0ea5e9?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/tag/v2.1.0)
[![Design](https://img.shields.io/badge/Design-Material%20Design%203-8b5cf6?style=flat-square)](https://m3.material.io/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20%7C%20Zero%20Cloud-f59e0b?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

**FinSight India** is a fast, 100% offline financial analytics app designed for the Indian banking ecosystem. It imports statement files across multiple banks, tracks running balances, eliminates internal transfer double-counting, auto-categorizes transactions, and generates insightful spending reports — all completely private on your device.

---

## 📥 Download App

Download the latest signed Android APK directly to your phone:

* ⬇️ **[Download FinSight India v2.1.0 APK](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/download/v2.1.0/FinSight-India-v2.1.0-release-signed.apk)** *(Installable over any prior version)*
* 📦 **[View All GitHub Releases](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)**

---

## ✨ Features in v2.1.0

### 🎨 1. Android Material Design 3 (Material You) UI/UX
* **Tonal Surface Hierarchy**: Elegant depth system built on MD3 tonal containers (`surface`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`).
* **MD3 Navigation Bar**: Standard 80dp bottom navigation bar featuring active indicator pills, smooth state transitions, and comfortable touch feedback.
* **MD3 Top App Bar**: High-clarity app bar with brand icon, version chip, and quick actions.
* **Touch Target Accessibility**: All interactive controls, cards, dialogs, and buttons adhere to the Android $\ge 48\text{px}$ touch target standard.
* **Architectural Separation**: Clean division between **Data Layers** (`balanceEngine`, `parsers`, `categorizationEngine`, `transferEngine`, `exportEngine`, `storage`) and **UI Layers** (navigation, views, modals).

### 📄 2. Multi-Bank Statement Ingestion
* Import statement files in **Excel (`.xlsx`, `.xls`)**, **CSV (`.csv`)**, and **PDF (`.pdf`)**.
* Decrypts **password-protected bank PDFs** locally on your device with zero cloud dependency.
* Auto-detects Indian banks and normalizes payment channels (UPI, IMPS, NEFT, RTGS, POS, ATM, NACH).

### 💰 3. True Running Balance Accounting
* Extracts running statement balances and displays **`Bal: ₹XX,XXX.XX`** directly in your transaction ledger.
* Calculates **Initial (Opening) Balance** and **Latest (Closing) Balance** with formatted statement dates:
  * If earliest transaction was a Credit: $\text{Initial Balance} = \text{Running Balance} - \text{Amount}$
  * If earliest transaction was a Debit: $\text{Initial Balance} = \text{Running Balance} + \text{Amount}$
  * Latest balance directly anchors to the closing running balance of your statement.
* Auto-syncs balance cards when statement files change, with manual override and statement re-analysis support.

### 🔄 4. Smart Inter-Bank Transfers
* Automatically identifies internal fund transfers between your own accounts (e.g. ₹20,000 sent from HDFC received in SBI).
* Synchronized `'Bank Transfer'` category tagging with custom clearing window selection.
* Excludes internal transfers from total income/expense figures to avoid double-counting.

### 🏷️ 5. Smart Direction-Aware Auto-Categorization
* Direction-aware rules (`CREDIT`, `DEBIT`, or `BOTH`) prevent income from receiving expense categories.
* Word-boundary regex matching ensures exact merchant tagging without false positives.
* Manage rules with live re-evaluation, add custom categories, and retain manual edits permanently.

### 📊 6. Visual Analytics & Drill-Downs
* **Dual Cash Flow**: Switch between Spend (Outflow), Earnings (Inflow), and Net Flow comparisons.
* **Interactive Charts**: Donut category breakdowns, periodic cash flow trends, and channel distributions.
* **Clickable Merchant & Payer Drill-Down**: Tap any top merchant or income source to inspect and jump to its transaction breakdown in a popup window.

### 📋 7. Modern Ledger & Multi-Select
* **Modern Selection Windows**: Full-featured popup windows for Transaction Type and Category with search and icons.
* **Bulk Category Editing**: Select multiple transactions via checkboxes to change categories in one tap.
* **Flexible Date Filters**: Filter by Week, Month, Quarter, Year, Quick Presets, or Custom Date Ranges.

### 📤 8. Universal Exports & Backup
* Export professional statement reports in **PDF**, formatted **Excel (`.xlsx`)**, or **CSV**.
* Native Android Share Sheet integration to save to Downloads, Google Drive, WhatsApp, etc.
* Full client-side JSON backup and granular restore (Banks, Files, Rules, Categories, Transactions).

---

## 🔒 100% Private & Air-Gapped

Your sensitive financial statements never leave your phone or browser.

| Security Feature | Implementation |
| --- | --- |
| **Servers** | None. Zero cloud servers, databases, or third-party APIs. |
| **Storage** | 100% on-device local storage (`localStorage`). |
| **Parsing** | In-memory processing via SheetJS and PDF.js. |
| **Telemetry** | Zero analytics, zero user tracking, zero ads. |

---

## 🏦 Supported Banks

Pre-configured header detection and parsing for:
* **State Bank of India (SBI)**
* **HDFC Bank**
* **ICICI Bank**
* **Axis Bank**
* **Kotak Mahindra Bank**
* **Union Bank of India (UBI)**
* *Any Indian bank statement with Date, Narration, and Debit/Credit columns.*

---

## 🛠️ Development & Building

```bash
# 1. Clone repository
git clone https://github.com/dr-liki/finsight-india-bank-analyzer.git
cd finsight-india-bank-analyzer

# 2. Install dependencies
npm install

# 3. Start local dev server
npm run dev

# 4. Build web production assets
npm run build

# 5. Sync Capacitor Android
npm run android:sync
```

---

## 📜 License

Licensed under the [MIT License](LICENSE).
