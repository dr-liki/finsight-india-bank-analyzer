import React, { useState, useMemo } from 'react';
import { Upload, FileSpreadsheet, FileText, PieChart as PieIcon, BarChart3, Calendar, Filter, Trash2, Building2, Download, Search, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

const CATEGORY_RULES = [
  { cat: 'Food & Dining', keys: ['swiggy', 'zomato', 'restaurant', 'cafe', 'starbucks', 'dominos', 'mcdonalds'] },
  { cat: 'Groceries & Quick Commerce', keys: ['zepto', 'blinkit', 'instamart', 'bigbasket', 'dmart', 'reliance smart'] },
  { cat: 'Investments & SIP', keys: ['zerodha', 'groww', 'ppfas', 'mutual fund', 'ach d-', 'sip', 'nps', 'epfo'] },
  { cat: 'Fuel & Transport', keys: ['shell', 'hpcl', 'bpcl', 'iocl', 'petrol', 'uber', 'ola', 'rapido', 'fastag', 'irctc'] },
  { cat: 'Bills & Utilities', keys: ['bescom', 'airtel', 'jio', 'act fibernet', 'electricity', 'water', 'gas', 'recharge', 'bbps'] },
  { cat: 'Healthcare & Medical', keys: ['hospital', 'manipal', 'apollo', 'pharmeasy', '1mg', 'pharmacy', 'clinic', 'medplus'] },
  { cat: 'Shopping & Books', keys: ['amazon', 'flipkart', 'myntra', 'blossom book', 'decathlon', 'nykaa'] },
  { cat: 'Salary & Income', keys: ['salary', 'neft cr', 'stipend', 'fellowship', 'interest', 'dividend'] }
];

const SAMPLE_TXNS = [
  { id: '1', date: '2026-08-01', narration: 'NEFT CR-GOVT MEDICAL COLLEGE STIPEND', amount: 85000, type: 'CREDIT', bank: 'SBI', channel: 'NEFT', category: 'Salary & Income' },
  { id: '2', date: '2026-08-03', narration: 'UPI/SWIGGY/BANGALORE/HDFC', amount: 640, type: 'DEBIT', bank: 'HDFC', channel: 'UPI', category: 'Food & Dining' },
  { id: '3', date: '2026-08-05', narration: 'ACH D-ZERODHA COIN SIP PPFAS', amount: 15000, type: 'DEBIT', bank: 'HDFC', channel: 'NACH', category: 'Investments & SIP' },
  { id: '4', date: '2026-08-11', narration: 'UPI/ZEPTO GROCERIES/ICICI', amount: 1280, type: 'DEBIT', bank: 'ICICI', channel: 'UPI', category: 'Groceries & Quick Commerce' },
  { id: '5', date: '2026-09-01', narration: 'NEFT CR-ST JOHNS MEDICAL SALARY', amount: 92000, type: 'CREDIT', bank: 'SBI', channel: 'NEFT', category: 'Salary & Income' },
  { id: '6', date: '2026-09-06', narration: 'POS SHELL PETROL BENGALURU', amount: 2450, type: 'DEBIT', bank: 'HDFC', channel: 'POS', category: 'Fuel & Transport' },
  { id: '7', date: '2026-09-14', narration: 'UPI/BESCOM ELECTRICITY BILL', amount: 1890, type: 'DEBIT', bank: 'SBI', channel: 'UPI', category: 'Bills & Utilities' },
  { id: '8', date: '2026-10-01', narration: 'NEFT CR-ST JOHNS MEDICAL SALARY', amount: 92000, type: 'CREDIT', bank: 'SBI', channel: 'NEFT', category: 'Salary & Income' },
  { id: '9', date: '2026-10-08', narration: 'UPI/BLOSSOM BOOK HOUSE/AXIS', amount: 1450, type: 'DEBIT', bank: 'Axis', channel: 'UPI', category: 'Shopping & Books' },
  { id: '10', date: '2026-10-18', narration: 'ACH D-ZERODHA COIN SIP PPFAS', amount: 15000, type: 'DEBIT', bank: 'HDFC', channel: 'NACH', category: 'Investments & SIP' }
];

function detectBank(text) {
  const s = text.toLowerCase();
  if (s.includes('hdfc')) return 'HDFC';
  if (s.includes('sbin') || s.includes('state bank')) return 'SBI';
  if (s.includes('icic')) return 'ICICI';
  if (s.includes('utib') || s.includes('axis')) return 'Axis';
  if (s.includes('kkbk') || s.includes('kotak')) return 'Kotak';
  return 'Other Bank';
}

function detectCategory(narration, type) {
  const s = (narration || '').toLowerCase();
  for (const r of CATEGORY_RULES) {
    if (r.keys.some(k => s.includes(k))) return r.cat;
  }
  return type === 'CREDIT' ? 'Salary & Income' : 'Uncategorized';
}

function detectChannel(narration) {
  const s = (narration || '').toUpperCase();
  if (s.includes('UPI')) return 'UPI';
  if (s.includes('NEFT')) return 'NEFT';
  if (s.includes('IMPS')) return 'IMPS';
  if (s.includes('ACH') || s.includes('NACH') || s.includes('ECS')) return 'NACH';
  if (s.includes('POS') || s.includes('CARD')) return 'POS';
  return 'OTHER';
}

export default function App() {
  const [txns, setTxns] = useState(SAMPLE_TXNS);
  const [granularity, setGranularity] = useState('MONTHLY'); // DAILY, MONTHLY, QUARTERLY, YEARLY
  const [bankFilter, setBankFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    const imported = [];
    for (const file of files) {
      const bankGuess = detectBank(file.name);
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        rows.forEach((r, idx) => {
          const vals = Object.values(r).map(v => String(v));
          const keys = Object.keys(r);
          const dateVal = r.Date || r['Txn Date'] || r['Value Date'] || vals[0] || '2026-10-01';
          const narrVal = r.Narration || r.Description || r.Particulars || vals[1] || 'Bank Transaction';
          const debitVal = parseFloat(String(r.Debit || r.Withdrawal || '0').replace(/[^0-9.]/g, '')) || 0;
          const creditVal = parseFloat(String(r.Credit || r.Deposit || '0').replace(/[^0-9.]/g, '')) || 0;
          const rawAmt = parseFloat(String(r.Amount || '0').replace(/[^0-9.-]/g, '')) || 0;
          const amount = debitVal || creditVal || Math.abs(rawAmt);
          const type = creditVal > 0 || rawAmt > 0 && !debitVal ? 'CREDIT' : 'DEBIT';
          if (amount > 0) {
            imported.push({
              id: `${file.name}-${idx}-${Date.now()}`,
              date: String(dateVal).slice(0, 10),
              narration: String(narrVal),
              amount,
              type,
              bank: detectBank(JSON.stringify(r) + file.name) || bankGuess,
              channel: detectChannel(String(narrVal)),
              category: detectCategory(String(narrVal), type)
            });
          }
        });
      }
    }
    if (imported.length > 0) setTxns(prev => [...imported, ...prev]);
  };

  const filtered = useMemo(() => {
    return txns.filter(t => {
      if (bankFilter !== 'ALL' && t.bank !== bankFilter) return false;
      if (search && !t.narration.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [txns, bankFilter, search]);

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

  const totals = useMemo(() => {
    const credit = filtered.filter(t => t.type === 'CREDIT').reduce((a, b) => a + b.amount, 0);
    const debit = filtered.filter(t => t.type === 'DEBIT').reduce((a, b) => a + b.amount, 0);
    return { credit, debit, net: credit - debit };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-emerald-400">FinSight India</h1>
          <p className="text-xs text-slate-400">Multi-Bank Statement Analyzer</p>
        </div>
        <label className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer">
          <Upload size={14} /> Upload XLSX/CSV/PDF
          <input type="file" multiple accept=".csv,.xlsx,.xls,.pdf" className="hidden" onChange={handleFiles} />
        </label>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['ALL', 'SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak'].map(b => (
            <button key={b} onClick={() => setBankFilter(b)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${bankFilter === b ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
              {b === 'ALL' ? 'All Banks' : b}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400">Total Inflow</span>
            <p className="text-sm font-bold text-emerald-400 mt-1">₹{totals.credit.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400">Total Outflow</span>
            <p className="text-sm font-bold text-rose-400 mt-1">₹{totals.debit.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400">Net Surplus</span>
            <p className="text-sm font-bold text-sky-400 mt-1">₹{totals.net.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Time Segregation</span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['DAILY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].map(g => (
                <button key={g} onClick={() => setGranularity(g)} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${granularity === g ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>
                  {g[0] + g.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodGroups}>
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }} />
                <Bar dataKey="credit" name="Credit (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="debit" name="Debit (₹)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-300">Period Breakdown ({granularity})</h2>
          </div>
          <div className="divide-y divide-slate-800 text-xs">
            {periodGroups.map(p => (
              <div key={p.period} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200">{p.period}</span>
                  <span className="text-slate-500 ml-2">({p.count} txns)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400">+₹{p.credit.toLocaleString('en-IN')}</span>
                  <span className="text-rose-400">-₹{p.debit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
