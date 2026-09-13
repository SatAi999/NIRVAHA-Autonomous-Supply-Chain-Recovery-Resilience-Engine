import React, { useState } from 'react';
import { NetworkState } from '../types';
import { Layers } from 'lucide-react';

interface CapacityCardProps {
  suppliers?: NetworkState['suppliers'];
  warehouses?: NetworkState['warehouses'];
}

export const CapacityCard: React.FC<CapacityCardProps> = ({ suppliers, warehouses }) => {
  const [activeLocation, setActiveLocation] = useState('Hyderabad');

  const rings = [
    { day: 'Mon', val: 78 },
    { day: 'Tue', val: 82 },
    { day: 'Wed', val: 91 },
    { day: 'Thu', val: 88 },
    { day: 'Fri', val: 95 },
    { day: 'Sat', val: 93 },
    { day: 'Sun', val: 70 },
  ];

  return (
    <div className="bg-gradient-to-br from-[#5b5ef0] via-[#676af4] to-[#7578f7] text-white rounded-[28px] p-6 shadow-xl flex flex-col justify-between min-h-[260px] relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black tracking-tight uppercase text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-white/90" />
          HUB & CAPACITY UTILIZATION
        </h2>

        <span className="px-3 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur text-white border border-white/20">
          this week
        </span>
      </div>

      {/* Circular Progress Rings Grid */}
      <div className="grid grid-cols-7 gap-2 my-4">
        {rings.map((r, i) => {
          const strokeDashoffset = 100 - r.val;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold text-white/80">{r.day}</span>
              
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-white font-bold"
                    strokeDasharray="100, 100"
                    strokeDashoffset={strokeDashoffset}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-black font-mono text-white">
                  {r.val}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Pills Row */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/15 overflow-x-auto no-scrollbar">
        {['Chennai', 'Hyderabad Hub', 'Mumbai Hub', 'Delhi Store'].map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocation(loc)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
              activeLocation === loc
                ? 'bg-white text-[#5b5ef0] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
};
