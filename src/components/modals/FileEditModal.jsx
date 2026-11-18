import React, { useState } from 'react';
import { X, Save, FileSpreadsheet } from 'lucide-react';

export default function FileEditModal({
  isOpen,
  file,
  banks = [],
  onSave,
  onClose
}) {
  if (!isOpen || !file) return null;

  const [form, setForm] = useState({
    name: file.name || '',
    bank: file.bank || (banks[0]?.name || 'Primary Bank')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Edit Statement File</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Rename file or reassign its transactions to another bank
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* File Name */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              File Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Assigned Bank */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Assigned Bank Account
            </label>
            <select
              value={form.bank}
              onChange={e => setForm({ ...form, bank: e.target.value })}
              className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {banks.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Reassigning moves all {file.count} parsed transactions to the selected bank
            </p>
          </div>
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
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Save size={14} /> Update File
          </button>
        </div>
      </form>
    </div>
  );
}
