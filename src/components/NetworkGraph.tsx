import React from 'react';
import { NetworkState } from '../types';
import { Factory, Warehouse as WarehouseIcon, Store, Truck, AlertOctagon } from 'lucide-react';

interface NetworkGraphProps {
  state: NetworkState | null;
}

interface CityCoord {
  x: number;
  y: number;
  type: 'SUPPLIER' | 'WAREHOUSE' | 'RETAILER';
  name: string;
}

const CITY_COORDS: Record<string, CityCoord> = {
  'Chennai': { x: 520, y: 440, type: 'SUPPLIER', name: 'Chennai (Supplier)' },
  'Bengaluru': { x: 420, y: 410, type: 'SUPPLIER', name: 'Bengaluru (Supplier/Retail)' },
  'Pune': { x: 260, y: 320, type: 'SUPPLIER', name: 'Pune (Supplier)' },
  'Hyderabad': { x: 450, y: 330, type: 'WAREHOUSE', name: 'Hyderabad (Central Hub)' },
  'Mumbai': { x: 230, y: 300, type: 'WAREHOUSE', name: 'Mumbai (Western Hub)' },
  'Delhi': { x: 340, y: 120, type: 'RETAILER', name: 'Delhi (Superstore/Hub)' },
  'Kolkata': { x: 700, y: 260, type: 'RETAILER', name: 'Kolkata (Retail Hub)' },
  'Ahmedabad': { x: 220, y: 220, type: 'RETAILER', name: 'Ahmedabad (Retail)' },
};

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ state }) => {
  if (!state) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 h-[420px] flex items-center justify-center text-slate-500">
        Loading Supply Chain Digital Twin Topology...
      </div>
    );
  }

  const disruptionsByEntity = new Set(
    state.disruptions.filter(d => d.status === 'ACTIVE').map(d => d.entity_id)
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            Live Digital Twin Topology (India Network)
          </h2>
          <p className="text-xs text-slate-400">Real-time status of Suppliers, Distribution Hubs, Routes & Retail Stores</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Active</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Degraded</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span> Disrupted</div>
        </div>
      </div>

      <div className="w-full h-[380px] bg-slate-950/60 rounded-xl border border-slate-800/80 relative overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 850 500">
          <defs>
            <linearGradient id="routeNormal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="routeClosed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Render Routes (Edges) */}
          {state.routes.map(r => {
            const orig = CITY_COORDS[r.origin];
            const dest = CITY_COORDS[r.destination];
            if (!orig || !dest) return null;

            const isClosed = r.status === 'CLOSED' || disruptionsByEntity.has(r.id);

            return (
              <g key={r.id}>
                <line
                  x1={orig.x}
                  y1={orig.y}
                  x2={dest.x}
                  y2={dest.y}
                  stroke={isClosed ? 'url(#routeClosed)' : 'url(#routeNormal)'}
                  strokeWidth={isClosed ? 3 : 2}
                  strokeDasharray={isClosed ? '6 4' : 'none'}
                />
                {/* Distance Label */}
                <text
                  x={(orig.x + dest.x) / 2}
                  y={(orig.y + dest.y) / 2 - 6}
                  fill={isClosed ? '#f43f5e' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                  className="font-semibold"
                >
                  {r.id} ({r.distance_km}km) {isClosed ? '⛔ CLOSED' : ''}
                </text>
              </g>
            );
          })}

          {/* Render Active Shipments */}
          {state.routes.map(r => {
            const orig = CITY_COORDS[r.origin];
            const dest = CITY_COORDS[r.destination];
            if (!orig || !dest || r.status === 'CLOSED') return null;

            return (
              <circle
                key={`anim-${r.id}`}
                cx={(orig.x + dest.x) / 2}
                cy={(orig.y + dest.y) / 2}
                r="4"
                fill="#38bdf8"
                className="animate-ping"
              />
            );
          })}

          {/* Render City Nodes */}
          {Object.entries(CITY_COORDS).map(([cityName, coord]) => {
            // Find supplier / warehouse / store in state
            const sup = state.suppliers.find(s => s.location === cityName);
            const wh = state.warehouses.find(w => w.location === cityName);
            const store = state.retail_stores.find(st => st.location === cityName);

            const isDisrupted = (sup && (sup.status === 'DISRUPTED' || disruptionsByEntity.has(sup.id))) ||
                                (store && disruptionsByEntity.has(store.id));
            const isDegraded = sup && sup.status === 'CAPACITY_REDUCED';

            let nodeColor = 'fill-emerald-500 stroke-emerald-400';
            if (isDisrupted) nodeColor = 'fill-rose-600 stroke-rose-400 animate-pulse';
            else if (isDegraded) nodeColor = 'fill-amber-500 stroke-amber-400';

            return (
              <g key={cityName} transform={`translate(${coord.x}, ${coord.y})`}>
                <circle r="18" className={`${nodeColor} stroke-2 drop-shadow-md cursor-pointer`} />
                
                <text
                  x="0"
                  y="32"
                  fill="#f1f5f9"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {cityName}
                </text>

                <text
                  x="0"
                  y="45"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {coord.type}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
