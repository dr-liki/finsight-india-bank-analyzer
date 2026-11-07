# FinSight India — Release Notes

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
