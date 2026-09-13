import React from 'react';
import { Target, Clock, AlertTriangle, Leaf, Award } from 'lucide-react';
import { NetworkState } from '../types';

interface MetricsProps {
  kpis?: NetworkState['kpis'];
  resilienceScore: number;
}

export const MetricsKpiCards: React.FC<MetricsProps> = ({ kpis, resilienceScore }) => {
  const sla = kpis?.overall_service_level_pct ?? 100;
  const activeDisruptions = kpis?.active_disruptions_count ?? 0;
  const unmetDemand = kpis?.unmet_demand ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Target Service Level (SLA)</p>
          <h3 className={`text-2xl font-bold font-mono mt-1 ${sla >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {sla.toFixed(1)}%
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Goal: ≥ 95.0%</p>
        </div>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
          <Target className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Active Disruptions</p>
          <h3 className={`text-2xl font-bold font-mono mt-1 ${activeDisruptions > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {activeDisruptions}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            {activeDisruptions > 0 ? 'Action Required' : 'Network Stable'}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${activeDisruptions > 0 ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Unmet Demand Shortage</p>
          <h3 className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {unmetDemand.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Across Retail Nodes</p>
        </div>
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">System Resilience Score</p>
          <h3 className="text-2xl font-bold font-mono text-indigo-400 mt-1">
            {resilienceScore.toFixed(1)} / 100
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Multi-Objective Index</p>
        </div>
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
          <Award className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
