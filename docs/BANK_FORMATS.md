# Supported Indian Bank Statement Formats

FinSight India automatically detects and maps columns across major Indian retail banks:

| Bank | Detected Keywords / IFSC Prefix | Typical Date Headers | Narration Headers | Amount / Split Columns |
| :--- | :--- | :--- | :--- | :--- |
| **State Bank of India (SBI)** | `SBIN`, `State Bank` | `Txn Date`, `Value Date` | `Description`, `Narration` | `Debit`, `Credit`, `Balance` |
| **HDFC Bank** | `HDFC` | `Date`, `Value Dt` | `Narration` | `Withdrawal Amt.`, `Deposit Amt.`, `Closing Balance` |
| **ICICI Bank** | `ICIC` | `Transaction Date`, `Value Date` | `Transaction Remarks` | `Withdrawal Amount (INR )`, `Deposit Amount (INR )` |
| **Axis Bank** | `UTIB`, `Axis` | `Tran Date` | `Particulars` | `Debit`, `Credit`, `Init. Br` |
| **Kotak Mahindra Bank** | `KKBK`, `Kotak` | `Date` | `Description`, `Chq / Ref No.` | `Amount`, `Dr / Cr` or `Withdrawal (Dr)` / `Deposit (Cr)` |
| **Union Bank of India (UBI)** | `UBIN`, `Union Bank` | `Tran Date`, `Value Date`, `TransactionDate` | `Particulars`, `Remarks` | `Debit` / `Withdrawal`, `Credit` / `Deposit`, `Tran Id`, `Chq/Ref No` |

## Adding Custom Bank Rules
To add custom bank detection or category rules, update `detectBank()` and `CATEGORY_RULES` inside `src/App.jsx`.
