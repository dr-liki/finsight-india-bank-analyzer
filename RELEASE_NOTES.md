# FinSight India — Release Notes

## Version 2.3.0 (November 2026)

### Changes over Version 2.2.0:
* **Duration Filtering & Presets in Transactions Page**:
  - Added multi-selection period duration filters for **Weekwise**, **Monthwise**, **Quarterwise**, and **Yearwise** horizons with itemized transaction count badges and Select All / Clear controls.
  - Added duration presets: **This Week**, **This Month**, **This Quarter**, and **This Year** (plus Last 7 Days, Last 30 Days, Last 3 Months).
  - Added Custom Date Range with dual date pickers, Clear Dates button, and one-tap duration reset.
* **Transaction Card Checkbox Relocation**:
  - Moved the transaction selection checkbox from Line 1 to **Line 3 (left of Category)**, freeing full horizontal width for Line 1 (Core Facts) and Line 2 (Narration).
* **Pinned Sticky Bulk Actions Bar**:
  - When multiple transactions are selected, the action bar (**Change Category** and **Delete**) stays fixed at the top (`sticky top-2 z-30`) with a blur backdrop (`backdrop-blur-md`), with only transactions scrolling beneath it.
* **Restored Mode Toggle Design in Analysis**:
  - Restored the compact MD3 segmented pill toggle design for the **Spend Outflow** and **Earning Inflow** box positioned below the category-wise container.
* **Removed Bank Balance Box from Overview**:
  - Removed the Bank Balances card from the Overview tab to declutter the dashboard (bank balances remain accessible in Banks & Rules).

---

## Version 2.2.0 (November 2026)

### Changes over Version 2.1.0:
* **Streamlined Top App Bar**:
  - Removed the sub-header line (`100% On-Device Financial Intelligence`) to reclaim vertical screen estate.
  - Kept only the essential Export button in the top bar; removed reset and backup buttons from the header.
* **Material Design 3 "All Banks" Popup Filter Window**:
  - Replaced the native select dropdown with a dedicated Material Design 3 popup modal (`BankFilterModal`) with "All Banks Combined", color-coded bank badges, account number hints, live transaction counters, and active checkmarks.
* **Optimized 3-Line Transaction Card Layout**:
  - Restructured transaction cards into three distinct lines:
    - **Line 1**: Date, bank account, channel, and amount all in one line.
    - **Line 2**: Complete transaction description (narration) displayed fully without truncation.
    - **Line 3**: Category badge (with running statement balance `Bal: ₹...`) on the left; Edit and Delete action buttons on the right.
* **Reorganized Analysis View**:
  - Moved the box containing Spend Outflow and Earning Inflow buttons below the category-wise breakdown box.

---

## Version 2.1.0 (November 2026)

### Changes over Version 2.0.0:
* **Android Material Design 3 (Material You) Design System Overhaul**:
  - **Tonal Surface Hierarchy**: Replaced flat dark shades with MD3 tonal surface containers (`surface` #0f131a, `surface-container-low` #151922, `surface-container` #1b202a, `surface-container-high` #222733, and `surface-container-highest` #292f3d).
  - **MD3 Navigation Bar**: Standard 80dp bottom navigation bar featuring elongated active indicator pills (`w-14 h-8 rounded-full bg-emerald-500/25 text-emerald-300`), active scale animations, and bold typographic labels.
  - **MD3 Top App Bar**: High-clarity 64dp header with vector brand logo, version badge, and min 48px touch target action icons.
  - **Elevated & Outlined Cards**: Restyled overview metric cards, bank balance cards, cashflow trend containers, and transaction lists with `rounded-3xl` (28px) and `rounded-2xl` geometry.
  - **Segmented Buttons & Filter Chips**: Horizontal-scrolling filter chips with selected states, segmented pills for Spend vs Earning modes, and touch targets conforming to Android $\ge 48\text{px}$ accessibility standards.
* **Data Layer & UI Layer Architectural Separation**:
  - Modularized codebase into dedicated Data Layers (`src/data/` for balance engine, parsers, categorization, transfers, exports, storage, and constants) and UI Layers (`src/components/`, `src/theme/`).

---

## Version 2.0.0 (November 2026)

### Changes over Version 1.9.2:
* **Dedicated Selection Windows for Type and Category in Edit Dialogs**:
  - Replaced native OS select dropdowns with dedicated popup windows styled identically to the Filter and Category Manager dialogs.
  - Stacked at `z-[80]`, guaranteeing the selection window opens in front of the Edit Transaction dialog.
  - Deployed to both Add Manual Transaction and Edit Transaction modals.
* **True Bank Statement Running Balance Accounting Engine**:
  - **Explicit 'Balance' Column Recording**: Running balances from uploaded Excel, CSV, and PDF statements are extracted and displayed directly in the Ledger (`Bal: ₹...`).
  - **Oldest-to-Newest Chronological Sorting**: Transactions assigned to each bank are sorted chronologically with intra-day sequence tie-breaking.
  - **Initial Balance Reverse-Deduction**:
    - If first transaction was a Credit: $\text{Initial Balance} = \text{First Recorded Balance} - \text{Amount}$
    - If first transaction was a Debit: $\text{Initial Balance} = \text{First Recorded Balance} + \text{Amount}$
  - **Latest Balance Anchor**: Anchors closing balance to the running balance of the latest transaction recording a balance.
  - Displayed alongside formatted dates in brackets on each bank card and auto-synced on statement modifications.

---

## Version 1.9.2 (November 2026)

### Changes over Version 1.9.1:
* **Restored Inline Category Select for Single-Transaction Edit**:
  - Replaced the category picker modal in Edit Transaction and Add Transaction dialogs with the direct native dropdown to eliminate layered modal conflicts.
* **Preserved Modern Category Picker for Bulk Actions**:
  - Retained the search-enabled Category Picker popup window exclusively for multi-select transaction editing.
* **Elevated Modal Stacking (`z-[70]`)**:
  - Boosted Category Picker modal stacking index to guarantee rendering above all other application overlays.
* **Relocated "Re-apply Rules" Button**:
  - Moved the button in Section 4 (Smart Auto-Categorization Rules) directly below the section description to match Sections 1, 2, and 3.

---

## Version 1.9.1 (November 2026)

### Changes over Version 1.9.0:
* **Fixed PDF Credit vs Debit Classification**:
  - Stripped balance columns ending in `Cr` before keyword testing, preventing debit payments from being misclassified as Credits.
* **Intra-Day Sequence Tie-Breaking**:
  - Preserved original file row order (`fileOrderIndex`) and detected statement direction (`ASC` vs `DESC`) to accurately order same-day transactions.
* **Excel / CSV Column Collision Fix**:
  - Enforced strict header boundaries so composite Dr/Cr columns do not displace Debit amount columns.
* **Explicit Opening & Closing Balance Capture**:
  - Added detection for `OPENING BALANCE`, `BALANCE B/F`, and `CLOSING BALANCE` rows as true mathematical balance anchors.
* **Overdraft & Signed Balances**:
  - Added proper accounting support for negative balances and overdraft amounts (`-Rs.X` and `Dr` balances).

---

## Version 1.9.0 (November 2026)

### Changes over Version 1.8.0:
* **Relocated Workspace Action Buttons Below Descriptions**:
  - Moved primary action buttons across all workspace sections (`Add Bank`, `Upload Files`, `Manage All`, `Manage Transfers`, and `Re-apply Rules`) below section descriptions.
* **Automatic Statement File Balance Analysis**:
  - Ingests statement balance data to extract Initial Balance and Latest Balance with formatted calendar dates in brackets.
* **Interactive Edit Bank Balance Popup Modal**:
  - Added baseline adjustment controls for initial/latest balances and dates, including a "Re-Calculate from Statements" button.
* **Live Reactive Balance Synchronization**:
  - Automatically recalculates bank balances and date ranges whenever statement files are uploaded, re-assigned, or deleted.

---

## Version 1.8.0 (November 2026)

### Changes over Version 1.7.0:
* **Relocated Spend vs Earning Net Flow Comparison Card**:
  - Moved comparison table permanently to the bottom of the Analysis page with balanced column proportions, tabular numerals, and horizontal scroll support.
* **Clickable Top Spend Merchants & Income Sources**:
  - Added interactive transaction drill-down modal when tapping any merchant or income payer.
* **Relocated Smart Bank Transfers to Bank & Rules Page**:
  - Moved the Smart Bank Transfers card from the Transactions tab to the Bank & Rules page below Categories Manager.
* **Standardized Header Action Buttons in Bank & Rules**:
  - Standardized all section action buttons to uniform height (`h-8`), padding (`px-3`), corner radius (`rounded-xl`), and typography (`text-xs font-semibold`).

---

## Version 1.7.0 (November 2026)

### Changes over Version 1.6.1:
* **Multi-Select Transactions & Bulk Category Changes**:
  - Added checkboxes on every transaction card with a floating bulk action bar for changing categories across multiple transactions.
* **Redesigned Transaction Type Filter Popup**:
  - Replaced native select dropdown with a visual modal dialog featuring All Types, Debits Only, and Credits Only with live totals.
* **Redesigned Category Picker Popup**:
  - Centered popup modal featuring real-time search, category color swatches, and transaction count badges.

---

## Version 1.6.1 (November 2026)

### Changes over Version 1.6.0:
* **Resolved Blank Screen Startup Crash**:
  - Fixed a Temporal Dead Zone (`ReferenceError`) caused by evaluating `transferPairs` before initialization in React `useEffect`.
* **Interactive Error Boundary Shell**:
  - Wrapped root app in an `<ErrorBoundary>` component with "Reload Application" and "Clear Cache & Restart" recovery controls.

---

## Version 1.6.0 (November 2026)

### Changes over Version 1.5.0:
* **Automatic 'Bank Transfer' Category Synchronization**:
  - Detected and manually linked transfer pairs automatically receive the `'Bank Transfer'` category on both legs.
* **Dedicated Ledger Placement for Transfer Banner**:
  - Scoped the Smart Bank Transfer banner exclusively to the Transactions tab; removed it from Overview and Analysis tabs.
* **Streamlined Minimal Top App Bar**:
  - Removed 5 secondary action buttons (*Transfers*, *Backup*, *Categories*, *+ Bank*, *Upload*) from the sticky top bar.
* **Screen-Centered Export Modal Dialog**:
  - Replaced absolute dropdown menu with a fixed centered modal dialog for PDF, Excel, and CSV exports.
* **Universal File Manager APK Icon Visibility**:
  - Added flat raster PNG icons across all density buckets and explicit manifest attributes in `AndroidManifest.xml`.

---

## Version 1.5.0 (November 2026)

### Changes over Version 1.4.0:
* **Interactive Smart Bank Transfer Management Suite**:
  - Added ability to unlink false-positive transfer pairs with persistent memory.
  - Added manual counterpart linking with counter-party candidate picker.
  - Added configurable clearing window ($0$ to $5$ days).
* **Native Android File Export & Share Engine**:
  - Integrated `@capacitor/filesystem` and `@capacitor/share` to resolve silent WebView download failures on Android.
* **Mobile Text Overflow Fix in Ledger**:
  - Applied flex constraints, word breaks, and line clamps to prevent long Indian banking narrations from overflowing screen bounds.
* **Direction-Aware Categorization Rules**:
  - Added transaction direction scope (`scope: 'CREDIT' | 'DEBIT' | 'BOTH'`) to prevent income from being categorized as expenses.
* **Multi-Select Period Duration Filters**:
  - Added Weekwise, Monthwise, Quarterwise, and Yearwise multi-select filters alongside presets and custom date ranges.

---

## Version 1.4.0 (November 2026)

### Changes over Version 1.3.0:
* **Token-Boundary Regex Auto-Categorization**:
  - Upgraded rule compiler to bounded regular expressions `(^|[^a-z0-9])(keyword)([^a-z0-9]|$)` to eliminate substring false positives.
* **Persistent Manual Categories**:
  - Introduced `isManualCategory: true` in transaction data model, ensuring manual tags survive app restarts and rule refreshes.
* **Multi-Option Category Filter in Ledger**:
  - Replaced single category select with a multi-option modal featuring search, transaction counts, Select All, and Clear controls.
* **Comprehensive Formatted Export Suite**:
  - Added high-quality PDF statement generation with executive KPI cards via `jspdf` and `jspdf-autotable`.
  - Added formatted Excel (`.xlsx`) workbooks with automated summary total rows.
  - Added RFC 4180 CSV with UTF-8 BOM encoding.

---

## Version 1.3.0 (November 2026)

### Changes over Version 1.2.0:
* **Material Design 3 Adaptive Launcher Icon**:
  - Added adaptive vector icon complying with 66% safe-zone guidelines, dark brand background, and Android 13+ themed monochrome icon support.
* **Persistent Release Signing Keystore**:
  - Committed release keystore (`certs/finsight-release-key.keystore`) and monotonic `versionCode` stamping to prevent signature conflicts during app updates.
* **Automated Smart Bank Transfer Detection**:
  - Added cross-bank internal transfer detection matching opposite transaction directions, identical amounts, and 2-day clearing windows.
  - Added internal transfer exclusion toggle to prevent double-counting expenses and income.
* **Granular Backup & Restore Manager**:
  - Added structured JSON backup creation and itemized restoration for Banks, Statement Files, Categories, Rules, and Transactions.
* **Dual Category Analysis**:
  - Added independent Spend Outflow and Earnings Inflow breakdown views with side-by-side Net Flow comparison table.

---

## Version 1.2.0 (November 2026)

### Changes over Version 1.1.0:
* **Union Bank of India (UBI) Support**:
  - Added statement auto-detection and column mapping for Union Bank of India.
* **Interactive Categories Manager UI**:
  - Added full CRUD interface for categories with cascading renames across all transactions and categorization rules.
* **Interactive Auto-Categorization Rules Engine**:
  - Added interactive rules editor with keyword badges and real-time transaction re-evaluation.
* **Duration & Date-Range Preset Filter**:
  - Added duration preset filter in Transactions Ledger (`7D`, `30D`, `This Month`, `3M`, `This Year`, `Custom`).
* **Automated Cloud Release Signing**:
  - Configured GitHub Actions CI/CD workflow to sign release APKs with `keytool`.

---

## Version 1.1.0 (November 2026)

### Changes over Version 1.0.0:
* **Custom Vector Brand Identity**:
  - Designed and introduced the **Rupee-Pulse Lens** vector brand icon across app headers, splash screens, and launcher resources.
* **Clean-Slate Onboarding Experience**:
  - Removed sample startup banks and hardcoded demo transactions for clean onboarding.
* **Full Bank & Statement File CRUD**:
  - Added bank management (add, edit, delete, custom color badges) and statement file tracking with metadata.
* **Automated Release Versioning**:
  - Added `APP_VERSION` display badge and automated version-stamped CI build artifacts (`FinSight-India-v1.1.0-b<run>-APK`).

---

## Version 1.0.0 (October 2026)

### Baseline Release:
* **Offline Hybrid Architecture**:
  - React 18 + Vite 5 + Tailwind CSS + Capacitor 6 hybrid mobile application.
* **Multi-Format Statement Ingestion**:
  - In-browser parsing for Excel (`.xlsx`, `.xls`), CSV, and unencrypted PDF statements via SheetJS and Mozilla PDF.js.
* **Four-Tab Bottom Navigation**:
  - Core app structure: `Overview`, `Spend Analysis`, `Transactions`, and `Files & Rules`.
* **Multi-Bank Cashflow Tracking**:
  - Daywise, Monthwise, Quarterly, and Yearly cash-flow trend charts.
* **Transaction Ledger**:
  - Searchable transaction ledger with inline add, edit, and delete controls.
* **Excel Data Export**:
  - Basic client-side spreadsheet export of parsed transactions.
