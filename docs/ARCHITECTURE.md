# System Architecture & Data Pipeline

## 1. Overview
FinSight India operates as an **offline-first Single Page Application (SPA)** packaged into a native Android WebView container via **Capacitor 6**. All file ingestion, decryption, tabular normalization, deduplication, and aggregation occur strictly in-memory inside the client runtime.

## 2. Ingestion & Parsing Pipeline

```text
[User Selects Multiple Files (.xlsx / .csv / .pdf)]
                     │
                     ▼
      ┌──────────────────────────────┐
      │     File Type Router         │
      └──────┬───────────────┬───────┘
             │               │
   (.xlsx / .csv)          (.pdf)
             │               │
             ▼               ▼
    [SheetJS (xlsx)]   [Mozilla PDF.js]
    ArrayBuffer Read   Password Handling & Text Token Extraction
             │               │
             └───────┬───────┘
                     ▼
      ┌──────────────────────────────┐
      │  Header & Bank Fingerprinter │
      │ (SBI / HDFC / ICICI / Axis)  │
      └──────────────┬───────────────┘
                     ▼
      ┌──────────────────────────────┐
      │   Transaction Normalizer     │
      │  Date ISO-8601 | Debit/Credit│
      └──────────────┬───────────────┘
                     ▼
      ┌──────────────────────────────┐
      │  Channel & Category Engine   │
      │  UPI/NEFT/NACH + 40+ Rules   │
      └──────────────┬───────────────┘
                     ▼
      ┌──────────────────────────────┐
      │ Time-Horizon Aggregator      │
      │ Daily | Monthly | Qtr | Year │
      └──────────────────────────────┘
```

## 3. Time-Horizon Segregation Logic
Every normalized transaction date (`YYYY-MM-DD`) is indexed into four time buckets using `useMemo` hooks for instantaneous switching:
- **Daywise**: `YYYY-MM-DD`
- **Monthwise**: `YYYY-MM`
- **Quarterly**: `YYYY-Q[1..4]` (Calendar quarters where `Q1 = Jan–Mar`, `Q2 = Apr–Jun`, `Q3 = Jul–Sep`, `Q4 = Oct–Dec`)
- **Yearly**: `YYYY`
