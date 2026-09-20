import React, { useState, useEffect } from 'react';
import { Waves, ShieldAlert, Activity, DollarSign, Clock, PlayCircle, RefreshCw, AlertTriangle, HelpCircle } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, cityOverview, resetAllData, onOpenGuide }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & City Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Waves className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-mono">
                FLOOD<span className="text-cyan-400">GUARD</span>
              </h1>
              <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-500/20 font-mono font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping"></span>
                PROTOTYPE / SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Real-City Flood Intelligence & Decision Platform • Chennai, TN
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('command')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'command'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="h-4 w-4" />
            Command Center
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'emergency'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Emergency Response
            {cityOverview.criticalWardsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-red-500 text-white font-mono font-bold rounded-full">
                {cityOverview.criticalWardsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('costsheet')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'costsheet'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Domain Cost Sheet
          </button>

          <button
            onClick={() => setActiveTab('replay')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'replay'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlayCircle className="h-4 w-4" />
            Historical Replay
          </button>
        </nav>

        {/* User Guide, Clock & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGuide}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-mono font-semibold"
            title="Open User Guide & Dashboard Tour"
          >
            <HelpCircle className="h-4 w-4 text-cyan-400" />
            <span>User Guide</span>
          </button>

          <div className="hidden lg:flex flex-col items-end text-right font-mono">
            <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              {time.toLocaleTimeString()}
            </div>
            <div className="text-[10px] text-slate-500">
              {time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <button
            onClick={resetAllData}
            title="Reset Simulation Parameters & Allocations"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 text-xs font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

      </div>
    </header>
  );
}
