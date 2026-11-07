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

---

### 4. Technical Architecture: v1.3.0 Capabilities

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
