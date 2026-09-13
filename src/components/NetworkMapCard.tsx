import React, { useState } from 'react';
import { NetworkState } from '../types';
import { MapPin, ArrowUpRight, Map as MapIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { NodeDetailsModal } from './NodeDetailsModal';

interface NetworkMapCardProps {
  state: NetworkState | null;
}

const CITY_PINS: Record<string, { x: number; y: number; label: string; role: string }> = {
  'Chennai': { x: 55, y: 78, label: 'Chennai', role: 'Supplier (Tech Supplies)' },
  'Bengaluru': { x: 45, y: 72, label: 'Bengaluru', role: 'Supplier / Retail' },
  'Pune': { x: 30, y: 55, label: 'Pune', role: 'Supplier (Auto)' },
  'Hyderabad': { x: 48, y: 56, label: 'Hyderabad', role: 'Central Hub' },
  'Mumbai': { x: 25, y: 50, label: 'Mumbai', role: 'Western Hub' },
  'Delhi': { x: 38, y: 22, label: 'Delhi Superstore', role: 'Critical Retail Node' },
  'Kolkata': { x: 78, y: 44, label: 'Kolkata', role: 'Metro Hub' },
  'Ahmedabad': { x: 22, y: 38, label: 'Ahmedabad', role: 'Industrial Retail' },
};

const ROUTE_COORDS: Record<string, { x1: number; y1: number; x2: number; y2: number }> = {
  'R-CHE-HYD': { x1: 55, y1: 78, x2: 48, y2: 56 },
  'R-BLR-HYD': { x1: 45, y1: 72, x2: 48, y2: 56 },
  'R-PUN-BOM': { x1: 30, y1: 55, x2: 25, y2: 50 },
  'R-HYD-DEL': { x1: 48, y1: 56, x2: 38, y2: 22 },
  'R-HYD-KOL': { x1: 48, y1: 56, x2: 78, y2: 44 },
  'R-BOM-DEL': { x1: 25, y1: 50, x2: 38, y2: 22 },
  'R-BOM-AMD': { x1: 25, y1: 50, x2: 22, y2: 38 },
  'R-HYD-BLR': { x1: 48, y1: 56, x2: 45, y2: 72 },
};

export const NetworkMapCard: React.FC<NetworkMapCardProps> = ({ state }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const activeDisruptions = state?.disruptions.filter(d => d.status === 'ACTIVE') ?? [];
  const activeDisruptedEntities = new Set(activeDisruptions.map(d => d.entity_id));

  return (
    <>
      <div className="bg-[#a2d2df] text-slate-950 rounded-[28px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px] border border-cyan-300/40">
        {/* Card Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-950/15 flex items-center justify-center text-slate-950">
              <MapIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase text-slate-950">
                DIGITAL TWIN GEOGRAPHY
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                {activeDisruptions.length > 0 ? (
                  <span className="text-rose-900 bg-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-700" />
                    {activeDisruptions.length} ACTIVE DISRUPTION(S)
                  </span>
                ) : (
                  <span className="text-emerald-900 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    ALL NETWORK NODES OPERATIONAL
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCity('Delhi')}
              className="px-3 py-1 bg-slate-950/15 hover:bg-slate-950/25 rounded-full text-xs font-bold text-slate-950 transition"
            >
              all nodes
            </button>
            <button
              onClick={() => setSelectedCity('Delhi')}
              className="w-8 h-8 rounded-full bg-slate-950 hover:bg-slate-900 text-white flex items-center justify-center shadow-md transition"
              title="Inspect Node Details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Map Canvas */}
        <div className="w-full h-[210px] bg-[#89becd]/40 rounded-2xl relative my-3 overflow-hidden border border-slate-950/10">
          {/* Dynamic SVG Routes Layer */}
          <svg className="w-full h-full absolute inset-0 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {state?.routes.map(r => {
              const coords = ROUTE_COORDS[r.id];
              if (!coords) return null;
              const isClosed = r.status === 'CLOSED' || activeDisruptedEntities.has(r.id);
              const isCongested = r.status === 'CONGESTED';

              return (
                <g key={r.id}>
                  <line
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
                    stroke={isClosed ? '#f43f5e' : isCongested ? '#f59e0b' : '#0f172a'}
                    strokeWidth={isClosed ? '2.5' : '1.5'}
                    strokeDasharray={isClosed ? '3 2' : 'none'}
                    opacity={isClosed ? '1' : '0.6'}
                  />
                  {isClosed && (
                    <circle
                      cx={(coords.x1 + coords.x2) / 2}
                      cy={(coords.y1 + coords.y2) / 2}
                      r="2"
                      fill="#e11d48"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Dynamic Location Markers */}
          {Object.entries(CITY_PINS).map(([cityName, pin]) => {
            const sup = state?.suppliers.find(s => s.location === cityName);
            const isDisrupted = (sup && (sup.status === 'DISRUPTED' || activeDisruptedEntities.has(sup.id)));
            const isCapacityReduced = (sup && sup.status === 'CAPACITY_REDUCED');

            return (
              <div
                key={cityName}
                onClick={() => setSelectedCity(cityName)}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                title={`Click to inspect ${cityName} (${pin.role})`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition transform group-hover:scale-125 ${
                    isDisrupted
                      ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-500/50'
                      : isCapacityReduced
                      ? 'bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-400'
                      : 'bg-slate-950 text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-slate-950/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {cityName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Details Inspection Modal */}
      <NodeDetailsModal
        cityName={selectedCity}
        onClose={() => setSelectedCity(null)}
        state={state}
      />
    </>
  );
};
