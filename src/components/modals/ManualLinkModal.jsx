import React, { useState } from 'react';
import { X, Link, Search } from 'lucide-react';

export default function ManualLinkModal({
  isOpen,
  targetTxn,
  candidates = [],
  onLink,
  onClose
}) {
  const [search, setSearch] = useState('');

  if (!isOpen || !targetTxn) return null;

  const targetAmount = Number(targetTxn.amount);
  const isTargetDebit = targetTxn.type === 'DEBIT';

  const filtered = candidates.filter(t => {
    if (search.trim()) {
      return (t.narration || '').toLowerCase().includes(search.toLowerCase().trim()) ||
             (t.bank || '').toLowerCase().includes(search.toLowerCase().trim());
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Link Transfer Pair Manually
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select opposite transaction in another bank to link as self-transfer
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Target Txn */}
        <div className="bg-[#151922] p-3 rounded-2xl border border-[#28303d] shrink-0">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-bold ${isTargetDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
              Target: {targetTxn.type} • ₹{targetAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-slate-400">{targetTxn.date}</span>
          </div>
          <p className="text-xs font-semibold text-white truncate">{targetTxn.narration}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{targetTxn.bank}</p>
        </div>

        {/* Search Candidates */}
        <div className="relative shrink-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidate transactions..."
            className="w-full bg-[#151922] border border-[#28303d] rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Candidates List */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No matching {isTargetDebit ? 'credit' : 'debit'} transactions found to pair with this amount.
            </p>
          ) : (
            filtered.map(c => {
              const diffDays = Math.round(Math.abs(new Date(targetTxn.date).getTime() - new Date(c.date).getTime()) / 86400000);
              return (
                <div
                  key={c.id}
                  className="bg-[#151922] hover:bg-[#222733] border border-[#28303d] p-3 rounded-2xl flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">₹{Number(c.amount).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1b202a] text-slate-300">
                        {c.bank}
                      </span>
                      <span className="text-[10px] text-slate-400">{c.date} ({diffDays}d apart)</span>
                    </div>
                    <p className="text-xs font-medium text-slate-300 truncate mt-1">{c.narration}</p>
                  </div>
                  <button
                    onClick={() => {
                      onLink(targetTxn, c);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition"
                  >
                    <Link size={13} /> Link Pair
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
