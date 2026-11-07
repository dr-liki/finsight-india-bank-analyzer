# FinSight India — Release Notes

## Version 1.2.0 (November 2026)

FinSight India v1.2.0 introduces **Union Bank of India (UBI)** bank statement support, an expanded Indian financial taxonomy with a dedicated **Categories Manager UI**, an interactive **Auto-Categorization Rules Engine** with instant transaction re-evaluation, a multi-preset **Duration / Date-Range Filter** in the Transactions Ledger, and **Automated Cloud Release APK Signing** via GitHub Actions.

---

### Highlights & Key Improvements

#### 1. Union Bank of India (UBI) Statement Parsing
- **Auto-Detection**: Recognizes UBI statements via IFSC prefixes and institution headers (`UBIN`, `Union Bank`, `Union Bank of India`).
- **Tabular Mapping (XLSX / CSV / XLS)**:
  - **Date**: Matches `Tran Date`, `Value Date`, `TransactionDate`, and `Txn Dt`.
  - **Narration**: Extracts `Particulars`, `Remarks`, `Narration`, and transaction descriptions.
  - **Amounts**: Normalizes `Debit` / `Withdrawal` (`DR`) and `Credit` / `Deposit` (`CR`).
  - **Identifiers**: Identifies `Tran Id` and `Chq/Ref No`.
- **PDF Parser**: Enhanced regular expression engine supporting Indian alphanumeric and hyphenated date tokens (`DD-Mon-YYYY`, `DD/MM/YYYY`, `DD-MM-YYYY`) and debit/credit balance markers.

#### 2. Expanded Financial Categories & Categories Manager UI
- **5 New Default Categories**:
  - `Bank Transfer` (NEFT, RTGS, IMPS, internal account transfers)
  - `Interest/Cashback` (Savings bank interest, credit card rewards, refunds)
  - `Friend` (Splitwise, peer repayments, shared expenses)
  - `Family` (Remittances, parents/home expenses)
  - `Cash Out` (ATM and self withdrawals)
- **Categories Manager UI**:
  - Accessible via the **Categories** button in the top navigation app bar and inside the **Banks & Rules** management tab.
  - **Add Category**: Add custom personal spending verticals.
  - **Edit / Rename Category**: Cascades updates across all historical transactions and active auto-categorization rules.
  - **Delete Category**: Safely removes categories while gracefully migrating associated transactions to `Uncategorized`.

#### 3. Interactive Auto-Categorization Rules Engine
- **Visual Rule Cards**: Displays all active categorization rules alongside their assigned merchant keywords as removable chip badges.
- **Granular Keyword Management**:
  - Add individual or comma-separated keywords directly into any category.
  - Delete individual keywords with a single tap on the `x` badge.
  - Edit complete keyword strings through a dedicated modal.
- **Instant Re-Evaluation**: Modifying, adding, or deleting a rule immediately triggers a client-side sweep that re-evaluates all transactions in real time.
- **Manual "Re-apply Rules"**: One-click action to recalculate transaction categories across the entire workspace.

#### 4. Transactions Ledger Duration & Date-Range Filter
- **Quick Preset Selectors**:
  - `All Time`
  - `Last 7 Days`
  - `Last 30 Days`
  - `This Month`
  - `Last 3 Months`
  - `This Year`
- **Custom Date Range**:
  - Compact `From` and `To` native date pickers.
  - Interactive range badge showing active bounds and transaction counts.
  - One-click reset and clear controls.

#### 5. Automated Cloud Release APK Signing (Option A)
- **CI/CD Pipeline**: GitHub Actions workflow (`.github/workflows/build-apk.yml`) upgraded to compile and sign production-ready release builds.
- **Automated Keystore Generation**: Employs `keytool` on Ubuntu runners to generate an RSA 2048-bit keystore (`finsight-release-key.jks`) on demand.
- **Release Signing**: Automatically configures Gradle `signingConfigs.release` before running `./gradlew assembleRelease`.
- **Artifact Output**: Publishes installable signed APK:
  `FinSight-India-v1.2.0-b<run>-release-signed.apk`

---

### Verification & Compatibility
- **Node.js**: Compatible with Node 18, 20, 22, and 26.
- **Android Platform**: Capacitor 6 on Android API 22+ (Android 5.1 through Android 15).
- **Privacy Standard**: 100% on-device local storage (`localStorage`). No servers, zero data exfiltration.
