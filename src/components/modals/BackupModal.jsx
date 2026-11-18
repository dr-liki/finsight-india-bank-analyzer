import React, { useState } from 'react';
import { X, Database, CheckSquare, Square, RefreshCw, Layers } from 'lucide-react';

export default function BackupModal({
  isOpen,
  backupData,
  onConfirmRestore,
  onClose
}) {
  if (!isOpen || !backupData) return null;

  const [mode, setMode] = useState('MERGE'); // 'MERGE' or 'REPLACE'
  const [selection, setSelection] = useState({
    banks: Array.isArray(backupData.banks) && backupData.banks.length > 0,
    files: Array.isArray(backupData.uploadedFiles) && backupData.uploadedFiles.length > 0,
    categories: Array.isArray(backupData.categories) && backupData.categories.length > 0,
    rules: Array.isArray(backupData.rules) && backupData.rules.length > 0,
    txns: Array.isArray(backupData.txns) && backupData.txns.length > 0
  });

  const toggle = (key) => {
    setSelection({ ...selection, [key]: !selection[key] });
  };

  const handleConfirm = () => {
    onConfirmRestore(mode, selection);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Database size={16} className="text-sky-400" />
              Restore Workspace Backup
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Choose which datasets to restore and how to handle existing data
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Restore Mode Switch */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300 block">
            Restore Strategy
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#151922] p-1 rounded-2xl border border-[#28303d]">
            <button
              type="button"
              onClick={() => setMode('MERGE')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                mode === 'MERGE'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Merge with Current
            </button>
            <button
              type="button"
              onClick={() => setMode('REPLACE')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                mode === 'REPLACE'
                  ? 'bg-rose-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Replace Workspace
            </button>
          </div>
          <p className="text-[10px] text-slate-400 px-1">
            {mode === 'MERGE'
              ? 'Merges unique banks, files, categories, and transactions into your current setup'
              : 'Overwrites existing workspace data with the contents of this backup file'}
          </p>
        </div>

        {/* Selective Checkboxes */}
        <div className="space-y-2 bg-[#151922] p-3.5 rounded-2xl border border-[#28303d]">
          <p className="text-[11px] font-semibold text-slate-300 mb-1">
            Include in Restore:
          </p>

          {[
            { key: 'banks', label: `Banks (${backupData.banks?.length || 0})` },
            { key: 'files', label: `Statement Files (${backupData.uploadedFiles?.length || 0})` },
            { key: 'categories', label: `Custom Categories (${backupData.categories?.length || 0})` },
            { key: 'rules', label: `Categorization Rules (${backupData.rules?.length || 0})` },
            { key: 'txns', label: `Transactions (${backupData.txns?.length || 0})` }
          ].map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggle(item.key)}
              className="w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-[#1b202a] text-slate-200 transition text-left"
            >
              <span>{item.label}</span>
              {selection[item.key] ? (
                <CheckSquare size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Square size={16} className="text-slate-500 shrink-0" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#28303d]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#151922]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <RefreshCw size={14} /> Confirm & Restore
          </button>
        </div>
      </div>
    </div>
  );
}
