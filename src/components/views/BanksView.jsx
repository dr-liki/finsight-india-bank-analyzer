import React from 'react';
import {
  Building2, Plus, Edit3, Trash2, Upload, FileSpreadsheet,
  Tag, ArrowLeftRight, Sparkles, Sliders, Database, Download, RotateCcw
} from 'lucide-react';
import { formatBalanceDate } from '../../data/balanceEngine';
import { BANK_COLOR_PALETTE } from '../../data/constants';

export default function BanksView({
  banks,
  uploadedFiles,
  txns,
  categories,
  rules,
  transferPairs,
  transferClearingDays,
  setTransferClearingDays,
  excludeTransfersFromTotals,
  setExcludeTransfersFromTotals,
  getBankBalanceInfo,
  onOpenAddBank,
  onOpenEditBank,
  onDeleteBank,
  onEditBankBalance,
  onTriggerUpload,
  onEditFile,
  onDeleteFile,
  onOpenCategoryManager,
  newCategoryName,
  setNewCategoryName,
  onAddCategory,
  onDeleteCategory,
  onOpenTransferManager,
  onOpenRuleModal,
  onReapplyRules,
  onExportBackup,
  onRestoreClick,
  onResetWorkspace,
  restoreFileInputRef,
  onRestoreFileSelect
}) {
  return (
    <div className="space-y-4 pb-24">
      {/* Section 1: Banks Manager */}
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl p-5 space-y-3">
        <div className="space-y-2.5">
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-emerald-400" /> My Banks ({banks.length})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Add, edit, or remove banks and manage accounts
            </p>
          </div>
          {/* Uniform Action Button Below Description (v1.9.0) */}
          <button
            onClick={onOpenAddBank}
            className="h-9 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus size={15} /> Add Bank
          </button>
        </div>

        {banks.length === 0 ? (
          <div className="bg-[#151922] border border-dashed border-[#28303d] rounded-2xl p-6 text-center space-y-2">
            <p className="text-xs text-slate-400">No banks added yet. Tap "Add Bank" or upload a statement to auto-create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {banks.map(b => {
              const bankFiles = uploadedFiles.filter(f => f.bank === b.name);
              const bankTxns = txns.filter(t => t.bank === b.name);
              const balInfo = getBankBalanceInfo(b, txns);

              return (
                <div key={b.id} className="bg-[#151922] border border-[#28303d] rounded-2xl p-4 flex flex-col justify-between gap-3">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: b.color || '#10b981' }} />
                        <div>
                          <h3 className="text-xs font-bold text-white">{b.name}</h3>
                          <p className="text-[10px] text-slate-400">
                            {b.accountHint ? `A/C: ${b.accountHint} • ` : ''}{bankFiles.length} files • {bankTxns.length} txns
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenEditBank(b)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#28303d] transition"
                          title="Edit Bank Details"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteBank(b)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/60 transition"
                          title="Delete Bank & Data"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* True Initial & Latest Balances with dates & edit button (v1.9.0 / v2.0.0) */}
                    <div className="bg-[#0f131a] p-3 rounded-xl border border-[#28303d] space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Statement Balances</span>
                        <button
                          onClick={() => onEditBankBalance(b)}
                          className="text-[10px] text-emerald-400 hover:underline font-bold"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="text-slate-400">Latest Balance:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-emerald-400">₹{balInfo.latest.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({formatBalanceDate(balInfo.latestDate)})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="text-slate-400">Initial Balance:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-300">₹{balInfo.initial.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({formatBalanceDate(balInfo.initialDate)})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-[#28303d]">
                    <button
                      onClick={() => onTriggerUpload(b.name)}
                      className="bg-[#1b202a] hover:bg-[#28303d] text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Upload size={12} /> Upload File to {b.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Statement Files Manager */}
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl p-5 space-y-3">
        <div className="space-y-2.5">
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-sky-400" /> Uploaded Statement Files ({uploadedFiles.length})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Edit file names, reassign files to another bank, or remove specific statements
            </p>
          </div>
          {/* Uniform Action Button Below Description (v1.9.0) */}
          <button
            onClick={() => onTriggerUpload('AUTO')}
            className="h-9 px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Upload size={15} /> Upload Files
          </button>
        </div>

        {uploadedFiles.length === 0 ? (
          <div
            onClick={() => onTriggerUpload('AUTO')}
            className="bg-[#151922] border-2 border-dashed border-[#28303d] hover:border-emerald-500/40 rounded-2xl p-6 text-center cursor-pointer transition space-y-2"
          >
            <Upload size={24} className="mx-auto text-emerald-400" />
            <p className="text-xs font-semibold text-slate-200">Tap to Upload .XLSX, .CSV, or .PDF Statements</p>
            <p className="text-[11px] text-slate-400">Supports password-protected PDFs & Indian banking statements</p>
          </div>
        ) : (
          <div className="divide-y divide-[#28303d] text-xs pt-1">
            {uploadedFiles.map(f => (
              <div key={f.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-100 truncate">{f.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                      {f.bank}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#151922] text-slate-400 border border-[#28303d]">
                      {f.format || 'FILE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {f.count} transactions • Uploaded {f.uploadedAt}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditFile(f)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#28303d] transition"
                    title="Edit File / Reassign Bank"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteFile(f)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/60 transition"
                    title="Delete File & its Transactions"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Categories Manager */}
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl p-5 space-y-3">
        <div className="space-y-2.5">
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Tag size={16} className="text-violet-400" /> Custom Categories ({categories.length})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Add new expense or earning categories and organize transactions
            </p>
          </div>
          {/* Uniform Action Button Below Description (v1.9.0) */}
          <button
            onClick={onOpenCategoryManager}
            className="h-9 px-4 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Tag size={15} /> Manage All
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Add new category (e.g. Subscriptions, Pet Care)"
            className="flex-1 bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={onAddCategory}
            className="h-9 px-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition"
          >
            <Plus size={15} /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map(c => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151922] border border-[#28303d] text-xs text-slate-200"
            >
              <span>{c}</span>
              {c !== 'Uncategorized' && (
                <button
                  onClick={() => onDeleteCategory(c)}
                  className="text-slate-400 hover:text-rose-400 ml-0.5"
                  title="Remove Category"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Section 4: Smart Bank Transfers (Moved below categories manager v1.8.0) */}
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl p-5 space-y-3">
        <div className="space-y-2.5">
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ArrowLeftRight size={16} className="text-sky-400" /> Smart Bank Transfers ({transferPairs.length} Linked)
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Prevent double counting internal self-transfers across your bank accounts
            </p>
          </div>
          {/* Uniform Action Button Below Description (v1.9.0) */}
          <button
            onClick={onOpenTransferManager}
            className="h-9 px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Sliders size={15} /> Manage All
          </button>
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeTransfersFromTotals}
              onChange={e => setExcludeTransfersFromTotals(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-[#151922] border-[#28303d]"
            />
            <span className="text-xs text-slate-300">
              Exclude internal transfers from Dashboard Inflow/Outflow totals (avoids double counting)
            </span>
          </label>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span>Clearing Window:</span>
            <select
              value={transferClearingDays}
              onChange={e => setTransferClearingDays(Number(e.target.value))}
              className="bg-[#151922] border border-[#28303d] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value={0}>Same Day (0 Days)</option>
              <option value={1}>1 Day Window</option>
              <option value={2}>2 Days Window (Standard)</option>
              <option value={3}>3 Days Window</option>
              <option value={5}>5 Days Window</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 5: Smart Auto-Categorization Rules */}
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl p-5 space-y-3">
        <div className="space-y-2.5">
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" /> Smart Auto-Categorization Rules ({rules.length})
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direction-aware token matching automatically assigns categories to your transactions
            </p>
          </div>
          {/* Re-apply Rules Button Below Description (v1.9.2) */}
          <button
            onClick={onReapplyRules}
            className="h-9 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Sparkles size={15} /> Re-apply Rules
          </button>
        </div>

        <div className="space-y-2 pt-1 max-h-72 overflow-y-auto pr-1">
          {rules.map(r => (
            <div
              key={r.cat}
              onClick={() => onOpenRuleModal(r)}
              className="p-3 rounded-2xl bg-[#151922] hover:bg-[#222733] border border-[#28303d] flex items-center justify-between gap-3 cursor-pointer transition"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{r.cat}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    r.scope === 'CREDIT' ? 'bg-emerald-500/15 text-emerald-300' : r.scope === 'DEBIT' ? 'bg-rose-500/15 text-rose-300' : 'bg-sky-500/15 text-sky-300'
                  }`}>
                    {r.scope || 'BOTH'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {(r.keys || []).join(', ')}
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                {r.keys.length} keywords →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Workspace Data & Backups */}
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl p-5 space-y-3">
        <div>
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Database size={16} className="text-sky-400" /> Workspace Data & Backups
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Export a standalone JSON backup of your workspace or restore existing data
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={onExportBackup}
            className="p-3.5 rounded-2xl bg-[#151922] hover:bg-[#222733] border border-[#28303d] flex items-center gap-3 transition text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0">
              <Download size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Export Full Workspace</p>
              <p className="text-[10px] text-slate-400">Save banks, rules, txns, and links</p>
            </div>
          </button>

          <button
            onClick={onRestoreClick}
            className="p-3.5 rounded-2xl bg-[#151922] hover:bg-[#222733] border border-[#28303d] flex items-center gap-3 transition text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-300 flex items-center justify-center shrink-0">
              <Upload size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Restore from Backup</p>
              <p className="text-[10px] text-slate-400">Select .json backup file to import</p>
            </div>
          </button>
        </div>

        <input
          type="file"
          ref={restoreFileInputRef}
          onChange={onRestoreFileSelect}
          accept=".json,application/json"
          className="hidden"
        />

        <div className="pt-2 border-t border-[#28303d]">
          <button
            onClick={onResetWorkspace}
            className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1.5 font-medium"
          >
            <RotateCcw size={13} /> Reset Local Workspace Cache
          </button>
        </div>
      </div>
    </div>
  );
}
