import React from 'react';
import { Home, BarChart2, Briefcase, Map, Settings, Plus, User, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart2, label: 'Resilience Analytics' },
    { id: 'disruptions', icon: Briefcase, label: 'Disruption Control' },
    { id: 'map', icon: Map, label: 'Digital Twin Map' },
    { id: 'settings', icon: Settings, label: 'System Settings' }
  ];

  return (
    <aside className="w-16 md:w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 justify-between rounded-l-[32px] shrink-0 shadow-sm">
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Brand Logo Container */}
        <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center font-extrabold text-lg tracking-tighter text-slate-100 shadow-md">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
        </div>

        {/* Navigation Rail */}
        <nav className="flex flex-col gap-3 w-full px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`w-full h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#38bdf8] text-slate-950 shadow-md shadow-cyan-500/25 scale-105 font-bold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User / Quick Action */}
      <div className="flex flex-col items-center gap-4 w-full px-2">
        <button className="w-10 h-10 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-full flex items-center justify-center transition shadow-sm">
          <Plus className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-md">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-slate-700" />
          </div>
        </div>
      </div>
    </aside>
  );
};
