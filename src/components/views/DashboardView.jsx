import React from 'react';
import {
  ArrowDownRight, ArrowUpRight, ArrowLeftRight, FileSpreadsheet, Building2, Upload
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { formatBalanceDate } from '../../data/balanceEngine';

export default function DashboardView({
  totals,
  excludeTransfersFromTotals,
  transferPairs,
  totalTransfersAmount,
  granularity,
  setGranularity,
  periodGroups,
  banks,
  uploadedFiles,
  txns,
  getBankBalanceInfo,
  onTriggerUpload,
  onSelectBankFilter,
  onEditBankBalance
}) {
  return (
    <div className="space-y-4 pb-24">
      {/* KPI Summary Cards - MD3 Rounded 3xl Tonal Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#1b202a] border border-[#28303d] p-4 rounded-3xl transition hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Total Inflow</span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <ArrowDownRight size={15} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-400 mt-2">₹{totals.credit.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            {excludeTransfersFromTotals && transferPairs.length > 0 ? 'Excl. internal transfers' : 'All accounts'}
          </p>
        </div>

        <div className="bg-[#1b202a] border border-[#28303d] p-4 rounded-3xl transition hover:border-rose-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Total Outflow</span>
            <div className="w-7 h-7 rounded-full bg-rose-500/15 flex items-center justify-center">
              <ArrowUpRight size={15} className="text-rose-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-rose-400 mt-2">₹{totals.debit.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            {excludeTransfersFromTotals && transferPairs.length > 0 ? 'Excl. internal transfers' : 'All accounts'}
          </p>
        </div>

        <div className="bg-[#1b202a] border border-[#28303d] p-4 rounded-3xl transition hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Net Savings</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${totals.net >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
              {totals.savingsRate}%
            </span>
          </div>
          <p className={`text-xl font-bold mt-2 ${totals.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totals.net >= 0 ? '+' : ''}₹{totals.net.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Net cashflow surplus</p>
        </div>

        <div className="bg-[#1b202a] border border-[#28303d] p-4 rounded-3xl transition hover:border-sky-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Internal Transfers</span>
            <div className="w-7 h-7 rounded-full bg-sky-500/15 flex items-center justify-center">
              <ArrowLeftRight size={15} className="text-sky-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-sky-400 mt-2">₹{totalTransfersAmount.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-1">{transferPairs.length} transfer pairs linked</p>
        </div>
      </div>

      {/* Granularity & Cashflow Chart - MD3 Container Card */}
      <div className="bg-[#1b202a] border border-[#28303d] p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Multi-Bank Cashflow Trend</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Monthly, quarterly, or yearly financial movement across your accounts</p>
          </div>
          <div className="flex items-center bg-[#151922] p-1 rounded-full border border-[#28303d] text-xs">
            {['DAILY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].map(g => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  granularity === g ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {periodGroups.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-[#28303d] rounded-2xl p-4">
            <FileSpreadsheet size={32} className="mb-2 text-slate-600" />
            <p>No transaction data available yet.</p>
            <button
              onClick={() => onTriggerUpload('AUTO')}
              className="mt-3 px-4 py-2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/25 transition"
            >
              Upload Bank Statement
            </button>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodGroups} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#28303d" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1b202a', borderColor: '#28303d', borderRadius: '16px', fontSize: '12px' }}
                  formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="credit" name="Inflow (₹)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="debit" name="Outflow (₹)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bank Account Balances - MD3 Cards */}
      {banks.length > 0 && (
        <div className="bg-[#1b202a] border border-[#28303d] p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-emerald-400" /> Bank Balances ({banks.length})
            </h2>
            <button
              onClick={() => onTriggerUpload('AUTO')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Upload size={13} /> Upload More
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {banks.map(b => {
              const balInfo = getBankBalanceInfo(b, txns);
              const bFiles = uploadedFiles.filter(f => f.bank === b.name);
              const bTxns = txns.filter(t => t.bank === b.name);

              return (
                <div
                  key={b.id}
                  className="bg-[#151922] border border-[#28303d] rounded-2xl p-3.5 flex flex-col justify-between gap-3 hover:border-emerald-500/40 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: b.color || '#10b981' }} />
                      <div>
                        <h3 className="text-xs font-bold text-white">{b.name}</h3>
                        <p className="text-[10px] text-slate-400">
                          {b.accountHint ? `A/C: ${b.accountHint} • ` : ''}{bFiles.length} files • {bTxns.length} txns
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onEditBankBalance(b)}
                      className="text-[11px] font-semibold text-emerald-400 hover:underline px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25"
                    >
                      Edit Balance
                    </button>
                  </div>

                  {/* Initial & Latest Balances */}
                  <div className="grid grid-cols-2 gap-2 bg-[#0f131a] p-2.5 rounded-xl border border-[#28303d]/80 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Initial Balance</span>
                      <span className="font-bold text-slate-200">₹{balInfo.initial.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] text-slate-400 block">({formatBalanceDate(balInfo.initialDate)})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Latest Balance</span>
                      <span className="font-bold text-emerald-400">₹{balInfo.latest.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] text-slate-400 block">({formatBalanceDate(balInfo.latestDate)})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#28303d]/60">
                    <button
                      onClick={() => onSelectBankFilter(b.name)}
                      className="text-sky-400 hover:underline text-[11px] font-medium"
                    >
                      View Ledger →
                    </button>
                    <button
                      onClick={() => onTriggerUpload(b.name)}
                      className="text-[11px] text-slate-300 hover:text-emerald-300 flex items-center gap-1 font-medium"
                    >
                      <Upload size={12} /> Upload
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
