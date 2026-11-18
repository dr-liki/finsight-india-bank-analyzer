import React from 'react';
import { X, FileSpreadsheet, FileText, Download } from 'lucide-react';

export default function ExportModal({
  isOpen,
  filteredCount,
  totalCount,
  onExportXlsx,
  onExportCsv,
  onExportPdf,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Export Statement & Reports
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Exporting {filteredCount} of {totalCount} active transactions
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Excel XLSX */}
          <button
            onClick={onExportXlsx}
            className="w-full p-3.5 rounded-2xl bg-[#151922] hover:bg-[#222733] border border-[#28303d] flex items-center gap-3.5 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                Microsoft Excel Workbook (.xlsx)
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Formatted workbook with total inflows, outflows, and net balance summary
              </p>
            </div>
          </button>

          {/* RFC 4180 CSV */}
          <button
            onClick={onExportCsv}
            className="w-full p-3.5 rounded-2xl bg-[#151922] hover:bg-[#222733] border border-[#28303d] flex items-center gap-3.5 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
              <Download size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white group-hover:text-sky-300">
                Standard Comma-Separated Values (.csv)
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Universal RFC-4180 CSV with UTF-8 BOM encoding for Google Sheets & Excel
              </p>
            </div>
          </button>

          {/* PDF Report */}
          <button
            onClick={onExportPdf}
            className="w-full p-3.5 rounded-2xl bg-[#151922] hover:bg-[#222733] border border-[#28303d] flex items-center gap-3.5 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white group-hover:text-rose-300">
                Formatted PDF Report (.pdf)
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Clean printable report with dark header, KPI summary cards, and color-coded ledger
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-[#28303d]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
