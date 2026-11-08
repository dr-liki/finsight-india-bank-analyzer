# FinSight India — Release Notes

## Version 1.7.0 (November 2026)

FinSight India v1.7.0 introduces major workflow and visual enhancements to the Transactions Ledger: an interactive **Multi-Select Transactions Suite with Bulk Category Assignment**, a **Redesigned Transaction Type Filter Popup Window** (replacing the native HTML select with visual cards for All Types, Debit, and Credit), and a **Redesigned Category Picker Popup Window** mirroring the design language of the filter window with real-time search, category color swatches, transaction count badges, and touch-optimized selection across bulk actions and transaction editing.

---

### Highlights & Key Improvements

#### 1. Multi-Select Transactions & Bulk Category Changes
- **Individual Checkbox Selection**: Each transaction row in the Transactions Ledger now features a responsive selection checkbox with clear checked/unchecked indicators.
- **Bulk Action Floating Banner**: Selecting one or more transactions dynamically displays a sleek action bar showcasing the active selection count, "Select All" / "Deselect All", and a primary "Change Category" action.
- **Bulk Category Application**: Tapping "Change Category" opens the Category Picker window; selecting any category updates all selected transactions at once and marks them with `isManualCategory: true` to prevent automatic rules from overwriting your classifications.
- **Toast Confirmation**: Displays an immediate feedback notification detailing the number of transactions updated and resets the active selection.

#### 2. Redesigned Transaction Type Popup Window
- **Replaced Native `<select>`**: Replaced the native HTML dropdown with an elegant, responsive trigger button that dynamically displays the active type filter with dedicated icon badges (`Layers`, `TrendingDown`, or `TrendingUp`).
- **Card-Based Type Selector Window**:
  - **All Types**: Displays total transactions count with clean slate styling.
  - **Debit Only (Expenses / Outflows)**: Features a rose indicator, live total debit expense amount, and transaction count.
  - **Credit Only (Income / Inflows)**: Features an emerald indicator, live total credit income amount, and transaction count.
  - Selected cards feature glowing borders and checkmark indicators with instant tap-to-select and quick "Reset to All" controls.

#### 3. Redesigned Category Popup Window (Consistent with Filter Window)
- **Visual Parity**: Built with the exact same visual design system as the multi-category filter window (screen-centered dark backdrop, rounded slate card, search bar with clear button, and action footer).
- **Rich Category Cards**: Every category displays a dedicated color dot matching the application's color palette, category title, and a badge with the count of existing transactions in that bucket.
- **Universal Category Selection**: Used for bulk category changes on multi-selected transactions as well as for selecting categories inside the Edit Transaction and Add Transaction modals, replacing basic native dropdowns with a search-enabled visual picker.
- **Color Dots in Category Filter**: Enhanced the existing Multi-Option Category Filter modal to include the same colored indicator dots for each category row.

---

## Version 1.6.1 (November 2026)

FinSight India v1.6.1 is an immediate hotfix update resolving an initialization runtime exception that caused a blank screen on startup in v1.6.0:

---

### Highlights & Key Improvements

#### 1. Resolved Blank Screen Initialization Crash (Temporal Dead Zone Fix)
- **Root Cause**: In v1.6.0, an automatic category assignment `useEffect` was positioned before the declaration of `transferPairs = useMemo(...)`. Because React evaluates dependency arrays synchronously during component execution, JavaScript threw an uncaught `ReferenceError: Cannot access 'transferPairs' before initialization` (Temporal Dead Zone violation) on startup, crashing React before mounting and causing a blank screen.
- **Resolution**: Reordered the `useEffect` hook to execute cleanly after `transferPairs` and `transferMap` are fully initialized. Refactored the updater to use functional state updates (`setTxns(prev => hasChange ? updated : prev)`), guaranteeing stability and eliminating re-render thrashing.

#### 2. Native React ErrorBoundary with Self-Recovery Controls
- **Fail-Safe UI Shell**: Wrapped the application root in an interactive `<ErrorBoundary>` component.
- **Zero Silent Failures**: If any unexpected runtime error ever occurs, users are shown an informative recovery card with the error details, a "Reload Application" button, and a "Clear Cache & Restart" option rather than an unresponsive blank screen.

---

## Version 1.6.0 (November 2026)

FinSight India v1.6.0 delivers core visual, architectural, and workflow refinements: **Automatic 'Bank Transfer' Category Assignment** for smart-detected and manually linked cross-bank transfers, a **Focused Ledger-Exclusive Smart Bank Transfer Banner** (removed from Overview and Analysis tabs), a **Clean Minimal Top App Bar** (removing the 5 cluttering top action buttons), **Removal of "Manage Categories" from the Analysis tab**, **Comprehensive Text Overflow Fixes** across all category analysis and merchant views, a **Centered Modal Export Dialog** (eliminating off-screen dropdown clipping on mobile viewports), and **Universal File Manager APK Icon Visibility** across Android file explorers.

---

### Highlights & Key Improvements

#### 1. Automatic 'Bank Transfer' Category Assignment
- **Synchronized Categorization**: When two transactions are paired as a Smart Bank Transfer (debit in Bank A matching credit in Bank B), both legs are automatically assigned the `'Bank Transfer'` category in real time.
- **Manual Link Integration**: Manually linking two transactions via the Transfer Linker instantly sets both transactions to `'Bank Transfer'` with `isManualCategory: true`.
- **Intelligent Unlink Reversion**: Unlinking a transfer pair resets both transactions back to their direction-aware automatic categories so they seamlessly rejoin their appropriate spending or earning buckets.

#### 2. Focused Ledger-Exclusive Smart Bank Transfer Banner
- **Removed from Overview & Analysis**: The Smart Bank Transfer notification and exclusion toggle has been removed from the global app shell and dashboard/analysis tabs, keeping high-level summaries uncluttered.
- **Dedicated Transactions Ledger Home**: The Smart Bank Transfer banner and its quick "Edit / Manage" controls are now positioned exclusively at the top of the Transactions (`LEDGER`) tab where users inspect and reconcile ledger entries.

#### 3. Clean Minimalist Top App Bar
- **Header De-Cluttering**: Removed the 5 redundant quick-action buttons (*Transfers*, *Backup*, *Categories*, *+ Bank*, and *Upload*) from the sticky top navigation bar.
- **Streamlined Visual Hierarchy**: The header now cleanly highlights the custom FinSight India branding, version badge, bank/file/transaction counters, and active transfer badge without crowding mobile screens.

#### 4. Streamlined Analysis Tab
- **Removed "Manage Categories" Action**: Removed the category management button from the Category Analysis tab to keep the interface purely focused on spending breakdowns, earning inflows, and net-flow comparisons.

#### 5. Mobile Text Overflow & Truncation Fix in Analysis Page
- **Horizontal Overflow Prevention**: Fixed category names, merchant strings, and amount labels overflowing screen boundaries on smaller mobile devices.
- **Responsive Sub-Mode Bar**: Added `overflow-x-auto` to the Spend / Earnings / Net Flow mode selector so button labels remain fully accessible on narrow viewports.
- **Fluid Breakdown Lists**: Applied `min-w-0 flex-1 truncate` to category rows and top payees/merchants, ensuring amounts and percentages always stay anchored within the screen.
- **Net Flow Table Width Constraint**: Constrained the Net Flow comparison table with `min-w-[420px]` inside an `overflow-x-auto` container with horizontal scroll support.

#### 6. Screen-Centered Export Modal Dialog
- **Eliminated Dropdown Off-Screen Clipping**: Replaced the previous `absolute` positioned dropdown menu (which clipped off-screen when buttons wrapped on mobile displays) with a fixed, centered modal dialog (`fixed inset-0 bg-black/75 z-50 flex items-center justify-center`).
- **Enhanced Export Experience**: Features large, touch-friendly selection cards for PDF Statement Report, Excel XLSX, and RFC 4180 CSV, an explicit summary of selected transactions, backdrop dismiss, and a dedicated close button.

#### 7. File Manager APK Icon Visibility
- **Universal Launcher & File Manager Icon Assets**: Added flat raster PNG icons (`ic_launcher.png`, `ic_launcher_round.png`) across all density buckets (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) in both `mipmap` and `drawable` resource folders.
- **Explicit Manifest Attributes**: Added explicit `android:icon`, `android:roundIcon`, and `android:logo` declarations to both `<application>` and the launcher `<activity>` in `AndroidManifest.xml`.
- **Automated CI Manifest Deployment**: Added an automated CI workflow step ensuring custom manifest attributes are permanently stamped into every generated release build, ensuring full thumbnail visibility in Files by Google, Samsung My Files, and third-party file explorers.

---

FinSight India v1.5.0 introduces comprehensive enhancements to transaction control, data export reliability, mobile UI layout, categorization accuracy, and temporal filtering: an **Interactive Smart Bank Transfer Management & Manual Linking Suite**, a **Universal Native Android Save & Share Engine** (resolving WebView export saving failures), a **Mobile Text-Overflow Fix** in the Transactions Ledger, **Smarter & Accurate Debit/Credit Direction Categorization**, and a **Multi-Select Period Duration Filter** (`Weekwise`, `Monthwise`, `Quarterwise`, `Yearwise`, `Presets`, and `Custom`).

---

### Highlights & Key Improvements

#### 1. Interactive Smart Bank Transfer Editing & Management
- **Unlink False-Positive Transfer Pairs**: Users can inspect any auto-detected transfer pair in the dedicated Inspector or Manager and unlink it with a single tap. Unlinked pairs are remembered so automated detection will not re-link them.
- **Manual Transfer Linking**: Allows linking transfers that auto-detection missed (e.g. slight date delays or non-standard narrations). Tapping "Link as Bank Transfer" in the transaction modal opens an interactive counterpart picker matching the opposite transaction direction.
- **Smart Bank Transfers Manager**: Dedicated management modal showing total paired transfers and volume, with configurable clearing windows (Same Day, 1 Day, 2 Days, 3 Days, 5 Days), unlinked history reset, and one-tap categorization as "Bank Transfer".
- **Direct Linkage in Transaction Edit Modal**: When inspecting an individual transaction, its paired transfer counterpart and bank are displayed with an immediate option to unlink.

#### 2. Native Android File Export & Share Engine
- **Resolved WebView Download Failures**: On Android/Capacitor WebView, standard HTML `<a download>` links and `blob:` navigation fail silently without saving files. v1.5.0 integrates `@capacitor/filesystem` and `@capacitor/share` to write exported files to cache and launch the native Android Share Sheet ("Save to Downloads", Google Drive, WhatsApp, etc.).
- **Universal Multi-Platform Support**: Automatically routes through native FileProvider and Share Sheet on Android devices while falling back to instant browser downloads on desktop/web environments.
- **Covers All Exports & Backups**: Applies to PDF Statement Reports, formatted Excel (`.xlsx`) workbooks, RFC 4180 CSV files, and full JSON workspace backups.

#### 3. Mobile Text Overflow & Truncation Fix in Transactions Ledger
- **Prevented Horizontal Blowout**: Continuous unbroken Indian banking narrations (such as `UPI/431289471928/MR-RAMESH-KUMAR...`) previously pushed amounts and edit icons off-screen on mobile devices.
- **Fluid Responsive Layout**: Applied flex constraints (`min-w-0 flex-1 overflow-hidden`), word breaks (`break-words break-all`), multi-line line-clamping (`line-clamp-2`), and right-column shrinkage protection (`shrink-0 text-right`), ensuring clean display on any screen width.

#### 4. Smarter & Accurate Debit and Credit Transaction Categorization
- **Direction-Aware Rule Evaluation**: Introduced transaction direction scope (`scope: 'CREDIT' | 'DEBIT' | 'BOTH'`) to categorization rules. Credits are never accidentally tagged with debit categories (or vice-versa).
- **Eliminated Salary Over-Tagging**: Prevented unmatched credit transactions from being blindly defaulted to `Salary & Income`.
- **Targeted Indian Banking Context Rules**: Discrete token recognition for interest credits (`int.pd`, `sb int`, `quarterly int`), cashbacks/rewards (`cred cashback`, `gpay reward`), refunds, tax refunds (`it refund`), dividends, ATM cash withdrawals, and utility/credit card bills.

#### 5. Multi-Select Period Duration Filter
- **Multi-Select Period Modes**: Users can now filter transactions across multiple periods at once:
  - **Weekwise**: Multi-select ISO weeks with live transaction counts.
  - **Monthwise**: Multi-select calendar months (e.g. compare Jan and Mar).
  - **Quarterwise**: Multi-select fiscal/calendar quarters (`Q1`, `Q2`, `Q3`, `Q4`).
  - **Yearwise**: Multi-select calendar years.
- **Convenient Presets & Custom Range**: Alongside multi-select periods, includes instant quick presets (`Last 7 Days`, `Last 30 Days`, `This Month`, `Last 3 Months`, `This Year`), `All Time`, and `Custom Date Range` with single-tap reset.

---

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
