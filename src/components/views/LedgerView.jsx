import React from 'react';
import {
  Search, Filter, Plus, CheckSquare, Square, Tag, Trash2, Edit3,
  Building2, Layers, ArrowLeftRight, Calendar, RotateCcw
} from 'lucide-react';

export default function LedgerView({
  txns,
  filteredTxns,
  search,
  setSearch,
  bankFilter,
  onOpenBankFilter,
  typeFilter,
  onOpenTypeFilter,
  selectedCategories,
  onOpenCategoryFilter,
  banks,
  selectedTxnIds,
  onToggleSelectAll,
  onToggleSelectTxn,
  onOpenBulkCategoryPicker,
  onBulkDelete,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onSingleCategoryClick,
  transferMap,
  onOpenTransferManager,
  durationMode = 'ALL',
  setDurationMode,
  datePreset = 'ALL',
  setDatePreset,
  selectedWeeks = [],
  setSelectedWeeks,
  availableWeeks = [],
  selectedMonths = [],
  setSelectedMonths,
  availableMonths = [],
  selectedQuarters = [],
  setSelectedQuarters,
  availableQuarters = [],
  selectedYears = [],
  setSelectedYears,
  availableYears = [],
  customFrom = '',
  setCustomFrom,
  customTo = '',
  setCustomTo
}) {
  const allSelected = filteredTxns.length > 0 && selectedTxnIds.length === filteredTxns.length;
  const isDurationFiltered = durationMode !== 'ALL';

  return (
    <div className="space-y-4 pb-24">
      {/* MD3 Filter Bar & Action Controls */}
      <div className="bg-[#1b202a] border border-[#28303d] p-4 rounded-3xl space-y-3">
        {/* Search Input & Add Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search narration, reference, merchant, category..."
              className="w-full bg-[#151922] border border-[#28303d] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <button
            onClick={onAddTransaction}
            className="h-10 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm shrink-0"
          >
            <Plus size={16} /> Add Txn
          </button>
        </div>

        {/* MD3 Filter Chips (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {/* Bank Filter Chip */}
          <button
            onClick={onOpenBankFilter}
            className={`h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition border ${
              bankFilter !== 'ALL'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-[#151922] border-[#28303d] text-slate-300 hover:bg-[#222733]'
            }`}
          >
            <Building2 size={14} />
            {bankFilter === 'ALL' ? `All Banks (${banks.length})` : bankFilter}
          </button>

          {/* Category Filter Chip */}
          <button
            onClick={onOpenCategoryFilter}
            className={`h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition border ${
              selectedCategories.length > 0
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-[#151922] border-[#28303d] text-slate-300 hover:bg-[#222733]'
            }`}
          >
            <Layers size={14} />
            {selectedCategories.length === 0
              ? 'All Categories'
              : `${selectedCategories.length} Categories`}
          </button>

          {/* Type Filter Chip */}
          <button
            onClick={onOpenTypeFilter}
            className={`h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition border ${
              typeFilter !== 'ALL'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-[#151922] border-[#28303d] text-slate-300 hover:bg-[#222733]'
            }`}
          >
            <Filter size={14} />
            {typeFilter === 'ALL' ? 'All Types' : typeFilter === 'DEBIT' ? 'Debits Only' : 'Credits Only'}
          </button>

          {/* Duration Status Chip */}
          {isDurationFiltered && (
            <button
              onClick={() => {
                setDurationMode('ALL');
                setDatePreset('ALL');
                setSelectedWeeks([]);
                setSelectedMonths([]);
                setSelectedQuarters([]);
                setSelectedYears([]);
                setCustomFrom('');
                setCustomTo('');
              }}
              className="h-9 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition border bg-sky-500/15 border-sky-500/40 text-sky-300 hover:bg-sky-500/25"
              title="Reset Duration Filter to All Time"
            >
              <RotateCcw size={12} />
              Reset Duration
            </button>
          )}
        </div>

        {/* DURATION / DATE-RANGE FILTER PANEL (v2.3.0 Seamless MD3 Design) */}
        <div className="pt-2 border-t border-[#28303d]/80 space-y-2.5">
          {/* Header Row: Label + Mode Segmented Selector */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
              <Calendar size={14} className="text-emerald-400" />
              <span>Duration Period:</span>
            </div>

            {/* Mode Switcher Chips (Horizontal Scrollable) */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              {[
                { id: 'ALL', label: 'All Time' },
                { id: 'PRESET', label: 'Presets' },
                { id: 'WEEKWISE', label: `Weekwise${selectedWeeks.length ? ` (${selectedWeeks.length})` : ''}` },
                { id: 'MONTHWISE', label: `Monthwise${selectedMonths.length ? ` (${selectedMonths.length})` : ''}` },
                { id: 'QUARTERWISE', label: `Quarterwise${selectedQuarters.length ? ` (${selectedQuarters.length})` : ''}` },
                { id: 'YEARWISE', label: `Yearwise${selectedYears.length ? ` (${selectedYears.length})` : ''}` },
                { id: 'CUSTOM', label: 'Custom' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setDurationMode(m.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition border ${
                    durationMode === m.id
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm'
                      : 'bg-[#151922] text-slate-400 hover:text-slate-200 border-[#28303d]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Panel: PRESETS */}
          {durationMode === 'PRESET' && (
            <div className="pt-2 border-t border-[#28303d]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'THIS_WEEK', label: 'This Week' },
                { id: 'THIS_MONTH', label: 'This Month' },
                { id: 'THIS_QUARTER', label: 'This Quarter' },
                { id: 'THIS_YEAR', label: 'This Year' },
                { id: '7D', label: 'Last 7 Days' },
                { id: '30D', label: 'Last 30 Days' },
                { id: '3M', label: 'Last 3 Months' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setDatePreset(p.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition border ${
                    datePreset === p.id
                      ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sm'
                      : 'bg-[#151922] text-slate-300 hover:text-white border-[#28303d]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Sub-Panel: WEEKWISE (Multi-Select Weeks) */}
          {durationMode === 'WEEKWISE' && (
            <div className="pt-2 border-t border-[#28303d]/60 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Select Weeks (Multi-select enabled):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedWeeks(availableWeeks.map(w => w.key))}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => setSelectedWeeks([])}
                    className="text-rose-400 hover:underline font-semibold"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto pr-1">
                {availableWeeks.length === 0 ? (
                  <span className="text-slate-500 text-xs">No week data available.</span>
                ) : (
                  availableWeeks.map(w => {
                    const active = selectedWeeks.includes(w.key);
                    return (
                      <button
                        key={w.key}
                        onClick={() => {
                          setSelectedWeeks(prev =>
                            prev.includes(w.key) ? prev.filter(k => k !== w.key) : [...prev, w.key]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1 transition ${
                          active
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-[#151922] border-[#28303d] text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span>{w.label}</span>
                        <span className="text-[9px] opacity-75">({w.count})</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Sub-Panel: MONTHWISE (Multi-Select Months) */}
          {durationMode === 'MONTHWISE' && (
            <div className="pt-2 border-t border-[#28303d]/60 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Select Months (Multi-select enabled):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMonths(availableMonths.map(m => m.key))}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => setSelectedMonths([])}
                    className="text-rose-400 hover:underline font-semibold"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto pr-1">
                {availableMonths.length === 0 ? (
                  <span className="text-slate-500 text-xs">No month data available.</span>
                ) : (
                  availableMonths.map(m => {
                    const active = selectedMonths.includes(m.key);
                    return (
                      <button
                        key={m.key}
                        onClick={() => {
                          setSelectedMonths(prev =>
                            prev.includes(m.key) ? prev.filter(k => k !== m.key) : [...prev, m.key]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1 transition ${
                          active
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-[#151922] border-[#28303d] text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span>{m.label}</span>
                        <span className="text-[9px] opacity-75">({m.count})</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Sub-Panel: QUARTERWISE (Multi-Select Quarters) */}
          {durationMode === 'QUARTERWISE' && (
            <div className="pt-2 border-t border-[#28303d]/60 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Select Quarters (Multi-select enabled):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedQuarters(availableQuarters.map(q => q.key))}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => setSelectedQuarters([])}
                    className="text-rose-400 hover:underline font-semibold"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto pr-1">
                {availableQuarters.length === 0 ? (
                  <span className="text-slate-500 text-xs">No quarter data available.</span>
                ) : (
                  availableQuarters.map(q => {
                    const active = selectedQuarters.includes(q.key);
                    return (
                      <button
                        key={q.key}
                        onClick={() => {
                          setSelectedQuarters(prev =>
                            prev.includes(q.key) ? prev.filter(k => k !== q.key) : [...prev, q.key]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1 transition ${
                          active
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-[#151922] border-[#28303d] text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span>{q.label}</span>
                        <span className="text-[9px] opacity-75">({q.count})</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Sub-Panel: YEARWISE (Multi-Select Years) */}
          {durationMode === 'YEARWISE' && (
            <div className="pt-2 border-t border-[#28303d]/60 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Select Years (Multi-select enabled):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedYears(availableYears.map(y => y.key))}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => setSelectedYears([])}
                    className="text-rose-400 hover:underline font-semibold"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto pr-1">
                {availableYears.length === 0 ? (
                  <span className="text-slate-500 text-xs">No year data available.</span>
                ) : (
                  availableYears.map(y => {
                    const active = selectedYears.includes(y.key);
                    return (
                      <button
                        key={y.key}
                        onClick={() => {
                          setSelectedYears(prev =>
                            prev.includes(y.key) ? prev.filter(k => k !== y.key) : [...prev, y.key]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1 transition ${
                          active
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-[#151922] border-[#28303d] text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span>{y.label}</span>
                        <span className="text-[9px] opacity-75">({y.count})</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Sub-Panel: CUSTOM */}
          {durationMode === 'CUSTOM' && (
            <div className="pt-2 border-t border-[#28303d]/60 flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px]">From:</span>
                <input
                  type="date"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  className="bg-[#151922] border border-[#28303d] rounded-xl px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px]">To:</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                  className="bg-[#151922] border border-[#28303d] rounded-xl px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              {(customFrom || customTo) && (
                <button
                  onClick={() => { setCustomFrom(''); setCustomTo(''); }}
                  className="text-xs text-rose-400 hover:underline px-1.5 py-1 font-semibold"
                >
                  Clear Dates
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Batch Selection Action Bar (Fixed / Sticky at Top when multiple txns selected) */}
      {selectedTxnIds.length > 0 && (
        <div className="sticky top-2 z-30 bg-[#222733]/95 backdrop-blur-md border border-emerald-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSelectAll}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
            >
              {allSelected ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} />}
              <span>{selectedTxnIds.length} Selected</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBulkCategoryPicker}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition shadow-sm"
            >
              <Tag size={13} /> Change Category
            </button>
            <button
              onClick={onBulkDelete}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Transaction List Cards */}
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl p-4 space-y-2">
        <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-400 font-semibold border-b border-[#28303d]">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSelectAll}
              className="text-slate-400 hover:text-white"
              title="Select all filtered transactions"
            >
              {allSelected ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} />}
            </button>
            <span>Showing {filteredTxns.length} of {txns.length} transactions</span>
          </div>
        </div>

        {filteredTxns.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <p>No transactions match the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            {filteredTxns.map(t => {
              const isSelected = selectedTxnIds.includes(t.id);
              const isCredit = t.type === 'CREDIT';
              const isTransfer = transferMap && transferMap.has(t.id);

              return (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl border transition space-y-2.5 ${
                    isSelected
                      ? 'bg-[#222733] border-emerald-500/40'
                      : 'bg-[#151922] hover:bg-[#1f2430] border-[#28303d]'
                  }`}
                >
                  {/* LINE 1: Date, Bank account, Channel, Transfer badge and Amount in one line (Freed space) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="font-semibold text-slate-300 text-[11px] whitespace-nowrap">
                        {t.date}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-[#1b202a] text-slate-300 border border-[#28303d] font-medium text-[10px] whitespace-nowrap truncate max-w-[130px]">
                        {t.bank}
                      </span>

                      <span className="px-1.5 py-0.5 rounded bg-[#1b202a] text-slate-400 font-mono text-[10px] whitespace-nowrap">
                        {t.channel || 'OTHER'}
                      </span>

                      {isTransfer && (
                        <span
                          onClick={onOpenTransferManager}
                          className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1 cursor-pointer hover:bg-sky-500/25 transition text-[10px] whitespace-nowrap"
                          title="Linked Smart Bank Transfer"
                        >
                          <ArrowLeftRight size={10} /> Transfer
                        </span>
                      )}
                    </div>

                    {/* Amount in Line 1 */}
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-bold tabular-nums whitespace-nowrap ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCredit ? '+' : '-'}₹{(t.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* LINE 2: Narration shown completely without truncation (Full horizontal space) */}
                  <div>
                    <p className="text-xs font-medium text-white break-words leading-relaxed">
                      {t.narration}
                    </p>
                  </div>

                  {/* LINE 3: Select transaction box to left of category, running balance, edit and delete buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#28303d]/50">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      {/* Checkbox moved to Line 3 left of category */}
                      <button
                        onClick={() => onToggleSelectTxn(t.id)}
                        className="text-slate-400 hover:text-emerald-400 shrink-0 p-0.5 rounded transition"
                        title={isSelected ? 'Deselect transaction' : 'Select transaction'}
                      >
                        {isSelected ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} />}
                      </button>

                      {/* Clickable Category Badge */}
                      <button
                        onClick={() => onSingleCategoryClick(t)}
                        className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition font-semibold text-[11px] truncate"
                        title="Click to change category"
                      >
                        {t.category || 'Uncategorized'}
                      </button>

                      {/* Statement Running Balance */}
                      {t.balance !== undefined && t.balance !== null && !isNaN(t.balance) && (
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                          Bal: ₹{Number(t.balance).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Edit and Delete Buttons in Line 3 */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditTransaction(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#28303d] transition"
                        title="Edit transaction"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#28303d] transition"
                        title="Delete transaction"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
