import React from 'react';
import { Sliders, CloudRain, Shield, Droplets, Zap, Wrench, Sparkles, AlertCircle } from 'lucide-react';
import { PRESETS } from '../data/chennaiData';

export default function LiveSimulationControls({ sliders, setSliders, applyPreset }) {
  const handleChange = (key, val) => {
    setSliders(prev => ({
      ...prev,
      [key]: parseFloat(val)
    }));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Interactive Flood Controls
          </h2>
        </div>
        <span className="text-[11px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
          LIVE PARAMETER ENGINE
        </span>
      </div>

      {/* Quick Scenario Presets */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1 font-mono">
          <Sparkles className="h-3 w-3 text-amber-400" /> Scenario Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/60 transition-all hover:border-cyan-500/50 group"
            >
              <div className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-400 truncate">
                {preset.name}
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Slider 1: Flood Area Radius */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-red-400" />
              Flood Area Spread Radius
            </label>
            <span className="text-xs font-bold text-red-400 font-mono bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
              {sliders.floodAreaRadius} km
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15.0"
            step="0.1"
            value={sliders.floodAreaRadius}
            onChange={(e) => handleChange('floodAreaRadius', e.target.value)}
            className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>0.5 km (Localized)</span>
            <span>15.0 km (City-wide)</span>
          </div>
        </div>

        {/* Slider 2: Hourly Rainfall */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CloudRain className="h-3.5 w-3.5 text-cyan-400" />
              Hourly Rain Intensity
            </label>
            <span className="text-xs font-bold text-cyan-400 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              {sliders.rainfallHourly} mm/hr
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            step="5"
            value={sliders.rainfallHourly}
            onChange={(e) => handleChange('rainfallHourly', e.target.value)}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>0 mm/hr</span>
            <span>180 mm/hr (Torrential)</span>
          </div>
        </div>

        {/* Slider 3: 24h Cumulative Rain */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CloudRain className="h-3.5 w-3.5 text-blue-400" />
              24h Cumulative Rainfall
            </label>
            <span className="text-xs font-bold text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
              {sliders.rainfall24h} mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="600"
            step="10"
            value={sliders.rainfall24h}
            onChange={(e) => handleChange('rainfall24h', e.target.value)}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>0 mm</span>
            <span>600 mm (Extreme Event)</span>
          </div>
        </div>

        {/* Slider 4: Reservoir Capacity */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              Reservoir Storage Level
            </label>
            <span className="text-xs font-bold text-sky-400 font-mono bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
              {sliders.waterLevelPct}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={sliders.waterLevelPct}
            onChange={(e) => handleChange('waterLevelPct', e.target.value)}
            className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>10% (Safe)</span>
            <span>100% (Overflow)</span>
          </div>
        </div>

        {/* Slider 5: Power Grid operational */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Power Grid Availability
            </label>
            <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded border ${
              sliders.powerGridPct < 40 
                ? 'text-red-400 bg-red-500/10 border-red-500/20' 
                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}>
              {sliders.powerGridPct}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={sliders.powerGridPct}
            onChange={(e) => handleChange('powerGridPct', e.target.value)}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>10% (Blackout)</span>
            <span>100% (Normal)</span>
          </div>
        </div>

        {/* Slider 6: Stormwater Drain Blockage */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-emerald-400" />
              Drain Blockage / Siltation
            </label>
            <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {sliders.drainBlockagePct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={sliders.drainBlockagePct}
            onChange={(e) => handleChange('drainBlockagePct', e.target.value)}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>0% (Clean Drains)</span>
            <span>100% (Fully Clogged)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
