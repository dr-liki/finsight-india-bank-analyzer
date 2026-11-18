# FinSight India — Release Notes

## Version 2.3.0 (November 2026)

FinSight India v2.3.0 introduces comprehensive duration filtering capabilities, refined transaction layout geometry, sticky bulk action controls, and focused overview metrics:
* **Multi-Selection Period & Presets Duration Filtering in Ledger**:
  - **Multi-Select Periods**: Re-introduced granular period filtering across **Weekwise**, **Monthwise**, **Quarterwise**, and **Yearwise** horizons with multi-select support, itemized transaction counters, and Select All / Clear controls.
  - **Quick Presets**: Added instant duration presets for **This Week**, **This Month**, **This Quarter**, and **This Year**, alongside Last 7 Days, Last 30 Days, and Last 3 Months.
  - **Custom Date Range**: Date pickers for start and end dates with dedicated Clear Dates and one-tap duration reset.
  - **Seamless MD3 Design**: Horizontal segmented chips, tonal sub-panels, and active indicator pills.
* **Optimized Transaction Card Checkbox Placement**:
  - Moved the transaction selection checkbox from Line 1 to **Line 3 (left of Category)**.
  - Reclaims horizontal space in **Line 1** (Date, Bank badge, Channel, Transfer badge, signed Amount) and **Line 2** (complete Narration with zero cutoff and no unnecessary left indent).
* **Pinned Sticky Bulk Actions Bar**:
  - When multiple transactions are selected, the action bar containing **Change Category** and **Delete** stays firmly pinned at the top (`sticky top-2 z-30`) with a blur backdrop (`backdrop-blur-md`). Only the transactions list scrolls beneath it.
* **Restored Version 2.1 Mode Toggle Design in Analysis**:
  - Re-applied the crisp, compact MD3 segmented pill toggle design from v2.1 for **Spend Outflow** and **Earning Inflow**, positioned directly below the Category-wise Breakdown card.
* **De-Cluttered Overview Workspace**:
  - Removed the Bank Balances card from the Overview tab to maintain focus on primary KPIs and cashflow trends (bank balances and editing tools remain fully available in Banks & Rules).

---

## Version 2.2.0 (November 2026)

FinSight India v2.2.0 introduces refined UI ergonomics, cleaner information hierarchy across the Top Bar and Ledger, and a modern popup window for bank filtering:
* **Streamlined Top App Bar**:
  - Removed the sub-header tagline to reclaim vertical screen estate and provide a distraction-free 64dp header.
  - Kept only the essential Export button in the top bar; removed reset and backup buttons from the header (retaining safe, full access to Backup and Reset in the Banks & Rules workspace).
* **Modern "All Banks" Popup Filter Window**:
  - Replaced the native select dropdown with a dedicated Material Design 3 popup modal (`BankFilterModal`) matching the visual style of Type and Category filter dialogs.
  - Features quick "All Banks Combined" selection, color-coded bank badges, account number hints, live transaction counters, and active checkmarks.
* **Optimized 3-Line Transaction Card Layout**:
  - **Line 1 (Core Facts)**: Multi-select checkbox, transaction date, bank badge, payment channel badge (UPI/NEFT/IMPS/ATM/POS/CARD/NET/CASH), transfer indicator, and clear signed amount (`+₹...` in emerald / `-₹...` in rose).
  - **Line 2 (Complete Narration)**: Transaction description/narration is rendered completely without truncation (`break-words`), giving full visibility into beneficiary, remarks, and UPI handles.
  - **Line 3 (Category & Actions)**: Category badge (with running statement balance `Bal: ₹...` when available) on the left, paired with dedicated Edit and Delete action buttons on the right.
* **Reorganized Spend & Earning Toggle in Analysis**:
  - Relocated the "Spend Outflow" and "Earning Inflow" selector directly below the "Category-wise Spending Outflow / Income & Earnings Inflow" container, creating an intuitive flow from category insights down into flow-mode switching.

---

## Version 2.1.0 (November 2026)

FinSight India v2.1.0 is a milestone release delivering a complete app-wide UI/UX transformation based on **Android Material Design 3 (Material You)** principles, along with a clean, modular architectural separation between Data Layers and UI Layers:
* **Android Material Design 3 (Material You) Design System**:
  - **Tonal Surface Hierarchy**: Replaced flat arbitrary dark shades with MD3 tonal surface containers (`surface` #0f131a, `surface-container-low` #151922, `surface-container` #1b202a, `surface-container-high` #222733, and `surface-container-highest` #292f3d).
  - **MD3 Navigation Bar**: Standard 80dp bottom navigation bar featuring elongated active indicator pills (`w-14 h-8 rounded-full bg-emerald-500/25 text-emerald-300`), active scale animations, and bold typographic labels.
  - **MD3 Top App Bar**: High-clarity 64dp header with vector brand logo, version badge, and min 48px touch target action icons.
  - **Elevated & Outlined Cards**: Restyled overview metric cards, bank balance cards, cashflow trend containers, and transaction lists with `rounded-3xl` (28px) and `rounded-2xl` geometry.
  - **Segmented Buttons & Filter Chips**: Horizontal-scrolling filter chips with selected states, segmented pills for Spend vs Earning modes, and touch targets conforming to Android $\ge 48\text{px}$ accessibility standards.
* **Modular Architectural Separation (Data & UI Layers)**:
  - **Data Layers** (`src/data/`):
    - `constants.js`: Design tokens, color palettes, default Indian banking categories, and rule definitions.
    - `balanceEngine.js`: True statement opening/closing balance math, chronological sorting, tie-breaking, and periodic extractors.
    - `parsers.js`: Tabular Excel/CSV matrix parser, Mozilla PDF.js parser, Indian bank detection, and channel classifiers.
    - `categorizationEngine.js`: Direction-aware token regex matching, rule compilation, and categorization evaluator.
    - `transferEngine.js`: Cross-bank internal transfer detection, reference number matching, and unlinking.
    - `exportEngine.js`: Excel XLSX workbook, RFC 4180 CSV, and autoTable PDF document generation with Android Share Sheet integration.
    - `storage.js`: LocalStorage manager with versioned keys (`_v210`) and JSON backup/restore engine.
  - **UI Layers** (`src/components/`, `src/theme/md3.css`):
    - Separate navigation bars, modular view panels (`DashboardView`, `AnalysisView`, `LedgerView`, `BanksView`), and independent dialog modals.

---

## Version 2.0.0 (November 2026)

FinSight India v2.0.0 introduces true bank balance statement accounting and modern selection windows across transaction workflows:
* **Modern Selection Windows for Type and Category in Edit Transaction**:
  - Replaced native OS select dropdowns with dedicated popup windows matching the Filter and Category Manager dialogs.
  - Stacked at `z-[80]`, ensuring the selection window opens comfortably in front of the Edit Transaction dialog.
  - Deployed to both Add Manual Transaction and Edit Transaction modals for universal consistency.
* **True Bank Statement Running Balance Accounting Engine**:
  - **Explicit 'Balance' Column Recording**: Running balances from uploaded statements are captured and displayed directly in the Ledger (`Bal: ₹...`).
  - **Oldest-to-Newest Chronological Sorting**: Transactions assigned to each bank are sorted chronologically with intra-day sequence tie-breaking.
  - **Exact Initial Balance Reverse-Deduction**:
    - If first transaction was a Credit: $\text{Initial Balance} = \text{First Recorded Balance} - \text{Amount}$
    - If first transaction was a Debit: $\text{Initial Balance} = \text{First Recorded Balance} + \text{Amount}$
  - **Exact Latest Balance**: Anchors to the closing running balance of the latest statement transaction.
  - Displayed alongside formatted dates in brackets on each bank card and auto-synced on statement modifications.

---

## Version 1.9.2 (November 2026)

* **Single Transaction Category Editing**: Restored inline dropdown select for single-transaction editing to eliminate modal stacking conflicts.
* **Multi-Select Transactions**: Preserved modern Category Picker popup window with instant search and color tags for bulk edits.
* **Elevated Modal Stacking (`z-[70]`)**: Boosted picker modal stacking index to guarantee rendering on top of all application overlays.
* **Re-apply Rules Button Relocated**: In Section 4 (Smart Auto-Categorization Rules), moved the button below description for visual consistency.

---

## Version 1.9.1 (November 2026)

* **Fixed PDF Credit vs Debit Classification**: Stripped balance columns ending in `Cr` before keyword testing, preventing debit payments from being misclassified as Credits.
* **Intra-Day Sequence Tie-Breaking**: Preserves original row order (`fileOrderIndex`) and detects statement direction (`ASC` vs `DESC`).
* **Excel / CSV Column Collision Fix**: Enforces strict header boundaries so composite Dr/Cr columns do not displace Debit amount columns.
* **Explicit Opening & Closing Balance Capture**: Detects `OPENING BALANCE`, `BALANCE B/F`, and `CLOSING BALANCE` rows as true mathematical anchors.
* **Overdraft & Signed Balances**: Accurately handles negative balances and overdraft amounts (`-Rs.X` and `Dr` balances).

---

## Version 1.9.0 (November 2026)

* **Header Action Buttons Moved Below Descriptions**: Primary action buttons across all five workspace sections moved directly below section descriptions for clean mobile layout.
* **Automatic Statement File Balance Analysis**: Ingests statement balance data, extracting Initial Balance and Latest Balance with formatted calendar dates in brackets.
* **Interactive Edit Bank Balance Modal**: Granular manual baseline controls to override or adjust balances, with a "Re-Calculate from Statements" button.
* **Live Reactive Synchronization**: Bank balances and date ranges update automatically in real time whenever statements are uploaded, re-assigned, or deleted.

---

## Version 1.8.0 (November 2026)

* **Net Flow Comparison Relocation & Overflow Fix**: Moved comparison table to the bottom of the Analysis page with balanced column layout, tabular numerals, and horizontal scroll support.
* **Clickable Top Spend Merchants & Income Sources**: Tapping any merchant or income payer opens an interactive drill-down modal showing all matching transactions.
* **Smart Bank Transfers Moved to Banks Page**: Relocated the transfers card from Ledger to the Banks & Rules page below Categories Manager.
* **Standardized Header Action Buttons**: Unified dimensions (`h-8`, `px-3`, `rounded-xl`, `text-xs font-semibold`) across all workspace section buttons.

---

## Version 1.7.0 (November 2026)

* **Multi-Select Transactions Suite**: Responsive checkboxes on every transaction row with dynamic bulk action bar for bulk category changes.
* **Redesigned Transaction Type Popup**: Replaced native select with a card-based modal for All Types, Debits Only, and Credits Only with live totals.
* **Redesigned Category Picker Popup**: Full-screen centered modal with real-time search, category color swatches, and transaction count badges.

---

## Version 1.6.1 (November 2026)

* **Resolved Blank Screen Startup Crash**: Fixed Temporal Dead Zone (`ReferenceError`) on `transferPairs` initialization in React `useEffect`.
* **Interactive Error Boundary**: Wrapped application root in a recovery shell with "Reload Application" and "Clear Cache & Restart" buttons.

---

## Version 1.6.0 (November 2026)

* **Automatic 'Bank Transfer' Category Synchronization**: Detected or linked transfer pairs automatically receive `'Bank Transfer'` category across both legs.
* **Focused Ledger Transfer Banner**: Scoped the transfer notification banner exclusively to the Transactions tab.
* **Clean Minimal Top App Bar**: Removed 5 redundant action buttons from the top bar for a clean header.
* **Screen-Centered Export Modal**: Replaced absolute dropdown with fixed centered dialog for PDF, Excel, and CSV exports.
* **Universal File Manager APK Icon**: Flat raster icons across all density buckets with explicit manifest attributes for complete thumbnail visibility.

---

## Version 1.5.0 (November 2026)

* **Interactive Smart Bank Transfer Management**: Unlinking false-positive pairs with persistence, manual counterpart pairing, and configurable clearing windows.
* **Universal Native Android Save & Share Engine**: Integrated `@capacitor/filesystem` and `@capacitor/share` to resolve silent WebView download failures.
* **Mobile Text Overflow Fix in Ledger**: Added flexible word-break constraints and line clamps to prevent long Indian banking narrations from breaking layout.
* **Direction-Aware Categorization (`scope: CREDIT | DEBIT | BOTH`)**: Prevents salary or credit tags from being assigned to debit expenses.
* **Multi-Select Period Duration Filters**: Introduced Weekwise, Monthwise, Quarterwise, and Yearwise multi-select filters alongside presets and custom ranges.

---

## Version 1.4.0 (November 2026)

* **Smart Token-Boundary Regex Categorization**: Bounded regular expressions prevent false-positive category matching (e.g., matching `ola` inside city names).
* **Persistent Manual Categories**: Introduced `isManualCategory: true` ensuring user-assigned categories survive app restarts and rule re-evaluations.
* **Multi-Option Category Filter in Ledger**: Searchable category filter modal with live transaction counts, Select All, and instant Clear button.
* **Comprehensive Formatted Export Suite**: Print-ready PDF statements with KPI cards, formatted Excel workbooks with totals, and RFC 4180 CSV with UTF-8 BOM.

---

## Version 1.3.0 (November 2026)

* **Material Design 3 Adaptive Launcher Icon**: Safe-zone compliant adaptive vector foreground, themed monochrome icon, and multi-density fallbacks.
* **Persistent Release Keystore & Conflict-Free Updates**: Permanent release keystore (`certs/finsight-release-key.keystore`) eliminating update installation signature conflicts.
* **Smart Bank Transfer Detection**: Automated cross-bank matching with 2-day clearing window and internal transfer exclusion toggle.
* **Granular Backup & Restore Manager**: Structured JSON workspace backups with itemized restoration (Banks, Files, Categories, Rules, Transactions).
* **Dual Category Analysis**: Separate Spend Outflow and Earnings Inflow breakdown views with side-by-side Net Flow comparison.

---

## Version 1.2.0 (November 2026)

* **Union Bank of India (UBI) Support**: Added auto-detection and column mapping for Union Bank of India statements.
* **Categories Manager UI**: Full CRUD interface for custom categories with cascading renames across all transactions and rules.
* **Interactive Auto-Categorization Rules**: Rules list with keyword tags and real-time transaction re-evaluation.
* **Duration & Date-Range Filter Presets**: Added quick time filters (`7D`, `30D`, `This Month`, `3M`, `This Year`, `Custom`) to the Ledger.
* **Automated Cloud Release Signing**: GitHub Actions CI/CD pipeline producing signed release APK artifacts on push.

---

## Version 1.1.0 (November 2026)

* **Custom Vector Brand Identity**: Introduced the **Rupee-Pulse Lens** logo across application headers, splash screens, and launcher icons.
* **Clean Slate Onboarding**: Removed sample data and hardcoded starter banks for an authentic clean-slate onboarding experience.
* **Full Bank & Statement File CRUD**: Complete bank management and statement file inspector with metadata tracking.

---

## Version 1.0.0 (October 2026)

* **Initial Application Architecture**: Offline React + Capacitor hybrid architecture for multi-bank statement analysis.
* **Multi-Format Ingestion**: Client-side parsing for Excel (`.xlsx`, `.xls`), CSV, and PDF statements via SheetJS and Mozilla PDF.js.
* **Cashflow Segregation**: Multi-bank cashflow tracking with monthly, quarterly, and yearly aggregation.
* **Transactions Ledger**: Searchable transaction ledger with inline add, edit, and delete controls.
* **Excel Data Export**: Client-side workbook export for analyzed transaction records.
