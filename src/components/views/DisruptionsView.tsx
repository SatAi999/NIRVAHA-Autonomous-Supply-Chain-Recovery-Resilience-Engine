import React, { useState } from 'react';
import { NetworkState } from '../../types';
import { Briefcase, Flame, ShieldAlert, AlertOctagon, TrendingUp, RefreshCw, Play, CheckCircle2, Award, ArrowRight } from 'lucide-react';

interface DisruptionsViewProps {
  state: NetworkState | null;
  onInjectDisruption: (type: string, entity_id: string, severity?: number, desc?: string) => void;
  onResetEnv: () => void;
  onRunAgent: () => void;
  isAgentRunning: boolean;
}

export const DisruptionsView: React.FC<DisruptionsViewProps> = ({
  state,
  onInjectDisruption,
  onResetEnv,
  onRunAgent,
  isAgentRunning
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeDisruptions = state?.disruptions.filter(d => d.status === 'ACTIVE') ?? [];

  const handleExecuteRecovery = async () => {
    setToastMessage("Executing LangGraph Agent Recovery Cycle...");
    await onRunAgent();
    setToastMessage("✓ Agent Recovery Cycle Completed! Plan generated & SQLite state updated.");
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleInject = async (type: string, entity_id: string, severity?: number, desc?: string) => {
    await onInjectDisruption(type, entity_id, severity, desc);
    setToastMessage(`✓ Disruption injected: ${type} on ${entity_id}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReset = async () => {
    await onResetEnv();
    setToastMessage("✓ Digital Twin Environment Reset to Healthy Baseline State!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-4 bg-cyan-950/90 border border-cyan-500/50 rounded-2xl text-cyan-300 text-xs font-mono font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-cyan-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 flex items-center justify-between shadow-xl flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Disruption Control Console</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            Failure Scenario Mutator & Incident Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Inject real state-mutating failures into SQLite Digital Twin to evaluate autonomous agent replanning
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 rounded-2xl transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset State</span>
          </button>

          <button
            onClick={handleExecuteRecovery}
            disabled={isAgentRunning}
            className={`px-6 py-3 text-xs font-black rounded-2xl shadow-xl transition flex items-center gap-2.5 ${
              isAgentRunning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/20 transform hover:scale-105'
            }`}
          >
            <Play className={`w-4 h-4 ${isAgentRunning ? 'animate-spin' : ''}`} />
            <span>{isAgentRunning ? 'Agent Replanning...' : 'Trigger Recovery Cycle'}</span>
          </button>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleInject('SUPPLIER_SHUTDOWN', 'SUP-CHE-01', 1.0, 'Chennai Plant Shutdown')}
          className="p-5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-2xl text-left transition group"
        >
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1">
            <Flame className="w-5 h-5" />
            Supplier A Shutdown
          </div>
          <p className="text-xs text-slate-400">Chennai Tech Supplies facility shuts down 100%.</p>
        </button>

        <button
          onClick={() => handleInject('CAPACITY_REDUCTION', 'SUP-BLR-02', 0.50, 'Bengaluru Raw Material Shortage')}
          className="p-5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-2xl text-left transition group"
        >
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
            <ShieldAlert className="w-5 h-5" />
            Supplier B 50% Drop
          </div>
          <p className="text-xs text-slate-400">Recovery Supplier loses 50% available capacity.</p>
        </button>

        <button
          onClick={() => handleInject('ROUTE_CLOSURE', 'R-HYD-DEL', 1.0, 'Flooding on NH44 Highway')}
          className="p-5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-2xl text-left transition group"
        >
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1">
            <AlertOctagon className="w-5 h-5" />
            Highway Route Closure
          </div>
          <p className="text-xs text-slate-400">NH44 Highway from Hyderabad to Delhi closes.</p>
        </button>

        <button
          onClick={() => handleInject('DEMAND_SPIKE', 'RET-DEL-01', 2.0, 'Delhi Festival Demand Surge')}
          className="p-5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-2xl text-left transition group"
        >
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1">
            <TrendingUp className="w-5 h-5" />
            Demand Spike 2x
          </div>
          <p className="text-xs text-slate-400">Delhi store demand target doubles instantly.</p>
        </button>
      </div>

      {/* Active Disruptions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
          <span>Active Disruptions Log ({activeDisruptions.length})</span>
          <span className="text-xs text-slate-400 font-mono font-normal">Stateful SQLite Table</span>
        </h3>

        {activeDisruptions.length === 0 ? (
          <div className="py-8 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            No active disruptions. Supply chain operating normally.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">ENTITY</th>
                  <th className="p-3">SEVERITY</th>
                  <th className="p-3">DESCRIPTION</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeDisruptions.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-cyan-400 font-bold">{d.id}</td>
                    <td className="p-3 font-bold text-amber-400">{d.type}</td>
                    <td className="p-3 text-slate-200">{d.entity_id}</td>
                    <td className="p-3 text-rose-400 font-bold">{(d.severity * 100).toFixed(0)}%</td>
                    <td className="p-3 text-slate-300">{d.description}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[10px]">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
