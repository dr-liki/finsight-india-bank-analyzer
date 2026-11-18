import React from 'react';
import { BarChart3, PieChart as PieIcon, FileText, Building2 } from 'lucide-react';

export default function NavigationBar({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'DASHBOARD', label: 'Overview', icon: BarChart3 },
    { id: 'SPEND', label: 'Analysis', icon: PieIcon },
    { id: 'LEDGER', label: 'Transactions', icon: FileText },
    { id: 'BANKS', label: 'Banks & Rules', icon: Building2 }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0f131a]/95 backdrop-blur-md border-t border-[#28303d] z-40 px-2">
      <div className="max-w-md mx-auto h-full grid grid-cols-4 items-center">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center h-full w-full py-1 text-center transition-all group"
            >
              {/* MD3 Active Indicator Pill */}
              <div
                className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  active
                    ? 'bg-emerald-500/25 text-emerald-300 scale-105'
                    : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-[#1b202a]'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span
                className={`text-[11px] mt-1 transition-colors ${
                  active ? 'text-emerald-300 font-bold' : 'text-slate-400 font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
