import React from 'react';
import { X, Check } from 'lucide-react';

export default function TypeFilterModal({
  isOpen,
  currentType,
  onSelect,
  onClose
}) {
  if (!isOpen) return null;

  const options = [
    { id: 'ALL', label: 'All Transaction Types', desc: 'Show both incoming and outgoing transactions' },
    { id: 'DEBIT', label: 'Debits Only (Outflow)', desc: 'Show only expenses, purchases, and withdrawals' },
    { id: 'CREDIT', label: 'Credits Only (Inflow)', desc: 'Show only income, refunds, and deposits' }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide">Filter by Flow Type</h3>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {options.map(opt => {
            const isSelected = currentType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#151922] border-[#28303d] hover:bg-[#222733] text-slate-200'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold">{opt.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                </div>
                {isSelected && <Check size={18} className="text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
