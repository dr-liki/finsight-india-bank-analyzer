import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

export default function MerchantDrilldownModal({
  isOpen,
  merchant,
  transactions = [],
  onViewInLedger,
  onClose
}) {
  if (!isOpen || !merchant) return null;

  const isDebit = merchant.type === 'DEBIT';

  // Find all transactions matching this merchant
  const matchingTxns = transactions.filter(t => {
    if (merchant.txnIds && merchant.txnIds.length > 0) {
      return merchant.txnIds.includes(t.id);
    }
    const cleanNarr = (t.narration || '').trim().toLowerCase();
    const label = (cleanNarr.slice(0, 28) || 'Transaction').trim();
    return t.type === merchant.type && label === merchant.name.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between shrink-0 gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isDebit ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <h3 className="text-sm font-bold text-white truncate">{merchant.name}</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {merchant.category} • {matchingTxns.length || merchant.count} transactions recorded
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Total Metric Card */}
        <div className="bg-[#151922] p-4 rounded-2xl border border-[#28303d] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total {isDebit ? 'Outflow (Spend)' : 'Inflow (Income)'}
            </span>
            <span className={`text-xl font-bold ${isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isDebit ? '-' : '+'}₹{merchant.amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDebit ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
          }`}>
            {isDebit ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
          </div>
        </div>

        {/* Transactions Breakdown List */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Transaction Activity History
          </p>
          {matchingTxns.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No individual records mapped.</p>
          ) : (
            matchingTxns.map(t => (
              <div
                key={t.id}
                className="bg-[#151922] p-3 rounded-2xl border border-[#28303d] flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">{t.date}</span>
                    <span>•</span>
                    <span className="truncate">{t.bank}</span>
                    <span>•</span>
                    <span>{t.channel || 'OTHER'}</span>
                  </div>
                  <p className="text-xs font-medium text-white truncate mt-0.5">{t.narration}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-bold ${isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isDebit ? '-' : '+'}₹{Number(t.amount).toLocaleString('en-IN')}
                  </span>
                  {t.balance !== undefined && t.balance !== null && (
                    <span className="text-[9px] text-slate-400 block">
                      Bal: ₹{Number(t.balance).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#28303d] shrink-0">
          <button
            onClick={() => {
              onViewInLedger(merchant.name);
              onClose();
            }}
            className="text-xs text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 font-semibold"
          >
            <ExternalLink size={13} /> View Filtered in Ledger
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
