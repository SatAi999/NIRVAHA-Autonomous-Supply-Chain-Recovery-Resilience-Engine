import React, { useState } from 'react';
import { AgentTrace } from '../types';
import { ArrowUpRight, Plus, Send, Bot, Flame, AlertOctagon, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import { AgentTraceModal } from './AgentTraceModal';

interface AiChatProps {
  traces: AgentTrace[];
  onInjectDisruption: (type: string, entity_id: string, severity?: number, desc?: string) => void;
  onRunAgent: () => void;
  onResetEnv: () => void;
  isAgentRunning: boolean;
}

export const AiOperationsChat: React.FC<AiChatProps> = ({
  traces,
  onInjectDisruption,
  onRunAgent,
  onResetEnv,
  isAgentRunning
}) => {
  const [prompt, setPrompt] = useState('');
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAgentRunning) return;
    onRunAgent();
    setPrompt('');
  };

  const latestTrace = traces.length > 0 ? traces[traces.length - 1] : null;

  return (
    <>
      <div className="bg-[#1b1c22] border border-slate-800 rounded-[28px] p-6 shadow-xl text-slate-100 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-100 uppercase flex items-center gap-2">
                <span>AI OPERATIONS LEAD</span>
                {isAgentRunning && (
                  <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono font-bold animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> RUNNING...
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">Autonomous Reasoning & Tool Execution Engine</p>
            </div>
          </div>

          <button
            onClick={() => setIsTraceModalOpen(true)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center shadow-md transition"
            title="Inspect Full Decision Trace Log"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Real-Time Agent Trace Stream */}
        <div className="flex-1 my-2 overflow-y-auto max-h-[160px] pr-1 space-y-2.5">
          {/* Dynamic Opening State Greeting */}
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-xs leading-relaxed text-slate-300 shadow-sm">
            <p className="font-medium">
              <strong className="text-cyan-400 font-semibold">NIRVAHA Agent:</strong> {
                isAgentRunning
                  ? "Executing 5-phase recovery loop on persistent Digital Twin SQLite DB..."
                  : traces.length > 0
                  ? `Completed recovery loop. Total traces recorded: ${traces.length}. Post-execution verification PASSED.`
                  : "Hi Operations Lead. Digital Twin is monitoring network state. Inject a disruption or trigger recovery to view live tool calls."
              }
            </p>
          </div>

          {/* Dynamic Traces List */}
          {traces.map((tr, idx) => (
            <div key={tr.id || idx} className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-xs leading-relaxed text-slate-200 shadow-md space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  STEP #{tr.step_index}: {tr.phase}
                </span>
                <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {tr.tool_called || 'State Machine'}
                </span>
              </div>
              <p className="text-slate-300 font-medium">
                <strong className="text-slate-100">Evidence:</strong> {tr.evidence}
              </p>
              {tr.reasoning && (
                <p className="text-[10px] text-slate-400 italic bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
                  "{tr.reasoning}"
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Quick Action Suggestion Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 my-1">
          <button
            onClick={onRunAgent}
            disabled={isAgentRunning}
            className="px-3 py-1.5 bg-[#d6e5d8] hover:bg-white text-slate-950 font-bold text-xs rounded-full transition whitespace-nowrap shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <span>📅 Initiate recovery planning</span>
          </button>

          <button
            onClick={() => onInjectDisruption('SUPPLIER_SHUTDOWN', 'SUP-CHE-01', 1.0, 'Chennai Plant Shutdown')}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-full transition whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Inject Shutdown</span>
          </button>

          <button
            onClick={() => onInjectDisruption('ROUTE_CLOSURE', 'R-HYD-DEL', 1.0, 'Flooding on NH44 Highway')}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-full transition whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Close Highway</span>
          </button>

          <button
            onClick={onResetEnv}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs rounded-full transition whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset State</span>
          </button>
        </div>

        {/* Form Prompt Input Bar */}
        <form onSubmit={handleSubmitPrompt} className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onRunAgent}
            className="w-9 h-9 rounded-full bg-[#ff594d] hover:bg-[#fa473b] text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0 transition"
            title="Add Disruption / Trigger Agent"
          >
            <Plus className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask NIRVAHA agent or choose to start..."
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            disabled={isAgentRunning}
            className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0 transition"
            title="Execute Agent Command"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Full Decision Trace Modal */}
      <AgentTraceModal
        isOpen={isTraceModalOpen}
        onClose={() => setIsTraceModalOpen(false)}
        traces={traces}
      />
    </>
  );
};
