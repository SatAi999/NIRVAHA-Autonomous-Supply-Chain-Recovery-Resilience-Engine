import React from 'react';
import { AlertOctagon, RefreshCw, Play, Zap, Flame, ShieldAlert, TrendingUp } from 'lucide-react';

interface DisruptionPanelProps {
  onInject: (type: string, entity_id: string, severity?: number, desc?: string) => void;
  onReset: () => void;
  onRunAgent: () => void;
  isAgentRunning: boolean;
}

export const DisruptionPanel: React.FC<DisruptionPanelProps> = ({
  onInject,
  onReset,
  onRunAgent,
  isAgentRunning
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Disruption Scenario Control & Autonomous Execution
          </h2>
          <p className="text-xs text-slate-400">Inject real state-mutating failures into SQLite Digital Twin to test Agent replanning</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Twin State
          </button>

          <button
            onClick={onRunAgent}
            disabled={isAgentRunning}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition shadow-lg ${
              isAgentRunning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
            }`}
          >
            <Play className={`w-4 h-4 ${isAgentRunning ? 'animate-spin' : ''}`} />
            {isAgentRunning ? 'Agent Replanning...' : 'Trigger NIRVAHA Recovery'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          onClick={() => onInject('SUPPLIER_SHUTDOWN', 'SUP-CHE-01', 1.0, 'Chennai Plant Fire Shutdown')}
          className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-left transition group"
        >
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-1">
            <Flame className="w-4 h-4" />
            T1: Supplier A Shutdown
          </div>
          <p className="text-[11px] text-slate-400">Chennai Tech Supplies goes 100% offline.</p>
        </button>

        <button
          onClick={() => onInject('CAPACITY_REDUCTION', 'SUP-BLR-02', 0.50, 'Bengaluru Raw Material Shortage')}
          className="p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-left transition group"
        >
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
            <ShieldAlert className="w-4 h-4" />
            T2: Supplier B 50% Drop
          </div>
          <p className="text-[11px] text-slate-400">Recovery Supplier loses 50% capacity.</p>
        </button>

        <button
          onClick={() => onInject('ROUTE_CLOSURE', 'R-HYD-DEL', 1.0, 'Flooding on NH44 Highway')}
          className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-left transition group"
        >
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-1">
            <AlertOctagon className="w-4 h-4" />
            T3: Highway Route Closure
          </div>
          <p className="text-[11px] text-slate-400">Hyderabad to Delhi highway closed.</p>
        </button>

        <button
          onClick={() => onInject('DEMAND_SPIKE', 'RET-DEL-01', 2.0, 'Delhi Festival Demand Surge')}
          className="p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-left transition group"
        >
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
            <TrendingUp className="w-4 h-4" />
            T4: Retail Demand Spike 2x
          </div>
          <p className="text-[11px] text-slate-400">Delhi store demand doubles instantly.</p>
        </button>
      </div>
    </div>
  );
};
