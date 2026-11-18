# FinSight India — Multi-Bank Statement Analyzer

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-10b981?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)
[![Release](https://img.shields.io/badge/Release-v2.3.0-0ea5e9?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/tag/v2.3.0)
[![Design](https://img.shields.io/badge/Design-Material%20Design%203-8b5cf6?style=flat-square)](https://m3.material.io/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20%7C%20Zero%20Cloud-f59e0b?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

**FinSight India** is a fast, 100% offline financial analytics app designed for the Indian banking ecosystem. It imports statement files across multiple banks, tracks running balances, eliminates internal transfer double-counting, auto-categorizes transactions, and generates insightful spending reports — all completely private on your device.

---

## 📥 Download App

Download the latest signed Android APK directly to your phone:

* ⬇️ **[Download FinSight India v2.3.0 APK](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/download/v2.3.0/FinSight-India-v2.3.0-release-signed.apk)** *(Installable over any prior version)*
* 📦 **[View All GitHub Releases](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)**

---

## ✨ Features & What's New in v2.3.0

### ⏱️ 1. Multi-Selection Period & Presets Duration Filtering
* **Comprehensive Period Controls**: Filter transactions seamlessly across **Weekwise**, **Monthwise**, **Quarterwise**, and **Yearwise** periods with multi-select support and transaction count badges.
* **Smart Presets**: Instant one-tap time windows including **This Week**, **This Month**, **This Quarter**, and **This Year** (plus Last 7 Days, Last 30 Days, and Last 3 Months).
* **Custom Date Range**: Date picker inputs with quick "Clear Dates" button and one-tap duration reset.

### 📋 2. Streamlined Transaction Cards & Checkbox Relocation
* **Freed Up Space in Lines 1 & 2**: Moved the transaction selection checkbox to **Line 3 (left of Category)**, removing previous left indentation and giving full horizontal width to Core Facts and Narration.
* **Line 1 (Core Facts)**: Transaction Date, Bank account badge, Payment Channel badge (UPI/NEFT/IMPS/ATM/POS/CARD/NET/CASH), and signed Amount all in one clean line.
* **Line 2 (Complete Narration)**: Transaction description rendered fully with zero truncation.
* **Line 3 (Actions & Category)**: Selection checkbox on the far left, clickable Category badge, statement running balance (`Bal: ₹...`), and Edit/Delete buttons on the right.

### 📌 3. Pinned Sticky Bulk Actions Bar
* When multiple transactions are selected, the **Change Category** and **Delete** action bar remains firmly pinned/fixed at the top of the screen (`sticky top-2 z-30`) with a blur backdrop, while only the transactions list scrolls beneath it.

### 📊 4. Refined Analysis Mode Toggle Design
* Restored the clean, high-precision MD3 segmented pill toggle design from version 2.1 for **Spend Outflow** and **Earning Inflow**, positioned directly below the Category-wise Breakdown card.

### 🎯 5. De-Cluttered Overview Workspace
* Removed the redundant Bank Balances container from the Overview tab, placing full focus on the high-level KPI cards and Multi-Bank Cashflow Trend chart (bank balances remain fully accessible in the Banks & Rules workspace).

### 💰 5. True Running Balance Accounting
* Extracts running statement balances and displays **`Bal: ₹XX,XXX.XX`** directly in your transaction ledger.
* Calculates **Initial (Opening) Balance** and **Latest (Closing) Balance** with formatted statement dates:
  * If earliest transaction was a Credit: $\text{Initial Balance} = \text{Running Balance} - \text{Amount}$
  * If earliest transaction was a Debit: $\text{Initial Balance} = \text{Running Balance} + \text{Amount}$
  * Latest balance directly anchors to the closing running balance of your statement.

### 🔄 6. Smart Inter-Bank Transfers & Auto-Categorization
* Automatically identifies internal fund transfers between your own accounts to avoid double-counting.
* Direction-aware rules (`CREDIT`, `DEBIT`, or `BOTH`) prevent income from receiving expense categories.

### 📤 7. Universal Exports & 100% Privacy
* Export statement reports in **PDF**, formatted **Excel (`.xlsx`)**, or **CSV** with native Android Share Sheet integration.
* Zero cloud servers, zero analytics, zero external network requests. 100% client-side.

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
