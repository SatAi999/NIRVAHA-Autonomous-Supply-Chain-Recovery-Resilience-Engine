import React from 'react';
import { X, Terminal, CheckCircle2, Cpu, Code } from 'lucide-react';
import { AgentTrace } from '../types';

interface TraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  traces: AgentTrace[];
}

export const AgentTraceModal: React.FC<TraceModalProps> = ({ isOpen, onClose, traces }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-100">Full Agent Decision Trace & Tool Inspector</h3>
            <p className="text-xs text-slate-400">Step-by-step audit log of agent observations, tool calls, and reasoning</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs">
          {traces.length === 0 ? (
            <div className="py-12 text-center text-slate-500 italic">No agent traces logged yet.</div>
          ) : (
            traces.map((t) => (
              <div key={t.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">Step #{t.step_index}</span>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full font-bold text-[10px]">
                      {t.phase}
                    </span>
                    {t.tool_called && (
                      <span className="text-purple-400 font-semibold text-[11px]">
                        tool: {t.tool_called}()
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(t.created_at).toLocaleString()}</span>
                </div>

                <div className="text-slate-300">
                  <strong className="text-slate-400">Evidence:</strong> {t.evidence}
                </div>

                {t.reasoning && (
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-300 text-[11px]">
                    <strong className="text-cyan-400">Reasoning:</strong> {t.reasoning}
                  </div>
                )}

                {t.tool_output && (
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">TOOL OUTPUT PAYLOAD:</span>
                    <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-[10px] text-cyan-300 overflow-x-auto">
                      {JSON.stringify(t.tool_output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
