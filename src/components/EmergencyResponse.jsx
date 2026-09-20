import React, { useState } from 'react';
import { ShieldAlert, Truck, Wrench, Droplets, Zap, CheckCircle2, AlertTriangle, ArrowRight, Hospital, MapPin, Radio, Cpu, RefreshCw, LifeBuoy } from 'lucide-react';

export default function EmergencyResponse({ cityOverview, resources, setResources, deployResource, addToast }) {
  const [failures, setFailures] = useState({
    pumpFailure: false,
    commsOutage: false,
    powerBlackout: false,
    routeBlocked: false
  });

  const toggleFailure = (key, label) => {
    setFailures(prev => {
      const nextState = !prev[key];
      
      if (addToast) {
        if (nextState) {
          addToast({
            type: 'error',
            title: `⚠️ SYSTEM FAILURE: ${label}`,
            message: `Critical failure detected! Emergency contingency protocols activated for ${label}.`
          });
        } else {
          addToast({
            type: 'success',
            title: `✅ SYSTEM RESTORED: ${label}`,
            message: `Normal operational status restored for ${label}.`
          });
        }
      }

      return {
        ...prev,
        [key]: nextState
      };
    });
  };

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
      
      {/* System Fail-Safe & Contingency Protocol Matrix */}
      <div className="bg-slate-900 border border-red-500/40 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-red-400 font-mono flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-red-400" />
              SYSTEM FAILURE CONTINGENCY & FAIL-SAFE MATRIX
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Simulate infrastructure failures (pump jam, sensor comms outage, power blackout) and test automated contingency pop-ups & protocols!
            </p>
          </div>
          <span className="text-[10px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded border border-red-500/20 font-mono font-bold">
            FAIL-SAFE SIMULATOR
          </span>
        </div>

        {/* Interactive Failure Simulation Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Toggle 1: Pump Failure */}
          <div className={`p-3 rounded-lg border transition-all ${
            failures.pumpFailure ? 'bg-red-950/80 border-red-500' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-emerald-400" /> Pumping Station Jam
              </span>
              <button
                onClick={() => toggleFailure('pumpFailure', 'Pumping Station Jam')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  failures.pumpFailure ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {failures.pumpFailure ? 'FAILURE ACTIVE' : 'SIMULATE FAIL'}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {failures.pumpFailure ? (
                <span className="text-red-300 font-semibold">
                  ⚠️ Primary pump jammed! Action: Auto-dispatching backup diesel sludge pumps + opening gravity sluices.
                </span>
              ) : 'Pumps operational (Normal status).'}
            </div>
          </div>

          {/* Toggle 2: Comms / Sensor Outage */}
          <div className={`p-3 rounded-lg border transition-all ${
            failures.commsOutage ? 'bg-red-950/80 border-red-500' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-cyan-400" /> Comms & Telemetry Down
              </span>
              <button
                onClick={() => toggleFailure('commsOutage', 'Comms & Telemetry Outage')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  failures.commsOutage ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {failures.commsOutage ? 'OUTAGE ACTIVE' : 'SIMULATE FAIL'}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {failures.commsOutage ? (
                <span className="text-red-300 font-semibold">
                  📡 Cellular telemetry lost! Action: Switched to P2P VHF Radio Mesh & runoff model extrapolation.
                </span>
              ) : 'Telemetry grid active.'}
            </div>
          </div>

          {/* Toggle 3: Power Blackout */}
          <div className={`p-3 rounded-lg border transition-all ${
            failures.powerBlackout ? 'bg-red-950/80 border-red-500' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" /> Substation Power Blackout
              </span>
              <button
                onClick={() => toggleFailure('powerBlackout', 'Substation Power Blackout')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  failures.powerBlackout ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {failures.powerBlackout ? 'BLACKOUT ACTIVE' : 'SIMULATE FAIL'}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {failures.powerBlackout ? (
                <span className="text-red-300 font-semibold">
                  ⚡ Grid power failed! Action: Hospital islanded onto BESS Microgrids + 250 kVA mobile generators.
                </span>
              ) : 'Substation power grid normal.'}
            </div>
          </div>

          {/* Toggle 4: Hospital Route Blocked */}
          <div className={`p-3 rounded-lg border transition-all ${
            failures.routeBlocked ? 'bg-red-950/80 border-red-500' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                <Hospital className="h-3.5 w-3.5 text-red-400" /> Ambulance Route Flooded
              </span>
              <button
                onClick={() => toggleFailure('routeBlocked', 'Ambulance Route Inundated')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  failures.routeBlocked ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {failures.routeBlocked ? 'ROUTE BLOCKED' : 'SIMULATE FAIL'}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {failures.routeBlocked ? (
                <span className="text-red-300 font-semibold">
                  🏥 EVR Periyar corridor flooded over 60cm! Action: Auto-re-routed to Greams Rd + 4x4 rescue boats dispatched.
                </span>
              ) : 'Ambulance corridors clear.'}
            </div>
          </div>

        </div>

      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-mono">Pumping Capacity</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {failures.pumpFailure ? '3 Units (Backup Active)' : '5 Units (44.5k L/min)'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {failures.pumpFailure ? 'Secondary Sluices Opened' : `Available: ${resources.filter(r => r.type === 'PUMP' && r.status === 'AVAILABLE').length} of 5`}
          </div>
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
                      fac.routeRisk >= 70 || failures.routeBlocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      Route Risk: {failures.routeBlocked ? '95% (BLOCKED)' : `${fac.routeRisk}%`}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mb-2">
                    Corridor: {failures.routeBlocked ? 'DETOUR via Greams Elevated Ramp' : fac.corridorName}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-400 font-semibold">
                      {failures.routeBlocked ? 'AMPHIBIOUS RESCUE ACTIVE' : fac.accessStatus}
                    </span>
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
