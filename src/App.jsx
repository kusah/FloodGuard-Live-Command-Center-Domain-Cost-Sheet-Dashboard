import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import LiveSimulationControls from './components/LiveSimulationControls';
import CommandMap from './components/CommandMap';
import EmergencyResponse from './components/EmergencyResponse';
import DomainCostSheet from './components/DomainCostSheet';
import HistoricalReplay from './components/HistoricalReplay';

import { 
  INITIAL_SLIDERS, 
  WARDS_DATA, 
  CRITICAL_FACILITIES, 
  WATERBODIES, 
  INITIAL_RESOURCES, 
  DOMAINS_COST_SHEET 
} from './data/chennaiData';

import { computeCityOverview } from './services/riskEngine';
import { ShieldAlert, Activity, AlertTriangle, Users, Waves, MapPin, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('command'); // 'command' | 'emergency' | 'costsheet' | 'replay'
  const [sliders, setSliders] = useState(INITIAL_SLIDERS);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [domains, setDomains] = useState(DOMAINS_COST_SHEET);
  const [totalTargetBudget, setTotalTargetBudget] = useState(100.0); // Default user budget cap in Crore

  // Compute live city intelligence overview whenever sliders or resources change
  const cityOverview = useMemo(() => {
    return computeCityOverview(WARDS_DATA, sliders, CRITICAL_FACILITIES, resources);
  }, [sliders, resources]);

  // Apply slider preset
  const applyPreset = (preset) => {
    setSliders(preset.sliders);
  };

  // Reset all simulation parameters to defaults
  const resetAllData = () => {
    setSliders(INITIAL_SLIDERS);
    setResources(INITIAL_RESOURCES);
    setDomains(DOMAINS_COST_SHEET);
    setTotalTargetBudget(100.0);
  };

  // Deploy emergency asset to location
  const deployResource = (type, targetName, lat, lng) => {
    setResources(prev => {
      const availableIndex = prev.findIndex(r => r.type === type && r.status === 'AVAILABLE');
      if (availableIndex === -1) {
        alert(`No available ${type} resources! All currently deployed.`);
        return prev;
      }
      const updated = [...prev];
      updated[availableIndex] = {
        ...updated[availableIndex],
        status: 'DEPLOYED',
        assignedWard: targetName,
        lat,
        lng
      };
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white pb-12">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cityOverview={cityOverview}
        resetAllData={resetAllData}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 py-6 space-y-6 flex-1">
        
        {/* Live Simulation Controls Bar (Always Accessible at top) */}
        <LiveSimulationControls
          sliders={sliders}
          setSliders={setSliders}
          applyPreset={applyPreset}
        />

        {/* TAB 1: LIVE COMMAND CENTER */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            
            {/* Top KPI Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 font-mono">Overall Model Risk Index</span>
                  <Activity className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono mt-2 flex items-baseline gap-2">
                  {cityOverview.avgRisk} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Status: <span className="font-bold text-cyan-400">{cityOverview.avgRisk > 60 ? 'HIGH RISK' : 'STABLE'}</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 font-mono">Est. Inundated Area</span>
                  <Waves className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-blue-400 font-mono mt-2">
                  {cityOverview.totalInundatedSqKm} <span className="text-xs text-slate-400 font-normal">sq km</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Spread Radius: {sliders.floodAreaRadius} km
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 font-mono">Exposed Population</span>
                  <Users className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400 font-mono mt-2">
                  {cityOverview.exposedPop.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Across High & Critical Risk Wards
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 font-mono">Active Model Alerts</span>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
                <div className="text-3xl font-extrabold text-red-400 font-mono mt-2">
                  {cityOverview.alerts.length} <span className="text-xs text-slate-400 font-normal">Active</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Rule-based System Monitoring
                </div>
              </div>

            </div>

            {/* Map and Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* GIS Map (Spans 2 cols) */}
              <div className="lg:col-span-2">
                <CommandMap
                  cityOverview={cityOverview}
                  sliders={sliders}
                  resources={resources}
                  waterbodies={WATERBODIES}
                />
              </div>

              {/* Live Alerts Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col h-[520px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" /> Model Alerts Stream
                  </h3>
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-mono">
                    LIVE ENGINE
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {cityOverview.alerts.length === 0 ? (
                    <div className="text-xs text-slate-500 font-mono text-center py-12 flex flex-col items-center gap-2">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
                      All environmental parameters within safe operating thresholds.
                    </div>
                  ) : (
                    cityOverview.alerts.map(alert => (
                      <div key={alert.id} className="bg-slate-950 p-3 rounded-lg border border-red-500/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                            {alert.severity}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-200 font-mono">{alert.title}</div>
                        <div className="text-[11px] text-slate-400">{alert.message}</div>
                        <div className="text-[9px] text-slate-500 font-mono pt-1 flex justify-between">
                          <span>Source: {alert.source}</span>
                          <span>Rule: {alert.rule}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: EMERGENCY RESPONSE & RESOURCE ALLOCATION */}
        {activeTab === 'emergency' && (
          <EmergencyResponse
            cityOverview={cityOverview}
            resources={resources}
            setResources={setResources}
            deployResource={deployResource}
          />
        )}

        {/* TAB 3: DOMAIN COST SHEET WITH USER BUDGET CONTROLLER */}
        {activeTab === 'costsheet' && (
          <DomainCostSheet
            domains={domains}
            setDomains={setDomains}
            totalTargetBudget={totalTargetBudget}
            setTotalTargetBudget={setTotalTargetBudget}
          />
        )}

        {/* TAB 4: HISTORICAL REPLAY */}
        {activeTab === 'replay' && (
          <HistoricalReplay
            setSliders={setSliders}
            cityOverview={cityOverview}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-4 mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>
          FLOODGUARD Prototype Platform • Prepared for Competition Specification • Real-City Implementation: Chennai, TN
        </div>
        <div className="text-[10px] text-slate-600">
          Sense → Predict → Prioritize → Respond → Recover
        </div>
      </footer>

    </div>
  );
}
