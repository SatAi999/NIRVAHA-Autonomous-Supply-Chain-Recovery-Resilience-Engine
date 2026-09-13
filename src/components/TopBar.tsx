import React from 'react';
import { Search, MapPin, Bell, Cpu, ChevronDown } from 'lucide-react';

interface TopBarProps {
  llmProvider: string;
  onOpenConfig: () => void;
  isAgentRunning: boolean;
  selectedHub: string;
  setSelectedHub: (hub: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  llmProvider,
  onOpenConfig,
  isAgentRunning,
  selectedHub,
  setSelectedHub
}) => {
  return (
    <header className="flex items-center justify-between py-2 px-1 mb-4 flex-wrap gap-4">
      {/* Breadcrumb / Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-0.5">
          <span>NIRVAHA Agent Engine</span>
          <span>/</span>
          <span className="text-slate-800 font-bold">Resilience Control Center</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Supply Chain Recovery Operations
        </h1>
      </div>

      {/* Right Controls Group */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKUs, routes, suppliers..."
            className="pl-9 pr-4 py-2 bg-white border border-slate-300 shadow-sm rounded-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-56 transition"
          />
        </div>

        {/* Location Dropdown Pill */}
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-full px-3.5 py-1.5 text-xs text-slate-800 font-medium shadow-sm">
          <MapPin className="w-4 h-4 text-cyan-600" />
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="bg-transparent text-slate-900 focus:outline-none cursor-pointer pr-2 text-xs font-bold"
          >
            <option value="RET-DEL-01" className="bg-white">Delhi Superstore Hub</option>
            <option value="RET-KOL-02" className="bg-white">Kolkata Metro Hub</option>
            <option value="RET-AMD-03" className="bg-white">Ahmedabad Industrial Hub</option>
            <option value="RET-BLR-04" className="bg-white">Bengaluru Tech Hub</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-2" />
        </div>

        {/* LLM Provider Trigger Button */}
        <button
          onClick={onOpenConfig}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-full transition shadow-sm"
        >
          <Cpu className="w-4 h-4 text-cyan-600" />
          <span className="hidden sm:inline">LLM:</span>
          <strong className="uppercase text-cyan-600 font-mono">{llmProvider}</strong>
        </button>

        {/* Notification Bell Badge */}
        <button className="w-9 h-9 bg-white hover:bg-slate-50 border border-slate-300 rounded-full flex items-center justify-center relative text-slate-700 transition shadow-sm">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2"></span>
        </button>
      </div>
    </header>
  );
};
