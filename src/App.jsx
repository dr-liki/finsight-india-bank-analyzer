import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Upload, FileSpreadsheet, FileText, PieChart as PieIcon, BarChart3,
  Calendar, Filter, Trash2, Building2, Download, Search, ArrowUpRight,
  ArrowDownRight, Wallet, Plus, Edit3, Check, X, Settings, RefreshCw,
  Lock, AlertCircle, Layers, ChevronRight, FolderOpen, Save
} from 'lucide-react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend
} from 'recharts';

// Configure PDF.js worker via reliable CDN for Android WebView compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#a855f7'];

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
  { cat: 'Salary & Income', keys: ['salary', 'neft cr', 'stipend', 'fellowship', 'interest', 'dividend', 'refund', 'cashback'] }
];

const INITIAL_TXNS = [
  { id: 'tx-1', date: '2026-08-01', narration: 'NEFT CR-GOVT MEDICAL COLLEGE STIPEND', amount: 85000, type: 'CREDIT', bank: 'SBI', channel: 'NEFT', category: 'Salary & Income' },
  { id: 'tx-2', date: '2026-08-03', narration: 'UPI/SWIGGY/BANGALORE/HDFC', amount: 640, type: 'DEBIT', bank: 'HDFC', channel: 'UPI', category: 'Food & Dining' },
  { id: 'tx-3', date: '2026-08-05', narration: 'ACH D-ZERODHA COIN SIP PPFAS', amount: 15000, type: 'DEBIT', bank: 'HDFC', channel: 'NACH', category: 'Investments & SIP' },
  { id: 'tx-4', date: '2026-08-11', narration: 'UPI/ZEPTO GROCERIES/ICICI', amount: 1280, type: 'DEBIT', bank: 'ICICI', channel: 'UPI', category: 'Groceries & Quick Commerce' },
  { id: 'tx-5', date: '2026-08-18', narration: 'UPI/MANIPAL HOSPITAL PHARMACY', amount: 2150, type: 'DEBIT', bank: 'SBI', channel: 'UPI', category: 'Healthcare & Medical' },
  { id: 'tx-6', date: '2026-09-01', narration: 'NEFT CR-ST JOHNS MEDICAL SALARY', amount: 92000, type: 'CREDIT', bank: 'SBI', channel: 'NEFT', category: 'Salary & Income' },
  { id: 'tx-7', date: '2026-09-05', narration: 'ACH D-ZERODHA COIN SIP PPFAS', amount: 15000, type: 'DEBIT', bank: 'HDFC', channel: 'NACH', category: 'Investments & SIP' },
  { id: 'tx-8', date: '2026-09-06', narration: 'POS SHELL PETROL BENGALURU', amount: 2450, type: 'DEBIT', bank: 'HDFC', channel: 'POS', category: 'Fuel & Transport' },
  { id: 'tx-9', date: '2026-09-10', narration: 'IMPS/HOUSE RENT KORAMANGALA', amount: 22000, type: 'DEBIT', bank: 'HDFC', channel: 'IMPS', category: 'Rent & Housing' },
  { id: 'tx-10', date: '2026-09-14', narration: 'UPI/BESCOM ELECTRICITY BILL', amount: 1890, type: 'DEBIT', bank: 'SBI', channel: 'UPI', category: 'Bills & Utilities' },
  { id: 'tx-11', date: '2026-10-01', narration: 'NEFT CR-ST JOHNS MEDICAL SALARY', amount: 92000, type: 'CREDIT', bank: 'SBI', channel: 'NEFT', category: 'Salary & Income' },
  { id: 'tx-12', date: '2026-10-05', narration: 'ACH D-ZERODHA COIN SIP PPFAS', amount: 15000, type: 'DEBIT', bank: 'HDFC', channel: 'NACH', category: 'Investments & SIP' },
  { id: 'tx-13', date: '2026-10-08', narration: 'UPI/BLOSSOM BOOK HOUSE/AXIS', amount: 1450, type: 'DEBIT', bank: 'Axis', channel: 'UPI', category: 'Shopping & Books' },
  { id: 'tx-14', date: '2026-10-12', narration: 'IMPS/HOUSE RENT KORAMANGALA', amount: 22000, type: 'DEBIT', bank: 'HDFC', channel: 'IMPS', category: 'Rent & Housing' },
  { id: 'tx-15', date: '2026-10-19', narration: 'UPI/ZOMATO LIMITED/KOTAK', amount: 890, type: 'DEBIT', bank: 'Kotak', channel: 'UPI', category: 'Food & Dining' }
];

function normalizeDate(raw) {
  if (!raw) return new Date().toISOString().slice(0, 10);
  if (typeof raw === 'number') {
    // Excel serial date
    const utcDays = Math.floor(raw - 25569);
    const d = new Date(utcDays * 86400 * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  const str = String(raw).trim();
  // Match YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  // Match DD/MM/YYYY or DD-MM-YYYY or DD/MM/YY
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    let year = dmy[3];
    if (year.length === 2) year = (parseInt(year, 10) > 50 ? '19' : '20') + year;
    return `${year}-${month}-${day}`;
  }
  // Match DD Mon YYYY (e.g., 14 Oct 2026 or 14-Oct-26)
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return '2026-10-01';
}

function parseAmount(val) {
  if (typeof val === 'number') return Math.abs(val);
  if (!val) return 0;
  const cleaned = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.abs(num);
}

function detectBank(text) {
  const s = (text || '').toLowerCase();
  if (s.includes('hdfc')) return 'HDFC';
  if (s.includes('sbin') || s.includes('state bank') || s.includes('sbi')) return 'SBI';
  if (s.includes('icic')) return 'ICICI';
  if (s.includes('utib') || s.includes('axis')) return 'Axis';
  if (s.includes('kkbk') || s.includes('kotak')) return 'Kotak';
  return 'SBI';
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

export default function App() {
  const [txns, setTxns] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_txns_v2');
      return saved ? JSON.parse(saved) : INITIAL_TXNS;
    } catch {
      return INITIAL_TXNS;
    }
  });

  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_rules_v2');
      return saved ? JSON.parse(saved) : DEFAULT_RULES;
    } catch {
      return DEFAULT_RULES;
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // DASHBOARD, SPEND, LEDGER, FILES
  const [granularity, setGranularity] = useState('MONTHLY'); // DAILY, MONTHLY, QUARTERLY, YEARLY
  const [bankFilter, setBankFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  // Edit / Add Transaction Modal State
  const [editingTxn, setEditingTxn] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTxnForm, setNewTxnForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    narration: '',
    amount: '',
    type: 'DEBIT',
    bank: 'SBI',
    channel: 'UPI',
    category: 'Food & Dining'
  });

  // PDF Password Modal State
  const [pendingPdf, setPendingPdf] = useState(null);
  const [pdfPassword, setPdfPassword] = useState('');

  // Custom Rule Form
  const [ruleKey, setRuleKey] = useState('');
  const [ruleCat, setRuleCat] = useState('Food & Dining');

  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('finsight_txns_v2', JSON.stringify(txns));
    } catch {}
  }, [txns]);

  useEffect(() => {
    try {
      localStorage.setItem('finsight_rules_v2', JSON.stringify(rules));
    } catch {}
  }, [rules]);

  const showToast = (msg, isError = false) => {
    setStatusMsg({ text: msg, isError });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const detectCategoryWithRules = (narration, type, currentRules = rules) => {
    const s = (narration || '').toLowerCase();
    for (const r of currentRules) {
      if (r.keys.some(k => s.includes(k.toLowerCase()))) return r.cat;
    }
    if (type === 'CREDIT') return 'Salary & Income';
    if (s.includes('upi/')) return 'Transfers & UPI';
    return 'Uncategorized';
  };

  // Smart tabular parser for XLSX/CSV 2D arrays (skips bank header metadata rows automatically)
  const parseSheetMatrix = (matrix, fileName) => {
    const bankGuess = detectBank(fileName + ' ' + JSON.stringify(matrix.slice(0, 15)));
    let headerRowIdx = -1;
    let colMap = { date: -1, narration: -1, debit: -1, credit: -1, amount: -1, type: -1 };

    for (let i = 0; i < Math.min(matrix.length, 35); i++) {
      const row = (matrix[i] || []).map(c => String(c || '').toLowerCase().trim());
      const hasDate = row.some(c => c.includes('date') || c.includes('dt'));
      const hasNarr = row.some(c => c.includes('narration') || c.includes('description') || c.includes('particular') || c.includes('remarks') || c.includes('details'));
      if (hasDate && (hasNarr || row.length >= 3)) {
        headerRowIdx = i;
        row.forEach((cell, idx) => {
          if (colMap.date === -1 && (cell.includes('date') || cell.includes('txn dt') || cell.includes('value dt'))) colMap.date = idx;
          if (colMap.narration === -1 && (cell.includes('narration') || cell.includes('description') || cell.includes('particular') || cell.includes('remarks') || cell.includes('details'))) colMap.narration = idx;
          if (colMap.debit === -1 && (cell.includes('debit') || cell.includes('withdrawal') || cell.includes('dr'))) colMap.debit = idx;
          if (colMap.credit === -1 && (cell.includes('credit') || cell.includes('deposit') || cell.includes('cr'))) colMap.credit = idx;
          if (colMap.amount === -1 && cell.includes('amount') && !cell.includes('withdrawal') && !cell.includes('deposit')) colMap.amount = idx;
          if (colMap.type === -1 && (cell === 'type' || cell.includes('dr/cr') || cell.includes('cr/dr'))) colMap.type = idx;
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
        // Fallback: find numeric columns
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
        const normDate = normalizeDate(dateRaw);
        parsedTxns.push({
          id: `imp-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          date: normDate,
          narration: narrStr,
          amount: finalAmount,
          type,
          bank: detectBank(narrStr + ' ' + bankGuess),
          channel: detectChannel(narrStr),
          category: detectCategoryWithRules(narrStr, type)
        });
      }
    }
    return parsedTxns;
  };

  // Parse PDF Bank Statements (with password prompt fallback)
  const parsePdfBuffer = async (arrayBuffer, fileName, password = '') => {
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

      const bankGuess = detectBank(fileName + ' ' + fullLines.slice(0, 20).join(' '));
      const parsedTxns = [];
      const dateRegex = /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4})\s+(.+)/;

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
              const isCredit = /\b(CR|CREDIT|NEFT CR|SALARY|DEP|REFUND)\b/i.test(line);
              const type = isCredit ? 'CREDIT' : 'DEBIT';
              parsedTxns.push({
                id: `pdf-${Date.now()}-${idx}`,
                date: normalizeDate(rawDate),
                narration: narrClean.slice(0, 90),
                amount: amountVal,
                type,
                bank: bankGuess,
                channel: detectChannel(narrClean),
                category: detectCategoryWithRules(narrClean, type)
              });
            }
          }
        }
      });

      return { success: true, txns: parsedTxns };
    } catch (err) {
      if (err && (err.name === 'PasswordException' || String(err.message || '').toLowerCase().includes('password'))) {
        return { needsPassword: true };
      }
      return { success: false, error: err.message || 'Could not parse PDF' };
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let totalAdded = 0;

    for (const file of files) {
      try {
        const ext = file.name.split('.').pop().toLowerCase();
        const buf = await file.arrayBuffer();

        if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
          const wb = XLSX.read(buf, { type: 'array' });
          let fileTxns = [];
          wb.SheetNames.forEach(sheetName => {
            const sheet = wb.Sheets[sheetName];
            const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            fileTxns = [...fileTxns, ...parseSheetMatrix(matrix, file.name)];
          });

          if (fileTxns.length > 0) {
            setTxns(prev => [...fileTxns, ...prev]);
            totalAdded += fileTxns.length;
            setUploadedFiles(prev => [{ name: file.name, count: fileTxns.length, bank: fileTxns[0].bank, time: new Date().toLocaleTimeString() }, ...prev]);
          } else {
            showToast(`No valid transactions found in ${file.name}`, true);
          }
        } else if (ext === 'pdf') {
          const res = await parsePdfBuffer(buf, file.name);
          if (res.needsPassword) {
            setPendingPdf({ buffer: buf, name: file.name });
            return;
          } else if (res.success && res.txns.length > 0) {
            setTxns(prev => [...res.txns, ...prev]);
            totalAdded += res.txns.length;
            setUploadedFiles(prev => [{ name: file.name, count: res.txns.length, bank: res.txns[0].bank, time: new Date().toLocaleTimeString() }, ...prev]);
          } else {
            showToast(`Parsed 0 rows from ${file.name}. Try XLSX/CSV export if scanned PDF.`, true);
          }
        }
      } catch (err) {
        showToast(`Error reading ${file.name}: ${err.message}`, true);
      }
    }

    if (totalAdded > 0) {
      showToast(`Imported ${totalAdded} transactions successfully!`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitPdfPassword = async () => {
    if (!pendingPdf) return;
    const res = await parsePdfBuffer(pendingPdf.buffer, pendingPdf.name, pdfPassword);
    if (res.needsPassword) {
      showToast('Incorrect PDF password. Please try again.', true);
    } else if (res.success && res.txns.length > 0) {
      setTxns(prev => [...res.txns, ...prev]);
      setUploadedFiles(prev => [{ name: pendingPdf.name, count: res.txns.length, bank: res.txns[0].bank, time: new Date().toLocaleTimeString() }, ...prev]);
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
    setTxns(prev => prev.map(t => t.id === editingTxn.id ? { ...editingTxn, amount: parseFloat(editingTxn.amount) || 0 } : t));
    setEditingTxn(null);
    showToast('Transaction updated');
  };

  const handleDeleteTxn = (id) => {
    setTxns(prev => prev.filter(t => t.id !== id));
    if (editingTxn && editingTxn.id === id) setEditingTxn(null);
    showToast('Transaction deleted');
  };

  const handleAddManualTxn = () => {
    const amt = parseFloat(newTxnForm.amount);
    if (!newTxnForm.narration || isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid narration and amount', true);
      return;
    }
    const created = {
      ...newTxnForm,
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
      bank: 'SBI',
      channel: 'UPI',
      category: 'Food & Dining'
    });
    showToast('Transaction added');
  };

  const handleAddRule = () => {
    if (!ruleKey.trim()) return;
    const keyClean = ruleKey.trim().toLowerCase();
    const updatedRules = rules.map(r => r.cat === ruleCat ? { ...r, keys: [...new Set([...r.keys, keyClean])] } : r);
    if (!updatedRules.some(r => r.cat === ruleCat)) {
      updatedRules.push({ cat: ruleCat, keys: [keyClean] });
    }
    setRules(updatedRules);
    // Re-run categorization on existing transactions matching keyword
    setTxns(prev => prev.map(t => t.narration.toLowerCase().includes(keyClean) ? { ...t, category: ruleCat } : t));
    setRuleKey('');
    showToast(`Rule added: "${keyClean}" → ${ruleCat}`);
  };

  const exportCsv = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `FinSight_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Exported filtered statement to XLSX');
  };

  const filtered = useMemo(() => {
    return txns.filter(t => {
      if (bankFilter !== 'ALL' && t.bank !== bankFilter) return false;
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (search && !t.narration.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase()) && !t.bank.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [txns, bankFilter, categoryFilter, typeFilter, search]);

  const totals = useMemo(() => {
    const credit = filtered.filter(t => t.type === 'CREDIT').reduce((a, b) => a + b.amount, 0);
    const debit = filtered.filter(t => t.type === 'DEBIT').reduce((a, b) => a + b.amount, 0);
    const net = credit - debit;
    const savingsRate = credit > 0 ? Math.max(0, ((credit - debit) / credit) * 100).toFixed(1) : '0.0';
    return { credit, debit, net, savingsRate };
  }, [filtered]);

  const periodGroups = useMemo(() => {
    const map = {};
    filtered.forEach(t => {
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
  }, [filtered, granularity]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    let totalDebit = 0;
    filtered.filter(t => t.type === 'DEBIT').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
      totalDebit += t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        pct: totalDebit > 0 ? ((value / totalDebit) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const channelBreakdown = useMemo(() => {
    const map = {};
    filtered.filter(t => t.type === 'DEBIT').forEach(t => {
      map[t.channel || 'OTHER'] = (map[t.channel || 'OTHER'] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  const topMerchants = useMemo(() => {
    const map = {};
    filtered.filter(t => t.type === 'DEBIT').forEach(t => {
      const label = t.narration.split('/').slice(0, 3).join('/').slice(0, 28);
      if (!map[label]) map[label] = { name: label, amount: 0, count: 0, category: t.category };
      map[label].amount += t.amount;
      map[label].count += 1;
    });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [filtered]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 select-none">
      {/* Hidden Multi-File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv,.xlsx,.xls,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top App Bar */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Wallet size={19} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">FinSight India</h1>
            <p className="text-[11px] text-slate-400">{txns.length} txns • Multi-Bank Analyzer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1"
            title="Add Transaction"
          >
            <Plus size={14} /> <span className="hidden sm:inline">Add</span>
          </button>
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition text-slate-950 font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
          >
            <Upload size={14} /> Upload Files
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

      {/* Global Bank Filter Bar */}
      <div className="bg-slate-900/50 border-b border-slate-900 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['ALL', 'SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak'].map(b => (
          <button
            key={b}
            onClick={() => setBankFilter(b)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
              bankFilter === b
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {b === 'ALL' ? 'All Banks' : b}
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <main className="p-4 max-w-4xl mx-auto space-y-4">

        {/* TAB 1: DASHBOARD (Daywise / Monthwise / Quarterly / Yearly) */}
        {activeTab === 'DASHBOARD' && (
          <>
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <span className="text-[11px] text-slate-400 flex items-center justify-between">
                  Total Inflow <ArrowDownRight size={13} className="text-emerald-400" />
                </span>
                <p className="text-sm sm:text-base font-bold text-emerald-400 mt-1">₹{totals.credit.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <span className="text-[11px] text-slate-400 flex items-center justify-between">
                  Total Outflow <ArrowUpRight size={13} className="text-rose-400" />
                </span>
                <p className="text-sm sm:text-base font-bold text-rose-400 mt-1">₹{totals.debit.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <span className="text-[11px] text-slate-400">Net Cash Surplus</span>
                <p className={`text-sm sm:text-base font-bold mt-1 ${totals.net >= 0 ? 'text-sky-400' : 'text-amber-400'}`}>
                  ₹{totals.net.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <span className="text-[11px] text-slate-400">Savings Rate</span>
                <p className="text-sm sm:text-base font-bold text-purple-400 mt-1">{totals.savingsRate}%</p>
              </div>
            </div>

            {/* Granularity Selector & Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Time-Horizon Segregation</h2>
                  <p className="text-[11px] text-slate-400">Daywise, Monthwise, Quarterly & Yearly Cash Flow</p>
                </div>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {[
                    { id: 'DAILY', label: 'Daywise' },
                    { id: 'MONTHLY', label: 'Monthwise' },
                    { id: 'QUARTERLY', label: 'Quarterly' },
                    { id: 'YEARLY', label: 'Yearly' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGranularity(g.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        granularity === g.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={periodGroups}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="credit" name="Inflow (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="debit" name="Outflow (₹)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Period Breakdown Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {granularity} Segregation Ledger ({periodGroups.length} periods)
                </h2>
                <button onClick={exportCsv} className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                  <Download size={13} /> Export XLSX
                </button>
              </div>
              <div className="divide-y divide-slate-800/80 text-xs max-h-80 overflow-y-auto">
                {periodGroups.map(p => (
                  <div key={p.period} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-100">{p.period}</span>
                      <span className="text-[11px] text-slate-400 ml-2 bg-slate-800 px-2 py-0.5 rounded-full">{p.count} txns</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Inflow</span>
                        <span className="text-emerald-400 font-medium">+₹{p.credit.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Outflow</span>
                        <span className="text-rose-400 font-medium">-₹{p.debit.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="min-w-[75px]">
                        <span className="text-[10px] text-slate-500 block">Net</span>
                        <span className={`font-bold ${p.net >= 0 ? 'text-sky-400' : 'text-amber-400'}`}>
                          {p.net >= 0 ? '+' : ''}₹{p.net.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: SPEND ANALYSIS (Category Donut, Payment Channels, Top Merchants) */}
        {activeTab === 'SPEND' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Donut Chart */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div>
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Spend by Category</h2>
                  <p className="text-[11px] text-slate-400">Tap any category below to filter transactions</p>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={82}
                        paddingAngle={3}
                      >
                        {categoryBreakdown.map((entry, index) => (
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
                  {categoryBreakdown.map((c, i) => (
                    <div
                      key={c.name}
                      onClick={() => {
                        setCategoryFilter(c.name);
                        setActiveTab('LEDGER');
                      }}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 cursor-pointer border border-slate-800/60"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-medium text-slate-200">{c.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-100">₹{c.value.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">({c.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Channel & Top Merchants */}
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
                        <Bar dataKey="value" name="Outflow (₹)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top Payees & Merchants</h2>
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
          </>
        )}

        {/* TAB 3: TRANSACTIONS LEDGER (Search, Filter, Inline Edit & Delete) */}
        {activeTab === 'LEDGER' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
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
              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200"
                >
                  <option value="ALL">All Categories</option>
                  {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Showing {filtered.length} transactions (Tap any row to Edit/Recategorize)</span>
              {categoryFilter !== 'ALL' && (
                <button onClick={() => setCategoryFilter('ALL')} className="text-emerald-400 underline">
                  Clear Category Filter
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-800/80 text-xs max-h-[60vh] overflow-y-auto">
              {filtered.map(t => (
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
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{t.date}</span>
                      <span>•</span>
                      <span className="text-sky-400 font-medium">{t.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm whitespace-nowrap ${t.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </span>
                    <Edit3 size={13} className="text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FILES, RULES & DATA MANAGEMENT */}
        {activeTab === 'FILES' && (
          <div className="space-y-4">
            {/* Multi-File Dropzone */}
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="bg-slate-900 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Upload size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Tap to Upload Bank Statements (.XLSX, .CSV, .PDF)</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Supports SBI, HDFC, ICICI, Axis, and Kotak statements. Automatically strips header metadata and segregates transactions.
              </p>
            </div>

            {/* Uploaded Files History */}
            {uploadedFiles.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Imported Statement Files</h3>
                <div className="divide-y divide-slate-800 text-xs">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200">{f.name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({f.bank})</span>
                      </div>
                      <span className="text-emerald-400 font-medium">+{f.count} txns ({f.time})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Auto-Categorization Rules */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Auto-Categorization Rules Engine</h3>
              <p className="text-[11px] text-slate-400">
                Add a merchant keyword (e.g. &quot;st johns&quot;, &quot;airtel&quot;, &quot;apollo&quot;) to automatically assign categories to matching narrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={ruleKey}
                  onChange={e => setRuleKey(e.target.value)}
                  placeholder="Keyword in narration (e.g. blinkit)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
                <select
                  value={ruleCat}
                  onChange={e => setRuleCat(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  onClick={handleAddRule}
                  className="bg-emerald-500 text-slate-950 font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  Add Rule
                </button>
              </div>
            </div>

            {/* Data Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-2 justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-slate-200">Manage Stored Data</h3>
                <p className="text-[11px] text-slate-400">All data is stored locally on your Android device.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTxns(INITIAL_TXNS);
                    showToast('Reset to sample dataset');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700"
                >
                  Reset Sample Data
                </button>
                <button
                  onClick={() => {
                    setTxns([]);
                    setUploadedFiles([]);
                    showToast('Cleared all transactions');
                  }}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs px-3 py-2 rounded-xl border border-rose-800 flex items-center gap-1"
                >
                  <Trash2 size={13} /> Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EDIT TRANSACTION MODAL */}
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
                    {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bank</label>
                  <select
                    value={editingTxn.bank}
                    onChange={e => setEditingTxn({ ...editingTxn, bank: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Other'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
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
                <button
                  onClick={() => setEditingTxn(null)}
                  className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MANUAL TRANSACTION MODAL */}
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
                    {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bank</label>
                  <select
                    value={newTxnForm.bank}
                    onChange={e => setNewTxnForm({ ...newTxnForm, bank: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  >
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
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

      {/* PASSWORD-PROTECTED PDF MODAL */}
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

      {/* ANDROID BOTTOM NAVIGATION MENU */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-1.5 z-40">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {[
            { id: 'DASHBOARD', label: 'Overview', icon: BarChart3 },
            { id: 'SPEND', label: 'Spend Analysis', icon: PieIcon },
            { id: 'LEDGER', label: 'Transactions', icon: FileText },
            { id: 'FILES', label: 'Files & Rules', icon: FolderOpen }
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
