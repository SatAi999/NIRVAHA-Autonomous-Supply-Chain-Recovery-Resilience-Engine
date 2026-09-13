import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import { Plan } from '../types';

interface TimingCardProps {
  plans?: Plan[];
  leadTimeHours?: number;
}

export const TimingClockCard: React.FC<TimingCardProps> = ({ plans, leadTimeHours: explicitLeadTime }) => {
  const activePlan = plans && plans.length > 0 ? plans[0] : null;
  const leadTimeHours = explicitLeadTime ?? (activePlan?.delay_hours || 34.0);

  // Dynamic calculations for analog clock dial hands & progress arc
  const hourHandAngle = ((leadTimeHours % 24) / 24) * 360;
  const minuteHandAngle = (leadTimeHours % 1) * 360 + leadTimeHours * 12;
  const strokeOffset = Math.max(0, 238 - (Math.min(leadTimeHours, 72) / 72) * 238);

  return (
    <div className="bg-[#d6e5d8] text-slate-950 rounded-[28px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px] border border-emerald-300/40">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight uppercase text-slate-950 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-950" />
          OPERATIONAL TIMING
        </h2>

        <button className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-md">
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Analog Clock Dial Widget */}
      <div className="flex flex-col items-center justify-center my-3 relative">
        <div className="w-36 h-36 rounded-full border-4 border-slate-950/20 bg-slate-950/5 relative flex items-center justify-center shadow-inner">
          {/* Hour Markers */}
          <span className="absolute top-1 text-[11px] font-black text-slate-950 font-mono">12</span>
          <span className="absolute right-2 text-[11px] font-black text-slate-950 font-mono">3</span>
          <span className="absolute bottom-1 text-[11px] font-black text-slate-950 font-mono">6</span>
          <span className="absolute left-2 text-[11px] font-black text-slate-950 font-mono">9</span>

          {/* Dynamic Concentric Progress Arc */}
          <svg className="w-full h-full absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" stroke="rgba(15, 23, 42, 0.15)" strokeWidth="6" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#f43f5e"
              strokeWidth="6"
              strokeDasharray="238"
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Dynamic Clock Hands */}
          <div
            style={{ transform: `rotate(${hourHandAngle}deg)` }}
            className="w-1.5 h-12 bg-slate-950 rounded-full absolute bottom-1/2 origin-bottom transition-transform duration-700 shadow-sm"
          ></div>
          <div
            style={{ transform: `rotate(${minuteHandAngle}deg)` }}
            className="w-1 h-14 bg-rose-600 rounded-full absolute bottom-1/2 origin-bottom transition-transform duration-700"
          ></div>
          <div className="w-3.5 h-3.5 bg-slate-950 rounded-full z-10 border-2 border-[#d6e5d8]"></div>
        </div>

        <div className="mt-2 text-center">
          <span className="text-xs font-black font-mono tracking-wider text-slate-950 uppercase bg-slate-950/10 px-3 py-1 rounded-full">
            EST. LEAD TIME: {leadTimeHours.toFixed(1)} HOURS
          </span>
        </div>
      </div>

      {/* Bottom Status Indicators */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-950 pt-2 border-t border-slate-950/15">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Peak Recovery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-950/30"></span>
          <span>SLA Window</span>
        </div>
        <span className="font-mono font-bold">IST +05:30</span>
      </div>
    </div>
  );
};
