import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Sparkles } from 'lucide-react';

export default function RuleEditModal({
  isOpen,
  rule,
  onSave,
  onClose
}) {
  if (!isOpen || !rule) return null;

  const [form, setForm] = useState({
    cat: rule.cat,
    scope: rule.scope || 'BOTH',
    keys: [...(rule.keys || [])]
  });
  const [newKey, setNewKey] = useState('');

  const handleAddKey = (e) => {
    e.preventDefault();
    const clean = newKey.trim().toLowerCase();
    if (!clean || form.keys.includes(clean)) return;
    setForm({ ...form, keys: [...form.keys, clean] });
    setNewKey('');
  };

  const handleRemoveKey = (keyToRemove) => {
    setForm({ ...form, keys: form.keys.filter(k => k !== keyToRemove) });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Edit Rule: {rule.cat}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Configure matching keywords and transaction flow direction scope
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Direction Scope (MD3 Segmented Pill) */}
        <div className="shrink-0 space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-300 block">
            Transaction Direction Scope
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#151922] p-1 rounded-2xl border border-[#28303d]">
            {[
              { id: 'BOTH', label: 'Both (Cr & Dr)' },
              { id: 'DEBIT', label: 'Debits Only' },
              { id: 'CREDIT', label: 'Credits Only' }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm({ ...form, scope: s.id })}
                className={`py-2 rounded-xl text-xs font-bold transition ${
                  form.scope === s.id
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Keyword Form */}
        <form onSubmit={handleAddKey} className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder="Add keyword (e.g. netflix, salary, uber)..."
            className="flex-1 bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus size={15} /> Add Key
          </button>
        </form>

        {/* Keywords Chips List */}
        <div className="overflow-y-auto pr-1 flex-1">
          <p className="text-[11px] font-semibold text-slate-400 mb-2">
            Active Keywords ({form.keys.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {form.keys.map(k => (
              <span
                key={k}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151922] border border-[#28303d] text-xs text-slate-200"
              >
                <span>{k}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKey(k)}
                  className="text-slate-400 hover:text-rose-400 ml-0.5"
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#28303d] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#151922]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Save size={14} /> Save Rule
          </button>
        </div>
      </div>
    </div>
  );
}
