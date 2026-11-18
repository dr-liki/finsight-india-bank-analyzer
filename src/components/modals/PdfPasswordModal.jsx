import React, { useState } from 'react';
import { X, Lock, KeyRound } from 'lucide-react';

export default function PdfPasswordModal({
  isOpen,
  pendingPdf,
  onSubmit,
  onClose
}) {
  const [password, setPassword] = useState('');

  if (!isOpen || !pendingPdf) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    onSubmit(password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <Lock size={16} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Protected PDF Statement
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The statement file <strong className="text-white">{pendingPdf.name}</strong> is password-protected. Enter the PDF password to decrypt and parse transactions on-device:
        </p>

        <div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Statement password (e.g. DOB, PAN, Account No)"
            className="w-full bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            autoFocus
            required
          />
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
            <KeyRound size={14} /> Unlock & Parse
          </button>
        </div>
      </form>
    </div>
  );
}
