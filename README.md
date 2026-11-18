# FinSight India — Multi-Bank Statement Analyzer

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-10b981?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)
[![Release](https://img.shields.io/badge/Release-v2.3.0-0ea5e9?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/tag/v2.3.0)
[![Design](https://img.shields.io/badge/Design-Material%20Design%203-8b5cf6?style=flat-square)](https://m3.material.io/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20%7C%20Zero%20Cloud-f59e0b?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

**FinSight India** is a fast, 100% offline financial intelligence and multi-bank statement analysis application tailored for the Indian banking ecosystem. It securely imports statement files (PDF, Excel, CSV), tracks true opening and closing running balances, auto-detects internal inter-bank transfers to prevent double counting, auto-categorizes transactions with direction-aware rules, and produces insightful spending reports — all completely private and on-device.

---

## 📥 Download App

Download the latest signed Android APK directly to your phone:

* ⬇️ **[Download FinSight India v2.3.0 APK](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/download/v2.3.0/FinSight-India-v2.3.0-release-signed.apk)** *(Installable over any prior version)*
* 📦 **[View All GitHub Releases](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)**

---

## ✨ What's New in Version 2.3.0

* **⏱️ Multi-Selection Period & Presets Duration Filtering**: Filter transactions across **Weekwise**, **Monthwise**, **Quarterwise**, and **Yearwise** horizons with multi-select support and transaction count badges. Includes instant presets (**This Week**, **This Month**, **This Quarter**, **This Year**, Last 7 Days, Last 30 Days, Last 3 Months) and Custom Date Ranges.
* **📋 Optimized Transaction Card Geometry**: Moved the transaction selection checkbox to **Line 3 (left of Category)**, reclaiming full horizontal width for Line 1 (Core Facts) and Line 2 (Complete Narration with zero truncation).
* **📌 Pinned Sticky Bulk Actions Bar**: When multiple transactions are selected, the **Change Category** and **Delete** action bar stays firmly pinned at the top (`sticky top-2 z-30`) with a frosted blur backdrop, allowing transactions to scroll smoothly beneath it.
* **📊 Restored MD3 Mode Toggle in Analysis**: Re-applied the crisp, high-precision MD3 segmented pill toggle design for **Spend Outflow** and **Earning Inflow**, positioned directly beneath the Category-wise Breakdown card.
* **🎯 Focused Overview Workspace**: Removed the redundant Bank Balances container from the Overview tab to highlight core KPIs and cashflow trends (bank balances and editing tools remain fully available in Banks & Rules).

---

## 🚀 Key Features

* **🎨 Android Material Design 3 (Material You)**:
  * Tonal surface hierarchy (`#0f131a` to `#292f3d`) for immersive dark theme.
  * Standard 80dp bottom navigation bar with active indicator pills.
  * 64dp minimal Top App Bar with dedicated quick Export button.
  * Card-based popup modal dialogs for Banks, Categories, Types, and Date Filters.
* **💰 True Statement Running Balance Accounting**:
  * Extracts running balances from statements and displays `Bal: ₹XX,XXX.XX` in the Ledger.
  * Reverses earliest transaction effect to calculate genuine opening/initial balance:
    $$\text{If Credit: } \text{Initial Balance} = \text{First Recorded Balance} - \text{Amount}$$
    $$\text{If Debit: } \text{Initial Balance} = \text{First Recorded Balance} + \text{Amount}$$
  * Anchors latest balance to the closing running balance of uploaded statements.
* **🔄 Smart Inter-Bank Transfers**:
  * Cross-bank matching identifies transfers between your own accounts to avoid double-counting.
  * Configurable clearing windows (0–5 days), pair unlinking, and manual counterpart linking.
* **⚡ Direction-Aware Smart Categorization**:
  * Automatically assigns Indian banking categories based on token-bounded regex rules.
  * Direction awareness (`CREDIT`, `DEBIT`, `BOTH`) prevents income from being tagged as expenses.
  * Manual category changes persist permanently across app restarts (`isManualCategory: true`).
* **📊 Dual Category Analysis & Payee Drill-Down**:
  * Independent Donut charts and percentage breakdowns for Spend Outflow and Earning Inflow.
  * Category-by-category Net Flow comparison table (Surplus vs Deficit).
  * Interactive Top Spend Merchants and Top Income Sources with transaction drill-down dialogs.
* **📤 Universal Formatted Export Suite**:
  * Print-ready PDF statements with KPI summary cards via `jspdf` and `jspdf-autotable`.
  * Formatted Excel (`.xlsx`) workbooks with automated summary total rows.
  * RFC 4180 CSV with UTF-8 BOM for Microsoft Excel, Google Sheets, and tax tools.
  * Native Android Share Sheet integration via `@capacitor/share` and `@capacitor/filesystem`.

---

## 🔒 Privacy & Security (100% On-Device)

FinSight India is built with an air-gapped privacy architecture. Your confidential bank statements and personal financial data never leave your device.

| Dimension | Implementation |
| :--- | :--- |
| **Servers** | **Zero**. No backend servers, cloud databases, or external APIs. |
| **Data Storage** | 100% stored in on-device local storage (`localStorage`). |
| **Parsing** | In-memory processing via client-side SheetJS and Mozilla PDF.js. |
| **Network Requests**| None. Operates completely offline with zero telemetry or tracking. |
| **Backups** | Encrypted/plaintext JSON workspace backup files created and restored locally. |

---

## 🏦 Supported Indian Banks

Pre-configured column mapping, date normalization, and statement parsing for:
* **State Bank of India (SBI)**
* **HDFC Bank**
* **ICICI Bank**
* **Axis Bank**
* **Kotak Mahindra Bank**
* **Union Bank of India (UBI)**
* *Any Indian bank statement (PDF, Excel, CSV) containing Date, Narration, and Debit/Credit columns.*

---

## 🛠️ Build & Development Setup

### Prerequisites
* **Node.js**: v18, v20, v22, or v26
* **Java JDK**: JDK 17 (for Android Capacitor builds)
* **Android SDK**: API Level 34+

```bash
# 1. Clone repository
git clone https://github.com/dr-liki/finsight-india-bank-analyzer.git
cd finsight-india-bank-analyzer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build web production bundle
npm run build

# 5. Sync Capacitor Android project
npm run android:sync
```

---

## 📜 License

Distributed under the [MIT License](LICENSE).
