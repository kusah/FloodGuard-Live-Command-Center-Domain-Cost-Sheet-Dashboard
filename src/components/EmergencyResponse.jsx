import React from 'react';
import { ShieldAlert, Truck, Wrench, Droplets, Zap, CheckCircle2, AlertTriangle, ArrowRight, Hospital, MapPin } from 'lucide-react';

export default function EmergencyResponse({ cityOverview, resources, setResources, deployResource }) {
  
  const getResourceIcon = (type) => {
    switch(type) {
      case 'PUMP': return <Droplets className="h-4 w-4 text-emerald-400" />;
      case 'EXCAVATOR': return <Wrench className="h-4 w-4 text-amber-400" />;
      case 'TRUCK_FLEET': return <Truck className="h-4 w-4 text-blue-400" />;
      case 'POWER': return <Zap className="h-4 w-4 text-yellow-400" />;
      default: return <ShieldAlert className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-mono">Pumping Capacity</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">5 Units (44.5k L/min)</div>
          <div className="text-[10px] text-slate-500 mt-1">Available: {resources.filter(r => r.type === 'PUMP' && r.status === 'AVAILABLE').length} of 5</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-mono">Channel Excavators</div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">2 Heavy Tracked</div>
          <div className="text-[10px] text-slate-500 mt-1">Available: {resources.filter(r => r.type === 'EXCAVATOR' && r.status === 'AVAILABLE').length} of 2</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-mono">Disaster Rescue Trucks</div>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">10 Transport Fleet</div>
          <div className="text-[10px] text-slate-500 mt-1">Status: Operational Depot</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-mono">Critical Wards at Risk</div>
          <div className="text-2xl font-bold text-red-400 font-mono mt-1">
            {cityOverview.criticalWardsCount} <span className="text-sm font-normal text-slate-400">Critical</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Priority Zone Allocation Active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Resource Inventory & Dispatch Board */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-400" /> Resource Deployment Inventory
            </h3>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
              CONSTRAINED INVENTORY
            </span>
          </div>

          <div className="space-y-3">
            {resources.map(res => (
              <div key={res.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    {getResourceIcon(res.type)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{res.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Assigned to: <span className="text-cyan-300 font-semibold">{res.assignedWard}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                    res.status === 'DEPLOYED' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {res.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle & Right: Priority Wards & Dispatch Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Priority Wards List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" /> Priority Wards & Instant Asset Dispatch
              </h3>
              <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-mono">
                SORTED BY MODEL RISK SCORE
              </span>
            </div>

            <div className="space-y-3">
              {cityOverview.calculatedWards
                .slice()
                .sort((a, b) => b.riskScore - a.riskScore)
                .map(ward => (
                  <div key={ward.id} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{ward.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${ward.badgeColor}`}>
                          {ward.riskLevel} ({ward.riskScore}/100)
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3 font-mono">
                        <span>Zone: {ward.zone}</span>
                        <span>Water Depth: <strong className="text-blue-400">{ward.waterDepthCm} cm</strong></span>
                        <span>Pop: {ward.population.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deployResource('PUMP', ward.name, ward.lat, ward.lng)}
                        className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold font-mono flex items-center gap-1 transition-colors"
                      >
                        <Droplets className="h-3.5 w-3.5" /> Deploy Pump
                      </button>
                      <button
                        onClick={() => deployResource('EXCAVATOR', ward.name, ward.lat, ward.lng)}
                        className="px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold font-mono flex items-center gap-1 transition-colors"
                      >
                        <Wrench className="h-3.5 w-3.5" /> Deploy Excavator
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Hospital Corridor Protection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Hospital className="h-4 w-4 text-red-400" /> Hospital Access Corridor Safety Monitor
              </h3>
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                AMBULANCE ROUTE PROTECTION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cityOverview.hospitalStatuses.map(fac => (
                <div key={fac.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white font-mono">{fac.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      fac.routeRisk >= 70 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      Route Risk: {fac.routeRisk}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mb-2">
                    Corridor: {fac.corridorName}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-400 font-semibold">{fac.accessStatus}</span>
                    {fac.isResourceAssigned ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="h-3 w-3" /> Pump Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => deployResource('PUMP', fac.name, fac.lat, fac.lng)}
                        className="text-cyan-400 hover:underline font-mono"
                      >
                        + Protect Route
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
