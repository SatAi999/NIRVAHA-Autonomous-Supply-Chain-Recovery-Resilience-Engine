import React from 'react';
import { Plan } from '../types';
import { Layers, AlertTriangle, CheckCircle2, DollarSign, Clock, Leaf, Shield } from 'lucide-react';

interface PlanViewProps {
  plans: Plan[];
}

export const CurrentPlanView: React.FC<PlanViewProps> = ({ plans }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 h-[460px] flex flex-col">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Recovery Plan Versioning (V1, V2, V3)
        </h2>
        <span className="text-xs text-slate-400 font-mono">Total Versions: {plans.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {plans.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
            No recovery plan generated yet.
          </div>
        ) : (
          plans.map(plan => {
            const isInvalid = plan.status === 'INVALIDATED';

            return (
              <div
                key={plan.id}
                className={`p-4 rounded-xl border transition ${
                  isInvalid
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-950/80 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-800 font-bold font-mono text-xs text-slate-200 rounded">
                      Plan V{plan.version}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        isInvalid
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {plan.id}
                  </span>
                </div>

                {isInvalid && plan.invalidation_reason && (
                  <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/20 rounded text-[11px] text-rose-300 flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>INVALIDATION REASON:</strong> {plan.invalidation_reason}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2 text-xs font-mono mb-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">TOTAL COST</span>
                    <strong className="text-slate-200">₹{plan.cost?.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">LEAD TIME</span>
                    <strong className="text-cyan-400">{plan.delay_hours} hrs</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">CARBON</span>
                    <strong className="text-amber-400">{plan.carbon_impact} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EXPECTED SLA</span>
                    <strong className="text-emerald-400">{plan.expected_sla}%</strong>
                  </div>
                </div>

                {/* Actions list */}
                {plan.actions && plan.actions.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Executed Plan Actions:</span>
                    {plan.actions.map((act: any, idx: number) => (
                      <div key={idx} className="text-[11px] font-mono text-slate-300 bg-slate-900/40 px-2 py-1 rounded">
                        • {act.action_type}: {act.quantity} units via Route {act.route_id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
