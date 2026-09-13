import React from 'react';
import { AgentTrace } from '../types';
import { Terminal, Search, Sliders, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface TimelineProps {
  traces: AgentTrace[];
}

export const AgentActivityTimeline: React.FC<TimelineProps> = ({ traces }) => {
  const getPhaseBadge = (phase: AgentTrace['phase']) => {
    switch (phase) {
      case 'OBSERVE':
        return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded">OBSERVE</span>;
      case 'INVESTIGATE':
        return <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold rounded">INVESTIGATE</span>;
      case 'OPTIMIZE':
        return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold rounded">OPTIMIZE</span>;
      case 'ACT':
        return <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold rounded">EXECUTE</span>;
      case 'VERIFY':
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">VERIFY</span>;
      case 'REPLAN':
        return <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold rounded">REPLAN</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded">{phase}</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 h-[460px] flex flex-col">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          Autonomous Decision Trace Timeline
        </h2>
        <span className="text-xs text-slate-400 font-mono">Steps logged: {traces.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {traces.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
            No agent traces logged yet. Click "Trigger NIRVAHA Recovery" above to begin.
          </div>
        ) : (
          traces.map(trace => (
            <div
              key={trace.id || `${trace.step_index}-${trace.created_at}`}
              className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg font-mono text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">#{trace.step_index}</span>
                  {getPhaseBadge(trace.phase)}
                  {trace.tool_called && (
                    <span className="text-cyan-400 font-semibold text-[11px]">
                      tool: {trace.tool_called}()
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">
                  {trace.created_at ? new Date(trace.created_at).toLocaleTimeString() : ''}
                </span>
              </div>

              <p className="text-slate-300 text-[11px]">
                <strong className="text-slate-400">Evidence:</strong> {trace.evidence}
              </p>

              {trace.reasoning && (
                <p className="text-slate-400 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/50">
                  <strong className="text-cyan-400">Agent Reasoning:</strong> {trace.reasoning}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
