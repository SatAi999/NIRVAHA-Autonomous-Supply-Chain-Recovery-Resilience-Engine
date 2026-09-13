import React, { useState } from 'react';
import { NetworkState } from '../../types';
import { Map, MapPin, Truck, Factory, Warehouse, Store } from 'lucide-react';
import { NodeDetailsModal } from '../NodeDetailsModal';

interface MapViewProps {
  state: NetworkState | null;
}

export const MapView: React.FC<MapViewProps> = ({ state }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const activeDisruptions = new Set(
    state?.disruptions.filter(d => d.status === 'ACTIVE').map(d => d.entity_id) ?? []
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 flex items-center justify-between shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
            <Map className="w-4 h-4" />
            <span>Digital Twin Topology Inspector</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            Indian Supply Chain Network Map
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Interactive spatial layout of Suppliers, Warehouses, Highways & Retail Nodes. Click any city node to inspect.
          </p>
        </div>
      </div>

      {/* Full Size Interactive Map Container */}
      <div className="bg-[#a2d2df] text-slate-950 rounded-3xl p-6 shadow-2xl relative border border-cyan-300/40 min-h-[460px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2 z-10">
          <span className="px-3 py-1 bg-slate-950 text-white rounded-full text-xs font-mono font-bold">
            Interactive Digital Twin Spatial Overlay
          </span>
          <span className="text-xs text-slate-950 font-bold font-mono">
            8 Cities | 4 Suppliers | 3 Distribution Hubs | 4 Retailers
          </span>
        </div>

        <div className="w-full h-[380px] bg-[#89becd]/40 rounded-2xl relative overflow-hidden border border-slate-950/10">
          {/* Route Overlay Lines */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="55" y1="78" x2="48" y2="56" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="2 1" />
            <line x1="45" y1="72" x2="48" y2="56" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="30" y1="55" x2="25" y2="50" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="48" y1="56" x2="38" y2="22" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="3 2" />
            <line x1="48" y1="56" x2="78" y2="44" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="25" y1="50" x2="38" y2="22" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="25" y1="50" x2="22" y2="38" stroke="#0f172a" strokeWidth="1.5" />
          </svg>

          {/* Interactive City Pins */}
          {[
            { city: 'Chennai', x: 55, y: 78, role: 'Supplier' },
            { city: 'Bengaluru', x: 45, y: 72, role: 'Supplier/Retail' },
            { city: 'Pune', x: 30, y: 55, role: 'Supplier' },
            { city: 'Hyderabad', x: 48, y: 56, role: 'Central Hub' },
            { city: 'Mumbai', x: 25, y: 50, role: 'Western Hub' },
            { city: 'Delhi', x: 38, y: 22, role: 'Delhi Superstore' },
            { city: 'Kolkata', x: 78, y: 44, role: 'Metro Hub' },
            { city: 'Ahmedabad', x: 22, y: 38, role: 'Industrial Retail' },
          ].map((pin) => (
            <div
              key={pin.city}
              onClick={() => setSelectedCity(pin.city)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              <div className="bg-slate-950 text-white px-2 py-0.5 rounded-md text-[9px] font-mono font-bold mb-1 shadow-md opacity-90 group-hover:opacity-100 whitespace-nowrap">
                {pin.city} ({pin.role})
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-950 hover:bg-cyan-500 text-white flex items-center justify-center shadow-lg transition transform group-hover:scale-125 mx-auto">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Details Inspection Modal */}
      <NodeDetailsModal
        cityName={selectedCity}
        onClose={() => setSelectedCity(null)}
        state={state}
      />
    </div>
  );
};
