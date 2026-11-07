import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Upload, FileSpreadsheet, FileText, PieChart as PieIcon, BarChart3,
  Trash2, Building2, Download, Search, ArrowUpRight,
  ArrowDownRight, Plus, Edit3, X, Lock, AlertCircle, FolderOpen, Save,
  Check, Tag, Layers, Sparkles, Calendar, Filter, RefreshCw,
  ArrowLeftRight, Database, TrendingUp, TrendingDown, CheckSquare, Square
} from 'lucide-react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';

const APP_VERSION = '1.3.0';

// Configure PDF.js worker via CDN for Android WebView compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#a855f7', '#06b6d4', '#eab308', '#f97316', '#84cc16'];
const EARN_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#14b8a6', '#84cc16', '#22c55e', '#a855f7', '#38bdf8', '#f59e0b'];

const BANK_COLOR_PALETTE = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Groceries & Quick Commerce',
  'Investments & SIP',
  'Fuel & Transport',
  'Bills & Utilities',
  'Healthcare & Medical',
  'Shopping & Books',
  'Rent & Housing',
  'Salary & Income',
  'Transfers & UPI',
  'Bank Transfer',
  'Interest/Cashback',
  'Friend',
  'Family',
  'Cash Out',
  'Uncategorized'
];

const DEFAULT_RULES = [
  { cat: 'Food & Dining', keys: ['swiggy', 'zomato', 'restaurant', 'cafe', 'starbucks', 'dominos', 'mcdonalds', 'kfc', 'burger', 'eatfit', 'bakery'] },
  { cat: 'Groceries & Quick Commerce', keys: ['zepto', 'blinkit', 'instamart', 'bigbasket', 'dmart', 'reliance smart', 'more supermarket', 'nature basket', 'milk'] },
  { cat: 'Investments & SIP', keys: ['zerodha', 'groww', 'ppfas', 'mutual fund', 'ach d-', 'sip', 'nps', 'epfo', 'kuvera', 'indmoney', 'lic', 'fd'] },
  { cat: 'Fuel & Transport', keys: ['shell', 'hpcl', 'bpcl', 'iocl', 'petrol', 'uber', 'ola', 'rapido', 'fastag', 'irctc', 'namma yatri', 'metro', 'indigo'] },
  { cat: 'Bills & Utilities', keys: ['bescom', 'airtel', 'jio', 'act fibernet', 'electricity', 'water', 'gas', 'recharge', 'bbps', 'bwssb', 'tataplay'] },
  { cat: 'Healthcare & Medical', keys: ['hospital', 'manipal', 'apollo', 'pharmeasy', '1mg', 'pharmacy', 'clinic', 'medplus', 'st johns', 'diagnostic'] },
  { cat: 'Shopping & Books', keys: ['amazon', 'flipkart', 'myntra', 'blossom book', 'decathlon', 'nykaa', 'ajio', 'meesho', 'croma', 'reliance digital'] },
  { cat: 'Rent & Housing', keys: ['rent', 'nobroker', 'maintenance', 'mygate', 'society', 'landlord'] },
  { cat: 'Salary & Income', keys: ['salary', 'stipend', 'fellowship'] },
  { cat: 'Bank Transfer', keys: ['fund transfer', 'neft', 'rtgs', 'imps', 'transfer to', 'trf from', 'trf to', 'internal transfer'] },
  { cat: 'Interest/Cashback', keys: ['int.pd', 'interest credit', 'sb int', 'cashback', 'reward points', 'dividend', 'refund'] },
  { cat: 'Friend', keys: ['splitwise', 'friend', 'settleup'] },
  { cat: 'Family', keys: ['family', 'mother', 'father', 'sister', 'brother', 'parents', 'home expense'] },
  { cat: 'Cash Out', keys: ['atm wdl', 'cash wdl', 'atm cash', 'self wdl', 'cash withdrawal'] }
];

// Unique Vector Brand Icon Component (FinSight Rupee-Pulse Lens)
function FinSightLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" className="shrink-0 shadow-md rounded-xl">
      <defs>
        <linearGradient id="fsBg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="55%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="fsEm" x1="96" y1="96" x2="416" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#fsBg)" stroke="#10b981" strokeWidth="14" strokeOpacity="0.45" />
      <circle cx="256" cy="256" r="176" stroke="#1e293b" strokeWidth="16" />
      <path d="M256 80 A176 176 0 0 1 432 256" stroke="url(#fsEm)" strokeWidth="18" strokeLinecap="round" />
      <rect x="148" y="284" width="38" height="84" rx="12" fill="#0ea5e9" fillOpacity="0.85" />
      <rect x="206" y="232" width="38" height="136" rx="12" fill="#10b981" fillOpacity="0.9" />
      <rect x="264" y="176" width="38" height="192" rx="12" fill="url(#fsEm)" />
      <path
        d="M172 146 H344 M172 192 H324 M254 146 C288 146 308 164 308 192 C308 222 284 242 242 242 H196 L316 368"
        stroke="#f8fafc"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="348" cy="146" r="18" fill="#34d399" />
    </svg>
  );
}

function normalizeDate(raw) {
  if (!raw) return new Date().toISOString().slice(0, 10);
  if (typeof raw === 'number') {
    const utcDays = Math.floor(raw - 25569);
    const d = new Date(utcDays * 86400 * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  const str = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    let year = dmy[3];
    if (year.length === 2) year = (parseInt(year, 10) > 50 ? '19' : '20') + year;
    return `${year}-${month}-${day}`;
  }
  const monMatch = str.match(/^(\d{1,2})[\/\-\s]+([A-Za-z]{3})[\/\-\s]+(\d{2,4})/);
  if (monMatch) {
    const day = monMatch[1].padStart(2, '0');
    const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
    const month = months[monMatch[2].toLowerCase()] || '01';
    let year = monMatch[3];
    if (year.length === 2) year = (parseInt(year, 10) > 50 ? '19' : '20') + year;
    return `${year}-${month}-${day}`;
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function parseAmount(val) {
  if (typeof val === 'number') return Math.abs(val);
  if (!val) return 0;
  const cleaned = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.abs(num);
}

function autoDetectBankName(text, userBanks = []) {
  const s = (text || '').toLowerCase();
  for (const b of userBanks) {
    if (s.includes(b.name.toLowerCase())) return b.name;
  }
  if (s.includes('ubin') || s.includes('union bank') || s.includes('union bank of india')) return 'Union Bank of India';
  if (s.includes('hdfc')) return 'HDFC Bank';
  if (s.includes('sbin') || s.includes('state bank') || s.includes('sbi')) return 'SBI';
  if (s.includes('icic')) return 'ICICI Bank';
  if (s.includes('utib') || s.includes('axis')) return 'Axis Bank';
  if (s.includes('kkbk') || s.includes('kotak')) return 'Kotak Bank';
  if (s.includes('cnrb') || s.includes('canara')) return 'Canara Bank';
  if (s.includes('barb') || s.includes('baroda')) return 'Bank of Baroda';
  if (s.includes('punb') || s.includes('pnb')) return 'PNB';
  return '';
}

function detectChannel(narration) {
  const s = (narration || '').toUpperCase();
  if (s.includes('UPI')) return 'UPI';
  if (s.includes('NEFT')) return 'NEFT';
  if (s.includes('IMPS')) return 'IMPS';
  if (s.includes('ACH') || s.includes('NACH') || s.includes('ECS') || s.includes('SIP')) return 'NACH';
  if (s.includes('POS') || s.includes('CARD') || s.includes('ECOM')) return 'POS';
  if (s.includes('ATM')) return 'ATM';
  return 'OTHER';
}

function applyCategorizationRules(transactionsList, rulesList) {
  if (!transactionsList || !transactionsList.length) return { updatedTxns: [], changedCount: 0 };
  let changedCount = 0;
  const updatedTxns = transactionsList.map(t => {
    const s = (t.narration || '').toLowerCase();
    let matchedCat = null;

    if (rulesList && rulesList.length) {
      for (const r of rulesList) {
        if (!r || !r.keys) continue;
        for (const rawKey of r.keys) {
          const k = String(rawKey || '').trim().toLowerCase();
          if (k && s.includes(k)) {
            matchedCat = r.cat;
            break;
          }
        }
        if (matchedCat) break;
      }
    }

    if (!matchedCat) {
      if (t.type === 'CREDIT') matchedCat = 'Salary & Income';
      else if (s.includes('upi/')) matchedCat = 'Transfers & UPI';
      else matchedCat = 'Uncategorized';
    }

    if (matchedCat !== t.category) {
      changedCount++;
      return { ...t, category: matchedCat };
    }
    return t;
  });

  return { updatedTxns, changedCount };
}

// SMART BANK TRANSFER PAIR DETECTION ENGINE
// Identifies matching debit in Bank A and credit in Bank B with same amount within 2 days
function detectTransferPairs(transactionsList) {
  if (!transactionsList || transactionsList.length < 2) return [];
  const pairs = [];
  const matchedDebitIds = new Set();
  const matchedCreditIds = new Set();

  const debits = transactionsList.filter(t => t.type === 'DEBIT');
  const credits = transactionsList.filter(t => t.type === 'CREDIT');

  for (const d of debits) {
    if (matchedDebitIds.has(d.id)) continue;
    const dDateStr = d.date || '2026-01-01';
    const dDate = new Date(dDateStr).getTime();
    const dAmt = Number(d.amount);
    if (!dAmt || dAmt <= 0) continue;
    const dNarr = (d.narration || '').toLowerCase();
    const dBank = (d.bank || '').toLowerCase();

    for (const c of credits) {
      if (matchedCreditIds.has(c.id)) continue;
      const cBank = (c.bank || '').toLowerCase();
      // Must be between different banks if bank names are populated
      if (dBank && cBank && dBank === cBank) continue;

      const cAmt = Number(c.amount);
      if (Math.abs(dAmt - cAmt) > 0.01) continue;

      const cDateStr = c.date || '2026-01-01';
      const cDate = new Date(cDateStr).getTime();
      const diffDays = Math.abs(dDate - cDate) / (1000 * 60 * 60 * 24);
      if (diffDays > 2) continue;

      const cNarr = (c.narration || '').toLowerCase();
      const transferKeywords = [
        'upi', 'neft', 'imps', 'rtgs', 'fund transfer', 'transfer', 'trf', 'self',
        'internal', 'own a/c', 'own ac', 'to ', 'from '
      ];
      const hasKeyword = transferKeywords.some(k => dNarr.includes(k) || cNarr.includes(k));

      // Extract 6-16 digit transaction references (e.g. UTR, RRN)
      const dDigits = (dNarr.match(/\b\d{6,16}\b/g) || []);
      const cDigits = (cNarr.match(/\b\d{6,16}\b/g) || []);
      const hasMatchingRef = dDigits.some(dig => cDigits.includes(dig));

      if (diffDays === 0 || hasKeyword || hasMatchingRef) {
        matchedDebitIds.add(d.id);
        matchedCreditIds.add(c.id);
        const pairId = `pair-${d.id}-${c.id}`;
        pairs.push({
          pairId,
          debitTxnId: d.id,
          creditTxnId: c.id,
          fromBank: d.bank,
          toBank: c.bank,
          amount: dAmt,
          date: d.date,
          diffDays
        });
        break;
      }
    }
  }
  return pairs;
}

export default function App() {
  const [banks, setBanks] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_banks_v130') || localStorage.getItem('finsight_banks_v120') || localStorage.getItem('finsight_banks_v110');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [txns, setTxns] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_txns_v130') || localStorage.getItem('finsight_txns_v120') || localStorage.getItem('finsight_txns_v110');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_files_v130') || localStorage.getItem('finsight_files_v120') || localStorage.getItem('finsight_files_v110');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_categories_v130') || localStorage.getItem('finsight_categories_v120') || localStorage.getItem('finsight_categories_v110');
      if (saved) {
        const parsed = JSON.parse(saved);
        const combined = Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed]));
        return combined;
      }
      return DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_rules_v130') || localStorage.getItem('finsight_rules_v120') || localStorage.getItem('finsight_rules_v110');
      return saved ? JSON.parse(saved) : DEFAULT_RULES;
    } catch {
      return DEFAULT_RULES;
    }
  });

  const [excludeTransfersFromTotals, setExcludeTransfersFromTotals] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_exclude_transfers_v130');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState('DASHBOARD'); // DASHBOARD, SPEND, LEDGER, BANKS
  const [granularity, setGranularity] = useState('MONTHLY'); // DAILY, MONTHLY, QUARTERLY, YEARLY
  const [bankFilter, setBankFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  // Category Analysis Tab Sub-Mode: 'SPEND', 'EARN', 'NET'
  const [categoryAnalysisMode, setCategoryAnalysisMode] = useState('SPEND');

  // Date Range Filter State for Transactions Tab
  const [datePreset, setDatePreset] = useState('ALL'); // ALL, 7D, 30D, THIS_MONTH, 3M, THIS_YEAR, CUSTOM
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Target bank selection for file upload
  const [uploadTargetBank, setUploadTargetBank] = useState('AUTO');
  const fileInputRef = useRef(null);

  // Backup & Restore state
  const restoreFileInputRef = useRef(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [backupDataToRestore, setBackupDataToRestore] = useState(null);
  const [restoreSelection, setRestoreSelection] = useState({
    banks: true,
    files: true,
    categories: true,
    rules: true,
    txns: true
  });
  const [restoreMode, setRestoreMode] = useState('MERGE'); // 'MERGE' or 'REPLACE'

  // Bank Management Modals (Add / Edit Bank)
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [bankForm, setBankForm] = useState({ name: '', accountHint: '', color: BANK_COLOR_PALETTE[0] });

  // File Management Modal (Edit / Reassign / Rename File)
  const [editingFile, setEditingFile] = useState(null);

  // Transaction Modals (Edit / Add)
  const [editingTxn, setEditingTxn] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTxnForm, setNewTxnForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    narration: '',
    amount: '',
    type: 'DEBIT',
    bank: '',
    channel: 'UPI',
    category: 'Food & Dining'
  });

  // PDF Password Modal
  const [pendingPdf, setPendingPdf] = useState(null);
  const [pdfPassword, setPdfPassword] = useState('');

  // Categories Manager Modal & State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  // Rules Engine State & Modals
  const [ruleKey, setRuleKey] = useState('');
  const [ruleCat, setRuleCat] = useState('Food & Dining');
  const [editingRule, setEditingRule] = useState(null);

  // Transfer Pair Inspector Modal
  const [selectedTransferPair, setSelectedTransferPair] = useState(null);

  // PERSISTENCE EFFECT (v1.3.0 Keys)
  useEffect(() => {
    try { localStorage.setItem('finsight_banks_v130', JSON.stringify(banks)); } catch {}
  }, [banks]);

  useEffect(() => {
    try { localStorage.setItem('finsight_txns_v130', JSON.stringify(txns)); } catch {}
  }, [txns]);

  useEffect(() => {
    try { localStorage.setItem('finsight_files_v130', JSON.stringify(uploadedFiles)); } catch {}
  }, [uploadedFiles]);

  useEffect(() => {
    try { localStorage.setItem('finsight_categories_v130', JSON.stringify(categories)); } catch {}
  }, [categories]);

  useEffect(() => {
    try { localStorage.setItem('finsight_rules_v130', JSON.stringify(rules)); } catch {}
  }, [rules]);

  useEffect(() => {
    try { localStorage.setItem('finsight_exclude_transfers_v130', JSON.stringify(excludeTransfersFromTotals)); } catch {}
  }, [excludeTransfersFromTotals]);

  // Real-time automatic rule re-evaluation:
  useEffect(() => {
    if (!txns || txns.length === 0) return;
    const { updatedTxns, changedCount } = applyCategorizationRules(txns, rules);
    if (changedCount > 0) {
      setTxns(updatedTxns);
    }
  }, [rules]);

  // SMART BANK TRANSFERS: Pair Detection and Quick Lookup Map
  const transferPairs = useMemo(() => {
    return detectTransferPairs(txns);
  }, [txns]);

  const transferMap = useMemo(() => {
    const map = new Map();
    transferPairs.forEach(pair => {
      map.set(pair.debitTxnId, {
        isDebit: true,
        partnerBank: pair.toBank,
        pairId: pair.pairId,
        amount: pair.amount,
        partnerTxnId: pair.creditTxnId
      });
      map.set(pair.creditTxnId, {
        isDebit: false,
        partnerBank: pair.fromBank,
        pairId: pair.pairId,
        amount: pair.amount,
        partnerTxnId: pair.debitTxnId
      });
    });
    return map;
  }, [transferPairs]);

  const totalTransfersAmount = useMemo(() => {
    return transferPairs.reduce((sum, p) => sum + p.amount, 0);
  }, [transferPairs]);

  const showToast = (msg, isError = false) => {
    setStatusMsg({ text: msg, isError });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const ensureBankRegistered = (bankName) => {
    const clean = (bankName || 'My Bank').trim();
    setBanks(prev => {
      if (prev.some(b => b.name.toLowerCase() === clean.toLowerCase())) return prev;
      const newBank = {
        id: `bank-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        name: clean,
        accountHint: '',
        color: BANK_COLOR_PALETTE[prev.length % BANK_COLOR_PALETTE.length],
        createdAt: new Date().toISOString().slice(0, 10)
      };
      return [...prev, newBank];
    });
    return clean;
  };

  const handleSaveBank = () => {
    const cleanName = bankForm.name.trim();
    if (!cleanName) {
      showToast('Please enter a bank name', true);
      return;
    }

    if (editingBank) {
      const oldName = editingBank.name;
      setBanks(prev => prev.map(b => b.id === editingBank.id ? { ...b, name: cleanName, accountHint: bankForm.accountHint.trim(), color: bankForm.color } : b));
      if (oldName !== cleanName) {
        setTxns(prev => prev.map(t => t.bank === oldName ? { ...t, bank: cleanName } : t));
        setUploadedFiles(prev => prev.map(f => f.bank === oldName ? { ...f, bank: cleanName } : f));
        if (bankFilter === oldName) setBankFilter(cleanName);
      }
      showToast(`Updated bank "${cleanName}"`);
    } else {
      if (banks.some(b => b.name.toLowerCase() === cleanName.toLowerCase())) {
        showToast('A bank with this name already exists', true);
        return;
      }
      const created = {
        id: `bank-${Date.now()}`,
        name: cleanName,
        accountHint: bankForm.accountHint.trim(),
        color: bankForm.color || BANK_COLOR_PALETTE[banks.length % BANK_COLOR_PALETTE.length],
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setBanks(prev => [...prev, created]);
      showToast(`Added bank "${cleanName}"`);
    }

    setShowBankModal(false);
    setEditingBank(null);
    setBankForm({ name: '', accountHint: '', color: BANK_COLOR_PALETTE[0] });
  };

  const handleDeleteBank = (bankObj) => {
    setBanks(prev => prev.filter(b => b.id !== bankObj.id));
    setUploadedFiles(prev => prev.filter(f => f.bank !== bankObj.name));
    setTxns(prev => prev.filter(t => t.bank !== bankObj.name));
    if (bankFilter === bankObj.name) setBankFilter('ALL');
    showToast(`Removed bank "${bankObj.name}" and its transactions`);
  };

  const handleSaveFileEdit = () => {
    if (!editingFile) return;
    const cleanName = editingFile.name.trim() || 'Statement';
    const targetBank = ensureBankRegistered(editingFile.bank);

    setUploadedFiles(prev => prev.map(f => f.id === editingFile.id ? { ...f, name: cleanName, bank: targetBank } : f));
    setTxns(prev => prev.map(t => t.fileId === editingFile.id ? { ...t, bank: targetBank, fileName: cleanName } : t));
    setEditingFile(null);
    showToast(`Updated file "${cleanName}"`);
  };

  const handleDeleteFile = (fileObj) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileObj.id));
    setTxns(prev => prev.filter(t => t.fileId !== fileObj.id));
    if (editingFile && editingFile.id === fileObj.id) setEditingFile(null);
    showToast(`Removed file "${fileObj.name}" and its ${fileObj.count} transactions`);
  };

  const detectCategoryWithRules = (narration, type, currentRules = rules) => {
    const s = (narration || '').toLowerCase();
    if (currentRules && currentRules.length) {
      for (const r of currentRules) {
        if (!r || !r.keys) continue;
        for (const rawKey of r.keys) {
          const k = String(rawKey || '').trim().toLowerCase();
          if (k && s.includes(k)) return r.cat;
        }
      }
    }
    if (type === 'CREDIT') return 'Salary & Income';
    if (s.includes('upi/')) return 'Transfers & UPI';
    return 'Uncategorized';
  };

  const executeRulesUpdate = (newRules, successMsgPrefix) => {
    setRules(newRules);
    const { updatedTxns, changedCount } = applyCategorizationRules(txns, newRules);
    if (changedCount > 0) {
      setTxns(updatedTxns);
    }
    showToast(`${successMsgPrefix} • ${changedCount} transaction${changedCount === 1 ? '' : 's'} updated`);
    return changedCount;
  };

  // CATEGORIES MANAGER
  const handleAddCategory = () => {
    const clean = (newCategoryName || '').trim();
    if (!clean) {
      showToast('Please enter a category name', true);
      return;
    }
    if (categories.some(c => c.toLowerCase() === clean.toLowerCase())) {
      showToast('This category already exists', true);
      return;
    }
    const updated = [...categories.filter(c => c !== 'Uncategorized'), clean, 'Uncategorized'];
    setCategories(updated);
    setNewCategoryName('');
    showToast(`Added category "${clean}"`);
  };

  const handleRenameCategory = (oldName, newName) => {
    const clean = (newName || '').trim();
    if (!clean || clean.toLowerCase() === oldName.toLowerCase()) {
      setEditingCategory(null);
      return;
    }
    if (categories.some(c => c.toLowerCase() === clean.toLowerCase())) {
      showToast('A category with this name already exists', true);
      return;
    }
    setCategories(prev => prev.map(c => c === oldName ? clean : c));
    let txnCount = 0;
    setTxns(prev => prev.map(t => {
      if (t.category === oldName) {
        txnCount++;
        return { ...t, category: clean };
      }
      return t;
    }));
    let ruleCount = 0;
    setRules(prev => prev.map(r => {
      if (r.cat === oldName) {
        ruleCount++;
        return { ...r, cat: clean };
      }
      return r;
    }));
    if (categoryFilter === oldName) setCategoryFilter(clean);
    if (ruleCat === oldName) setRuleCat(clean);

    setEditingCategory(null);
    showToast(`Renamed "${oldName}" → "${clean}" (${txnCount} txns, ${ruleCount} rules updated)`);
  };

  const handleDeleteCategory = (catName) => {
    if (catName === 'Uncategorized') {
      showToast('Cannot delete default Uncategorized category', true);
      return;
    }
    if (categories.length <= 1) {
      showToast('At least one category must remain', true);
      return;
    }
    setCategories(prev => prev.filter(c => c !== catName));
    let txnCount = 0;
    setTxns(prev => prev.map(t => {
      if (t.category === catName) {
        txnCount++;
        return { ...t, category: 'Uncategorized' };
      }
      return t;
    }));
    setRules(prev => prev.filter(r => r.cat !== catName));
    if (categoryFilter === catName) setCategoryFilter('ALL');
    if (ruleCat === catName) setRuleCat(categories[0] || 'Uncategorized');

    showToast(`Removed category "${catName}" (${txnCount} txns moved to Uncategorized)`);
  };

  // RULES ENGINE
  const handleAddRule = () => {
    if (!ruleKey.trim()) {
      showToast('Please enter a keyword', true);
      return;
    }
    const rawKeys = ruleKey.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    if (!rawKeys.length) return;

    let cleanedRules = rules.map(r => ({
      ...r,
      keys: r.keys.filter(k => !rawKeys.includes(k.toLowerCase()))
    })).filter(r => r.keys.length > 0 || r.cat.toLowerCase() === ruleCat.toLowerCase());

    const existingIndex = cleanedRules.findIndex(r => r.cat.toLowerCase() === ruleCat.toLowerCase());
    if (existingIndex !== -1) {
      const merged = Array.from(new Set([...rawKeys, ...cleanedRules[existingIndex].keys]));
      cleanedRules[existingIndex] = { ...cleanedRules[existingIndex], keys: merged };
      const [promoted] = cleanedRules.splice(existingIndex, 1);
      cleanedRules.unshift(promoted);
    } else {
      cleanedRules.unshift({ cat: ruleCat, keys: rawKeys });
    }

    setRuleKey('');
    executeRulesUpdate(cleanedRules, `Rule updated for "${ruleCat}"`);
  };

  const handleRemoveKeyword = (catName, keyword) => {
    const cleanKey = keyword.trim().toLowerCase();
    const updatedRules = rules.map(r => {
      if (r.cat === catName) {
        return { ...r, keys: r.keys.filter(k => k.toLowerCase() !== cleanKey) };
      }
      return r;
    }).filter(r => r.keys.length > 0);

    executeRulesUpdate(updatedRules, `Removed keyword "${keyword}" from ${catName}`);
  };

  const handleDeleteRule = (catName) => {
    const updatedRules = rules.filter(r => r.cat !== catName);
    executeRulesUpdate(updatedRules, `Removed rule for "${catName}"`);
  };

  const handleSaveEditRule = () => {
    if (!editingRule) return;
    const cleanKeys = editingRule.keysStr.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    if (!cleanKeys.length) {
      handleDeleteRule(editingRule.cat);
      setEditingRule(null);
      return;
    }
    const updatedRules = rules.map(r => {
      if (r.cat === editingRule.cat) {
        return { ...r, keys: cleanKeys };
      }
      return { ...r, keys: r.keys.filter(k => !cleanKeys.includes(k.toLowerCase())) };
    }).filter(r => r.keys.length > 0);

    setEditingRule(null);
    executeRulesUpdate(updatedRules, `Updated keywords for "${editingRule.cat}"`);
  };

  // BACKUP & RESTORE IMPLEMENTATION
  const handleExportBackup = () => {
    const backupPayload = {
      app: 'FinSight India',
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        banks,
        uploadedFiles,
        categories,
        rules,
        txns
      }
    };
    const jsonStr = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinSight_India_Backup_v${APP_VERSION}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Workspace backup exported successfully');
  };

  const handleRestoreFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const data = parsed.data || parsed;
        if (!data || typeof data !== 'object') throw new Error('Unrecognized backup format');
        setBackupDataToRestore(data);
        setRestoreSelection({
          banks: Array.isArray(data.banks) && data.banks.length > 0,
          files: Array.isArray(data.uploadedFiles) && data.uploadedFiles.length > 0,
          categories: Array.isArray(data.categories) && data.categories.length > 0,
          rules: Array.isArray(data.rules) && data.rules.length > 0,
          txns: Array.isArray(data.txns) && data.txns.length > 0
        });
        setShowRestoreModal(true);
      } catch (err) {
        showToast(`Could not parse backup file: ${err.message}`, true);
      }
    };
    reader.readAsText(file);
    if (restoreFileInputRef.current) restoreFileInputRef.current.value = '';
  };

  const handleConfirmRestore = () => {
    if (!backupDataToRestore) return;
    const data = backupDataToRestore;
    const summaryParts = [];

    if (restoreMode === 'REPLACE') {
      if (restoreSelection.banks && Array.isArray(data.banks)) {
        setBanks(data.banks);
        summaryParts.push(`${data.banks.length} banks`);
      }
      if (restoreSelection.files && Array.isArray(data.uploadedFiles)) {
        setUploadedFiles(data.uploadedFiles);
        summaryParts.push(`${data.uploadedFiles.length} files`);
      }
      if (restoreSelection.categories && Array.isArray(data.categories)) {
        setCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...data.categories])));
        summaryParts.push(`${data.categories.length} categories`);
      }
      if (restoreSelection.rules && Array.isArray(data.rules)) {
        setRules(data.rules);
        summaryParts.push(`${data.rules.length} rules`);
      }
      if (restoreSelection.txns && Array.isArray(data.txns)) {
        setTxns(data.txns);
        summaryParts.push(`${data.txns.length} txns`);
      }
    } else {
      // MERGE mode
      if (restoreSelection.banks && Array.isArray(data.banks)) {
        setBanks(prev => {
          const existingNames = new Set(prev.map(b => b.name.toLowerCase()));
          const toAdd = data.banks.filter(b => !existingNames.has((b.name || '').toLowerCase()));
          return [...prev, ...toAdd];
        });
        summaryParts.push(`banks merged`);
      }
      if (restoreSelection.files && Array.isArray(data.uploadedFiles)) {
        setUploadedFiles(prev => {
          const existingIds = new Set(prev.map(f => f.id));
          const toAdd = data.uploadedFiles.filter(f => !existingIds.has(f.id));
          return [...toAdd, ...prev];
        });
        summaryParts.push(`files merged`);
      }
      if (restoreSelection.categories && Array.isArray(data.categories)) {
        setCategories(prev => Array.from(new Set([...prev, ...data.categories])));
        summaryParts.push(`categories merged`);
      }
      if (restoreSelection.rules && Array.isArray(data.rules)) {
        setRules(prev => {
          const map = new Map();
          prev.forEach(r => map.set(r.cat.toLowerCase(), { cat: r.cat, keys: [...r.keys] }));
          data.rules.forEach(r => {
            const k = r.cat.toLowerCase();
            if (map.has(k)) {
              const mergedKeys = Array.from(new Set([...map.get(k).keys, ...r.keys]));
              map.set(k, { cat: r.cat, keys: mergedKeys });
            } else {
              map.set(k, r);
            }
          });
          return Array.from(map.values());
        });
        summaryParts.push(`rules merged`);
      }
      if (restoreSelection.txns && Array.isArray(data.txns)) {
        setTxns(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const toAdd = data.txns.filter(t => !existingIds.has(t.id));
          return [...toAdd, ...prev];
        });
        summaryParts.push(`txns merged`);
      }
    }

    setShowRestoreModal(false);
    setBackupDataToRestore(null);
    showToast(`Restored: ${summaryParts.join(', ')}`);
  };

  // Tabular matrix parser with UBI and multi-bank support
  const parseSheetMatrix = (matrix, fileName, fileId, preferredBank) => {
    const detected = autoDetectBankName(fileName + ' ' + JSON.stringify(matrix.slice(0, 25)), banks);
    const resolvedBank = preferredBank && preferredBank !== 'AUTO'
      ? preferredBank
      : (detected || (banks[0] ? banks[0].name : fileName.split('.')[0].slice(0, 16) || 'Primary Bank'));

    let headerRowIdx = -1;
    let colMap = { date: -1, narration: -1, debit: -1, credit: -1, amount: -1, type: -1, ref: -1 };

    for (let i = 0; i < Math.min(matrix.length, 35); i++) {
      const row = (matrix[i] || []).map(c => String(c || '').toLowerCase().trim());
      const hasDate = row.some(c => c.includes('date') || c.includes('dt') || c.includes('tran date') || c.includes('txndate'));
      const hasNarr = row.some(c => c.includes('narration') || c.includes('description') || c.includes('particular') || c.includes('remarks') || c.includes('details'));
      if (hasDate && (hasNarr || row.length >= 3)) {
        headerRowIdx = i;
        row.forEach((cell, idx) => {
          if (colMap.date === -1 && (cell.includes('date') || cell.includes('txn dt') || cell.includes('value dt') || cell.includes('tran date') || cell.includes('txndate') || cell.includes('transaction date'))) colMap.date = idx;
          if (colMap.narration === -1 && (cell.includes('narration') || cell.includes('description') || cell.includes('particular') || cell.includes('remarks') || cell.includes('details'))) colMap.narration = idx;
          if (colMap.debit === -1 && (cell.includes('debit') || cell.includes('withdrawal') || cell.includes('dr'))) colMap.debit = idx;
          if (colMap.credit === -1 && (cell.includes('credit') || cell.includes('deposit') || cell.includes('cr'))) colMap.credit = idx;
          if (colMap.amount === -1 && cell.includes('amount') && !cell.includes('withdrawal') && !cell.includes('deposit')) colMap.amount = idx;
          if (colMap.type === -1 && (cell === 'type' || cell.includes('dr/cr') || cell.includes('cr/dr'))) colMap.type = idx;
          if (colMap.ref === -1 && (cell.includes('tran id') || cell.includes('chq') || cell.includes('ref no') || cell.includes('cheque'))) colMap.ref = idx;
        });
        break;
      }
    }

    const parsedTxns = [];
    const startIdx = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;

    for (let i = startIdx; i < matrix.length; i++) {
      const row = matrix[i];
      if (!row || row.length < 2) continue;

      let dateRaw = colMap.date !== -1 ? row[colMap.date] : row[0];
      let narrRaw = colMap.narration !== -1 ? row[colMap.narration] : row[1];
      if (!narrRaw && row.length > 2) narrRaw = row[2];

      let debit = colMap.debit !== -1 ? parseAmount(row[colMap.debit]) : 0;
      let credit = colMap.credit !== -1 ? parseAmount(row[colMap.credit]) : 0;
      let amt = colMap.amount !== -1 ? parseAmount(row[colMap.amount]) : 0;

      if (colMap.debit === -1 && colMap.credit === -1 && colMap.amount === -1) {
        const nums = row.slice(2).map(parseAmount).filter(n => n > 0);
        if (nums.length >= 1) debit = nums[0];
      }

      let type = 'DEBIT';
      let finalAmount = 0;

      if (credit > 0 && debit === 0) {
        type = 'CREDIT';
        finalAmount = credit;
      } else if (debit > 0) {
        type = 'DEBIT';
        finalAmount = debit;
      } else if (amt > 0) {
        finalAmount = amt;
        const typeCell = colMap.type !== -1 ? String(row[colMap.type] || '').toUpperCase() : String(row.join(' ')).toUpperCase();
        type = (typeCell.includes('CR') || typeCell.includes('CREDIT')) ? 'CREDIT' : 'DEBIT';
      }

      const narrStr = String(narrRaw || '').trim();
      if (finalAmount > 0 && narrStr && !narrStr.toLowerCase().includes('opening balance') && !narrStr.toLowerCase().includes('closing balance')) {
        parsedTxns.push({
          id: `imp-${fileId}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          fileId,
          fileName,
          date: normalizeDate(dateRaw),
          narration: narrStr,
          amount: finalAmount,
          type,
          bank: resolvedBank,
          channel: detectChannel(narrStr),
          category: detectCategoryWithRules(narrStr, type)
        });
      }
    }
    return { parsedTxns, resolvedBank };
  };

  // PDF Parser with UBI, password unlocking, and flexible date patterns
  const parsePdfBuffer = async (arrayBuffer, fileName, fileId, preferredBank, password = '') => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password: password || undefined });
      const pdf = await loadingTask.promise;
      let fullLines = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const itemsByY = {};
        textContent.items.forEach(item => {
          const y = Math.round(item.transform[5] / 4) * 4;
          if (!itemsByY[y]) itemsByY[y] = [];
          itemsByY[y].push({ x: item.transform[4], str: item.str });
        });
        const sortedY = Object.keys(itemsByY).map(Number).sort((a, b) => b - a);
        sortedY.forEach(y => {
          const lineStr = itemsByY[y].sort((a, b) => a.x - b.x).map(i => i.str).join(' ').trim();
          if (lineStr) fullLines.push(lineStr);
        });
      }

      const detected = autoDetectBankName(fileName + ' ' + fullLines.slice(0, 30).join(' '), banks);
      const resolvedBank = preferredBank && preferredBank !== 'AUTO'
        ? preferredBank
        : (detected || (banks[0] ? banks[0].name : fileName.split('.')[0].slice(0, 16) || 'Primary Bank'));

      const parsedTxns = [];
      const dateRegex = /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}[\/\-][A-Za-z]{3}[\/\-]\d{2,4}|\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4})\s+(.+)/;

      fullLines.forEach((line, idx) => {
        const match = line.match(dateRegex);
        if (match) {
          const rawDate = match[1];
          const rest = match[2];
          const numMatches = rest.match(/[\d,]+\.\d{2}/g);
          if (numMatches && numMatches.length >= 1) {
            const amountVal = parseAmount(numMatches[0]);
            const narrClean = rest.replace(/[\d,]+\.\d{2}/g, '').replace(/\s+/g, ' ').trim();
            if (amountVal > 0 && narrClean.length > 2) {
              const isCredit = /\b(CR|CREDIT|NEFT CR|SALARY|DEP|DEPOSIT|REFUND)\b/i.test(line);
              const type = isCredit ? 'CREDIT' : 'DEBIT';
              parsedTxns.push({
                id: `pdf-${fileId}-${idx}`,
                fileId,
                fileName,
                date: normalizeDate(rawDate),
                narration: narrClean.slice(0, 90),
                amount: amountVal,
                type,
                bank: resolvedBank,
                channel: detectChannel(narrClean),
                category: detectCategoryWithRules(narrClean, type)
              });
            }
          }
        }
      });

      return { success: true, txns: parsedTxns, resolvedBank };
    } catch (err) {
      if (err && (err.name === 'PasswordException' || String(err.message || '').toLowerCase().includes('password'))) {
        return { needsPassword: true };
      }
      return { success: false, error: err.message || 'Could not parse PDF' };
    }
  };

  const triggerFilePicker = (targetBank = 'AUTO') => {
    setUploadTargetBank(targetBank);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let totalAdded = 0;

    for (const file of files) {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      try {
        const ext = file.name.split('.').pop().toLowerCase();
        const buf = await file.arrayBuffer();

        if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
          const wb = XLSX.read(buf, { type: 'array' });
          let fileTxns = [];
          let finalBank = '';
          wb.SheetNames.forEach(sheetName => {
            const sheet = wb.Sheets[sheetName];
            const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            const { parsedTxns, resolvedBank } = parseSheetMatrix(matrix, file.name, fileId, uploadTargetBank);
            fileTxns = [...fileTxns, ...parsedTxns];
            if (resolvedBank) finalBank = resolvedBank;
          });

          if (fileTxns.length > 0) {
            const bankName = ensureBankRegistered(finalBank);
            setTxns(prev => [...fileTxns, ...prev]);
            totalAdded += fileTxns.length;
            setUploadedFiles(prev => [{
              id: fileId,
              name: file.name,
              format: ext.toUpperCase(),
              count: fileTxns.length,
              bank: bankName,
              uploadedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            }, ...prev]);
          } else {
            showToast(`No valid transactions found in ${file.name}`, true);
          }
        } else if (ext === 'pdf') {
          const res = await parsePdfBuffer(buf, file.name, fileId, uploadTargetBank);
          if (res.needsPassword) {
            setPendingPdf({ buffer: buf, name: file.name, fileId, targetBank: uploadTargetBank });
            return;
          } else if (res.success && res.txns.length > 0) {
            const bankName = ensureBankRegistered(res.resolvedBank);
            setTxns(prev => [...res.txns, ...prev]);
            totalAdded += res.txns.length;
            setUploadedFiles(prev => [{
              id: fileId,
              name: file.name,
              format: 'PDF',
              count: res.txns.length,
              bank: bankName,
              uploadedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            }, ...prev]);
          } else {
            showToast(`Parsed 0 rows from ${file.name}. Try XLSX/CSV export if scanned PDF.`, true);
          }
        }
      } catch (err) {
        showToast(`Error reading ${file.name}: ${err.message}`, true);
      }
    }

    if (totalAdded > 0) {
      showToast(`Imported ${totalAdded} transactions!`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitPdfPassword = async () => {
    if (!pendingPdf) return;
    const res = await parsePdfBuffer(pendingPdf.buffer, pendingPdf.name, pendingPdf.fileId, pendingPdf.targetBank, pdfPassword);
    if (res.needsPassword) {
      showToast('Incorrect PDF password. Please try again.', true);
    } else if (res.success && res.txns.length > 0) {
      const bankName = ensureBankRegistered(res.resolvedBank);
      setTxns(prev => [...res.txns, ...prev]);
      setUploadedFiles(prev => [{
        id: pendingPdf.fileId,
        name: pendingPdf.name,
        format: 'PDF',
        count: res.txns.length,
        bank: bankName,
        uploadedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      }, ...prev]);
      showToast(`Unlocked & imported ${res.txns.length} transactions!`);
      setPendingPdf(null);
      setPdfPassword('');
    } else {
      showToast('PDF unlocked, but no tabular transactions matched.', true);
      setPendingPdf(null);
      setPdfPassword('');
    }
  };

  const handleSaveEdit = () => {
    if (!editingTxn) return;
    const bankName = ensureBankRegistered(editingTxn.bank || 'Primary Bank');
    setTxns(prev => prev.map(t => t.id === editingTxn.id ? { ...editingTxn, bank: bankName, amount: parseFloat(editingTxn.amount) || 0 } : t));
    setEditingTxn(null);
    showToast('Transaction updated');
  };

  const handleDeleteTxn = (id) => {
    const target = txns.find(t => t.id === id);
    setTxns(prev => prev.filter(t => t.id !== id));
    if (target && target.fileId) {
      setUploadedFiles(prev => prev.map(f => f.id === target.fileId ? { ...f, count: Math.max(0, f.count - 1) } : f));
    }
    if (editingTxn && editingTxn.id === id) setEditingTxn(null);
    showToast('Transaction deleted');
  };

  const handleAddManualTxn = () => {
    const amt = parseFloat(newTxnForm.amount);
    const chosenBank = (newTxnForm.bank || (banks[0] ? banks[0].name : '')).trim();
    if (!newTxnForm.narration || isNaN(amt) || amt <= 0 || !chosenBank) {
      showToast('Please enter narration, amount, and bank name', true);
      return;
    }
    const bankName = ensureBankRegistered(chosenBank);
    const created = {
      ...newTxnForm,
      bank: bankName,
      id: `manual-${Date.now()}`,
      amount: amt
    };
    setTxns(prev => [created, ...prev]);
    setShowAddModal(false);
    setNewTxnForm({
      date: new Date().toISOString().slice(0, 10),
      narration: '',
      amount: '',
      type: 'DEBIT',
      bank: bankName,
      channel: 'UPI',
      category: categories[0] || 'Food & Dining'
    });
    showToast('Transaction added');
  };

  const exportCsv = () => {
    if (!filtered.length) {
      showToast('No transactions to export', true);
      return;
    }
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `FinSight_v${APP_VERSION}_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Exported filtered statement to XLSX');
  };

  // Date Range Bounds calculation
  const dateRangeBounds = useMemo(() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (datePreset === '7D') {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { start: toYMD(past), end: toYMD(now) };
    }
    if (datePreset === '30D') {
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { start: toYMD(past), end: toYMD(now) };
    }
    if (datePreset === 'THIS_MONTH') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: toYMD(start), end: toYMD(end) };
    }
    if (datePreset === '3M') {
      const past = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      return { start: toYMD(past), end: toYMD(now) };
    }
    if (datePreset === 'THIS_YEAR') {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return { start: toYMD(start), end: toYMD(end) };
    }
    if (datePreset === 'CUSTOM') {
      return { start: customFrom || null, end: customTo || null };
    }
    return { start: null, end: null };
  }, [datePreset, customFrom, customTo]);

  const filtered = useMemo(() => {
    return txns.filter(t => {
      if (bankFilter !== 'ALL' && t.bank !== bankFilter) return false;
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (dateRangeBounds.start && t.date < dateRangeBounds.start) return false;
      if (dateRangeBounds.end && t.date > dateRangeBounds.end) return false;
      if (search && !t.narration.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase()) && !(t.bank || '').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [txns, bankFilter, categoryFilter, typeFilter, search, dateRangeBounds]);

  // TOTALS COMPUTATION (Respects Internal Transfer Exclusion)
  const totals = useMemo(() => {
    const credit = filtered
      .filter(t => t.type === 'CREDIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .reduce((a, b) => a + b.amount, 0);

    const debit = filtered
      .filter(t => t.type === 'DEBIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .reduce((a, b) => a + b.amount, 0);

    const net = credit - debit;
    const savingsRate = credit > 0 ? Math.max(0, ((credit - debit) / credit) * 100).toFixed(1) : '0.0';
    return { credit, debit, net, savingsRate };
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  const periodGroups = useMemo(() => {
    const map = {};
    filtered.forEach(t => {
      // Exclude transfers if option enabled
      if (excludeTransfersFromTotals && transferMap.has(t.id)) return;

      const d = t.date || '2026-01-01';
      const [yr, mo] = d.split('-');
      const q = `Q${Math.ceil((parseInt(mo || '1', 10)) / 3)}`;
      let key = d;
      if (granularity === 'MONTHLY') key = `${yr}-${mo}`;
      if (granularity === 'QUARTERLY') key = `${yr}-${q}`;
      if (granularity === 'YEARLY') key = `${yr}`;
      if (!map[key]) map[key] = { period: key, credit: 0, debit: 0, net: 0, count: 0 };
      if (t.type === 'CREDIT') map[key].credit += t.amount;
      else map[key].debit += t.amount;
      map[key].net = map[key].credit - map[key].debit;
      map[key].count += 1;
    });
    return Object.values(map).sort((a, b) => a.period.localeCompare(b.period));
  }, [filtered, granularity, excludeTransfersFromTotals, transferMap]);

  // CATEGORY SPEND BREAKDOWN (DEBITS)
  const categorySpendBreakdown = useMemo(() => {
    const map = {};
    let totalDebit = 0;
    filtered
      .filter(t => t.type === 'DEBIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
        totalDebit += t.amount;
      });
    return {
      total: totalDebit,
      items: Object.entries(map)
        .map(([name, value]) => ({
          name,
          value,
          pct: totalDebit > 0 ? ((value / totalDebit) * 100).toFixed(1) : '0'
        }))
        .sort((a, b) => b.value - a.value)
    };
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // CATEGORY EARNING BREAKDOWN (CREDITS)
  const categoryEarnBreakdown = useMemo(() => {
    const map = {};
    let totalCredit = 0;
    filtered
      .filter(t => t.type === 'CREDIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
        totalCredit += t.amount;
      });
    return {
      total: totalCredit,
      items: Object.entries(map)
        .map(([name, value]) => ({
          name,
          value,
          pct: totalCredit > 0 ? ((value / totalCredit) * 100).toFixed(1) : '0'
        }))
        .sort((a, b) => b.value - a.value)
    };
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // COMBINED NET FLOW BY CATEGORY (SPEND VS EARN)
  const categoryCombinedBreakdown = useMemo(() => {
    const allCats = new Set([...categories]);
    const res = [];
    allCats.forEach(cat => {
      const spend = filtered
        .filter(t => t.category === cat && t.type === 'DEBIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
        .reduce((sum, t) => sum + t.amount, 0);

      const earn = filtered
        .filter(t => t.category === cat && t.type === 'CREDIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
        .reduce((sum, t) => sum + t.amount, 0);

      if (spend > 0 || earn > 0) {
        res.push({
          name: cat,
          spend,
          earn,
          net: earn - spend
        });
      }
    });
    return res.sort((a, b) => (b.spend + b.earn) - (a.spend + a.earn));
  }, [filtered, categories, excludeTransfersFromTotals, transferMap]);

  // Outflow by Channel (Spend)
  const channelBreakdown = useMemo(() => {
    const map = {};
    filtered
      .filter(t => t.type === 'DEBIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .forEach(t => {
        map[t.channel || 'OTHER'] = (map[t.channel || 'OTHER'] || 0) + t.amount;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // Inflow by Channel (Earnings)
  const inflowChannelBreakdown = useMemo(() => {
    const map = {};
    filtered
      .filter(t => t.type === 'CREDIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .forEach(t => {
        map[t.channel || 'OTHER'] = (map[t.channel || 'OTHER'] || 0) + t.amount;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // Top Payees & Merchants (Spend)
  const topMerchants = useMemo(() => {
    const map = {};
    filtered
      .filter(t => t.type === 'DEBIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .forEach(t => {
        const label = t.narration.split('/').slice(0, 3).join('/').slice(0, 28);
        if (!map[label]) map[label] = { name: label, amount: 0, count: 0, category: t.category };
        map[label].amount += t.amount;
        map[label].count += 1;
      });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // Top Inflow Sources (Earnings)
  const topEarningSources = useMemo(() => {
    const map = {};
    filtered
      .filter(t => t.type === 'CREDIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .forEach(t => {
        const label = t.narration.split('/').slice(0, 3).join('/').slice(0, 28);
        if (!map[label]) map[label] = { name: label, amount: 0, count: 0, category: t.category };
        map[label].amount += t.amount;
        map[label].count += 1;
      });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 select-none">
      {/* Hidden Multi-File Input for Statements */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv,.xlsx,.xls,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Hidden File Input for JSON Backup Restore */}
      <input
        ref={restoreFileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleRestoreFileSelect}
      />

      {/* Top App Bar with Custom FinSight Icon & Version Badge */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FinSightLogo size={38} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white leading-tight">FinSight India</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                v{APP_VERSION}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {banks.length} {banks.length === 1 ? 'Bank' : 'Banks'} • {uploadedFiles.length} Files • {txns.length} Txns
              {transferPairs.length > 0 && (
                <span className="text-sky-400 ml-1">• {transferPairs.length} Transfers</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Backup & Restore Quick Access */}
          <button
            onClick={handleExportBackup}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1"
            title="Download JSON Backup"
          >
            <Download size={13} className="text-sky-400" /> <span className="hidden sm:inline">Backup</span>
          </button>
          {/* Categories Manager Quick Access */}
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1"
            title="Manage Categories"
          >
            <Tag size={13} className="text-emerald-400" /> <span className="hidden sm:inline">Categories</span>
          </button>
          <button
            onClick={() => {
              setEditingBank(null);
              setBankForm({ name: '', accountHint: '', color: BANK_COLOR_PALETTE[banks.length % BANK_COLOR_PALETTE.length] });
              setShowBankModal(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1"
            title="Add Bank"
          >
            <Building2 size={13} /> <span className="hidden sm:inline">+ Bank</span>
          </button>
          <button
            onClick={() => triggerFilePicker(bankFilter !== 'ALL' ? bankFilter : 'AUTO')}
            className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition text-slate-950 font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
          >
            <Upload size={14} /> <span className="hidden xs:inline">Upload</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {statusMsg && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2 border ${statusMsg.isError ? 'bg-rose-950/95 border-rose-700 text-rose-200' : 'bg-emerald-950/95 border-emerald-700 text-emerald-200'}`}>
          <AlertCircle size={14} />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Dynamic User Bank Filter Bar */}
      <div className="bg-slate-900/50 border-b border-slate-900 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setBankFilter('ALL')}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
            bankFilter === 'ALL'
              ? 'bg-emerald-500 text-slate-950 font-semibold'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          All Banks ({banks.length})
        </button>
        {banks.map(b => (
          <button
            key={b.id}
            onClick={() => setBankFilter(b.name)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
              bankFilter === b.name
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color || '#10b981' }} />
            <span>{b.name}</span>
            {b.accountHint && <span className="text-[10px] opacity-75">({b.accountHint})</span>}
          </button>
        ))}
      </div>

      {/* SMART BANK TRANSFERS BANNER / TOGGLE */}
      {transferPairs.length > 0 && (
        <div className="bg-sky-950/40 border-b border-sky-900/60 px-4 py-2 flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={14} className="text-sky-400 shrink-0" />
            <span className="text-slate-200">
              <strong className="text-sky-300">{transferPairs.length} Smart Bank Transfers</strong> detected across your accounts (₹{totalTransfersAmount.toLocaleString('en-IN')})
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-sky-200 font-medium">
            <input
              type="checkbox"
              checked={excludeTransfersFromTotals}
              onChange={e => setExcludeTransfersFromTotals(e.target.checked)}
              className="accent-sky-500 rounded"
            />
            <span>Exclude transfers from spend/earning totals</span>
          </label>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* TAB 1: OVERVIEW & CASHFLOW DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-4">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Inflow</span>
                  <ArrowDownRight size={14} className="text-emerald-400" />
                </div>
                <p className="text-lg font-bold text-emerald-400 mt-1">₹{totals.credit.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {excludeTransfersFromTotals && transferPairs.length > 0 ? 'Excl. internal transfers' : 'All accounts'}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Outflow</span>
                  <ArrowUpRight size={14} className="text-rose-400" />
                </div>
                <p className="text-lg font-bold text-rose-400 mt-1">₹{totals.debit.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {excludeTransfersFromTotals && transferPairs.length > 0 ? 'Excl. internal transfers' : 'All accounts'}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Net Savings</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${totals.net >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {totals.savingsRate}%
                  </span>
                </div>
                <p className={`text-lg font-bold mt-1 ${totals.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totals.net >= 0 ? '+' : ''}₹{totals.net.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Net cashflow surplus</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Internal Transfers</span>
                  <ArrowLeftRight size={14} className="text-sky-400" />
                </div>
                <p className="text-lg font-bold text-sky-400 mt-1">₹{totalTransfersAmount.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{transferPairs.length} transfer pairs linked</p>
              </div>
            </div>

            {/* Granularity & Cashflow Chart */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Multi-Bank Cashflow Trend</h2>
                  <p className="text-[11px] text-slate-400">Monthly, quarterly, or yearly financial movement across your banks</p>
                </div>
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {['DAILY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGranularity(g)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${granularity === g ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {periodGroups.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  <FileSpreadsheet size={28} className="mb-2 text-slate-600" />
                  <p>No transaction data available.</p>
                  <button onClick={() => triggerFilePicker('AUTO')} className="mt-2 text-emerald-400 font-semibold underline">
                    Upload Bank Statement
                  </button>
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={periodGroups} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                      <Bar dataKey="credit" name="Inflow (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="debit" name="Outflow (₹)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORY ANALYSIS (SPEND & EARNING SEPARATELY + NET FLOW) */}
        {activeTab === 'SPEND' && (
          <div className="space-y-4">
            {/* Top Analysis Mode Pill Switcher */}
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                <button
                  onClick={() => setCategoryAnalysisMode('SPEND')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    categoryAnalysisMode === 'SPEND'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingDown size={13} />
                  <span>Spend Breakdown (₹{categorySpendBreakdown.total.toLocaleString('en-IN')})</span>
                </button>
                <button
                  onClick={() => setCategoryAnalysisMode('EARN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    categoryAnalysisMode === 'EARN'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingUp size={13} />
                  <span>Earnings Breakdown (₹{categoryEarnBreakdown.total.toLocaleString('en-IN')})</span>
                </button>
                <button
                  onClick={() => setCategoryAnalysisMode('NET')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    categoryAnalysisMode === 'NET'
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers size={13} />
                  <span>Net Flow / Comparison</span>
                </button>
              </div>

              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 font-medium"
              >
                <Tag size={12} className="text-emerald-400" /> Manage Categories
              </button>
            </div>

            {/* MODE 1: SPEND BREAKDOWN */}
            {categoryAnalysisMode === 'SPEND' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Donut Chart & List */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Outflow by Category</h2>
                    <span className="text-xs font-bold text-rose-400">₹{categorySpendBreakdown.total.toLocaleString('en-IN')}</span>
                  </div>

                  {categorySpendBreakdown.items.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-10">No debit transactions found in selected range.</p>
                  ) : (
                    <>
                      <div className="h-56 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categorySpendBreakdown.items}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={82}
                              paddingAngle={3}
                            >
                              {categorySpendBreakdown.items.map((entry, index) => (
                                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                              formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {categorySpendBreakdown.items.map((c, i) => (
                          <div
                            key={c.name}
                            onClick={() => {
                              setCategoryFilter(c.name);
                              setTypeFilter('DEBIT');
                              setActiveTab('LEDGER');
                            }}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 cursor-pointer border border-slate-800/60"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              <span className="text-xs font-medium text-slate-200">{c.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-rose-400">₹{c.value.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-slate-400 ml-1.5">({c.pct}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Spend Channel & Top Payees */}
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                    <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Outflow by Channel (UPI / NACH / NEFT / POS)</h2>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={channelBreakdown} layout="vertical">
                          <XAxis type="number" stroke="#64748b" fontSize={11} />
                          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={55} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                            formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                          />
                          <Bar dataKey="value" name="Outflow (₹)" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                    <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top Spend Merchants & Payees</h2>
                    <div className="divide-y divide-slate-800 text-xs">
                      {topMerchants.map((m, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-200 truncate max-w-[200px]">{m.name}</p>
                            <p className="text-[10px] text-slate-400">{m.category} • {m.count} txns</p>
                          </div>
                          <span className="font-bold text-rose-400">₹{m.amount.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: EARNINGS BREAKDOWN */}
            {categoryAnalysisMode === 'EARN' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Donut Chart & List */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Earnings / Inflow by Category</h2>
                    <span className="text-xs font-bold text-emerald-400">₹{categoryEarnBreakdown.total.toLocaleString('en-IN')}</span>
                  </div>

                  {categoryEarnBreakdown.items.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-10">No credit/income transactions found in selected range.</p>
                  ) : (
                    <>
                      <div className="h-56 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryEarnBreakdown.items}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={82}
                              paddingAngle={3}
                            >
                              {categoryEarnBreakdown.items.map((entry, index) => (
                                <Cell key={entry.name} fill={EARN_COLORS[index % EARN_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                              formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {categoryEarnBreakdown.items.map((c, i) => (
                          <div
                            key={c.name}
                            onClick={() => {
                              setCategoryFilter(c.name);
                              setTypeFilter('CREDIT');
                              setActiveTab('LEDGER');
                            }}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 cursor-pointer border border-slate-800/60"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: EARN_COLORS[i % EARN_COLORS.length] }} />
                              <span className="text-xs font-medium text-slate-200">{c.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-emerald-400">₹{c.value.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-slate-400 ml-1.5">({c.pct}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Earning Channel & Top Sources */}
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                    <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Inflow by Channel (NEFT / IMPS / UPI / ACH)</h2>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={inflowChannelBreakdown} layout="vertical">
                          <XAxis type="number" stroke="#64748b" fontSize={11} />
                          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={55} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                            formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                          />
                          <Bar dataKey="value" name="Inflow (₹)" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                    <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top Income Sources & Payers</h2>
                    <div className="divide-y divide-slate-800 text-xs">
                      {topEarningSources.map((m, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-200 truncate max-w-[200px]">{m.name}</p>
                            <p className="text-[10px] text-slate-400">{m.category} • {m.count} txns</p>
                          </div>
                          <span className="font-bold text-emerald-400">₹{m.amount.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODE 3: COMBINED DUAL VIEW / NET FLOW */}
            {categoryAnalysisMode === 'NET' && (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Spend vs Earning Net Flow Comparison</h2>
                    <p className="text-[11px] text-slate-400">Compare incoming earnings against outgoing expenses across every category</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-rose-400 font-semibold">Total Outflow: ₹{categorySpendBreakdown.total.toLocaleString('en-IN')}</span>
                    <span className="text-emerald-400 font-semibold">Total Inflow: ₹{categoryEarnBreakdown.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs overflow-x-auto">
                  <div className="py-2 grid grid-cols-12 font-bold text-slate-400 border-b border-slate-800 text-[11px]">
                    <span className="col-span-4">Category</span>
                    <span className="col-span-3 text-right">Spend (Outflow)</span>
                    <span className="col-span-3 text-right">Earning (Inflow)</span>
                    <span className="col-span-2 text-right">Net Flow</span>
                  </div>

                  {categoryCombinedBreakdown.map(item => (
                    <div key={item.name} className="py-2.5 grid grid-cols-12 items-center hover:bg-slate-800/40 px-1 rounded-lg">
                      <span className="col-span-4 font-semibold text-slate-200 truncate">{item.name}</span>
                      <span className="col-span-3 text-right text-rose-400 font-medium">
                        {item.spend > 0 ? `₹${item.spend.toLocaleString('en-IN')}` : '—'}
                      </span>
                      <span className="col-span-3 text-right text-emerald-400 font-medium">
                        {item.earn > 0 ? `₹${item.earn.toLocaleString('en-IN')}` : '—'}
                      </span>
                      <span className={`col-span-2 text-right font-bold ${item.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.net >= 0 ? '+' : ''}₹{item.net.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRANSACTIONS LEDGER (With Duration Filter & Smart Bank Transfer Badges) */}
        {activeTab === 'LEDGER' && txns.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            {/* Search and Filters Header */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search narration, merchant, category, or bank..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200"
                >
                  <option value="ALL">All Categories ({categories.length})</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200"
                >
                  <option value="ALL">All Types</option>
                  <option value="DEBIT">Debit Only</option>
                  <option value="CREDIT">Credit Only</option>
                </select>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* DURATION / DATE-RANGE FILTER BAR */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <Calendar size={13} className="text-emerald-400" />
                  <span>Duration Filter:</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: 'ALL', label: 'All Time' },
                    { id: '7D', label: 'Last 7 Days' },
                    { id: '30D', label: 'Last 30 Days' },
                    { id: 'THIS_MONTH', label: 'This Month' },
                    { id: '3M', label: 'Last 3 Months' },
                    { id: 'THIS_YEAR', label: 'This Year' },
                    { id: 'CUSTOM', label: 'Custom' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setDatePreset(p.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                        datePreset === p.id
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {datePreset === 'CUSTOM' && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">From:</span>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={e => setCustomFrom(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">To:</span>
                    <input
                      type="date"
                      value={customTo}
                      onChange={e => setCustomTo(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                    />
                  </div>
                  {(customFrom || customTo) && (
                    <button
                      onClick={() => { setCustomFrom(''); setCustomTo(''); }}
                      className="text-xs text-rose-400 hover:underline px-1.5 py-1"
                    >
                      Clear Dates
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 flex-wrap gap-1">
              <span>
                Showing {filtered.length} of {txns.length} transactions
                {dateRangeBounds.start && dateRangeBounds.end && ` (${dateRangeBounds.start} to ${dateRangeBounds.end})`}
              </span>
              <div className="flex items-center gap-2">
                {categoryFilter !== 'ALL' && (
                  <button onClick={() => setCategoryFilter('ALL')} className="text-emerald-400 underline">
                    Clear Category
                  </button>
                )}
                {datePreset !== 'ALL' && (
                  <button onClick={() => setDatePreset('ALL')} className="text-emerald-400 underline">
                    Reset Date Filter
                  </button>
                )}
              </div>
            </div>

            {/* TRANSACTIONS LIST WITH SMART TRANSFER BADGES */}
            <div className="divide-y divide-slate-800/80 text-xs max-h-[58vh] overflow-y-auto">
              {filtered.map(t => {
                const transferInfo = transferMap.get(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => setEditingTxn({ ...t })}
                    className="py-3 px-2 hover:bg-slate-800/50 rounded-xl flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-100">{t.narration}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                          {t.bank}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                          {t.channel}
                        </span>
                        {/* SMART BANK TRANSFER BADGE */}
                        {transferInfo && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const partner = txns.find(p => p.id === transferInfo.partnerTxnId);
                              if (partner) setSelectedTransferPair({ main: t, partner });
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1 font-medium hover:bg-sky-500/25"
                            title="Click to view paired transfer"
                          >
                            <ArrowLeftRight size={10} />
                            <span>
                              Transfer {transferInfo.isDebit ? `${t.bank} ➔ ${transferInfo.partnerBank}` : `${transferInfo.partnerBank} ➔ ${t.bank}`}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{t.date}</span>
                        <span>•</span>
                        <span className="text-sky-400 font-medium">{t.category}</span>
                        {t.fileName && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 truncate max-w-[140px]">{t.fileName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm whitespace-nowrap ${t.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </span>
                      <Edit3 size={13} className="text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: BANKS, FILES, CATEGORIES, RULES & BACKUP MANAGER */}
        {activeTab === 'BANKS' && (
          <div className="space-y-4">
            {/* Section 1: Banks Manager */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 size={15} className="text-emerald-400" /> My Banks ({banks.length})
                  </h2>
                  <p className="text-[11px] text-slate-400">Add, edit, or remove banks and upload statements directly to a specific bank</p>
                </div>
                <button
                  onClick={() => {
                    setEditingBank(null);
                    setBankForm({ name: '', accountHint: '', color: BANK_COLOR_PALETTE[banks.length % BANK_COLOR_PALETTE.length] });
                    setShowBankModal(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                >
                  <Plus size={14} /> Add Bank
                </button>
              </div>

              {banks.length === 0 ? (
                <div className="bg-slate-950/70 border border-dashed border-slate-800 rounded-xl p-5 text-center space-y-2">
                  <p className="text-xs text-slate-400">No banks added yet. Add a bank manually or upload a statement file to auto-create one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {banks.map(b => {
                    const bankFiles = uploadedFiles.filter(f => f.bank === b.name);
                    const bankTxns = txns.filter(t => t.bank === b.name);
                    return (
                      <div key={b.id} className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between gap-2.5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: b.color || '#10b981' }} />
                            <div>
                              <h3 className="text-xs font-bold text-white">{b.name}</h3>
                              <p className="text-[10px] text-slate-400">
                                {b.accountHint ? `A/C: ${b.accountHint} • ` : ''}{bankFiles.length} files • {bankTxns.length} txns
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingBank(b);
                                setBankForm({ name: b.name, accountHint: b.accountHint || '', color: b.color || BANK_COLOR_PALETTE[0] });
                                setShowBankModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                              title="Edit Bank"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteBank(b)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/60"
                              title="Delete Bank & its Data"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                          <button
                            onClick={() => {
                              setBankFilter(b.name);
                              setActiveTab('DASHBOARD');
                            }}
                            className="text-[11px] text-sky-400 hover:underline font-medium"
                          >
                            View Analytics →
                          </button>
                          <button
                            onClick={() => triggerFilePicker(b.name)}
                            className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1"
                          >
                            <Upload size={11} /> Upload File to {b.name}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 2: Statement Files Manager */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet size={15} className="text-sky-400" /> Uploaded Statement Files ({uploadedFiles.length})
                  </h2>
                  <p className="text-[11px] text-slate-400">Edit file names, reassign files to another bank, or remove specific files</p>
                </div>
                <button
                  onClick={() => triggerFilePicker('AUTO')}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                >
                  <Upload size={14} /> Upload Files
                </button>
              </div>

              {uploadedFiles.length === 0 ? (
                <div
                  onClick={() => triggerFilePicker('AUTO')}
                  className="bg-slate-950/70 border-2 border-dashed border-slate-800 hover:border-emerald-500/40 rounded-xl p-6 text-center cursor-pointer transition space-y-1.5"
                >
                  <Upload size={22} className="mx-auto text-emerald-400" />
                  <p className="text-xs font-semibold text-slate-200">Tap to Upload .XLSX, .CSV, or .PDF Statements</p>
                  <p className="text-[11px] text-slate-400">Auto-detects Union Bank of India (UBI), SBI, HDFC, ICICI, Axis, Kotak, etc.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80 text-xs">
                  {uploadedFiles.map(f => (
                    <div key={f.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-100">{f.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                            {f.bank}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {f.format || 'FILE'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {f.count} transactions • Uploaded {f.uploadedAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setEditingFile({ ...f })}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                          title="Edit File Name or Reassign Bank"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(f)}
                          className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800"
                          title="Remove File & its Transactions"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: Categories Manager UI */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={15} className="text-emerald-400" /> Categories Manager ({categories.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">Add, rename (cascades to all transactions and rules), or delete categories</p>
                </div>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1"
                >
                  <Layers size={13} /> Manage All
                </button>
              </div>

              {/* Add New Category Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="New category name (e.g. Subscriptions, Pet Care)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
                />
                <button
                  onClick={handleAddCategory}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {/* Category Badges Grid */}
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map(c => {
                  const count = txns.filter(t => t.category === c).length;
                  return (
                    <div
                      key={c}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-slate-200"
                    >
                      <span className="font-medium">{c}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded-full">{count}</span>
                      <button
                        onClick={() => setEditingCategory({ oldName: c, newName: c })}
                        className="text-slate-400 hover:text-white p-0.5"
                        title="Rename Category"
                      >
                        <Edit3 size={11} />
                      </button>
                      {c !== 'Uncategorized' && (
                        <button
                          onClick={() => handleDeleteCategory(c)}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                          title="Delete Category"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Interactive Auto-Categorization Rules List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={15} className="text-purple-400" /> Interactive Auto-Categorization Rules ({rules.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Match merchant keywords in narrations to assign categories. Modifying rules immediately re-evaluates all transactions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const { updatedTxns, changedCount } = applyCategorizationRules(txns, rules);
                    if (changedCount > 0) setTxns(updatedTxns);
                    showToast(`Re-evaluated ${txns.length} transactions (${changedCount} updated)`);
                  }}
                  className="bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 font-semibold"
                  title="Re-apply all rules across all transactions"
                >
                  <RefreshCw size={12} /> Re-apply Rules
                </button>
              </div>

              {/* Add Keyword Rule Form */}
              <div className="flex flex-col sm:flex-row gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <input
                  type="text"
                  value={ruleKey}
                  onChange={e => setRuleKey(e.target.value)}
                  placeholder="Keyword(s) in narration (comma-separated, e.g. ubi, zepto, netflix)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  onKeyDown={e => { if (e.key === 'Enter') handleAddRule(); }}
                />
                <select
                  value={ruleCat}
                  onChange={e => setRuleCat(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  onClick={handleAddRule}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Add Rule
                </button>
              </div>

              {/* Interactive Rules List */}
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {rules.map((rule, idx) => {
                  const matchedTxnCount = txns.filter(t => t.category === rule.cat).length;
                  return (
                    <div key={rule.cat + idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="text-xs font-bold text-white">{rule.cat}</span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                            {matchedTxnCount} {matchedTxnCount === 1 ? 'txn' : 'txns'}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                            {rule.keys.length} keywords
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingRule({ cat: rule.cat, keysStr: rule.keys.join(', ') })}
                            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Edit Keywords"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.cat)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40"
                            title="Delete Rule"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {rule.keys.map(k => (
                          <span
                            key={k}
                            className="inline-flex items-center gap-1 text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md group hover:border-slate-700"
                          >
                            <span>{k}</span>
                            <button
                              onClick={() => handleRemoveKeyword(rule.cat, k)}
                              className="text-slate-500 group-hover:text-rose-400 ml-0.5"
                              title={`Remove keyword "${k}"`}
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Backup & Restore Data Management */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Database size={15} className="text-sky-400" /> Backup & Restore Workspace Data
                </h3>
                <p className="text-[11px] text-slate-400">
                  Export complete data to a single JSON file or restore with granular item-by-item selection (banks, statement files metadata, categories, rules, and transactions).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleExportBackup}
                  className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3 transition text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition">
                    <Download size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Export JSON Backup</h4>
                    <p className="text-[11px] text-slate-400">Save banks, files, categories, rules & {txns.length} txns</p>
                  </div>
                </button>

                <button
                  onClick={() => { if (restoreFileInputRef.current) restoreFileInputRef.current.click(); }}
                  className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3 transition text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                    <FolderOpen size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Restore from Backup</h4>
                    <p className="text-[11px] text-slate-400">Select what to restore (Merge or Replace)</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Section 6: Clear All Workspace Data */}
            {(banks.length > 0 || txns.length > 0 || uploadedFiles.length > 0) && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-2 justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Reset Workspace</h3>
                  <p className="text-[11px] text-slate-400">FinSight India v{APP_VERSION} • 100% On-Device Privacy Storage</p>
                </div>
                <button
                  onClick={() => {
                    setBanks([]);
                    setTxns([]);
                    setUploadedFiles([]);
                    setBankFilter('ALL');
                    showToast('Removed all banks, files, and transactions');
                  }}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs px-3 py-2 rounded-xl border border-rose-800 flex items-center gap-1 font-semibold"
                >
                  <Trash2 size={13} /> Clear Entire Workspace
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* RESTORE BACKUP MODAL (GRANULAR SELECTION & CONFLICT HANDLING) */}
      {showRestoreModal && backupDataToRestore && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 space-y-4 max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-sky-400" />
                <h3 className="text-sm font-bold text-white">Restore Workspace Backup</h3>
              </div>
              <button onClick={() => setShowRestoreModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 shrink-0">
              Choose which datasets to restore into your workspace:
            </p>

            <div className="space-y-2 text-xs flex-1 overflow-y-auto pr-1">
              {/* Banks Checkbox */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={restoreSelection.banks}
                    onChange={e => setRestoreSelection({ ...restoreSelection, banks: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-200">Banks</span>
                    <p className="text-[10px] text-slate-400">
                      {Array.isArray(backupDataToRestore.banks) ? `${backupDataToRestore.banks.length} banks found in backup` : 'No banks'}
                    </p>
                  </div>
                </div>
                <Building2 size={15} className="text-emerald-400" />
              </label>

              {/* Statement Files Checkbox */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={restoreSelection.files}
                    onChange={e => setRestoreSelection({ ...restoreSelection, files: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-200">Statement Files Metadata</span>
                    <p className="text-[10px] text-slate-400">
                      {Array.isArray(backupDataToRestore.uploadedFiles) ? `${backupDataToRestore.uploadedFiles.length} statement files` : 'No files'}
                    </p>
                  </div>
                </div>
                <FileSpreadsheet size={15} className="text-sky-400" />
              </label>

              {/* Categories Checkbox */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={restoreSelection.categories}
                    onChange={e => setRestoreSelection({ ...restoreSelection, categories: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-200">Custom Categories</span>
                    <p className="text-[10px] text-slate-400">
                      {Array.isArray(backupDataToRestore.categories) ? `${backupDataToRestore.categories.length} categories` : 'No categories'}
                    </p>
                  </div>
                </div>
                <Tag size={15} className="text-emerald-400" />
              </label>

              {/* Rules Checkbox */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={restoreSelection.rules}
                    onChange={e => setRestoreSelection({ ...restoreSelection, rules: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-200">Auto-Categorization Rules</span>
                    <p className="text-[10px] text-slate-400">
                      {Array.isArray(backupDataToRestore.rules) ? `${backupDataToRestore.rules.length} rules with keywords` : 'No rules'}
                    </p>
                  </div>
                </div>
                <Sparkles size={15} className="text-purple-400" />
              </label>

              {/* Transactions Checkbox */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={restoreSelection.txns}
                    onChange={e => setRestoreSelection({ ...restoreSelection, txns: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-200">Transactions Ledger</span>
                    <p className="text-[10px] text-slate-400">
                      {Array.isArray(backupDataToRestore.txns) ? `${backupDataToRestore.txns.length} transactions` : 'No transactions'}
                    </p>
                  </div>
                </div>
                <FileText size={15} className="text-emerald-400" />
              </label>

              {/* Restoration Strategy Mode */}
              <div className="pt-2">
                <label className="text-slate-400 block mb-1.5 font-medium">Restoration Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRestoreMode('MERGE')}
                    className={`p-2 rounded-xl border text-left text-xs ${restoreMode === 'MERGE' ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    Merge with existing
                    <span className="block text-[10px] font-normal opacity-75">Combines without duplicates</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRestoreMode('REPLACE')}
                    className={`p-2 rounded-xl border text-left text-xs ${restoreMode === 'REPLACE' ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    Replace entire data
                    <span className="block text-[10px] font-normal opacity-75">Overwrites with backup</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800 shrink-0">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
              >
                <Check size={14} /> Restore Selected Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMART TRANSFER PAIR DETAILS MODAL */}
      {selectedTransferPair && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-sky-400" />
                <h3 className="text-sm font-bold text-white">Smart Bank Transfer Pair</h3>
              </div>
              <button onClick={() => setSelectedTransferPair(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              These two transactions match as a self-account transfer between your banks for ₹{selectedTransferPair.main.amount.toLocaleString('en-IN')}:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-rose-900/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Debit (Outflow)</span>
                  <span className="font-bold text-rose-400">-₹{selectedTransferPair.main.type === 'DEBIT' ? selectedTransferPair.main.amount.toLocaleString('en-IN') : selectedTransferPair.partner.amount.toLocaleString('en-IN')}</span>
                </div>
                <p className="font-semibold text-slate-100">{selectedTransferPair.main.type === 'DEBIT' ? selectedTransferPair.main.bank : selectedTransferPair.partner.bank}</p>
                <p className="text-[11px] text-slate-400 truncate">{selectedTransferPair.main.type === 'DEBIT' ? selectedTransferPair.main.narration : selectedTransferPair.partner.narration}</p>
                <p className="text-[10px] text-slate-500">{selectedTransferPair.main.type === 'DEBIT' ? selectedTransferPair.main.date : selectedTransferPair.partner.date}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Credit (Inflow)</span>
                  <span className="font-bold text-emerald-400">+₹{selectedTransferPair.main.type === 'CREDIT' ? selectedTransferPair.main.amount.toLocaleString('en-IN') : selectedTransferPair.partner.amount.toLocaleString('en-IN')}</span>
                </div>
                <p className="font-semibold text-slate-100">{selectedTransferPair.main.type === 'CREDIT' ? selectedTransferPair.main.bank : selectedTransferPair.partner.bank}</p>
                <p className="text-[11px] text-slate-400 truncate">{selectedTransferPair.main.type === 'CREDIT' ? selectedTransferPair.main.narration : selectedTransferPair.partner.narration}</p>
                <p className="text-[10px] text-slate-500">{selectedTransferPair.main.type === 'CREDIT' ? selectedTransferPair.main.date : selectedTransferPair.partner.date}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTransferPair(null)}
                className="bg-slate-800 text-slate-200 px-4 py-1.5 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT BANK */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white">{editingBank ? 'Edit Bank' : 'Add Bank'}</h3>
              <button onClick={() => { setShowBankModal(false); setEditingBank(null); }} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Bank Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Union Bank of India, SBI, HDFC Bank, ICICI"
                  value={bankForm.name}
                  onChange={e => setBankForm({ ...bankForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Account Label / Last 4 Digits (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Salary A/C ••4821"
                  value={bankForm.accountHint}
                  onChange={e => setBankForm({ ...bankForm, accountHint: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1.5">Bank Badge Color</label>
                <div className="flex items-center gap-2">
                  {BANK_COLOR_PALETTE.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBankForm({ ...bankForm, color: c })}
                      className={`w-6 h-6 rounded-full border-2 ${bankForm.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => { setShowBankModal(false); setEditingBank(null); }}
                className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBank}
                className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
              >
                <Save size={14} /> {editingBank ? 'Update Bank' : 'Add Bank'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT / REASSIGN UPLOADED FILE */}
      {editingFile && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white">Edit Statement File</h3>
              <button onClick={() => setEditingFile(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">File Display Name</label>
                <input
                  type="text"
                  value={editingFile.name}
                  onChange={e => setEditingFile({ ...editingFile, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Assigned Bank (Reassigning updates all {editingFile.count} txns)</label>
                <input
                  type="text"
                  list="finsight-bank-options"
                  value={editingFile.bank}
                  onChange={e => setEditingFile({ ...editingFile, bank: e.target.value })}
                  placeholder="Enter or select bank name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
                <datalist id="finsight-bank-options">
                  {banks.map(b => <option key={b.id} value={b.name} />)}
                </datalist>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDeleteFile(editingFile)}
                className="bg-rose-950 text-rose-300 border border-rose-800 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 size={13} /> Delete File
              </button>
              <div className="flex gap-2">
                <button onClick={() => setEditingFile(null)} className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs">
                  Cancel
                </button>
                <button onClick={handleSaveFileEdit} className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1">
                  <Save size={13} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT TRANSACTION */}
      {editingTxn && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white">Edit Transaction</h3>
              <button onClick={() => setEditingTxn(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={editingTxn.date}
                  onChange={e => setEditingTxn({ ...editingTxn, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Narration / Description</label>
                <input
                  type="text"
                  value={editingTxn.narration}
                  onChange={e => setEditingTxn({ ...editingTxn, narration: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editingTxn.amount}
                    onChange={e => setEditingTxn({ ...editingTxn, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Type</label>
                  <select
                    value={editingTxn.type}
                    onChange={e => setEditingTxn({ ...editingTxn, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="DEBIT">DEBIT (-)</option>
                    <option value="CREDIT">CREDIT (+)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={editingTxn.category}
                    onChange={e => setEditingTxn({ ...editingTxn, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bank</label>
                  <input
                    type="text"
                    list="finsight-bank-options"
                    value={editingTxn.bank}
                    onChange={e => setEditingTxn({ ...editingTxn, bank: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDeleteTxn(editingTxn.id)}
                className="bg-rose-950 text-rose-300 border border-rose-800 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
              <div className="flex gap-2">
                <button onClick={() => setEditingTxn(null)} className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD MANUAL TRANSACTION */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white">Add Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={newTxnForm.date}
                  onChange={e => setNewTxnForm({ ...newTxnForm, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Narration / Merchant</label>
                <input
                  type="text"
                  placeholder="e.g. UPI/SWIGGY/BANGALORE"
                  value={newTxnForm.narration}
                  onChange={e => setNewTxnForm({ ...newTxnForm, narration: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="1500"
                    value={newTxnForm.amount}
                    onChange={e => setNewTxnForm({ ...newTxnForm, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Type</label>
                  <select
                    value={newTxnForm.type}
                    onChange={e => setNewTxnForm({ ...newTxnForm, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="DEBIT">DEBIT (-)</option>
                    <option value="CREDIT">CREDIT (+)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={newTxnForm.category}
                    onChange={e => setNewTxnForm({ ...newTxnForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bank Name *</label>
                  <input
                    type="text"
                    list="finsight-bank-options"
                    placeholder={banks[0] ? banks[0].name : 'e.g. Union Bank of India'}
                    value={newTxnForm.bank}
                    onChange={e => setNewTxnForm({ ...newTxnForm, bank: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setShowAddModal(false)} className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs">
                Cancel
              </button>
              <button onClick={handleAddManualTxn} className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PASSWORD-PROTECTED PDF */}
      {pendingPdf && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Lock size={18} />
              <h3 className="text-sm font-bold">Password-Protected PDF</h3>
            </div>
            <p className="text-xs text-slate-300">
              Enter the password for <strong>{pendingPdf.name}</strong> to decrypt and analyze transactions locally.
            </p>
            <input
              type="password"
              value={pdfPassword}
              onChange={e => setPdfPassword(e.target.value)}
              placeholder="Enter PDF Password"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setPendingPdf(null); setPdfPassword(''); }}
                className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={submitPdfPassword}
                className="bg-emerald-500 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs"
              >
                Unlock & Parse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: DEDICATED CATEGORIES MANAGER MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 space-y-3 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Categories Manager ({categories.length})</h3>
              </div>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-400 shrink-0">
              Renaming a category automatically updates all associated transactions and categorization rules across your workspace.
            </p>

            <div className="flex gap-2 shrink-0">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="New Category Name (e.g. Subscriptions)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
              />
              <button
                onClick={handleAddCategory}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs overflow-y-auto flex-1 pr-1">
              {categories.map(c => {
                const count = txns.filter(t => t.category === c).length;
                const isEditingThis = editingCategory && editingCategory.oldName === c;
                return (
                  <div key={c} className="py-2.5 flex items-center justify-between gap-2">
                    {isEditingThis ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingCategory.newName}
                          onChange={e => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                          className="bg-slate-950 border border-emerald-500 rounded-lg px-2.5 py-1 text-xs text-white flex-1"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleRenameCategory(editingCategory.oldName, editingCategory.newName);
                            if (e.key === 'Escape') setEditingCategory(null);
                          }}
                        />
                        <button
                          onClick={() => handleRenameCategory(editingCategory.oldName, editingCategory.newName)}
                          className="bg-emerald-500 text-slate-950 font-bold px-2 py-1 rounded-lg text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{c}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                            {count} {count === 1 ? 'txn' : 'txns'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingCategory({ oldName: c, newName: c })}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Rename"
                          >
                            <Edit3 size={13} />
                          </button>
                          {c !== 'Uncategorized' && (
                            <button
                              onClick={() => handleDeleteCategory(c)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/60"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800 shrink-0">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: EDIT RULE KEYWORDS MODAL */}
      {editingRule && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white">Edit Rule: {editingRule.cat}</h3>
              <button onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <label className="text-slate-400 block">Keywords (comma-separated)</label>
              <textarea
                rows={3}
                value={editingRule.keysStr}
                onChange={e => setEditingRule({ ...editingRule, keysStr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-500">
                Saving will immediately re-evaluate transactions matching these keywords.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setEditingRule(null)} className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs">
                Cancel
              </button>
              <button onClick={handleSaveEditRule} className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1">
                <Save size={13} /> Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANDROID BOTTOM NAVIGATION MENU */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-1.5 z-40">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {[
            { id: 'DASHBOARD', label: 'Overview', icon: BarChart3 },
            { id: 'SPEND', label: 'Analysis', icon: PieIcon },
            { id: 'LEDGER', label: 'Transactions', icon: FileText },
            { id: 'BANKS', label: 'Banks & Rules', icon: Building2 }
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                  active ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
