import React from 'react';
import {
  Search, Filter, Plus, CheckSquare, Square, Tag, Trash2, Edit3,
  ArrowUpRight, ArrowDownRight, Layers, ArrowLeftRight
} from 'lucide-react';

export default function LedgerView({
  txns,
  filteredTxns,
  search,
  setSearch,
  bankFilter,
  setBankFilter,
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
  onOpenTransferManager
}) {
  const allSelected = filteredTxns.length > 0 && selectedTxnIds.length === filteredTxns.length;

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

          {/* Bank Selector Dropdown Chip */}
          <select
            value={bankFilter}
            onChange={e => setBankFilter(e.target.value)}
            className="h-9 px-3 rounded-full bg-[#151922] border border-[#28303d] text-xs font-semibold text-slate-300 focus:outline-none focus:border-emerald-500 shrink-0"
          >
            <option value="ALL">All Banks ({banks.length})</option>
            {banks.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Batch Selection Action Bar (MD3 Container High) */}
      {selectedTxnIds.length > 0 && (
        <div className="bg-[#222733] border border-emerald-500/30 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-lg animate-in fade-in duration-150">
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
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition"
            >
              <Tag size={13} /> Change Category
            </button>
            <button
              onClick={onBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition"
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
          <div className="space-y-2 pt-1">
            {filteredTxns.map(t => {
              const isSelected = selectedTxnIds.includes(t.id);
              const isCredit = t.type === 'CREDIT';
              const isTransfer = transferMap && transferMap.has(t.id);

              return (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#222733] border-emerald-500/40'
                      : 'bg-[#151922] hover:bg-[#1f2430] border-[#28303d]'
                  }`}
                >
                  {/* Left: Checkbox + Date/Bank/Narration/Tags */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleSelectTxn(t.id)}
                      className="mt-1 text-slate-400 hover:text-emerald-400 shrink-0"
                    >
                      {isSelected ? <CheckSquare size={17} className="text-emerald-400" /> : <Square size={17} />}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-[10px]">
                        <span className="font-semibold text-slate-300">{t.date}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#1b202a] text-slate-300 border border-[#28303d] font-medium">
                          {t.bank}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#1b202a] text-slate-400 font-mono">
                          {t.channel || 'OTHER'}
                        </span>
                        {isTransfer && (
                          <span
                            onClick={onOpenTransferManager}
                            className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1 cursor-pointer hover:bg-sky-500/25 transition"
                            title="Linked Smart Bank Transfer"
                          >
                            <ArrowLeftRight size={10} /> Transfer
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-medium text-white truncate" title={t.narration}>
                        {t.narration}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        {/* Clickable Category Badge */}
                        <button
                          onClick={() => onSingleCategoryClick(t)}
                          className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition font-semibold"
                          title="Click to change category"
                        >
                          {t.category || 'Uncategorized'}
                        </button>

                        {/* Statement Balance Tag (v2.0.0) */}
                        {t.balance !== undefined && t.balance !== null && !isNaN(t.balance) && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Bal: ₹{Number(t.balance).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCredit ? '+' : '-'}₹{(t.amount || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={() => onEditTransaction(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#28303d] transition"
                        title="Edit transaction"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#28303d] transition"
                        title="Delete transaction"
                      >
                        <Trash2 size={14} />
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
