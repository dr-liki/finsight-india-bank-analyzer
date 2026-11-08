# FinSight India — Release Notes

## Version 1.4.0 (November 2026)

FinSight India v1.4.0 brings major enhancements to classification precision, user control, and report generation: a **Smart Token-Boundary Auto-Categorization Engine** eliminating false positive tags (such as over-tagging Fuel & Transport), **Persistent Manual Transaction Categories** that never revert on app restart or rules refresh, an interactive **Multi-Option Category Filter with Reset Action** in the Ledger, and a comprehensive **Formatted Export Suite (PDF, Excel XLSX, and CSV)**.

---

### Highlights & Key Improvements

#### 1. Smart Token-Boundary Auto-Categorization Engine
- **Eliminated False Positives**: Resolved an issue where unrelated transactions (e.g. city names like *Kolkata* or *Solapur*, finance company names like *Cholamandalam*, or challan keywords like *Violation*) were falsely tagged under `Fuel & Transport` because of naive substring matches like `ola`.
- **Discrete Token Boundary Matching**: All keywords are compiled into bounded regular expressions matching word boundaries `(^|[^a-z0-9])(keyword)([^a-z0-9]|$)`, ensuring keywords match as distinct tokens rather than substrings inside other words.
- **Refined Keyword Rules**: Cleaned up ambiguous short keywords across categories, prioritizing exact UPI handles, merchant IDs, and distinct Indian financial identifiers.

#### 2. Persistent Manual Transaction Categories
- **Zero Category Overwrites on Restart**: Fixed the bug where category changes manually assigned in the "Edit Transaction" or "Add Transaction" dialogs disappeared when reloading or relaunching the application.
- **Manual Override Stamp**: Introduced `isManualCategory: true` in the transaction data model. Manual classifications permanently bypass automated rule re-evaluations and background runs.
- **Visual Feedback & Reversion**: Added a "Manual Tag" badge in the transaction edit modal with an instant option to revert back to auto-categorization if desired.

#### 3. Multi-Option Category Filter with Instant Clear Action
- **Multi-Category Selection**: Upgraded the category filter in the Transactions (`LEDGER`) tab from a single-item select to a multi-option modal allowing simultaneous inspection of multiple spending verticals (e.g. analyzing `Food & Dining` and `Groceries` together).
- **Search & Bulk Controls**: Real-time category search filter, live transaction count badges per category, "Select All", and a single-tap "Clear / Reset Filter" button.
- **Active Filter Dismiss Pill**: Prominently displays the count of active category filters with an instant `✕` button to restore all categories in a single tap.

#### 4. Formatted Export Suite (PDF, CSV, and XLSX)
- **High-Quality PDF Statement Export**:
  - Generates crisp, print-ready PDF statements via `jspdf` and `jspdf-autotable`.
  - Deep slate branding header (`#0f172a`), export scope metadata (Bank, Category Filter, Date Range, Generation Timestamp).
  - Executive KPI summary card: Total Outflow (Debit), Total Inflow (Credit), and Net Cash Balance.
  - Alternating shaded data rows with colored amounts (Green for Inflow, Red for Outflow), auto-wrapping narration text, and running page numbers.
- **Formatted Excel Workbook (`.xlsx`)**:
  - Generated via SheetJS (`xlsx`) with automated column width calculations.
  - Formatted transaction data with automated summary totals rows (Total Debits, Total Credits, Net Balance).
- **Standardized RFC 4180 CSV**:
  - Encoded with UTF-8 BOM (`\uFEFF`) and proper quotation escaping for seamless compatibility with Microsoft Excel, Google Sheets, LibreOffice, and tax software.
- **Context-Aware Scoping**: All export formats automatically respect the user's active Ledger filters (selected banks, date ranges, multi-category selections, search query, and smart transfer exclusions).

---

## Version 1.3.0 (November 2026)

FinSight India v1.3.0 brings full **Material Design 3 (MD3) Adaptive Icon Compliance**, **Conflict-Free Updates** with a persistent release signing keystore, **Smart Bank Transfer Matching** between accounts, a comprehensive **Backup & Restore Manager** with granular item selection, and **Dual Category Analysis** showing both Spend and Earning breakdowns independently.

---

### Highlights & Key Improvements

#### 1. Material Design 3 (MD3) Launcher Icon Compliance & App Drawer Fix
- **Visibility Fix**: Resolves the invisible launcher icon issue in modern Android app drawers caused by default white-on-white asset templates.
- **Adaptive Icon Architecture**:
  - **Background**: Deep brand slate `#0f172a` with subtle emerald gradient arc.
  - **Foreground**: Precision-centered vector containing the FinSight Rupee-Pulse Lens and stylized ascending bars, scaled within the strict 66% safe zone (72dp within 108dp canvas) so no OEM mask (circle, squircle, teardrop) clips the logo.
  - **Themed Icons (Monochrome)**: Full Android 13+ dynamic Material You themed icon support (`ic_launcher_monochrome.xml`) tinting with user wallpaper accents.
- **Multi-Density Fallbacks**: Full raster PNG suites across `mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, and `xxxhdpi` for legacy Android OS and third-party launchers.

#### 2. Conflict-Free Update Installation Over Previous Versions
- **Persistent Release Keystore**: Added a dedicated, permanent release keystore (`certs/finsight-release-key.keystore` and base64 fallback) committed to the repository.
- **Consistent Signatures**: Eliminates `INSTALL_FAILED_UPDATE_INCOMPATIBLE` signature mismatch errors when updating newer APK releases over older builds without uninstalling.
- **Auto-Incrementing Version Code**: GitHub Actions automatically computes strictly increasing `versionCode` ($1000 + \text{run\_number}$) preventing package manager version regressions.

#### 3. Smart Bank Transfer Detection Between Accounts
- **Automated Transfer Pairing**: Scans transactions across accounts to detect when money transferred out of Bank A matches a deposit into Bank B:
  - Opposite transaction types (DEBIT in Bank A $\leftrightarrow$ CREDIT in Bank B)
  - Identical transaction amount
  - Matching within a 2-day date clearing window
  - Keyword and 6-16 digit reference token (UTR/RRN) matching
- **Internal Transfer Exclusion Toggle**: Option to exclude internal bank transfers from total spend and total income calculations to prevent artificial inflation of expenses and earnings.
- **Interactive Transfer Badges**: Visual indicator in the Ledger (`↔ Transfer Bank A ➔ Bank B`) with a dedicated details modal showing both paired debit and credit records.

#### 4. Granular Backup & Restore Manager
- **Complete Workspace Export**: One-click download of a structured JSON backup file (`FinSight_India_Backup_v1.3.0_YYYY-MM-DD.json`).
- **Itemized Restore Selection**:
  - ☑ Banks
  - ☑ Statement Files Metadata
  - ☑ Custom Categories
  - ☑ Auto-Categorization Rules & Keywords
  - ☑ Transactions Ledger
- **Flexible Restoration Modes**:
  - **Merge with existing**: Combines imported records without creating duplicates.
  - **Replace entire data**: Overwrites workspace cleanly with the backup file.

#### 5. Dual Category Analysis (Spend AND Earnings Breakdown)
- **Spend Breakdown (Outflow)**: Donut chart, category percentage distribution, outflow channels, and top merchants for debits.
- **Earnings Breakdown (Inflow)**: Donut chart, income source distribution, inflow channels, and top deposit payers for credits.
- **Net Flow Comparison**: Side-by-side comparison table showing Spend, Earning, and Net Balance (surplus/deficit) per category.

---

## Version 1.2.0 (November 2026)

FinSight India v1.2.0 introduces **Union Bank of India (UBI)** bank statement support, an expanded Indian financial taxonomy with a dedicated **Categories Manager UI**, an interactive **Auto-Categorization Rules Engine** with instant transaction re-evaluation, a multi-preset **Duration / Date-Range Filter** in the Transactions Ledger, and **Automated Cloud Release APK Signing** via GitHub Actions.

---

### Verification & Compatibility
- **Node.js**: Compatible with Node 18, 20, 22, and 26.
- **Android Platform**: Capacitor 6 on Android API 22+ (Android 5.1 through Android 15).
- **Privacy Standard**: 100% on-device local storage (`localStorage`). No servers, zero data exfiltration.
