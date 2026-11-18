import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, Check } from 'lucide-react';

export default function TypePickerModal({
  isOpen,
  currentType,
  onSelect,
  onClose,
  title = 'Select Transaction Type'
}) {
  if (!isOpen) return null;

  const options = [
    {
      id: 'DEBIT',
      label: 'Debit (Outflow / Expense)',
      description: 'Money paid out, transfers sent, withdrawals, purchases',
      icon: ArrowUpRight,
      color: 'text-rose-400',
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/30'
    },
    {
      id: 'CREDIT',
      label: 'Credit (Inflow / Income)',
      description: 'Salary, refunds, cashback, investments received, deposits',
      icon: ArrowDownRight,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2.5">
          {options.map(opt => {
            const isSelected = currentType === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                  isSelected
                    ? `${opt.bg} ${opt.border} ring-1 ring-emerald-500/30`
                    : 'bg-[#151922] border-[#28303d] hover:bg-[#222733]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${opt.bg} ${opt.color} flex items-center justify-center shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isSelected ? opt.color : 'text-white'}`}>
                      {opt.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      {opt.description}
                    </p>
                  </div>
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
