import React, { useState } from 'react';
import { X, Search, Check, Tag } from 'lucide-react';
import { COLORS } from '../../data/constants';

export default function CategoryPickerModal({
  isOpen,
  currentCategory,
  categories = [],
  onSelect,
  onClose,
  title = 'Select Category',
  subtitle = ''
}) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = categories.filter(c =>
    c.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-[#151922] border border-[#28303d] rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            autoFocus
          />
        </div>

        {/* Category List */}
        <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No matching categories found.</p>
          ) : (
            filtered.map((cat, idx) => {
              const isSelected = currentCategory === cat;
              const color = COLORS[categories.indexOf(cat) % COLORS.length] || '#10b981';

              return (
                <button
                  key={cat}
                  onClick={() => {
                    onSelect(cat);
                    onClose();
                  }}
                  className={`w-full px-3.5 py-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#151922] border-[#28303d] hover:bg-[#222733] text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs font-semibold truncate">{cat}</span>
                  </div>
                  {isSelected && <Check size={16} className="text-emerald-400 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
