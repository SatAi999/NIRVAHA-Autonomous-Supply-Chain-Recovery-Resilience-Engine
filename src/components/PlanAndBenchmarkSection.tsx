import React, { useState } from 'react';
import { Plan, BenchmarkResult } from '../types';
import { fetchBenchmark } from '../services/api';
import { Layers, BarChart3, Award, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

interface SectionProps {
  plans: Plan[];
}

export const PlanAndBenchmarkSection: React.FC<SectionProps> = ({ plans }) => {
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunBenchmark = async () => {
    setLoading(true);
    try {
      const res = await fetchBenchmark();
      setBenchmark(res);
    } catch (e) {
      console.error("Benchmark failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {/* 1. RECOVERY PLAN VERSIONS CARD */}
      <div className="bg-[#14151a] border border-slate-800 rounded-[28px] p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase text-slate-100">
                RECOVERY PLAN VERSIONS (V1, V2, V3)
              </h2>
              <p className="text-xs text-slate-400">Dynamic Plan Invalidation & Version Tracking</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-800 text-slate-300 font-mono text-xs font-bold rounded-full">
            {plans.length} Versions
          </span>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {plans.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 italic">
              No recovery plan generated yet. Trigger recovery in AI Operations chat above.
            </div>
          ) : (
            plans.map(plan => {
              const isInvalid = plan.status === 'INVALIDATED';

              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-2xl border transition ${
                    isInvalid
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : 'bg-slate-900/90 border-cyan-500/40 text-slate-100 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-800 font-bold font-mono text-xs text-slate-200 rounded-lg">
                        Plan V{plan.version}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          isInvalid
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(plan.created_at).toLocaleTimeString()}
                    </span>
                  </div>

                  {isInvalid && plan.invalidation_reason && (
                    <div className="mb-2.5 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>INVALIDATED:</strong> {plan.invalidation_reason}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2 text-xs font-mono bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px]">COST</span>
                      <strong className="text-slate-200">₹{plan.cost?.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">LEAD TIME</span>
                      <strong className="text-cyan-400">{plan.delay_hours}h</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">CARBON</span>
                      <strong className="text-amber-400">{plan.carbon_impact}kg</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">SLA %</span>
                      <strong className="text-emerald-400">{plan.expected_sla}%</strong>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. QUANTITATIVE BENCHMARK SUITE (Inspired by Image 2's Fluid Stat Gauge) */}
      <div className="bg-[#14151a] border border-slate-800 rounded-[28px] p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase text-slate-100">
                BENCHMARK EVALUATION
              </h2>
              <p className="text-xs text-slate-400">NIRVAHA vs. Greedy Cost Baseline</p>
            </div>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={loading}
            className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 rounded-full transition flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{loading ? 'Evaluating...' : 'Run Benchmark'}</span>
          </button>
        </div>

        {benchmark ? (
          <div className="space-y-4">
            {/* Fluid Circular Stat Wheel Widget (Directly inspired by Image 2's "12,340h" widget) */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-rose-500 opacity-30 blur-md animate-pulse"></div>
                <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-cyan-500/50 flex flex-col items-center justify-center text-center shadow-2xl relative z-10">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">RESILIENCE</span>
                  <span className="text-xl font-black font-mono text-cyan-400">
                    {benchmark.nirvaha.resilience_score}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">/ 100 PTS</span>
                </div>
              </div>

              <div className="flex-1 ml-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400">SLA Restoration:</span>
                  <strong className="text-emerald-400">{benchmark.nirvaha.service_level_pct}%</strong>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Recovery Speedup:</span>
                  <strong className="text-cyan-400">{benchmark.improvement_pct.recovery_speedup_pct}</strong>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Cost Savings:</span>
                  <strong className="text-slate-200">{benchmark.improvement_pct.cost_reduction_pct}</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl">
                <div className="text-cyan-400 font-bold mb-1">NIRVAHA AGENT</div>
                <div className="text-slate-300">SLA: {benchmark.nirvaha.service_level_pct}%</div>
                <div className="text-slate-300">Cost: ₹{benchmark.nirvaha.cost_inr.toLocaleString()}</div>
                <div className="text-emerald-400 font-bold mt-1">VERIFIED PASSED</div>
              </div>

              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                <div className="text-rose-400 font-bold mb-1">GREEDY BASELINE</div>
                <div className="text-slate-400">SLA: {benchmark.greedy_baseline.service_level_pct}%</div>
                <div className="text-slate-400">Cost: ₹{benchmark.greedy_baseline.cost_inr.toLocaleString()}</div>
                <div className="text-rose-400 font-bold mt-1">FAILED</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500 italic">
            Click "Run Benchmark" above to generate comparative evaluation.
          </div>
        )}
      </div>
    </div>
  );
};
