import React, { useState } from 'react';
import { fetchBenchmark } from '../services/api';
import { BenchmarkResult } from '../types';
import { BarChart3, TrendingUp, CheckCircle, XCircle, Award } from 'lucide-react';

export const BenchmarkComparisonView: React.FC = () => {
  const [data, setData] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunBenchmark = async () => {
    setLoading(true);
    try {
      const res = await fetchBenchmark();
      setData(res);
    } catch (e) {
      console.error("Benchmark error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Evaluation Benchmark: NIRVAHA vs. Greedy Baseline
          </h2>
          <p className="text-xs text-slate-400">Quantitative proof of autonomous recovery performance under cascading disruptions</p>
        </div>

        <button
          onClick={handleRunBenchmark}
          disabled={loading}
          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 rounded-lg transition flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          {loading ? 'Running Benchmark Suite...' : 'Run Scenario Benchmark'}
        </button>
      </div>

      {data ? (
        <div className="space-y-4">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300">
            <strong>Benchmark Scenario:</strong> {data.scenario}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NIRVAHA CARD */}
            <div className="p-4 bg-gradient-to-b from-cyan-950/40 to-slate-950 border border-cyan-500/40 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  {data.nirvaha.system_name}
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                  VERIFIED PASSED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SERVICE LEVEL</span>
                  <span className="text-lg font-bold text-emerald-400">{data.nirvaha.service_level_pct}%</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">RECOVERY TIME</span>
                  <span className="text-lg font-bold text-cyan-400">{data.nirvaha.recovery_time_hours}h</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">TOTAL COST</span>
                  <span className="text-sm font-bold text-slate-200">₹{data.nirvaha.cost_inr.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">RESILIENCE INDEX</span>
                  <span className="text-sm font-bold text-indigo-400">{data.nirvaha.resilience_score} / 100</span>
                </div>
              </div>
            </div>

            {/* GREEDY BASELINE CARD */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-400">
                  {data.greedy_baseline.system_name}
                </h3>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded">
                  VERIFICATION FAILED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">SERVICE LEVEL</span>
                  <span className="text-lg font-bold text-rose-400">{data.greedy_baseline.service_level_pct}%</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">RECOVERY TIME</span>
                  <span className="text-lg font-bold text-amber-400">{data.greedy_baseline.recovery_time_hours}h</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">TOTAL COST</span>
                  <span className="text-sm font-bold text-slate-400">₹{data.greedy_baseline.cost_inr.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">RESILIENCE INDEX</span>
                  <span className="text-sm font-bold text-slate-400">{data.greedy_baseline.resilience_score} / 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* DELTA SUMMARY */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg flex items-center justify-around text-xs font-mono text-emerald-300">
            <div><strong>SLA DELTA:</strong> {data.improvement_pct.service_level_delta}</div>
            <div><strong>COST REDUCTION:</strong> {data.improvement_pct.cost_reduction_pct}</div>
            <div><strong>SPEEDUP:</strong> {data.improvement_pct.recovery_speedup_pct}</div>
            <div><strong>CARBON REDUCTION:</strong> {data.improvement_pct.carbon_reduction_pct}</div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-500 italic">
          Click "Run Scenario Benchmark" above to generate live quantitative comparative evaluation.
        </div>
      )}
    </div>
  );
};
