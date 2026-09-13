import React from 'react';
import { X, MapPin, Package, ShieldAlert, Truck, Layers } from 'lucide-react';
import { NetworkState } from '../types';

interface ModalProps {
  cityName: string | null;
  onClose: () => void;
  state: NetworkState | null;
}

export const NodeDetailsModal: React.FC<ModalProps> = ({ cityName, onClose, state }) => {
  if (!cityName || !state) return null;

  const supplier = state.suppliers.find(s => s.location === cityName);
  const warehouse = state.warehouses.find(w => w.location === cityName);
  const store = state.retail_stores.find(r => r.location === cityName);
  const inventories = state.inventories.filter(inv => {
    if (supplier && inv.location_id === supplier.id) return true;
    if (warehouse && inv.location_id === warehouse.id) return true;
    if (store && inv.location_id === store.id) return true;
    return false;
  });

  const routesFromCity = state.routes.filter(r => r.origin === cityName || r.destination === cityName);
  const activeDisruptions = state.disruptions.filter(d => 
    (supplier && d.entity_id === supplier.id) ||
    (warehouse && d.entity_id === warehouse.id) ||
    (store && d.entity_id === store.id)
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-100">{cityName} Logistics Node</h3>
            <p className="text-xs text-slate-400 font-mono">
              {supplier ? 'SUPPLIER NODE' : warehouse ? 'DISTRIBUTION HUB' : store ? 'RETAIL SUPERSTORE' : 'HUB'}
            </p>
          </div>
        </div>

        {/* Entity Details */}
        <div className="space-y-4 text-xs font-mono">
          {supplier && (
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-1 font-bold text-cyan-400">
                <span>SUPPLIER: {supplier.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${supplier.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {supplier.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 mt-2">
                <div>Available Qty: <strong>{supplier.available_capacity} / {supplier.max_capacity}</strong></div>
                <div>Lead Time: <strong>{supplier.lead_time_days} days</strong></div>
                <div>Unit Cost: <strong>₹{supplier.unit_cost}</strong></div>
                <div>Reliability: <strong>{supplier.reliability_score * 100}%</strong></div>
              </div>
            </div>
          )}

          {warehouse && (
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-1 font-bold text-indigo-400">
                <span>HUB: {warehouse.name}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px]">
                  {warehouse.operating_status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 mt-2">
                <div>Capacity: <strong>{warehouse.capacity} units</strong></div>
                <div>Throughput: <strong>{warehouse.throughput_capacity} / hr</strong></div>
              </div>
            </div>
          )}

          {store && (
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-1 font-bold text-emerald-400">
                <span>STORE: {store.name}</span>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-[10px]">
                  Priority: {store.priority}
                </span>
              </div>
              <div className="text-slate-300 mt-1">
                Target SLA: <strong>{store.target_sla * 100}%</strong> | Deadline: <strong>{store.deadline_hours} hrs</strong>
              </div>
            </div>
          )}

          {/* Active Disruptions */}
          {activeDisruptions.length > 0 && (
            <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-2xl text-rose-300">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                ACTIVE DISRUPTIONS
              </div>
              {activeDisruptions.map(d => (
                <div key={d.id} className="text-[11px] font-sans text-rose-200">• {d.type}: {d.description}</div>
              ))}
            </div>
          )}

          {/* Connected Routes */}
          <div>
            <div className="font-bold text-slate-400 uppercase text-[10px] mb-1">CONNECTED HIGHWAY ROUTES:</div>
            <div className="space-y-1">
              {routesFromCity.map(r => (
                <div key={r.id} className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between">
                  <span>{r.origin} ➔ {r.destination} ({r.distance_km}km)</span>
                  <span className={r.status === 'OPEN' ? 'text-emerald-400' : 'text-rose-400 font-bold'}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
