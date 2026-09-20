import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, CloudRain, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HistoricalReplay({ setSliders, cityOverview }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hour, setHour] = useState(0); // 0 to 24 hours timeline

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setHour(prev => {
          if (prev >= 24) {
            setIsPlaying(false);
            return 24;
          }
          return prev + 1;
        });
      }, 1000); // 1 sec = 1 hour step
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync sliders to storm curve as hour advances
  useEffect(() => {
    if (hour === 0) {
      setSliders({
        floodAreaRadius: 0.8,
        rainfallHourly: 10,
        rainfall24h: 30,
        waterLevelPct: 40,
        powerGridPct: 95,
        drainBlockagePct: 15
      });
    } else if (hour <= 6) {
      setSliders({
        floodAreaRadius: 2.2,
        rainfallHourly: 45,
        rainfall24h: 120,
        waterLevelPct: 65,
        powerGridPct: 85,
        drainBlockagePct: 30
      });
    } else if (hour <= 14) {
      // Peak storm window
      setSliders({
        floodAreaRadius: 8.5,
        rainfallHourly: 130,
        rainfall24h: 420,
        waterLevelPct: 98,
        powerGridPct: 35,
        drainBlockagePct: 75
      });
    } else if (hour <= 20) {
      // Receding storm window
      setSliders({
        floodAreaRadius: 5.4,
        rainfallHourly: 40,
        rainfall24h: 460,
        waterLevelPct: 85,
        powerGridPct: 60,
        drainBlockagePct: 60
      });
    } else {
      // Recovery phase
      setSliders({
        floodAreaRadius: 3.1,
        rainfallHourly: 10,
        rainfall24h: 480,
        waterLevelPct: 70,
        powerGridPct: 75,
        drainBlockagePct: 40
      });
    }
  }, [hour, setSliders]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const resetReplay = () => {
    setIsPlaying(false);
    setHour(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-400" />
            HISTORICAL STORM REPLAY SIMULATOR (2015 CHENNAI DELUGE)
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Step-by-step minute-by-minute hydrodynamic replay showing live risk escalation and automated alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center gap-2 shadow-md transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
            }`}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'PAUSE REPLAY' : 'START REPLAY'}
          </button>

          <button
            onClick={resetReplay}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono"
            title="Reset Timeline"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">Simulation Timeline Scrubber</span>
          <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            T+ {hour < 10 ? `0${hour}` : hour}:00 Hours
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={hour}
          onChange={(e) => {
            setIsPlaying(false);
            setHour(parseInt(e.target.value, 10));
          }}
          className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>00:00 (Onset)</span>
          <span>06:00 (Rains Intensify)</span>
          <span>12:00 (Peak Inundation)</span>
          <span>18:00 (Sluice Release)</span>
          <span>24:00 (Recovery)</span>
        </div>
      </div>

      {/* Dynamic Status at current hour */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Current Storm Phase</div>
          <div className="text-sm font-bold text-white font-mono mt-1">
            {hour === 0 ? 'Normal Pre-storm' : hour <= 6 ? 'Early Inundation Phase' : hour <= 14 ? 'PEAK DELUGE WINDOW' : hour <= 20 ? 'Receding Flood Waters' : 'Post-event Recovery'}
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">City Risk Level</div>
          <div className="text-sm font-bold text-cyan-400 font-mono mt-1">
            Average Score: {cityOverview.avgRisk} / 100
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400 font-mono">Active Warnings</div>
          <div className="text-sm font-bold text-amber-400 font-mono mt-1">
            {cityOverview.alerts.length} System Alerts Generated
          </div>
        </div>
      </div>

    </div>
  );
}
