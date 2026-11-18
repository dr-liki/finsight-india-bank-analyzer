import React from 'react';
import { X, Plus, ArrowUpRight, ArrowDownRight, Tag, ChevronRight } from 'lucide-react';

export default function AddTxnModal({
  isOpen,
  txn,
  onChange,
  onSave,
  onClose,
  banks = [],
  onOpenTypePicker,
  onOpenCategoryPicker
}) {
  if (!isOpen || !txn) return null;

  const isCredit = txn.type === 'CREDIT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide">Add Manual Transaction</h3>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Narration */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Narration / Description *
            </label>
            <input
              type="text"
              value={txn.narration || ''}
              onChange={e => onChange({ ...txn, narration: e.target.value })}
              placeholder="e.g. Swiggy Order, Chai, Salary credit"
              className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={txn.amount || ''}
                onChange={e => onChange({ ...txn, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Date
              </label>
              <input
                type="date"
                value={txn.date || new Date().toISOString().slice(0, 10)}
                onChange={e => onChange({ ...txn, date: e.target.value })}
                className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Bank & Channel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Bank Account
              </label>
              <select
                value={txn.bank || (banks[0]?.name || 'Primary Bank')}
                onChange={e => onChange({ ...txn, bank: e.target.value })}
                className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {banks.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Payment Channel
              </label>
              <select
                value={txn.channel || 'UPI'}
                onChange={e => onChange({ ...txn, channel: e.target.value })}
                className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {['UPI', 'NEFT', 'IMPS', 'NACH', 'POS', 'ATM', 'OTHER'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Picker Trigger */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Flow Type
            </label>
            <button
              type="button"
              onClick={onOpenTypePicker}
              className="w-full p-3 rounded-2xl bg-[#151922] border border-[#28303d] hover:bg-[#222733] flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isCredit ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {isCredit ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                </div>
                <span className={`text-xs font-bold ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCredit ? 'Credit (Inflow / Income)' : 'Debit (Outflow / Expense)'}
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Category Picker Trigger */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Category
            </label>
            <button
              type="button"
              onClick={onOpenCategoryPicker}
              className="w-full p-3 rounded-2xl bg-[#151922] border border-[#28303d] hover:bg-[#222733] flex items-center justify-between transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Tag size={15} />
                </div>
                <span className="text-xs font-bold text-white">
                  {txn.category || 'Food & Dining'}
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#28303d]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#151922] transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus size={15} /> Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
