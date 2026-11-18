import React from 'react';
import { Download } from 'lucide-react';
import FinSightLogo from '../common/FinSightLogo';
import { APP_VERSION } from '../../data/constants';

export default function TopAppBar({ onOpenExport }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0f131a]/90 backdrop-blur-md border-b border-[#28303d] px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Version Badge (Sub-header removed) */}
        <div className="flex items-center gap-3 min-w-0">
          <FinSightLogo size={36} />
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h1 className="text-base font-bold tracking-tight text-white truncate">
              FinSight India
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              v{APP_VERSION}
            </span>
          </div>
        </div>

        {/* Top Actions: Only Export Button Kept */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenExport}
            className="md3-touch-target p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1b202a] active:bg-[#222733] transition"
            title="Export Statement Report (PDF / Excel / CSV)"
          >
            <Download size={20} className="text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
