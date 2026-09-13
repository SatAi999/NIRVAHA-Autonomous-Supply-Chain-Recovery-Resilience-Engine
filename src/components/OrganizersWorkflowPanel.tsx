import React from 'react';
import { AgentTrace, Plan, NetworkState } from '../types';
import { CheckCircle2, ShieldCheck, Activity, Zap, RotateCcw, AlertTriangle, Play } from 'lucide-react';

interface WorkflowPanelProps {
  traces: AgentTrace[];
  plans: Plan[];
  networkState: NetworkState | null;
  isAgentRunning: boolean;
  onInjectDisruption: (type: string, entity_id: string, severity?: number, desc?: string) => Promise<void>;
  onRunAgent: () => Promise<void>;
  onResetEnv: () => Promise<void>;
}

export const OrganizersWorkflowPanel: React.FC<WorkflowPanelProps> = ({
  traces,
  plans,
  networkState,
  isAgentRunning,
  onInjectDisruption,
  onRunAgent,
  onResetEnv
}) => {
  const activeDisruptionsCount = networkState?.kpis.active_disruptions_count ?? 0;
  const latestTrace = traces.length > 0 ? traces[traces.length - 1] : null;

  const step1Done = networkState !== null;
  const step2Done = activeDisruptionsCount > 0;
  const step3Done = traces.some(t => t.phase === 'INVESTIGATE');
  const step4Done = traces.some(t => t.phase === 'OPTIMIZE');
  const step5Done = traces.some(t => t.phase === 'ACT');
  const step6Done = traces.some(t => t.phase === 'VERIFY');
  const step7Done = plans.some(p => p.status === 'INVALIDATED' || p.version > 1);

  const steps = [
    { num: 1, title: "1. Monitor State", desc: "Read inventory, suppliers, routes", active: step1Done, color: "text-emerald-400 border-emerald-500/30" },
    { num: 2, title: "2. Detect Disruption", desc: "Identify bottleneck / shortage", active: step2Done, color: "text-rose-400 border-rose-500/30" },
    { num: 3, title: "3. Investigate Alts", desc: "Search active suppliers & routes", active: step3Done, color: "text-purple-400 border-purple-500/30" },
    { num: 4, title: "4. Multi-Obj Solve", desc: "Cost, Lead Time, Carbon, SLA", active: step4Done, color: "text-amber-400 border-amber-500/30" },
    { num: 5, title: "5. Execute Action", desc: "Create PO / Stock Transfer", active: step5Done, color: "text-cyan-400 border-cyan-500/30" },
    { num: 6, title: "6. Verify DB State", desc: "Independent SQLite post-audit", active: step6Done, color: "text-emerald-400 border-emerald-500/30" },
    { num: 7, title: "7. Replan & Adapt", desc: "Invalidate plan & adapt version", active: step7Done, color: "text-indigo-400 border-indigo-500/30" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-0.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Problem Statement 6 — Real-Time Agentic Loop</span>
          </div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight">
            Autonomous Retail Recovery 7-Step Workflow Monitor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Live observation of state mutations, tool calls, and replanning on SQLite Digital Twin
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-full text-xs font-mono text-cyan-400 font-bold">
          <Activity className={`w-4 h-4 ${isAgentRunning ? 'animate-spin text-cyan-400' : 'text-emerald-400'}`} />
          <span>{isAgentRunning ? 'AGENT REPLANNING LOOP ACTIVE' : `CURRENT PHASE: ${latestTrace ? latestTrace.phase : 'MONITORING'}`}</span>
        </div>
      </div>

      {/* 1-CLICK INTERACTIVE SCENARIO CONTROLLER BAR */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase font-mono">
          <Zap className="w-4 h-4 animate-bounce text-amber-400" />
          <span>1-Click Scenario Actions:</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onResetEnv()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>1. Reset Baseline</span>
          </button>

          <button
            onClick={() => onInjectDisruption('SUPPLIER_SHUTDOWN', 'SUP-CHE-01', 1.0, 'Chennai Supplier Plant Emergency Shutdown')}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>2. Inject Chennai Shutdown (T1)</span>
          </button>

          <button
            onClick={() => onRunAgent()}
            disabled={isAgentRunning}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isAgentRunning ? 'Running Recovery Agent...' : '3. Run Autonomous Recovery Agent'}</span>
          </button>

          <button
            onClick={() => onInjectDisruption('ROUTE_CLOSURE', 'R-HYD-DEL', 1.0, 'Monsoon Flood Route Closure on NH44')}
            className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
            <span>4. Inject Highway Route Closure (T3)</span>
          </button>
        </div>
      </div>

      {/* 7-Step Required Workflow Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {steps.map(s => (
          <div
            key={s.num}
            className={`p-3 rounded-2xl border transition ${
              s.active
                ? `bg-slate-950/90 ${s.color} shadow-md`
                : 'bg-slate-950/40 border-slate-800/80 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] font-bold">STEP #{s.num}</span>
              {s.active ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              )}
            </div>
            <h4 className="font-bold text-[11px] leading-tight mb-0.5 text-slate-200">{s.title}</h4>
            <p className="text-[10px] text-slate-400 leading-tight">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

