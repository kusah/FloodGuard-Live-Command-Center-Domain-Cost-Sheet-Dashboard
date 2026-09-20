import React from 'react';
import { X, Sliders, MapPin, ShieldAlert, DollarSign, CloudRain, HardHat, CheckCircle2, PlayCircle, Sparkles, Navigation } from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white font-mono">
                FLOODGUARD • USER GUIDE & QUICK WALKTHROUGH
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                How to navigate & test the real-city flood command platform
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-4 text-xs">
          
          {/* Section 1 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm font-mono">1. Interactive Storm Sliders & Presets</h3>
              <p className="text-slate-400 mt-0.5">
                Drag any slider at the top (Rainfall, Flood Area Radius, Reservoir Level, Power Grid, Drain Blockage) or click quick scenario presets (*Normal*, *2015 Deluge*, *2023 Cyclone Michaung*). Watch the map, risk scores, and alerts update instantly!
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm font-mono">2. Interactive GIS Map & Flooded Streets</h3>
              <p className="text-slate-400 mt-0.5">
                Click any **Ward**, **Hospital**, **Reservoir**, or **Street Line** on the map to view live water depth ($cm$), traffic passability, and risk scores. Toggle the **Rain Radar**, **Flood Alert Pins**, and **Flooded Streets Layer** on/off.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm font-mono">3. Emergency Response & Asset Dispatch</h3>
              <p className="text-slate-400 mt-0.5">
                Go to the **Emergency Response** tab to dispatch 5 High-Capacity Pumps and Dredging Excavators to priority wards or hospital ambulance routes. Test system breakdowns in the **System Failure Matrix** to see instant fail-safe pop-ups!
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm font-mono">4. User Budget Controller & Cost Sheet</h3>
              <p className="text-slate-400 mt-0.5">
                Go to **Domain Cost Sheet** tab to set any custom budget cap (e.g., ₹1.5 Cr MVP, ₹30 Cr, ₹100 Cr, ₹250 Cr). All domain subtotals and line-item prices automatically rescale proportionally! Export the cost sheet to CSV anytime.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm font-mono">5. Historical Storm Replay</h3>
              <p className="text-slate-400 mt-0.5">
                Click **Start Replay** in the Historical Replay tab to play a 24-hour storm simulation timeline and watch the dashboard react automatically over time.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all shadow-md"
          >
            Got it, Let's Explore!
          </button>
        </div>

      </div>
    </div>
  );
}
