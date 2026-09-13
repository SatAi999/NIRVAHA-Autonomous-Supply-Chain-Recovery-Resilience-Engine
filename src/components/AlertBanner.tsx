import React from 'react';
import { AlertTriangle, ArrowUpRight } from 'lucide-react';

interface AlertBannerProps {
  activeDisruptionsCount: number;
  onTriggerRecovery: () => void;
  isAgentRunning: boolean;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  activeDisruptionsCount,
  onTriggerRecovery,
  isAgentRunning
}) => {
  return (
    <div className="bg-[#241e15] border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#f5a623] text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
          !
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#f5a623] flex items-center gap-2">
            <span>STABILIZING SUPPLY CHAIN SLA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          </h3>
          <p className="text-xs font-medium text-slate-300 mt-0.5">
            {activeDisruptionsCount > 0
              ? `Critical alerts active (${activeDisruptionsCount} disruptions). Initiate agent recovery loop.`
              : 'Network operating under normal constraints. Shift SLA window active.'}
          </p>
        </div>
      </div>

      <button
        onClick={onTriggerRecovery}
        disabled={isAgentRunning}
        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-white text-slate-950 flex items-center justify-center shadow-md transition transform hover:scale-105 shrink-0"
        title="Execute Recovery Strategy"
      >
        <ArrowUpRight className="w-5 h-5" />
      </button>
    </div>
  );
};
