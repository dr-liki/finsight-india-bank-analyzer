import React from 'react';
import {
  Search, Filter, Plus, CheckSquare, Square, Tag, Trash2, Edit3,
  Building2, Layers, ArrowLeftRight
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
          {/* Bank Filter Chip (Updated from native select to modern popup trigger) */}
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
                  {/* LINE 1: Date, Bank account, Channel and Amount in one line */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <button
                        onClick={() => onToggleSelectTxn(t.id)}
                        className="text-slate-400 hover:text-emerald-400 shrink-0"
                        title={isSelected ? 'Deselect transaction' : 'Select transaction'}
                      >
                        {isSelected ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} />}
                      </button>

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

                  {/* LINE 2: Narration shown completely without truncation */}
                  <div className="pl-6">
                    <p className="text-xs font-medium text-white break-words leading-relaxed">
                      {t.narration}
                    </p>
                  </div>

                  {/* LINE 3: Category, Edit and Delete buttons in third line */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#28303d]/50 pl-6">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      {/* Clickable Category Badge */}
                      <button
                        onClick={() => onSingleCategoryClick(t)}
                        className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition font-semibold text-[11px] truncate"
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
