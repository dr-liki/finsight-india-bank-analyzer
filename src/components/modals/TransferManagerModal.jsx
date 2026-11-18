import React from 'react';
import { X, ArrowLeftRight, Unlink, Link, Sliders } from 'lucide-react';

export default function TransferManagerModal({
  isOpen,
  transferPairs = [],
  transactions = [],
  onUnlinkPair,
  onOpenManualLink,
  onClose
}) {
  if (!isOpen) return null;

  const txnMap = new Map();
  transactions.forEach(t => txnMap.set(t.id, t));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-2xl p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <ArrowLeftRight size={17} className="text-sky-400" />
              Smart Bank Transfers Manager ({transferPairs.length} Pairs)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Self-transfers between your accounts excluded from cashflow totals to avoid double counting
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* List of paired transfers */}
        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
          {transferPairs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p>No internal transfer pairs detected yet.</p>
            </div>
          ) : (
            transferPairs.map(p => {
              const debitTxn = txnMap.get(p.debitTxnId);
              const creditTxn = txnMap.get(p.creditTxnId);

              return (
                <div
                  key={p.pairId}
                  className="bg-[#151922] border border-[#28303d] rounded-2xl p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-400">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 font-semibold">
                        {p.isManualPair ? 'Manual Link' : 'Auto Matched'}
                      </span>
                    </div>

                    <button
                      onClick={() => onUnlinkPair(p.debitTxnId, p.creditTxnId)}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Unlink size={13} /> Unlink Pair
                    </button>
                  </div>

                  {/* Flow Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* From (Debit) */}
                    <div className="bg-[#0f131a] p-2.5 rounded-xl border border-[#28303d]/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="font-semibold text-rose-400">DEBIT (Outflow)</span>
                        <span>{debitTxn?.date || p.date}</span>
                      </div>
                      <p className="font-bold text-white truncate">{p.fromBank}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {debitTxn?.narration || 'Transaction details'}
                      </p>
                    </div>

                    {/* To (Credit) */}
                    <div className="bg-[#0f131a] p-2.5 rounded-xl border border-[#28303d]/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="font-semibold text-emerald-400">CREDIT (Inflow)</span>
                        <span>{creditTxn?.date || p.date}</span>
                      </div>
                      <p className="font-bold text-white truncate">{p.toBank}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {creditTxn?.narration || 'Transaction details'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-[#28303d] shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
