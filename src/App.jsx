import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';

// Data Layers
import {
  APP_VERSION,
  DEFAULT_CATEGORIES,
  DEFAULT_RULES,
  BANK_COLOR_PALETTE
} from './data/constants';
import {
  getIsoWeek,
  getMonthInfo,
  getQuarterInfo,
  getYearInfo,
  getBankBalanceInfo,
  formatBalanceDate
} from './data/balanceEngine';
import {
  parseSheetMatrix,
  parsePdfBuffer,
  autoDetectBankName,
  detectChannel
} from './data/parsers';
import {
  compileRulesEngine,
  detectCategoryWithRules,
  applyCategorizationRules
} from './data/categorizationEngine';
import { detectTransferPairs } from './data/transferEngine';
import {
  exportToXlsx,
  exportToCsv,
  exportToPdf
} from './data/exportEngine';
import {
  loadInitialState,
  saveToStorage,
  createBackupPayload
} from './data/storage';

// Navigation Components
import TopAppBar from './components/navigation/TopAppBar';
import NavigationBar from './components/navigation/NavigationBar';

// View Components
import DashboardView from './components/views/DashboardView';
import AnalysisView from './components/views/AnalysisView';
import LedgerView from './components/views/LedgerView';
import BanksView from './components/views/BanksView';

// Modal Components
import EditTxnModal from './components/modals/EditTxnModal';
import AddTxnModal from './components/modals/AddTxnModal';
import TypePickerModal from './components/modals/TypePickerModal';
import CategoryPickerModal from './components/modals/CategoryPickerModal';
import TypeFilterModal from './components/modals/TypeFilterModal';
import CategoryFilterModal from './components/modals/CategoryFilterModal';
import BankFilterModal from './components/modals/BankFilterModal';
import EditBalanceModal from './components/modals/EditBalanceModal';
import BankModal from './components/modals/BankModal';
import FileEditModal from './components/modals/FileEditModal';
import TransferManagerModal from './components/modals/TransferManagerModal';
import ManualLinkModal from './components/modals/ManualLinkModal';
import CategoryManagerModal from './components/modals/CategoryManagerModal';
import RuleEditModal from './components/modals/RuleEditModal';
import ExportModal from './components/modals/ExportModal';
import BackupModal from './components/modals/BackupModal';
import MerchantDrilldownModal from './components/modals/MerchantDrilldownModal';
import PdfPasswordModal from './components/modals/PdfPasswordModal';
import Toast from './components/common/Toast';

export default function App() {
  // Load persistent state
  const initial = useMemo(() => loadInitialState(), []);

  const [banks, setBanks] = useState(initial.banks);
  const [txns, setTxns] = useState(initial.txns);
  const [uploadedFiles, setUploadedFiles] = useState(initial.uploadedFiles);
  const [categories, setCategories] = useState(initial.categories);
  const [rules, setRules] = useState(initial.rules);
  const [excludeTransfersFromTotals, setExcludeTransfersFromTotals] = useState(initial.excludeTransfers);
  const [manualTransferPairs, setManualTransferPairs] = useState(initial.manualPairs);
  const [unlinkedTransferPairs, setUnlinkedTransferPairs] = useState(initial.unlinkedPairs);
  const [transferClearingDays, setTransferClearingDays] = useState(initial.transferDays);

  // App Navigation & View Modes
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'SPEND' | 'LEDGER' | 'BANKS'
  const [granularity, setGranularity] = useState('MONTHLY');
  const [categoryAnalysisMode, setCategoryAnalysisMode] = useState('SPEND');

  // Filters
  const [search, setSearch] = useState('');
  const [bankFilter, setBankFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'DEBIT' | 'CREDIT'
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [durationMode, setDurationMode] = useState('PRESET'); // 'PRESET' | 'WEEKWISE' | 'MONTHWISE' | 'QUARTERWISE' | 'YEARWISE' | 'CUSTOM'
  const [datePreset, setDatePreset] = useState('ALL');
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Batch Selection
  const [selectedTxnIds, setSelectedTxnIds] = useState([]);

  // Modals & Popups State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [newTxnForm, setNewTxnForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    narration: '',
    amount: '',
    type: 'DEBIT',
    bank: '',
    channel: 'UPI',
    category: 'Food & Dining'
  });

  // Dedicated Type & Category Pickers (v2.0.0)
  const [showTxnTypePickerModal, setShowTxnTypePickerModal] = useState(false);
  const [showTxnCategoryPickerModal, setShowTxnCategoryPickerModal] = useState(false);
  const [typePickerContext, setTypePickerContext] = useState(null); // 'EDIT' | 'NEW' | null
  const [catPickerContext, setCatPickerContext] = useState(null); // 'EDIT' | 'NEW' | 'BULK' | null

  // Filter Modals
  const [showTypeFilterModal, setShowTypeFilterModal] = useState(false);
  const [showCategoryFilterModal, setShowCategoryFilterModal] = useState(false);
  const [showBankFilterModal, setShowBankFilterModal] = useState(false);

  // Bank & File Modals
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [editingBankBalance, setEditingBankBalance] = useState(null);

  // Transfers & Rules Modals
  const [showTransferManagerModal, setShowTransferManagerModal] = useState(false);
  const [manualLinkTargetTxn, setManualLinkTargetTxn] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingRule, setEditingRule] = useState(null);

  // Export & Backup Modals
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [backupDataToRestore, setBackupDataToRestore] = useState(null);

  // Merchant Drilldown Popup (v1.8.0)
  const [selectedMerchantDrilldown, setSelectedMerchantDrilldown] = useState(null);

  // Password-protected PDF statement prompt
  const [pendingPdf, setPendingPdf] = useState(null);

  // File Inputs & Notifications
  const fileInputRef = useRef(null);
  const uploadTargetBankRef = useRef('AUTO');
  const restoreFileInputRef = useRef(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to Storage
  useEffect(() => { saveToStorage('banks', banks); }, [banks]);
  useEffect(() => { saveToStorage('txns', txns); }, [txns]);
  useEffect(() => { saveToStorage('files', uploadedFiles); }, [uploadedFiles]);
  useEffect(() => { saveToStorage('categories', categories); }, [categories]);
  useEffect(() => { saveToStorage('rules', rules); }, [rules]);
  useEffect(() => { saveToStorage('excludeTransfers', excludeTransfersFromTotals); }, [excludeTransfersFromTotals]);
  useEffect(() => { saveToStorage('manualPairs', manualTransferPairs); }, [manualTransferPairs]);
  useEffect(() => { saveToStorage('unlinkedPairs', unlinkedTransferPairs); }, [unlinkedTransferPairs]);
  useEffect(() => { saveToStorage('transferDays', transferClearingDays); }, [transferClearingDays]);

  // Synchronize bank balances on transaction updates
  useEffect(() => {
    if (!banks.length || !txns.length) return;
    let changed = false;
    const updated = banks.map(b => {
      if (b.isManualBalance) return b;
      const info = getBankBalanceInfo(b, txns);
      if (info.hasData && (b.latestBalance !== info.latest || b.initialBalance !== info.initial)) {
        changed = true;
        return {
          ...b,
          initialBalance: info.initial,
          initialBalanceDate: info.initialDate,
          latestBalance: info.latest,
          latestBalanceDate: info.latestDate
        };
      }
      return b;
    });
    if (changed) {
      setBanks(updated);
    }
  }, [txns]);

  // Bank Registration Helper
  const ensureBankRegistered = (bankName) => {
    const clean = (bankName || 'My Bank').trim();
    const existing = banks.find(b => b.name.toLowerCase() === clean.toLowerCase());
    if (existing) return existing.name;

    const newBank = {
      id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: clean,
      accountHint: '',
      color: BANK_COLOR_PALETTE[banks.length % BANK_COLOR_PALETTE.length],
      initialBalance: 0,
      initialBalanceDate: 'No statements',
      latestBalance: 0,
      latestBalanceDate: 'No statements'
    };
    setBanks(prev => [...prev, newBank]);
    return clean;
  };

  // SMART TRANSFERS COMPUTATION
  const transferPairs = useMemo(() => {
    return detectTransferPairs(txns, manualTransferPairs, unlinkedTransferPairs, transferClearingDays);
  }, [txns, manualTransferPairs, unlinkedTransferPairs, transferClearingDays]);

  const transferMap = useMemo(() => {
    const map = new Map();
    transferPairs.forEach(p => {
      map.set(p.debitTxnId, p);
      map.set(p.creditTxnId, p);
    });
    return map;
  }, [transferPairs]);

  const totalTransfersAmount = useMemo(() => {
    return transferPairs.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [transferPairs]);

  // Auto categorize paired transactions as 'Bank Transfer'
  useEffect(() => {
    if (!transferPairs.length) return;
    const pairedTxnIds = new Set();
    transferPairs.forEach(p => {
      pairedTxnIds.add(p.debitTxnId);
      pairedTxnIds.add(p.creditTxnId);
    });

    let hasChange = false;
    const updated = txns.map(t => {
      if (pairedTxnIds.has(t.id) && !t.isManualCategory && t.category !== 'Bank Transfer') {
        hasChange = true;
        return { ...t, category: 'Bank Transfer' };
      }
      return t;
    });

    if (hasChange) {
      setTxns(updated);
    }
  }, [transferPairs]);

  // Unlink Transfer Pair
  const handleUnlinkPair = (debitTxnId, creditTxnId) => {
    setManualTransferPairs(prev => prev.filter(p => !(p.debitTxnId === debitTxnId && p.creditTxnId === creditTxnId)));
    setUnlinkedTransferPairs(prev => {
      const exists = prev.some(p => (
        (p.debitTxnId === debitTxnId && p.creditTxnId === creditTxnId) ||
        (p.debitTxnId === creditTxnId && p.creditTxnId === debitTxnId)
      ));
      if (!exists) {
        return [...prev, { debitTxnId, creditTxnId, unlinkedAt: new Date().toISOString() }];
      }
      return prev;
    });

    setTxns(prev => prev.map(t => {
      if ((t.id === debitTxnId || t.id === creditTxnId) && !t.isManualCategory && t.category === 'Bank Transfer') {
        const autoCat = detectCategoryWithRules(t.narration, t.type, rules);
        return { ...t, category: autoCat };
      }
      return t;
    }));

    showToast('Transfer pair unlinked');
  };

  // Manual Transfer Pairing
  const handleCreateManualPair = (txnA, txnB) => {
    if (!txnA || !txnB) return;
    const debitTxn = txnA.type === 'DEBIT' ? txnA : txnB;
    const creditTxn = txnA.type === 'CREDIT' ? txnA : txnB;

    setUnlinkedTransferPairs(prev => prev.filter(p => !(
      (p.debitTxnId === debitTxn.id && p.creditTxnId === creditTxn.id) ||
      (p.debitTxnId === creditTxn.id && p.creditTxnId === debitTxn.id)
    )));

    const newPair = {
      pairId: `manual-${debitTxn.id}-${creditTxn.id}`,
      debitTxnId: debitTxn.id,
      creditTxnId: creditTxn.id,
      fromBank: debitTxn.bank,
      toBank: creditTxn.bank,
      amount: debitTxn.amount,
      date: debitTxn.date,
      diffDays: Math.abs(new Date(debitTxn.date || '2026-01-01').getTime() - new Date(creditTxn.date || '2026-01-01').getTime()) / 86400000,
      isManualPair: true
    };

    setManualTransferPairs(prev => [...prev.filter(p => !(p.debitTxnId === debitTxn.id && p.creditTxnId === creditTxn.id)), newPair]);

    setTxns(prev => prev.map(t => {
      if ((t.id === debitTxn.id || t.id === creditTxn.id) && !t.isManualCategory) {
        return { ...t, category: 'Bank Transfer' };
      }
      return t;
    }));

    showToast('Manual transfer pair linked successfully');
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

  // Filtered Transactions
  const filtered = useMemo(() => {
    return txns.filter(t => {
      if (bankFilter !== 'ALL' && t.bank !== bankFilter) return false;
      if (selectedCategories.length > 0 && selectedCategories.length < categories.length) {
        if (!selectedCategories.includes(t.category)) return false;
      }
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;

      // Duration Mode Filtering
      if (durationMode === 'WEEKWISE') {
        if (selectedWeeks.length > 0) {
          const w = getIsoWeek(t.date).key;
          if (!selectedWeeks.includes(w)) return false;
        }
      } else if (durationMode === 'MONTHWISE') {
        if (selectedMonths.length > 0) {
          const m = getMonthInfo(t.date).key;
          if (!selectedMonths.includes(m)) return false;
        }
      } else if (durationMode === 'QUARTERWISE') {
        if (selectedQuarters.length > 0) {
          const q = getQuarterInfo(t.date).key;
          if (!selectedQuarters.includes(q)) return false;
        }
      } else if (durationMode === 'YEARWISE') {
        if (selectedYears.length > 0) {
          const y = getYearInfo(t.date).key;
          if (!selectedYears.includes(y)) return false;
        }
      } else if (durationMode === 'CUSTOM') {
        if (customFrom && t.date < customFrom) return false;
        if (customTo && t.date > customTo) return false;
      } else if (durationMode === 'PRESET') {
        if (dateRangeBounds.start && t.date < dateRangeBounds.start) return false;
        if (dateRangeBounds.end && t.date > dateRangeBounds.end) return false;
      }

      if (search && !t.narration.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase()) && !(t.bank || '').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [
    txns, bankFilter, selectedCategories, categories, typeFilter, search,
    durationMode, selectedWeeks, selectedMonths, selectedQuarters, selectedYears,
    customFrom, customTo, dateRangeBounds
  ]);

  // Totals Computation
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

  // Cashflow Trend BarChart Data
  const periodGroups = useMemo(() => {
    const map = {};
    filtered
      .filter(t => !excludeTransfersFromTotals || !transferMap.has(t.id))
      .forEach(t => {
        let key = t.date ? t.date.slice(0, 7) : 'Unknown';
        if (granularity === 'DAILY') key = t.date || 'Unknown';
        else if (granularity === 'QUARTERLY') key = getQuarterInfo(t.date).key;
        else if (granularity === 'YEARLY') key = getYearInfo(t.date).key;

        if (!map[key]) map[key] = { period: key, credit: 0, debit: 0 };
        if (t.type === 'CREDIT') map[key].credit += t.amount;
        else map[key].debit += t.amount;
      });

    return Object.values(map).sort((a, b) => a.period.localeCompare(b.period));
  }, [filtered, granularity, excludeTransfersFromTotals, transferMap]);

  // Category Spend Breakdown
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
          category: name,
          amount: value,
          value,
          pct: totalDebit > 0 ? ((value / totalDebit) * 100).toFixed(1) : '0'
        }))
        .sort((a, b) => b.value - a.value)
    };
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // Category Earn Breakdown
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
          category: name,
          amount: value,
          value,
          pct: totalCredit > 0 ? ((value / totalCredit) * 100).toFixed(1) : '0'
        }))
        .sort((a, b) => b.value - a.value)
    };
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // Combined Net Flow by Category
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

  // Top Spend Merchants
  const topSpendMerchants = useMemo(() => {
    const map = {};
    filtered
      .filter(t => t.type === 'DEBIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .forEach(t => {
        const label = t.narration.split('/').slice(0, 3).join('/').slice(0, 28);
        if (!map[label]) map[label] = { name: label, amount: 0, count: 0, category: t.category, type: 'DEBIT', txnIds: [] };
        map[label].amount += t.amount;
        map[label].count += 1;
        map[label].txnIds.push(t.id);
      });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // Top Income Sources
  const topIncomeSources = useMemo(() => {
    const map = {};
    filtered
      .filter(t => t.type === 'CREDIT' && (!excludeTransfersFromTotals || !transferMap.has(t.id)))
      .forEach(t => {
        const label = t.narration.split('/').slice(0, 3).join('/').slice(0, 28);
        if (!map[label]) map[label] = { name: label, amount: 0, count: 0, category: t.category, type: 'CREDIT', txnIds: [] };
        map[label].amount += t.amount;
        map[label].count += 1;
        map[label].txnIds.push(t.id);
      });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [filtered, excludeTransfersFromTotals, transferMap]);

  // File Upload Handlers
  const triggerFilePicker = (bankName = 'AUTO') => {
    uploadTargetBankRef.current = bankName;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let totalAdded = 0;

    for (const file of files) {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const ext = file.name.split('.').pop().toLowerCase();
      const uploadTargetBank = uploadTargetBankRef.current;

      try {
        if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
          const buf = await file.arrayBuffer();
          const wb = XLSX.read(buf, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const matrix = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

          const { parsedTxns, resolvedBank, explicitOpeningBalance, explicitClosingBalance } = parseSheetMatrix(
            matrix,
            file.name,
            fileId,
            uploadTargetBank,
            banks,
            rules
          );

          if (parsedTxns.length > 0) {
            ensureBankRegistered(resolvedBank);
            setTxns(prev => [...parsedTxns, ...prev]);
            setUploadedFiles(prev => [
              {
                id: fileId,
                name: file.name,
                bank: resolvedBank,
                count: parsedTxns.length,
                format: ext.toUpperCase(),
                uploadedAt: new Date().toISOString().slice(0, 10),
                statementOpeningBalance: explicitOpeningBalance,
                statementClosingBalance: explicitClosingBalance
              },
              ...prev
            ]);
            totalAdded += parsedTxns.length;
          } else {
            showToast(`No transactions found in ${file.name}`, true);
          }
        } else if (ext === 'pdf') {
          const buf = await file.arrayBuffer();
          const res = await parsePdfBuffer(buf, file.name, fileId, uploadTargetBank, banks, rules);

          if (res.needsPassword) {
            setPendingPdf({
              fileId,
              name: file.name,
              buffer: buf,
              preferredBank: uploadTargetBank
            });
            continue;
          }

          if (res.success && res.txns && res.txns.length > 0) {
            ensureBankRegistered(res.resolvedBank);
            setTxns(prev => [...res.txns, ...prev]);
            setUploadedFiles(prev => [
              {
                id: fileId,
                name: file.name,
                bank: res.resolvedBank,
                count: res.txns.length,
                format: 'PDF',
                uploadedAt: new Date().toISOString().slice(0, 10),
                statementOpeningBalance: res.statementOpeningBalance,
                statementClosingBalance: res.statementClosingBalance
              },
              ...prev
            ]);
            totalAdded += res.txns.length;
          } else {
            showToast(res.error || `Could not parse transactions from ${file.name}`, true);
          }
        } else {
          showToast(`Unsupported file type: ${file.name}`, true);
        }
      } catch (err) {
        showToast(`Failed to parse ${file.name}: ${err.message}`, true);
      }
    }

    if (totalAdded > 0) {
      showToast(`Successfully imported ${totalAdded} transactions!`);
    }
  };

  const handleUnlockPdf = async (password) => {
    if (!pendingPdf) return;
    try {
      const res = await parsePdfBuffer(
        pendingPdf.buffer,
        pendingPdf.name,
        pendingPdf.fileId,
        pendingPdf.preferredBank,
        banks,
        rules,
        password
      );

      if (res.needsPassword) {
        showToast('Incorrect PDF statement password', true);
        return;
      }

      if (res.success && res.txns && res.txns.length > 0) {
        ensureBankRegistered(res.resolvedBank);
        setTxns(prev => [...res.txns, ...prev]);
        setUploadedFiles(prev => [
          {
            id: pendingPdf.fileId,
            name: pendingPdf.name,
            bank: res.resolvedBank,
            count: res.txns.length,
            format: 'PDF (Protected)',
            uploadedAt: new Date().toISOString().slice(0, 10),
            statementOpeningBalance: res.statementOpeningBalance,
            statementClosingBalance: res.statementClosingBalance
          },
          ...prev
        ]);
        showToast(`Decrypted & imported ${res.txns.length} transactions!`);
        setPendingPdf(null);
      } else {
        showToast(res.error || 'No transactions found in protected PDF', true);
      }
    } catch (err) {
      showToast(`Decryption failed: ${err.message}`, true);
    }
  };

  // Single & Batch Transaction Management
  const handleSaveEditTxn = () => {
    if (!editingTxn) return;
    setTxns(prev => prev.map(t => (t.id === editingTxn.id ? { ...editingTxn, isManualCategory: true } : t)));
    showToast('Transaction updated');
    setEditingTxn(null);
  };

  const handleSaveAddTxn = () => {
    if (!newTxnForm.narration.trim() || !newTxnForm.amount) {
      showToast('Please enter narration and valid amount', true);
      return;
    }
    const bankName = newTxnForm.bank || (banks[0]?.name || 'Primary Bank');
    ensureBankRegistered(bankName);

    const createdTxn = {
      id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: newTxnForm.date || new Date().toISOString().slice(0, 10),
      narration: newTxnForm.narration.trim(),
      amount: parseFloat(newTxnForm.amount) || 0,
      type: newTxnForm.type || 'DEBIT',
      bank: bankName,
      channel: newTxnForm.channel || 'UPI',
      category: newTxnForm.category || 'Food & Dining',
      isManualCategory: true
    };

    setTxns(prev => [createdTxn, ...prev]);
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
    showToast('Transaction added successfully');
  };

  const handleDeleteSingleTxn = (txnId) => {
    setTxns(prev => prev.filter(t => t.id !== txnId));
    setSelectedTxnIds(prev => prev.filter(id => id !== txnId));
    showToast('Transaction deleted');
  };

  const handleBulkDelete = () => {
    if (!selectedTxnIds.length) return;
    if (window.confirm(`Delete ${selectedTxnIds.length} selected transactions?`)) {
      setTxns(prev => prev.filter(t => !selectedTxnIds.includes(t.id)));
      setSelectedTxnIds([]);
      showToast(`Deleted ${selectedTxnIds.length} transactions`);
    }
  };

  const handleBulkCategorySelect = (newCategory) => {
    setTxns(prev => prev.map(t => {
      if (selectedTxnIds.includes(t.id)) {
        return { ...t, category: newCategory, isManualCategory: true };
      }
      return t;
    }));
    showToast(`Updated category for ${selectedTxnIds.length} transactions to "${newCategory}"`);
    setSelectedTxnIds([]);
  };

  // Bank & File Management
  const handleSaveBank = (formData) => {
    if (editingBank) {
      const oldName = editingBank.name;
      setBanks(prev => prev.map(b => (b.id === editingBank.id ? { ...b, ...formData } : b)));
      if (formData.name !== oldName) {
        setTxns(prev => prev.map(t => (t.bank === oldName ? { ...t, bank: formData.name } : t)));
        setUploadedFiles(prev => prev.map(f => (f.bank === oldName ? { ...f, bank: formData.name } : f)));
      }
      showToast(`Bank "${formData.name}" updated`);
    } else {
      const newBank = {
        id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: formData.name,
        accountHint: formData.accountHint || '',
        color: formData.color || BANK_COLOR_PALETTE[banks.length % BANK_COLOR_PALETTE.length],
        initialBalance: 0,
        initialBalanceDate: 'No statements',
        latestBalance: 0,
        latestBalanceDate: 'No statements'
      };
      setBanks(prev => [...prev, newBank]);
      showToast(`Bank "${formData.name}" added`);
    }
    setShowBankModal(false);
    setEditingBank(null);
  };

  const handleDeleteBank = (bankObj) => {
    if (window.confirm(`Delete bank "${bankObj.name}" and all associated files and transactions?`)) {
      setBanks(prev => prev.filter(b => b.id !== bankObj.id));
      setTxns(prev => prev.filter(t => t.bank !== bankObj.name));
      setUploadedFiles(prev => prev.filter(f => f.bank !== bankObj.name));
      showToast(`Bank "${bankObj.name}" removed`);
    }
  };

  const handleSaveFileEdit = (formData) => {
    if (!editingFile) return;
    setUploadedFiles(prev => prev.map(f => (f.id === editingFile.id ? { ...f, name: formData.name, bank: formData.bank } : f)));
    setTxns(prev => prev.map(t => (t.fileId === editingFile.id ? { ...t, bank: formData.bank } : t)));
    showToast(`Updated statement "${formData.name}"`);
    setEditingFile(null);
  };

  const handleDeleteFile = (fileObj) => {
    if (window.confirm(`Delete file "${fileObj.name}" and remove its ${fileObj.count} transactions?`)) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileObj.id));
      setTxns(prev => prev.filter(t => t.fileId !== fileObj.id));
      showToast(`Removed file "${fileObj.name}"`);
    }
  };

  // Re-apply Rules
  const handleReapplyRules = () => {
    const { updatedTxns, changedCount } = applyCategorizationRules(txns, rules);
    setTxns(updatedTxns);
    showToast(`Re-applied rules: updated ${changedCount} transactions`);
  };

  // Exports
  const handleExportXlsx = async () => {
    try {
      await exportToXlsx({ filtered });
      setShowExportMenu(false);
      showToast(`Exported ${filtered.length} transactions to XLSX`);
    } catch (err) {
      showToast(`Export to XLSX failed: ${err.message}`, true);
    }
  };

  const handleExportCsv = async () => {
    try {
      await exportToCsv({ filtered });
      setShowExportMenu(false);
      showToast(`Exported ${filtered.length} transactions to CSV`);
    } catch (err) {
      showToast(`Export to CSV failed: ${err.message}`, true);
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf({
        filtered,
        totalTxnsCount: txns.length,
        durationMode,
        selectedWeeks,
        selectedMonths,
        selectedQuarters,
        selectedYears,
        customFrom,
        customTo,
        datePreset,
        bankFilter,
        selectedCategories
      });
      setShowExportMenu(false);
      showToast(`Exported ${filtered.length} transactions to PDF`);
    } catch (err) {
      showToast(`Export to PDF failed: ${err.message}`, true);
    }
  };

  // Backup & Restore
  const handleExportBackup = async () => {
    try {
      const payload = createBackupPayload({
        banks,
        uploadedFiles,
        categories,
        rules,
        txns,
        manualPairs: manualTransferPairs,
        unlinkedPairs: unlinkedTransferPairs,
        transferDays: transferClearingDays,
        excludeTransfers: excludeTransfersFromTotals
      });

      const jsonStr = JSON.stringify(payload, null, 2);
      const filename = `FinSight_India_Backup_v${APP_VERSION}_${new Date().toISOString().slice(0, 10)}.json`;

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Workspace backup exported successfully');
    } catch (err) {
      showToast(`Export failed: ${err.message}`, true);
    }
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
        setShowRestoreModal(true);
      } catch (err) {
        showToast(`Could not parse backup file: ${err.message}`, true);
      }
    };
    reader.readAsText(file);
    if (restoreFileInputRef.current) restoreFileInputRef.current.value = '';
  };

  const handleConfirmRestore = (mode, selection) => {
    if (!backupDataToRestore) return;
    const data = backupDataToRestore;
    const summaryParts = [];

    if (mode === 'REPLACE') {
      if (selection.banks && Array.isArray(data.banks)) {
        setBanks(data.banks);
        summaryParts.push(`${data.banks.length} banks`);
      }
      if (selection.files && Array.isArray(data.uploadedFiles)) {
        setUploadedFiles(data.uploadedFiles);
        summaryParts.push(`${data.uploadedFiles.length} files`);
      }
      if (selection.categories && Array.isArray(data.categories)) {
        setCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...data.categories])));
        summaryParts.push(`${data.categories.length} categories`);
      }
      if (selection.rules && Array.isArray(data.rules)) {
        setRules(data.rules);
        summaryParts.push(`${data.rules.length} rules`);
      }
      if (selection.txns && Array.isArray(data.txns)) {
        setTxns(data.txns);
        summaryParts.push(`${data.txns.length} txns`);
      }
      if (Array.isArray(data.manualTransferPairs)) {
        setManualTransferPairs(data.manualTransferPairs);
      }
      if (Array.isArray(data.unlinkedTransferPairs)) {
        setUnlinkedTransferPairs(data.unlinkedTransferPairs);
      }
      if (data.transferClearingDays !== undefined) {
        setTransferClearingDays(Number(data.transferClearingDays) || 2);
      }
      if (data.excludeTransfersFromTotals !== undefined) {
        setExcludeTransfersFromTotals(Boolean(data.excludeTransfersFromTotals));
      }
    } else {
      // Merge mode
      if (selection.banks && Array.isArray(data.banks)) {
        setBanks(prev => {
          const existingNames = new Set(prev.map(b => b.name.toLowerCase()));
          const toAdd = data.banks.filter(b => !existingNames.has((b.name || '').toLowerCase()));
          return [...prev, ...toAdd];
        });
        summaryParts.push(`banks merged`);
      }
      if (selection.files && Array.isArray(data.uploadedFiles)) {
        setUploadedFiles(prev => {
          const existingIds = new Set(prev.map(f => f.id));
          const toAdd = data.uploadedFiles.filter(f => !existingIds.has(f.id));
          return [...toAdd, ...prev];
        });
        summaryParts.push(`files merged`);
      }
      if (selection.categories && Array.isArray(data.categories)) {
        setCategories(prev => Array.from(new Set([...prev, ...data.categories])));
        summaryParts.push(`categories merged`);
      }
      if (selection.rules && Array.isArray(data.rules)) {
        setRules(prev => {
          const map = new Map();
          prev.forEach(r => map.set(r.cat.toLowerCase(), { cat: r.cat, scope: r.scope || 'BOTH', keys: [...r.keys] }));
          data.rules.forEach(r => {
            const k = r.cat.toLowerCase();
            if (map.has(k)) {
              const mergedKeys = Array.from(new Set([...map.get(k).keys, ...r.keys]));
              map.set(k, { cat: r.cat, scope: r.scope || map.get(k).scope, keys: mergedKeys });
            } else {
              map.set(k, r);
            }
          });
          return Array.from(map.values());
        });
        summaryParts.push(`rules merged`);
      }
      if (selection.txns && Array.isArray(data.txns)) {
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

  const handleResetWorkspace = () => {
    if (window.confirm('Reset all transactions, banks, files, and rules? Your previous state will be cleared.')) {
      try {
        localStorage.clear();
      } catch (e) {}
      setBanks([]);
      setTxns([]);
      setUploadedFiles([]);
      setCategories(DEFAULT_CATEGORIES);
      setRules(DEFAULT_RULES);
      setManualTransferPairs([]);
      setUnlinkedTransferPairs([]);
      setSelectedTxnIds([]);
      showToast('Workspace reset to defaults');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f131a] text-[#f1f5f9] flex flex-col font-sans selection:bg-emerald-500/30">
      <Toast toast={toast} />

      {/* Material Design 3 Top App Bar */}
      <TopAppBar
        onOpenExport={() => setShowExportMenu(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto p-4 flex-1">
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept=".xlsx,.xls,.csv,.pdf"
          className="hidden"
        />
        <input
          type="file"
          ref={restoreFileInputRef}
          onChange={handleRestoreFileSelect}
          accept=".json,application/json"
          className="hidden"
        />

        {/* TAB 1: DASHBOARD VIEW */}
        {activeTab === 'DASHBOARD' && (
          <DashboardView
            totals={totals}
            excludeTransfersFromTotals={excludeTransfersFromTotals}
            transferPairs={transferPairs}
            totalTransfersAmount={totalTransfersAmount}
            granularity={granularity}
            setGranularity={setGranularity}
            periodGroups={periodGroups}
            banks={banks}
            uploadedFiles={uploadedFiles}
            txns={txns}
            getBankBalanceInfo={getBankBalanceInfo}
            onTriggerUpload={triggerFilePicker}
            onSelectBankFilter={(bankName) => {
              setBankFilter(bankName);
              setActiveTab('LEDGER');
            }}
            onEditBankBalance={(bankObj) => setEditingBankBalance(bankObj)}
          />
        )}

        {/* TAB 2: ANALYSIS VIEW */}
        {activeTab === 'SPEND' && (
          <AnalysisView
            categoryAnalysisMode={categoryAnalysisMode}
            setCategoryAnalysisMode={setCategoryAnalysisMode}
            categorySpendBreakdown={categorySpendBreakdown}
            categoryEarnBreakdown={categoryEarnBreakdown}
            categoryCombinedBreakdown={categoryCombinedBreakdown}
            topSpendMerchants={topSpendMerchants}
            topIncomeSources={topIncomeSources}
            onSelectMerchant={(merchant) => setSelectedMerchantDrilldown(merchant)}
            onCategoryClickLedger={(catName) => {
              setSelectedCategories([catName]);
              setTypeFilter('ALL');
              setActiveTab('LEDGER');
            }}
            categories={categories}
          />
        )}

        {/* TAB 3: TRANSACTIONS LEDGER VIEW */}
        {activeTab === 'LEDGER' && (
          <LedgerView
            txns={txns}
            filteredTxns={filtered}
            search={search}
            setSearch={setSearch}
            bankFilter={bankFilter}
            onOpenBankFilter={() => setShowBankFilterModal(true)}
            typeFilter={typeFilter}
            onOpenTypeFilter={() => setShowTypeFilterModal(true)}
            selectedCategories={selectedCategories}
            onOpenCategoryFilter={() => setShowCategoryFilterModal(true)}
            banks={banks}
            selectedTxnIds={selectedTxnIds}
            onToggleSelectAll={() => {
              if (selectedTxnIds.length === filtered.length) {
                setSelectedTxnIds([]);
              } else {
                setSelectedTxnIds(filtered.map(t => t.id));
              }
            }}
            onToggleSelectTxn={(id) => {
              if (selectedTxnIds.includes(id)) {
                setSelectedTxnIds(selectedTxnIds.filter(x => x !== id));
              } else {
                setSelectedTxnIds([...selectedTxnIds, id]);
              }
            }}
            onOpenBulkCategoryPicker={() => {
              setCatPickerContext('BULK');
              setShowTxnCategoryPickerModal(true);
            }}
            onBulkDelete={handleBulkDelete}
            onAddTransaction={() => setShowAddModal(true)}
            onEditTransaction={(t) => setEditingTxn(t)}
            onDeleteTransaction={handleDeleteSingleTxn}
            onSingleCategoryClick={(t) => {
              setEditingTxn(t);
              setCatPickerContext('EDIT');
              setShowTxnCategoryPickerModal(true);
            }}
            transferMap={transferMap}
            onOpenTransferManager={() => setShowTransferManagerModal(true)}
          />
        )}

        {/* TAB 4: BANKS & RULES VIEW */}
        {activeTab === 'BANKS' && (
          <BanksView
            banks={banks}
            uploadedFiles={uploadedFiles}
            txns={txns}
            categories={categories}
            rules={rules}
            transferPairs={transferPairs}
            transferClearingDays={transferClearingDays}
            setTransferClearingDays={setTransferClearingDays}
            excludeTransfersFromTotals={excludeTransfersFromTotals}
            setExcludeTransfersFromTotals={setExcludeTransfersFromTotals}
            getBankBalanceInfo={getBankBalanceInfo}
            onOpenAddBank={() => {
              setEditingBank(null);
              setShowBankModal(true);
            }}
            onOpenEditBank={(b) => {
              setEditingBank(b);
              setShowBankModal(true);
            }}
            onDeleteBank={handleDeleteBank}
            onEditBankBalance={(b) => setEditingBankBalance(b)}
            onTriggerUpload={triggerFilePicker}
            onEditFile={(f) => setEditingFile(f)}
            onDeleteFile={handleDeleteFile}
            onOpenCategoryManager={() => setShowCategoryModal(true)}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            onAddCategory={() => {
              const clean = newCategoryName.trim();
              if (!clean || categories.includes(clean)) return;
              setCategories(prev => [...prev.filter(c => c !== 'Uncategorized'), clean, 'Uncategorized']);
              setNewCategoryName('');
              showToast(`Category "${clean}" added`);
            }}
            onDeleteCategory={(cat) => {
              if (cat === 'Uncategorized') return;
              if (window.confirm(`Delete category "${cat}"? Transactions in this category will become Uncategorized.`)) {
                setCategories(prev => prev.filter(c => c !== cat));
                setTxns(prev => prev.map(t => (t.category === cat ? { ...t, category: 'Uncategorized' } : t)));
                showToast(`Removed category "${cat}"`);
              }
            }}
            onOpenTransferManager={() => setShowTransferManagerModal(true)}
            onOpenRuleModal={(r) => setEditingRule(r)}
            onReapplyRules={handleReapplyRules}
            onExportBackup={handleExportBackup}
            onRestoreClick={() => restoreFileInputRef.current?.click()}
            onResetWorkspace={handleResetWorkspace}
            restoreFileInputRef={restoreFileInputRef}
            onRestoreFileSelect={handleRestoreFileSelect}
          />
        )}
      </main>

      {/* Material Design 3 Bottom Navigation Bar */}
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* --- ALL MODALS --- */}

      {/* Single Edit Transaction Modal */}
      <EditTxnModal
        isOpen={Boolean(editingTxn)}
        txn={editingTxn}
        onChange={setEditingTxn}
        onSave={handleSaveEditTxn}
        onClose={() => setEditingTxn(null)}
        banks={banks}
        onOpenTypePicker={() => {
          setTypePickerContext('EDIT');
          setShowTxnTypePickerModal(true);
        }}
        onOpenCategoryPicker={() => {
          setCatPickerContext('EDIT');
          setShowTxnCategoryPickerModal(true);
        }}
      />

      {/* Add Manual Transaction Modal */}
      <AddTxnModal
        isOpen={showAddModal}
        txn={newTxnForm}
        onChange={setNewTxnForm}
        onSave={handleSaveAddTxn}
        onClose={() => setShowAddModal(false)}
        banks={banks}
        onOpenTypePicker={() => {
          setTypePickerContext('NEW');
          setShowTxnTypePickerModal(true);
        }}
        onOpenCategoryPicker={() => {
          setCatPickerContext('NEW');
          setShowTxnCategoryPickerModal(true);
        }}
      />

      {/* Dedicated Flow Type Picker Modal (v2.0.0) */}
      <TypePickerModal
        isOpen={showTxnTypePickerModal}
        currentType={typePickerContext === 'EDIT' ? editingTxn?.type : newTxnForm.type}
        onSelect={(selectedType) => {
          if (typePickerContext === 'EDIT' && editingTxn) {
            setEditingTxn({ ...editingTxn, type: selectedType });
          } else if (typePickerContext === 'NEW') {
            setNewTxnForm({ ...newTxnForm, type: selectedType });
          }
        }}
        onClose={() => setShowTxnTypePickerModal(false)}
      />

      {/* Dedicated Category Picker Modal (v2.0.0) */}
      <CategoryPickerModal
        isOpen={showTxnCategoryPickerModal}
        currentCategory={
          catPickerContext === 'EDIT'
            ? editingTxn?.category
            : catPickerContext === 'NEW'
            ? newTxnForm.category
            : ''
        }
        categories={categories}
        onSelect={(selectedCat) => {
          if (catPickerContext === 'EDIT' && editingTxn) {
            setEditingTxn({ ...editingTxn, category: selectedCat, isManualCategory: true });
          } else if (catPickerContext === 'NEW') {
            setNewTxnForm({ ...newTxnForm, category: selectedCat });
          } else if (catPickerContext === 'BULK') {
            handleBulkCategorySelect(selectedCat);
          }
        }}
        onClose={() => setShowTxnCategoryPickerModal(false)}
        title={catPickerContext === 'BULK' ? `Bulk Categorize (${selectedTxnIds.length} txns)` : 'Select Category'}
        subtitle={catPickerContext === 'EDIT' ? editingTxn?.narration : ''}
      />

      {/* Filter Modals */}
      <TypeFilterModal
        isOpen={showTypeFilterModal}
        currentType={typeFilter}
        onSelect={setTypeFilter}
        onClose={() => setShowTypeFilterModal(false)}
      />

      <CategoryFilterModal
        isOpen={showCategoryFilterModal}
        selectedCategories={selectedCategories}
        categories={categories}
        onApply={setSelectedCategories}
        onClose={() => setShowCategoryFilterModal(false)}
      />

      {/* Bank Filter Modal (v2.2.0) */}
      <BankFilterModal
        isOpen={showBankFilterModal}
        currentBank={bankFilter}
        banks={banks}
        transactions={txns}
        onSelect={setBankFilter}
        onClose={() => setShowBankFilterModal(false)}
      />

      {/* Edit Bank Balances Modal (v1.9.0 / v2.0.0) */}
      <EditBalanceModal
        isOpen={Boolean(editingBankBalance)}
        bank={editingBankBalance}
        onSave={(updatedBank) => {
          setBanks(prev => prev.map(b => (b.id === updatedBank.id ? updatedBank : b)));
          showToast(`Balances saved for ${updatedBank.name}`);
          setEditingBankBalance(null);
        }}
        onClose={() => setEditingBankBalance(null)}
        onAutoRecalculate={(b) => getBankBalanceInfo({ ...b, isManualBalance: false }, txns)}
      />

      {/* Bank Modal */}
      <BankModal
        isOpen={showBankModal}
        bank={editingBank}
        onSave={handleSaveBank}
        onClose={() => {
          setShowBankModal(false);
          setEditingBank(null);
        }}
      />

      {/* File Edit Modal */}
      <FileEditModal
        isOpen={Boolean(editingFile)}
        file={editingFile}
        banks={banks}
        onSave={handleSaveFileEdit}
        onClose={() => setEditingFile(null)}
      />

      {/* Smart Transfers Manager Modal */}
      <TransferManagerModal
        isOpen={showTransferManagerModal}
        transferPairs={transferPairs}
        transactions={txns}
        onUnlinkPair={handleUnlinkPair}
        onOpenManualLink={(target) => {
          setManualLinkTargetTxn(target);
          setShowTransferManagerModal(false);
        }}
        onClose={() => setShowTransferManagerModal(false)}
      />

      {/* Manual Link Modal */}
      <ManualLinkModal
        isOpen={Boolean(manualLinkTargetTxn)}
        targetTxn={manualLinkTargetTxn}
        candidates={txns.filter(t => (
          manualLinkTargetTxn &&
          t.type !== manualLinkTargetTxn.type &&
          t.bank !== manualLinkTargetTxn.bank &&
          Math.abs(Number(t.amount) - Number(manualLinkTargetTxn.amount)) < 0.01
        ))}
        onLink={handleCreateManualPair}
        onClose={() => setManualLinkTargetTxn(null)}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryModal}
        categories={categories}
        onAddCategory={(name) => {
          if (!name || categories.includes(name)) return;
          setCategories(prev => [...prev.filter(c => c !== 'Uncategorized'), name, 'Uncategorized']);
          showToast(`Category "${name}" added`);
        }}
        onRenameCategory={(oldName, newName) => {
          setCategories(prev => prev.map(c => (c === oldName ? newName : c)));
          setTxns(prev => prev.map(t => (t.category === oldName ? { ...t, category: newName } : t)));
          showToast(`Renamed "${oldName}" to "${newName}"`);
        }}
        onDeleteCategory={(cat) => {
          if (cat === 'Uncategorized') return;
          setCategories(prev => prev.filter(c => c !== cat));
          setTxns(prev => prev.map(t => (t.category === cat ? { ...t, category: 'Uncategorized' } : t)));
          showToast(`Deleted category "${cat}"`);
        }}
        onClose={() => setShowCategoryModal(false)}
      />

      {/* Rule Edit Modal */}
      <RuleEditModal
        isOpen={Boolean(editingRule)}
        rule={editingRule}
        onSave={(updatedRule) => {
          setRules(prev => prev.map(r => (r.cat === updatedRule.cat ? updatedRule : r)));
          setEditingRule(null);
          showToast(`Rule for "${updatedRule.cat}" updated`);
        }}
        onClose={() => setEditingRule(null)}
      />

      {/* Export Menu Modal */}
      <ExportModal
        isOpen={showExportMenu}
        filteredCount={filtered.length}
        totalCount={txns.length}
        onExportXlsx={handleExportXlsx}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        onClose={() => setShowExportMenu(false)}
      />

      {/* Backup / Restore Modal */}
      <BackupModal
        isOpen={showRestoreModal}
        backupData={backupDataToRestore}
        onConfirmRestore={handleConfirmRestore}
        onClose={() => {
          setShowRestoreModal(false);
          setBackupDataToRestore(null);
        }}
      />

      {/* Merchant Drilldown Popup (v1.8.0) */}
      <MerchantDrilldownModal
        isOpen={Boolean(selectedMerchantDrilldown)}
        merchant={selectedMerchantDrilldown}
        transactions={filtered}
        onViewInLedger={(merchantName) => {
          setSearch(merchantName);
          setActiveTab('LEDGER');
        }}
        onClose={() => setSelectedMerchantDrilldown(null)}
      />

      {/* Password-protected PDF Modal */}
      <PdfPasswordModal
        isOpen={Boolean(pendingPdf)}
        pendingPdf={pendingPdf}
        onSubmit={handleUnlockPdf}
        onClose={() => setPendingPdf(null)}
      />
    </div>
  );
}
