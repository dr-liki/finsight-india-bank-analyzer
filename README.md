# FinSight India — Multi-Bank Statement Analyzer

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-10b981?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)
[![Release](https://img.shields.io/badge/Release-v2.2.0-0ea5e9?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/tag/v2.2.0)
[![Design](https://img.shields.io/badge/Design-Material%20Design%203-8b5cf6?style=flat-square)](https://m3.material.io/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20%7C%20Zero%20Cloud-f59e0b?style=flat-square)](https://github.com/dr-liki/finsight-india-bank-analyzer)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

**FinSight India** is a fast, 100% offline financial analytics app designed for the Indian banking ecosystem. It imports statement files across multiple banks, tracks running balances, eliminates internal transfer double-counting, auto-categorizes transactions, and generates insightful spending reports — all completely private on your device.

---

## 📥 Download App

Download the latest signed Android APK directly to your phone:

* ⬇️ **[Download FinSight India v2.2.0 APK](https://github.com/dr-liki/finsight-india-bank-analyzer/releases/download/v2.2.0/FinSight-India-v2.2.0-release-signed.apk)** *(Installable over any prior version)*
* 📦 **[View All GitHub Releases](https://github.com/dr-liki/finsight-india-bank-analyzer/releases)**

---

## ✨ Features & What's New in v2.2.0

### 🚀 1. Streamlined Top App Bar
* **Ultra-Clean Header**: Removed the redundant sub-header text for a sleek, compact profile.
* **Focused Action**: Retained the primary Export button (`.xlsx`, `.csv`, `.pdf`) directly on the header while removing cluttered secondary controls (accessible in Banks & Rules).

### 📋 2. Optimized 3-Line Transaction Card Layout
* **Complete Narration**: Transaction descriptions are now rendered in full without any truncation or text cutoff.
* **Balanced 3-Line Visual Flow**:
  * **Line 1**: Transaction Date, Bank account badge, Payment Channel badge, and Amount formatted in one clear line.
  * **Line 2**: Complete Narration / Description with natural text wrapping.
  * **Line 3**: Interactive Category badge (with running balance) alongside Edit and Delete action buttons.

### 🏦 3. All Banks Filter Popup Window
* Replaced the legacy native `<select>` dropdown with a dedicated **All Banks Popup Dialog** that strictly adheres to the app's Material Design 3 design system, matching the Type and Category filter popups with account hints, transaction counts, and active checks.

### 📊 4. Re-Ordered Analysis Workspace
* Moved the **Spend Outflow / Earning Inflow** toggle control and total amount summary directly below the **Category-wise Breakdown Box** for a more intuitive analytical hierarchy.

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
