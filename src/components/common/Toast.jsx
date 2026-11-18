import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
        toast.isError
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
      }`}>
        {toast.isError ? (
          <AlertCircle size={16} className="text-rose-400 shrink-0" />
        ) : (
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
        )}
        <span className="truncate">{toast.msg}</span>
      </div>
    </div>
  );
}
