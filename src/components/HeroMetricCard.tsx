import React from 'react';
import { NetworkState } from '../types';
import { Activity, TrendingUp, DollarSign, Target } from 'lucide-react';

interface HeroCardProps {
  kpis?: NetworkState['kpis'];
  resilienceScore: number;
}

export const HeroMetricCard: React.FC<HeroCardProps> = ({ kpis, resilienceScore }) => {
  const sla = kpis?.overall_service_level_pct ?? 98.2;
  const fulfilled = kpis?.total_fulfilled ?? 3200;
  const unmet = kpis?.unmet_demand ?? 0;

  const barData = [
    { day: 'Mon', val: 65, active: false },
    { day: 'Tue', val: 78, active: false },
    { day: 'Wed', val: 92, active: false },
    { day: 'Thu', val: 98, active: true, tag: '₹2,11,50.88' },
    { day: 'Fri', val: 85, active: false },
    { day: 'Sat', val: 89, active: false },
    { day: 'Sun', val: 74, active: false },
  ];

  return (
    <div className="bg-gradient-to-br from-[#ff5b52] via-[#fa4f45] to-[#f03e35] text-slate-950 rounded-[28px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center text-slate-950">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-950">
            SLA & REVENUE PERFORMANCE
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 bg-slate-950/15 rounded-full border border-slate-950/20 text-slate-950">
            Target SLA ≥ 95%
          </span>
          <span className="px-3 py-1 bg-slate-950/15 rounded-full border border-slate-950/20 text-slate-950 font-mono">
            INR, ₹
          </span>
        </div>
      </div>

      {/* Main Metric Numbers Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-10 my-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950/80 mb-1">
            <span>TARGET SERVICE LEVEL</span>
            <span className="px-2 py-0.5 bg-slate-950 text-white rounded-full text-[10px] font-mono">
              +7.5%
            </span>
          </div>
          <div className="text-4xl lg:text-5xl font-black font-mono tracking-tight text-slate-950">
            {sla.toFixed(1)}%
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950/80 mb-1">
            <span>UNMET DEMAND SHORTAGE</span>
            <span className="px-2 py-0.5 bg-slate-950 text-white rounded-full text-[10px] font-mono">
              +2.4%
            </span>
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-slate-950">
            {unmet.toLocaleString()} <span className="text-base font-bold">UNITS</span>
          </div>
          <p className="text-[11px] font-medium text-slate-950/80 mt-0.5">
            Fulfilled: {fulfilled.toLocaleString()} units
          </p>
        </div>
      </div>

      {/* Bottom Mini Bar Chart Backdrop */}
      <div className="flex items-end justify-between gap-2 pt-4 border-t border-slate-950/15 z-10">
        {barData.map((b, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            {b.active && (
              <div className="absolute -top-7 px-2 py-0.5 bg-slate-950 text-white text-[10px] font-mono font-bold rounded-full shadow-md whitespace-nowrap">
                {b.tag}
              </div>
            )}
            <div className="w-full bg-slate-950/15 rounded-t-lg h-16 flex items-end p-0.5">
              <div
                style={{ height: `${b.val}%` }}
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  b.active ? 'bg-slate-950' : 'bg-slate-950/40 group-hover:bg-slate-950/60'
                }`}
              />
            </div>
            <span className={`text-[10px] font-bold ${b.active ? 'text-slate-950 font-black' : 'text-slate-950/70'}`}>
              {b.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
