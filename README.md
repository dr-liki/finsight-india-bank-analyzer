# FinSight India — Multi-Bank Statement Analyzer

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-10b981?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)
[![Release](https://img.shields.io/badge/Release-v2.0.0-0ea5e9?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/tag/v2.0.0)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20%7C%20Zero%20Cloud-f59e0b?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

**FinSight India** is a fast, 100% offline financial analytics app designed for the Indian banking ecosystem. It imports statement files across multiple banks, tracks running balances, eliminates internal transfer double-counting, auto-categorizes transactions, and generates insightful spending reports — all completely private on your device.

---

## 📥 Download App

Download the latest signed Android APK directly to your phone:

* ⬇️ **[Download FinSight India v2.0.0 APK](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/download/v2.0.0/FinSight-India-v2.0.0-release-signed.apk)** *(Installable over any prior version)*
* 📦 **[View All GitHub Releases](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)**

---

## ✨ Features

### 📄 1. Multi-Bank Statement Ingestion
* Import statement files in **Excel (`.xlsx`, `.xls`)**, **CSV (`.csv`)**, and **PDF (`.pdf`)**.
* Decrypts **password-protected bank PDFs** locally on your device.
* Normalizes Indian date formats, transaction channels (UPI, IMPS, NEFT, RTGS, POS, ATM), and narrations.

### 💰 2. True Running Balance Accounting
* Extracts running statement balances and displays **`Bal: ₹XX,XXX.XX`** directly in your ledger.
* Calculates **Initial (Opening) Balance** and **Latest (Closing) Balance** with formatted statement dates:
  * If earliest txn was a Credit: $\text{Initial Balance} = \text{Running Balance} - \text{Amount}$
  * If earliest txn was a Debit: $\text{Initial Balance} = \text{Running Balance} + \text{Amount}$
  * Latest balance directly anchors to the closing statement balance.
* Auto-syncs balance cards when statements change, with optional manual overrides.

### 🔄 3. Smart Inter-Bank Transfers
* Automatically identifies internal fund transfers between your own accounts (e.g. ₹20,000 sent from HDFC received in SBI).
* Synchronized `'Bank Transfer'` category tagging.
* Toggle to exclude transfers from total income/expense figures to avoid double-counting.

### 🏷️ 4. Smart Auto-Categorization
* Direction-aware rules (`CREDIT`, `DEBIT`, or `BOTH`) prevent income from receiving expense categories.
* Word-boundary regex matching ensures exact merchant tagging without false positives.
* Manage rules with live re-evaluation, add custom categories, and retain manual edits permanently.

### 📊 5. Visual Analytics & Drill-Downs
* **Dual Cash Flow**: Switch between Spend (Outflow), Earnings (Inflow), and Net Flow comparisons.
* **Interactive Charts**: Donut category breakdowns, monthly trends, and payment channel distribution.
* **Clickable Merchant & Payer Drill-Down**: Tap any top merchant or income source to view and edit its transaction history.

### 📋 6. Modern Ledger & Multi-Select
* **Modern Selection Windows**: Full-featured popup windows for Transaction Type and Category with search and icons.
* **Bulk Category Editing**: Select multiple transactions via checkboxes to change categories in one tap.
* **Flexible Date Filters**: Filter by Week, Month, Quarter, Year, Quick Presets, or Custom Date Ranges.

### 📤 7. Universal Exports & Backup
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
npx cap sync android
```

---

## 📜 License

Licensed under the [MIT License](LICENSE).
