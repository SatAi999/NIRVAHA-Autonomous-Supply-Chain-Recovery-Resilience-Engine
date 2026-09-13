import React, { useState } from 'react';
import { NetworkState, BenchmarkResult } from '../../types';
import { fetchBenchmark } from '../../services/api';
import { BarChart3, TrendingUp, DollarSign, Leaf, Clock, Target, Award } from 'lucide-react';

interface AnalyticsViewProps {
  state: NetworkState | null;
  resilienceScore: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ state, resilienceScore }) => {
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunBenchmark = async () => {
    setLoading(true);
    try {
      const res = await fetchBenchmark();
      setBenchmark(res);
    } catch (e) {
      console.error("Benchmark error", e);
    } finally {
      setLoading(false);
    }
  };

  const sla = state?.kpis.overall_service_level_pct ?? 98.2;
  const unmet = state?.kpis.unmet_demand ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 flex items-center justify-between shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Resilience & Recovery Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            Multi-Objective Evaluation & KPI Metrics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quantitative measurement of SLA restoration, cost impact, lead time, and carbon efficiency
          </p>
        </div>

        <button
          onClick={handleRunBenchmark}
          disabled={loading}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          <span>{loading ? 'Running Evaluation...' : 'Run Quantitative Benchmark'}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Overall Service Level (SLA)</span>
          <div className="text-3xl font-black font-mono text-emerald-400 mt-2">{sla.toFixed(1)}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Target Threshold: ≥ 95.0%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">System Resilience Index</span>
          <div className="text-3xl font-black font-mono text-cyan-400 mt-2">{resilienceScore.toFixed(1)} / 100</div>
          <p className="text-[11px] text-slate-500 mt-1">Multi-Objective Score</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Unmet Demand Shortage</span>
          <div className="text-3xl font-black font-mono text-amber-400 mt-2">{unmet.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 mt-1">Units Pending Delivery</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Active Disruptions</span>
          <div className="text-3xl font-black font-mono text-rose-400 mt-2">{state?.kpis.active_disruptions_count ?? 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Network Bottlenecks</p>
        </div>
      </div>

      {/* Quantitative Benchmark Result Cards */}
      {benchmark && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            NIRVAHA vs. Greedy Baseline Comparative Benchmark
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-2xl space-y-2">
              <div className="font-bold text-cyan-400 text-sm">NIRVAHA AUTONOMOUS ENGINE</div>
              <div>Service Level: <strong className="text-emerald-400">{benchmark.nirvaha.service_level_pct}%</strong></div>
              <div>Recovery Speed: <strong className="text-cyan-300">{benchmark.nirvaha.recovery_time_hours} hrs</strong></div>
              <div>Total Cost: <strong className="text-slate-200">₹{benchmark.nirvaha.cost_inr.toLocaleString()}</strong></div>
              <div>Carbon Impact: <strong className="text-amber-400">{benchmark.nirvaha.carbon_kg_co2} kg CO2</strong></div>
            </div>

            <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-2">
              <div className="font-bold text-rose-400 text-sm">GREEDY COST BASELINE</div>
              <div>Service Level: <strong className="text-rose-400">{benchmark.greedy_baseline.service_level_pct}%</strong></div>
              <div>Recovery Speed: <strong className="text-amber-400">{benchmark.greedy_baseline.recovery_time_hours} hrs</strong></div>
              <div>Total Cost: <strong className="text-slate-400">₹{benchmark.greedy_baseline.cost_inr.toLocaleString()}</strong></div>
              <div>Carbon Impact: <strong className="text-slate-400">{benchmark.greedy_baseline.carbon_kg_co2} kg CO2</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
