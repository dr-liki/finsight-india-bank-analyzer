# PROJECT_CONTEXT
## Project Reference Summary: FinSight India — Android Multi-Bank Statement Analyzer

### 1. Project Identity & Repository

* **Application Name:** FinSight India
* **App / Package ID:** `com.finsight.bankanalyzer`
* **GitHub Repository:** `[https://github.com/dr-liki/finsight-india-bank-analyzer](https://github.com/dr-liki/finsight-india-bank-analyzer)`
* **Target Platform:** Android (packaged via Capacitor 6) & Offline-First Web SPA
* **Privacy Model:** 100% client-side, on-device processing and storage (`localStorage`). Zero external servers or cloud data transmission.
* **Brand Icon:** Custom SVG **Rupee-Pulse Lens** (`public/icon.svg` and inline `<FinSightLogo/>` React component) featuring ascending emerald/sky analytics bars overlaid with a geometric `₹` symbol inside a dark-slate squircle.



---

### 2. Tech Stack & Build Pipeline

* **Frontend Framework:** React 18 + Vite 5 + Tailwind CSS 3
* **Icons & Charts:** `lucide-react` + `recharts` (Responsive BarChart, PieChart/Donut, CartesianGrid, Tooltip, Legend)
* **File Parsing Engines:**
* **Excel & CSV (`.xlsx`, `.xls`, `.csv`):** SheetJS (`xlsx`) reading `ArrayBuffer` into a 2D matrix, scanning the first 35 rows to strip bank metadata headers, normalizing `DD/MM/YYYY`, `DD-MM-YYYY`, ISO dates, and Excel serial dates.
* **PDF Statements (`.pdf`):** Mozilla `pdfjs-dist` (`v3.11.174` with CDN worker for Android WebView compatibility), extracting text coordinates row-by-row, plus an interactive decryption modal for password-protected bank PDFs.


* **CI/CD & APK Packaging:** GitHub Actions (`.github/workflows/build-apk.yml`) running Ubuntu, Node 20, and Java JDK 17 Temurin to build web assets, sync Capacitor Android, stamp `versionName` and `versionCode` into `android/app/build.gradle`, and compile the APK artifact.



---

### 3. Version History & Completed Milestones

| Version | Status | Key Capabilities Implemented |
| --- | --- | --- |
| **v1.0.0** | Completed | Initial React + Capacitor setup; basic CSV/XLSX/PDF ingestion; 4-tab Android bottom navigation (`Overview`, `Spend Analysis`, `Transactions`, `Files & Rules`); Daywise (`YYYY-MM-DD`), Monthwise (`YYYY-MM`), Quarterly (`YYYY-Q1..Q4`), and Yearly (`YYYY`) cash-flow segregation; inline transaction add/edit/delete; XLSX export. |
| **v1.1.0** | Completed | Added build versioning (`v1.1.0` badge + versioned GitHub Actions APK artifact `FinSight-India-v1.1.0-b<run>-APK`); added custom **Rupee-Pulse Lens** vector icon; removed all preloaded banks and sample startup data for a clean onboarding experience; added full CRUD for **Banks** and **Statement Files**. |
| **v1.2.0** | Completed | Added Union Bank of India (UBI) auto-detection & header mapping; expanded default categories with 5 new verticals (`Bank Transfer`, `Interest/Cashback`, `Friend`, `Family`, `Cash Out`); implemented full Categories Manager UI with cascading renames; upgraded Auto-Categorization Rules to an interactive list with keyword tags and real-time transaction re-evaluation; added Duration/Date-Range filter in Transactions Ledger (`All Time`, `7D`, `30D`, `This Month`, `3M`, `This Year`, `Custom`); automated Cloud Release APK Signing (Option A keytool) producing signed release APK `FinSight-India-v1.2.0-b<run>-release-signed.apk`. |
| **v1.3.0** | Completed | Fixed app drawer logo visibility with full Material Design 3 (MD3) Adaptive Icon compliance (foreground, background, monochrome themed icon); eliminated update install conflict via persistent release signing keystore (`certs/finsight-release-key.keystore`) and monotonic versionCode stamping; implemented Smart Bank Transfer matching between accounts with internal transfer exclusion toggle; added complete Backup & Restore manager with granular item-by-item selection (banks, statement files metadata, categories, rules, transactions); added dual Category Analysis providing separate Spend (debit) and Earnings (credit) breakdown views with net flow comparisons. |
| **v1.4.0** | Completed | Upgraded auto-categorization engine with discrete token-boundary regex compiler eliminating false positives (e.g., over-tagging Fuel & Transport); implemented persistent manual transaction category tags (`isManualCategory: true`) that survive app reloads and rule updates; added multi-option category filter modal with live transaction counts, search, and clear filter button in Ledger; added comprehensive formatted export suite (PDF statements with executive KPI cards via `jspdf`/`jspdf-autotable`, styled Excel `.xlsx` workbooks with summary rows, and RFC 4180 `.csv` with UTF-8 BOM). |
| **v1.5.0** | Completed | Added interactive Smart Bank Transfer management with pair unlinking, candidate counterpart manual linking, configurable clearing windows, and transfer manager UI; implemented native Android file saving and sharing via `@capacitor/filesystem` and `@capacitor/share` (fixing silent export download failures); resolved Ledger mobile text overflow with `min-w-0` and `break-words break-all`; upgraded auto-categorization with transaction direction awareness (`scope: 'CREDIT' | 'DEBIT' | 'BOTH'`); added multi-select duration filters across weekwise, monthwise, quarterwise, and yearwise periods. |
| **v1.6.0** | Completed | Automatically assign 'Bank Transfer' category for both paired transactions; transfer banner moved exclusively into Transactions (`LEDGER`) tab and removed from Overview and Analysis; removed 5 cluttering top app bar buttons for clean header; removed 'Manage Categories' from Analysis tab; resolved Analysis tab text overflow across sub-mode buttons, category breakdowns, and Net Flow table; replaced Ledger export dropdown with screen-centered modal dialog; added universal raster icons and explicit activity/application icon attributes in AndroidManifest and CI deployment for complete file manager thumbnail visibility. |
| **v1.6.1** | Completed | Hotfix resolving blank screen initialization crash caused by a Temporal Dead Zone (TDZ) ReferenceError on `transferPairs` in `useEffect`; reordered hook after `useMemo` declarations; wrapped application root in interactive `<ErrorBoundary>` with user recovery controls. |

---

### 4. Technical Architecture: v1.6.0 Capabilities

1. **Automatic 'Bank Transfer' Category Synchronization**:
   - Both legs of detected or manually linked transfer pairs automatically receive the `'Bank Transfer'` category in real time.
   - Unlinking a pair automatically reverts both transactions back to their direction-aware automatic categories.

2. **Scoped Bank Transfer Banner & Clean Top App Bar**:
   - Global header reduced to clean branding, version, and entity counters (5 cluttering action buttons removed).
   - Smart Bank Transfer banner relocated exclusively to the Transactions (`LEDGER`) tab.

3. **Centered Export Modal Dialog**:
   - Replaced off-screen prone absolute dropdown with fixed centered modal (`fixed inset-0 bg-black/75 z-50 flex items-center justify-center`).
   - Clean card-based format selection for PDF Statement, Excel XLSX, and RFC 4180 CSV.

4. **Universal File Manager APK Icon Deployment**:
   - Raster flat icons across all density buckets (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) in `mipmap` and `drawable`.
   - Explicit `android:icon`, `android:roundIcon`, and `android:logo` on both `<application>` and `<activity>`.
   - CI workflow step deploying `android-manifest/AndroidManifest.xml` during Gradle builds.

1. **Smart Bank Transfer Management Suite (`detectTransferPairs`)**:
   - Automated cross-bank matching with configurable clearing window ($0$ to $5$ days).
   - User unlinking with persistence (`unlinkedTransferPairs`) to prevent false-positive re-pairing.
   - Manual transfer pairing (`manualTransferPairs`) with counter-party candidate picker.
   - Dedicated Smart Bank Transfers Manager modal and direct unlinking in transaction edit dialog.

2. **Native Save & Share Engine (`saveOrShareFile`)**:
   - Uses `@capacitor/filesystem` (`writeFile` to `Directory.Cache`) and `@capacitor/share` (`Share.share`) on native Android.
   - Resolves WebView download failures where `<a download>` and `blob:` URLs fail silently.
   - Transparent desktop web fallback via `Blob` and anchor simulation.
   - Configured with Android FileProvider and `file_paths.xml`.

3. **Responsive Mobile Layout & Text Overflow Prevention**:
   - Applied `min-w-0 flex-1 overflow-hidden`, `break-words break-all`, and `line-clamp-2` to narration blocks.
   - Applied `shrink-0 text-right` to transaction amounts and action icons.

4. **Direction-Aware Auto-Categorization Engine (`evaluateTransactionCategory`)**:
   - Categorization rules support `scope: 'CREDIT' | 'DEBIT' | 'BOTH'`.
   - Prevents credits from defaulting to `Salary & Income`.
   - Discrete recognition of interest credits, cashbacks, refunds, dividends, and ATM cash withdrawals.

5. **Multi-Select Period Duration Filtering**:
   - `durationMode`: `'ALL'`, `'WEEKWISE'`, `'MONTHWISE'`, `'QUARTERWISE'`, `'YEARWISE'`, `'PRESET'`, `'CUSTOM'`.
   - Multi-select ISO weeks, calendar months, quarters, and years with transaction count badges.

1. **Smart Token-Boundary Rules Engine (`compileRulesEngine`)**:
   - Compiles user keywords into boundary-enforced regular expressions: `(^|[^a-z0-9])(keyword)([^a-z0-9]|$)`.
   - Prevents substring contamination (e.g. `ola` in `KOLKATA`, `CHOLAMANDALAM`, `SOLAPUR`, `VIOLATION`).
   - Prioritizes longer phrases first and matches against normalized transaction narrations.

2. **Persistent Manual Categorization (`isManualCategory`)**:
   - `isManualCategory: true` metadata flag stamped whenever a user manually edits or adds a transaction category.
   - Evaluator (`applyCategorizationRules`) skips manual categories, guaranteeing persistence across app restarts, re-imports, and rule modifications.
   - Reversible UI toggle in Edit Transaction modal to restore auto-classification.

3. **Multi-Category Filter in Ledger**:
   - `selectedCategories` array state in Ledger component.
   - Multi-select modal with category search, "Select All", and "Clear Filter" actions.
   - Context-aware active filter pill displaying active selection count with one-tap dismiss.

4. **Multi-Format Export Suite (PDF, XLSX, CSV)**:
   - **PDF**: `jspdf` (`2.5.2`) + `jspdf-autotable` (`3.8.4`) generating branded A4 portrait document with header, KPI card, zebra striping, currency formatting, and page numbers.
   - **XLSX**: `xlsx` (SheetJS) with automated column widths and computed summary totals rows.
   - **CSV**: Standard UTF-8 BOM RFC 4180 comma-separated values.
   - Automatically synchronizes with all active filters (date presets/custom range, banks, search, categories, and transfer exclusions).

5. **Material Design 3 (MD3) Adaptive Icons & Zero-Conflict Release Keystore**:

1. **MD3 Adaptive Icons & Android Drawer Visibility**:
   - Resides in `android-res/` and injected into `android/app/src/main/res/`.
   - Adaptive icon (`ic_launcher.xml` and `ic_launcher_round.xml`) with safe zone vector foreground (`ic_launcher_foreground.xml`), dark slate background (`ic_launcher_background.xml`), and dynamic Material You themed icon (`ic_launcher_monochrome.xml`).
   - Legacy PNG mipmaps generated via `librsvg2-bin` during CI.

2. **Persistent Release Keystore & Conflict-Free Updates**:
   - `certs/finsight-release-key.keystore` (and `certs/keystore.base64`) committed to repository.
   - Fixed signing config in Gradle with alias `finsightkey` and password `androidrelease123`.
   - Guaranteed identical signature on every GitHub Actions release.

3. **Smart Bank Transfer Matching**:
   - `detectTransferPairs()` engine matching opposite transaction types across banks with matching amounts within 2 days.
   - Interactive `↔ Transfer` badge and inspection modal.
   - Optional exclusion from inflow/outflow totals to prevent double counting.

4. **Backup & Restore System**:
   - Export structured JSON backups with checksum and version header.
   - Granular import modal selecting any combination of Banks, Files, Categories, Rules, and Transactions.
   - Choice between Merge mode and Clean Replace mode.

5. **Dual Category Analysis (Spend AND Earnings)**:
   - 3-way toggle in Analysis tab: Spend (Outflow), Earnings (Inflow), and Net Flow Comparison.
   - Recharts Donut charts, channel breakdowns, and top payees/sources for both directions.


2. **Expanded Default Categories & Full Category CRUD in Menu:**
* Add **`Bank Transfer`**, **`Interest/Cashback`**, **`Friend`**, **`Family`**, and **`Cash Out`** to the default categories list.
* Add a dedicated **Categories Manager** section in the menu with options to **Add**, **Edit/Rename** (cascading updates to existing transactions and rules), and **Delete** categories.


3. **Interactive Auto-Categorization Rules List (Add, Edit, Remove):**
* Upgrade the Rules Engine UI to display all active categorization rules as an interactive list showing each category and its matched keywords.
* Allow **Adding** new rules, **Editing** existing rule keywords or target categories, and **Removing** individual keywords or entire rules, with instant re-evaluation against transactions.


4. **Duration / Date-Range Filter in Transactions Tab:**
* Add a duration filter bar to the **Transactions (`LEDGER`)** view supporting quick presets (**All Time**, **Last 7 Days**, **Last 30 Days**, **This Month**, **Last 3 Months**, **This Year**) plus a **Custom Date Range (`From Date` – `To Date`)** picker.


5. **Automated Release APK Signing (Option A) & Release Notes:**
* Update `.github/workflows/build-apk.yml` to automatically generate a deterministic/persistent release keystore (`finsight-release-key.jks`) via `keytool`, configure Gradle release signing, and output a signed release APK (`FinSight-India-v1.2.0-b<run>-release-signed.apk`) alongside formal `RELEASE_NOTES.md`.
