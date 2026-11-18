import React from 'react';
import {
  TrendingDown, TrendingUp, PieChart as PieIcon, BarChart3,
  ArrowUpDown
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { COLORS, EARN_COLORS } from '../../data/constants';

export default function AnalysisView({
  categoryAnalysisMode,
  setCategoryAnalysisMode,
  categorySpendBreakdown,
  categoryEarnBreakdown,
  categoryCombinedBreakdown,
  topSpendMerchants,
  topIncomeSources,
  onSelectMerchant,
  onCategoryClickLedger,
  categories
}) {
  const isSpend = categoryAnalysisMode !== 'EARN';
  const activeBreakdown = isSpend ? categorySpendBreakdown : categoryEarnBreakdown;
  const activeColors = isSpend ? COLORS : EARN_COLORS;

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Category Breakdown & Charts Container (Category-Wise Box on Top) */}
      <div className="bg-[#1b202a] border border-[#28303d] p-5 rounded-3xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <PieIcon size={16} className={isSpend ? 'text-rose-400' : 'text-emerald-400'} />
              {isSpend ? 'Category-wise Spending Outflow' : 'Category-wise Income & Earnings Inflow'}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Visual share and distribution across categorized transaction buckets
            </p>
          </div>
        </div>

        {activeBreakdown.items.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-[#28303d] rounded-2xl">
            <p>No {isSpend ? 'debit' : 'credit'} transactions found in this time window.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Pie Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeBreakdown.items}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {activeBreakdown.items.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1b202a', borderColor: '#28303d', borderRadius: '16px', fontSize: '12px' }}
                    formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Ranking List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {activeBreakdown.items.map((item, idx) => {
                const color = activeColors[idx % activeColors.length];
                const pct = activeBreakdown.total > 0 ? ((item.amount / activeBreakdown.total) * 100).toFixed(1) : 0;
                return (
                  <div
                    key={item.category}
                    onClick={() => onCategoryClickLedger(item.category)}
                    className="p-2.5 rounded-2xl bg-[#151922] hover:bg-[#222733] border border-[#28303d] flex items-center justify-between gap-3 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">{pct}%</span>
                      <span className={`font-bold ${isSpend ? 'text-rose-400' : 'text-emerald-400'}`}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Spend Outflow and Earning Inflow Box (MD3 Mode Toggle from v2.1) */}
      <div className="bg-[#1b202a] border border-[#28303d] p-2.5 rounded-3xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#151922] p-1 rounded-full border border-[#28303d]">
          <button
            onClick={() => setCategoryAnalysisMode('SPEND')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              isSpend
                ? 'bg-rose-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown size={14} /> Spend Outflow
          </button>
          <button
            onClick={() => setCategoryAnalysisMode('EARN')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              !isSpend
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={14} /> Earning Inflow
          </button>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[#151922] border border-[#28303d] text-xs">
          <span className="text-slate-400">Total {isSpend ? 'Spent' : 'Earned'}: </span>
          <span className={`font-bold ${isSpend ? 'text-rose-400' : 'text-emerald-400'}`}>
            ₹{activeBreakdown.total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 3. Top Spend Merchants / Top Income Sources (Clickable for drilldown popup) */}
      <div className="bg-[#1b202a] border border-[#28303d] p-5 rounded-3xl space-y-4">
        <div>
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={16} className="text-sky-400" />
            {isSpend ? 'Top Spend Merchants & Outflow Targets' : 'Top Income Payouts & Inflow Sources'}
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Click any merchant or source to inspect all associated transaction details in a popup window
          </p>
        </div>

        {((isSpend ? topSpendMerchants : topIncomeSources) || []).length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No merchant records available in active scope.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(isSpend ? topSpendMerchants : topIncomeSources).map((m, idx) => (
              <div
                key={`${m.name}-${idx}`}
                onClick={() => onSelectMerchant({ ...m, type: isSpend ? 'DEBIT' : 'CREDIT' })}
                className="bg-[#151922] hover:bg-[#222733] border border-[#28303d] hover:border-emerald-500/40 p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1b202a] text-[10px] font-bold text-slate-400 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-emerald-300">
                      {m.name}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 ml-7 truncate">
                    {m.category || 'General'} • {m.count || 1} transactions
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold block ${isSpend ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isSpend ? '-' : '+'}₹{m.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition">View details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Spend vs Earning Net Flow Comparison Card */}
      <div className="bg-[#1b202a] border border-[#28303d] p-5 rounded-3xl space-y-4 overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ArrowUpDown size={15} className="text-sky-400" /> Spend vs Earning Net Flow Comparison
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Category-by-category net cash flow balance across current active period
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 font-semibold text-[11px] whitespace-nowrap">
              Outflow: ₹{categorySpendBreakdown.total.toLocaleString('en-IN')}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold text-[11px] whitespace-nowrap">
              Inflow: ₹{categoryEarnBreakdown.total.toLocaleString('en-IN')}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border ${
              (categoryEarnBreakdown.total - categorySpendBreakdown.total) >= 0
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}>
              Net: {(categoryEarnBreakdown.total - categorySpendBreakdown.total) >= 0 ? '+' : '-'}₹{Math.abs(categoryEarnBreakdown.total - categorySpendBreakdown.total).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {categoryCombinedBreakdown.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No cash flow activity found in selected range.</p>
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
            <div className="min-w-[460px]">
              <div className="py-2.5 px-3 flex items-center font-bold text-slate-400 border-b border-[#28303d] text-[11px] uppercase tracking-wider">
                <span className="w-[34%] text-left">Category</span>
                <span className="w-[22%] text-right">Spend (Outflow)</span>
                <span className="w-[22%] text-right">Earning (Inflow)</span>
                <span className="w-[22%] text-right">Net Flow</span>
              </div>

              <div className="divide-y divide-[#28303d]/60 text-xs">
                {categoryCombinedBreakdown.map(item => (
                  <div
                    key={item.name}
                    onClick={() => onCategoryClickLedger(item.name)}
                    className="py-3 px-3 flex items-center hover:bg-[#151922] rounded-xl cursor-pointer transition"
                    title={`Click to view ledger for ${item.name}`}
                  >
                    <div className="w-[34%] flex items-center gap-2 min-w-0 pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[categories.indexOf(item.name) % COLORS.length] || '#10b981' }}
                      />
                      <span className="font-semibold text-slate-200 truncate">{item.name}</span>
                    </div>
                    <span className="w-[22%] text-right text-rose-400 font-medium whitespace-nowrap tabular-nums">
                      {item.spend > 0 ? `₹${item.spend.toLocaleString('en-IN')}` : '—'}
                    </span>
                    <span className="w-[22%] text-right text-emerald-400 font-medium whitespace-nowrap tabular-nums">
                      {item.earn > 0 ? `₹${item.earn.toLocaleString('en-IN')}` : '—'}
                    </span>
                    <span className={`w-[22%] text-right font-bold whitespace-nowrap tabular-nums ${item.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.net >= 0 ? '+' : '-'}₹{Math.abs(item.net).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
