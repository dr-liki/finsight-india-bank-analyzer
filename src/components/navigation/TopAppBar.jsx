import React from 'react';
import { Download, Database, RotateCcw } from 'lucide-react';
import FinSightLogo from '../common/FinSightLogo';
import { APP_VERSION } from '../../data/constants';

export default function TopAppBar({
  onOpenExport,
  onOpenBackup,
  onResetWorkspace,
  hasTxns
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#0f131a]/90 backdrop-blur-md border-b border-[#28303d] px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Version Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <FinSightLogo size={36} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold tracking-tight text-white truncate">
                FinSight India
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                v{APP_VERSION}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              100% On-Device Financial Intelligence
            </p>
          </div>
        </div>

        {/* Top Actions Bar (Min 48px touch targets) */}
        <div className="flex items-center gap-1">
          {hasTxns && (
            <button
              onClick={onOpenExport}
              className="md3-touch-target p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1b202a] active:bg-[#222733] transition"
              title="Export Statement Report (PDF / Excel / CSV)"
            >
              <Download size={19} className="text-emerald-400" />
            </button>
          )}

          <button
            onClick={onOpenBackup}
            className="md3-touch-target p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1b202a] active:bg-[#222733] transition"
            title="Backup & Restore Workspace"
          >
            <Database size={19} className="text-sky-400" />
          </button>

          <button
            onClick={onResetWorkspace}
            className="md3-touch-target p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-[#1b202a] active:bg-[#222733] transition"
            title="Clear Workspace & Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
