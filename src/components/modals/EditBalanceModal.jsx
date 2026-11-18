import React, { useState } from 'react';
import { X, Save, RefreshCw, AlertCircle } from 'lucide-react';

export default function EditBalanceModal({
  isOpen,
  bank,
  onSave,
  onClose,
  onAutoRecalculate
}) {
  if (!isOpen || !bank) return null;

  const [form, setForm] = useState({
    initialBalance: bank.initialBalance !== undefined && bank.initialBalance !== null ? String(bank.initialBalance) : '0',
    initialBalanceDate: bank.initialBalanceDate && bank.initialBalanceDate !== 'No statements' ? bank.initialBalanceDate : new Date().toISOString().slice(0, 10),
    latestBalance: bank.latestBalance !== undefined && bank.latestBalance !== null ? String(bank.latestBalance) : '0',
    latestBalanceDate: bank.latestBalanceDate && bank.latestBalanceDate !== 'No statements' ? bank.latestBalanceDate : new Date().toISOString().slice(0, 10),
    isAutoReset: false
  });

  const handleRecalculate = () => {
    if (onAutoRecalculate) {
      const autoInfo = onAutoRecalculate(bank);
      if (autoInfo) {
        setForm({
          initialBalance: String(autoInfo.initial),
          initialBalanceDate: autoInfo.initialDate && autoInfo.initialDate !== 'No statements' ? autoInfo.initialDate : new Date().toISOString().slice(0, 10),
          latestBalance: String(autoInfo.latest),
          latestBalanceDate: autoInfo.latestDate && autoInfo.latestDate !== 'No statements' ? autoInfo.latestDate : new Date().toISOString().slice(0, 10),
          isAutoReset: true
        });
      }
    }
  };

  const handleSubmit = () => {
    const initAmt = parseFloat(form.initialBalance) || 0;
    const latestAmt = parseFloat(form.latestBalance) || 0;
    const isAuto = Boolean(form.isAutoReset);

    onSave({
      ...bank,
      initialBalance: initAmt,
      initialBalanceDate: form.initialBalanceDate || new Date().toISOString().slice(0, 10),
      latestBalance: latestAmt,
      latestBalanceDate: form.latestBalanceDate || new Date().toISOString().slice(0, 10),
      isManualBalance: !isAuto
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Edit Balances: {bank.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Adjust starting opening balance or latest recorded closing balance
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Initial Balance */}
          <div className="bg-[#151922] border border-[#28303d] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                Initial / Opening Balance
              </label>
              <span className="text-[10px] text-slate-400">Statement opening</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Amount (₹)</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.initialBalance}
                  onChange={e => setForm({ ...form, initialBalance: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-[#0f131a] border border-[#28303d] rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Date</span>
                <input
                  type="date"
                  value={form.initialBalanceDate}
                  onChange={e => setForm({ ...form, initialBalanceDate: e.target.value })}
                  className="w-full bg-[#0f131a] border border-[#28303d] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Latest Balance */}
          <div className="bg-[#151922] border border-[#28303d] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                Latest / Closing Balance
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold">Active closing</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Amount (₹)</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.latestBalance}
                  onChange={e => setForm({ ...form, latestBalance: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-[#0f131a] border border-[#28303d] rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Date</span>
                <input
                  type="date"
                  value={form.latestBalanceDate}
                  onChange={e => setForm({ ...form, latestBalanceDate: e.target.value })}
                  className="w-full bg-[#0f131a] border border-[#28303d] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Auto Detect Button */}
          <button
            type="button"
            onClick={handleRecalculate}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#151922] hover:bg-[#222733] text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <RefreshCw size={14} /> Re-Calculate from Uploaded Statements
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#28303d]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#151922]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Save size={14} /> Save Balances
          </button>
        </div>
      </div>
    </div>
  );
}
