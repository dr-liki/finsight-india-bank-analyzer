import React, { useState } from 'react';
import { X, Tag, Plus, Edit3, Trash2 } from 'lucide-react';
import { COLORS } from '../../data/constants';

export default function CategoryManagerModal({
  isOpen,
  categories = [],
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onClose
}) {
  const [newCat, setNewCat] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    onAddCategory(newCat.trim());
    setNewCat('');
  };

  const handleRenameSubmit = (oldName) => {
    if (!editName.trim() || editName.trim() === oldName) {
      setEditingCat(null);
      return;
    }
    onRenameCategory(oldName, editName.trim());
    setEditingCat(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1b202a] border border-[#28303d] rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Manage Categories ({categories.length})
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Add custom categories, rename existing buckets, or clean up unused ones
            </p>
          </div>
          <button
            onClick={onClose}
            className="md3-touch-target p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#28303d] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            placeholder="New category name..."
            className="flex-1 bg-[#151922] border border-[#28303d] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus size={15} /> Add
          </button>
        </form>

        {/* Categories List */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          {categories.map((cat, idx) => {
            const isEditing = editingCat === cat;
            const color = COLORS[idx % COLORS.length] || '#10b981';

            return (
              <div
                key={cat}
                className="bg-[#151922] border border-[#28303d] p-3 rounded-2xl flex items-center justify-between gap-3"
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="flex-1 bg-[#0f131a] border border-[#28303d] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleRenameSubmit(cat)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCat(null)}
                      className="px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs font-semibold text-white truncate">{cat}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCat(cat);
                          setEditName(cat);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#28303d] transition"
                        title="Rename"
                      >
                        <Edit3 size={13} />
                      </button>
                      {cat !== 'Uncategorized' && (
                        <button
                          onClick={() => onDeleteCategory(cat)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/60 transition"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-[#28303d] shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
