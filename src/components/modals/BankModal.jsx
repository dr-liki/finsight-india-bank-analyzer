import React, { useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { BANK_COLOR_PALETTE, POPULAR_INDIAN_BANKS } from '../../data/constants';

export default function BankModal({
  isOpen,
  bank,
  onSave,
  onClose
}) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    name: bank?.name || '',
    accountHint: bank?.accountHint || '',
    color: bank?.color || BANK_COLOR_PALETTE[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              {bank ? 'Edit Bank Account' : 'Add New Bank Account'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Specify bank name, account number hint, and visual indicator color
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Bank Name */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Bank Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. State Bank of India, HDFC Bank"
              list="popular-banks"
              className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              autoFocus
              required
            />
            <datalist id="popular-banks">
              {POPULAR_INDIAN_BANKS.map(b => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>

          {/* Account Hint */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Account Hint / Last 4 Digits (Optional)
            </label>
            <input
              type="text"
              value={form.accountHint}
              onChange={e => setForm({ ...form, accountHint: e.target.value })}
              placeholder="e.g. XX1234 or Salary A/C"
              className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Color Tag
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {BANK_COLOR_PALETTE.map(col => (
                <button
                  type="button"
                  key={col}
                  onClick={() => setForm({ ...form, color: col })}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    form.color === col ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#1b202a]' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#28303d]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#151922]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Save size={14} /> {bank ? 'Update Bank' : 'Save Bank'}
          </button>
        </div>
      </form>
    </div>
  );
}
