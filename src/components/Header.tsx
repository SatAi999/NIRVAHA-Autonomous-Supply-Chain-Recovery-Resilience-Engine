import React from 'react';
import { ShieldCheck, Cpu, Settings, Activity } from 'lucide-react';

interface HeaderProps {
  llmProvider: string;
  onOpenConfig: () => void;
  isAgentRunning: boolean;
  resilienceScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  llmProvider,
  onOpenConfig,
  isAgentRunning,
  resilienceScore
}) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-cyan-950 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-lg shadow-cyan-500/10">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              NIRVAHA
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
              Tech Zephyr 4.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Autonomous Supply Chain Recovery & Resilience Engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Resilience Score Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-400">Resilience Index:</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {resilienceScore.toFixed(1)} / 100
          </span>
        </div>

        {/* LLM Status Indicator & Button */}
        <button
          onClick={onOpenConfig}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 rounded-lg transition"
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Provider: <strong className="uppercase text-cyan-400 font-mono">{llmProvider}</strong></span>
          <Settings className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Live System Pulse */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{isAgentRunning ? 'AGENT ACTIVE' : 'DIGITAL TWIN ONLINE'}</span>
        </div>
      </div>
    </header>
  );
};
