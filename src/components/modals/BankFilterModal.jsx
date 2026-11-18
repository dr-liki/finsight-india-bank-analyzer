import React from 'react';
import { X, Check, Building2 } from 'lucide-react';

export default function BankFilterModal({
  isOpen,
  currentBank,
  banks = [],
  transactions = [],
  onSelect,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Building2 size={16} className="text-emerald-400" />
              Filter by Bank Account
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select a specific bank or view combined transactions
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Bank List Options */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          {/* All Banks Option */}
          <button
            onClick={() => {
              onSelect('ALL');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
              currentBank === 'ALL'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-[#151922] border-[#28303d] hover:bg-[#222733] text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold truncate">All Banks Combined</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {banks.length} accounts configured • {transactions.length} total txns
                </p>
              </div>
            </div>
            {currentBank === 'ALL' && <Check size={18} className="text-emerald-400 shrink-0" />}
          </button>

          {/* Individual Bank Accounts */}
          {banks.map(b => {
            const isSelected = currentBank === b.name;
            const bankTxnCount = transactions.filter(t => t.bank === b.name).length;

            return (
              <button
                key={b.id}
                onClick={() => {
                  onSelect(b.name);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#151922] border-[#28303d] hover:bg-[#222733] text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: b.color || '#10b981' }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold truncate">{b.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {b.accountHint ? `A/C: ${b.accountHint} • ` : ''}{bankTxnCount} transactions
                    </p>
                  </div>
                </div>
                {isSelected && <Check size={18} className="text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-[#28303d] shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
