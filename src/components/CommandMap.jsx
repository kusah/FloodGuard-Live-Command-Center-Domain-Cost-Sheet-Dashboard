import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CHENNAI_CENTER, CHENNAI_STREETS } from '../data/chennaiData';
import { Shield, Hospital, Droplets, Truck, Info, AlertTriangle, CloudRain, Wind, Flame, Navigation } from 'lucide-react';

// Custom Map icons setup
const createCustomIcon = (color, emoji, pulse = false) => L.divIcon({
  className: `custom-leaflet-marker ${pulse ? 'pulse-red' : ''}`,
  html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.6); font-size: 16px;">${emoji}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const alertIcon = createCustomIcon('#dc2626', '⚠️', true);
const hospitalIcon = createCustomIcon('#ef4444', '🏥');
const reservoirIcon = createCustomIcon('#0284c7', '💧');
const pumpIcon = createCustomIcon('#10b981', '🌊');
const excavatorIcon = createCustomIcon('#f59e0b', '🚜');
const truckIcon = createCustomIcon('#3b82f6', '🚛');

// Map Recenter Helper Component
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function CommandMap({ cityOverview, sliders, resources, waterbodies, weatherData }) {
  const [showRadarOverlay, setShowRadarOverlay] = useState(true);
  const [showAlertPins, setShowAlertPins] = useState(true);
  const [showStreets, setShowStreets] = useState(true);

  const primaryEpicenter = [12.9774, 80.2212]; // Velachery / Chembarambakkam catchment focal point

  // Calculated rain radar opacity & color based on hourly rain slider
  const radarOpacity = Math.min(0.45, Math.max(0.1, (sliders.rainfallHourly / 150) * 0.45));
  const radarColor = sliders.rainfallHourly > 80 ? '#7c3aed' : sliders.rainfallHourly > 40 ? '#0284c7' : '#0ea5e9';

  // Calculate street-level flood risk (HIGH / MEDIUM / LOW)
  const calculateStreetRisk = (street) => {
    const rainfallImpact = (sliders.rainfallHourly * 0.4) + (sliders.rainfall24h / 300 * 40);
    const drainImpact = sliders.drainBlockagePct * 0.3;
    const rawScore = (street.baseHazard * 0.4) + (rainfallImpact * 0.4) + (drainImpact * 0.2);
    
    // Scale by elevation
    const finalScore = Math.min(100, Math.max(5, Math.round(rawScore / (street.elevation * 0.35 + 0.6))));
    const waterDepthCm = Math.max(0, Math.round((finalScore / 100) * (sliders.rainfall24h * 0.22)));

    let riskLevel = 'LOW';
    let color = '#10b981'; // green
    let trafficStatus = 'FULLY PASSABLE';

    if (finalScore >= 70) {
      riskLevel = 'HIGH';
      color = '#ef4444'; // red
      trafficStatus = 'CLOSED - FLOODED (>45cm water)';
    } else if (finalScore >= 45) {
      riskLevel = 'MEDIUM';
      color = '#f97316'; // orange
      trafficStatus = 'WARNING - HEAVY VEHICLES / AMBULANCES ONLY';
    }

    return {
      ...street,
      riskScore: finalScore,
      riskLevel,
      color,
      waterDepthCm,
      trafficStatus
    };
  };

  const calculatedStreets = CHENNAI_STREETS.map(s => calculateStreetRisk(s));

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Top Left Overlay Badge & Weather Layer Toggles */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
        
        <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3.5 py-2.5 rounded-lg shadow-lg flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></div>
          <div>
            <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
              GIS FLOOD MAP • STREET NETWORK ACTIVE
            </div>
            <div className="text-[10px] text-slate-300 font-mono flex items-center gap-2">
              <span>Rain: <strong className="text-cyan-400">{sliders.rainfallHourly} mm/h</strong></span>
              <span>•</span>
              <span>Spread: <strong className="text-red-400">{sliders.floodAreaRadius} km</strong></span>
            </div>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md p-1.5 rounded-lg shadow-lg flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowStreets(!showStreets)}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              showStreets ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" /> Flooded Streets Layer
          </button>

          <button
            onClick={() => setShowRadarOverlay(!showRadarOverlay)}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              showRadarOverlay ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" /> Rain Radar
          </button>

          <button
            onClick={() => setShowAlertPins(!showAlertPins)}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              showAlertPins ? 'bg-red-500 text-white font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Flood Alert Pins ({cityOverview.alerts.length})
          </button>
        </div>

      </div>

      {/* Map Legend overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 border border-slate-800 backdrop-blur-md p-2.5 rounded-lg shadow-lg text-[10px] font-mono text-slate-300">
        <div className="font-bold text-slate-200 mb-1">STREET FLOOD RISK LEGEND</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5"><span className="h-2 w-5 rounded bg-red-500"></span> High Risk Street (Closed)</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-5 rounded bg-orange-500"></span> Medium Risk (Caution)</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-5 rounded bg-emerald-500"></span> Low Risk Street (Safe)</div>
          <div className="flex items-center gap-1.5">⚠️ Alert Location</div>
          <div className="flex items-center gap-1.5">🏥 Hospital Corridor</div>
        </div>
      </div>

      <MapContainer
        center={CHENNAI_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={CHENNAI_CENTER} />
        
        {/* Dark theme tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Street-Level Color Coded Flood Risk Polylines Layer */}
        {showStreets && calculatedStreets.map(street => (
          <Polyline
            key={street.id}
            positions={street.coordinates}
            pathOptions={{
              color: street.color,
              weight: street.riskLevel === 'HIGH' ? 6 : street.riskLevel === 'MEDIUM' ? 5 : 4,
              opacity: 0.9,
              dashArray: street.riskLevel === 'HIGH' ? '10, 6' : undefined
            }}
          >
            <Popup>
              <div className="p-1.5 min-w-[220px] font-mono">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-1.5">
                  <span className="font-bold text-xs text-white">{street.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    street.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    street.riskLevel === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {street.riskLevel} RISK
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Street Type:</span>
                    <span>{street.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Water Depth:</span>
                    <span className="font-bold text-blue-400">{street.waterDepthCm} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Street Elevation:</span>
                    <span>{street.elevation} m</span>
                  </div>
                  <div className="mt-1.5 p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                    <span className="text-slate-400 block">Traffic Passability:</span>
                    <span className={`font-bold ${street.riskLevel === 'HIGH' ? 'text-red-400' : 'text-amber-300'}`}>
                      {street.trafficStatus}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Synced Rain Radar Cloud Layer */}
        {showRadarOverlay && (
          <Circle
            center={primaryEpicenter}
            radius={(sliders.floodAreaRadius + 4) * 1000}
            pathOptions={{
              color: radarColor,
              fillColor: radarColor,
              fillOpacity: radarOpacity,
              weight: 0
            }}
          />
        )}

        {/* Dynamic Inundation Spread Overlay Circle */}
        <Circle
          center={primaryEpicenter}
          radius={sliders.floodAreaRadius * 1000} // meters
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.22,
            dashArray: '8, 8',
            weight: 2.5
          }}
        >
          <Tooltip permanent direction="top" className="bg-red-950 text-red-200 border-red-800 font-mono text-[10px]">
            Inundation Zone: {sliders.floodAreaRadius} km (Rain: {sliders.rainfallHourly} mm/h)
          </Tooltip>
        </Circle>

        {/* Flood Alert Pins Rendered directly ON MAP */}
        {showAlertPins && cityOverview.calculatedWards.filter(w => w.riskLevel === 'CRITICAL' || w.riskLevel === 'HIGH').map(ward => (
          <Marker
            key={`alert-${ward.id}`}
            position={[ward.lat + 0.004, ward.lng + 0.004]}
            icon={alertIcon}
          >
            <Popup>
              <div className="p-1.5 min-w-[210px] font-mono">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs border-b border-slate-700 pb-1 mb-1">
                  <AlertTriangle className="h-4 w-4" /> FLOOD ALERT: {ward.name}
                </div>
                <div className="text-xs text-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Score:</span>
                    <span className="font-bold text-red-400">{ward.riskScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Water Depth:</span>
                    <span className="font-bold text-blue-400">{ward.waterDepthCm} cm</span>
                  </div>
                  <div className="text-[10px] text-amber-300 mt-1">
                    Rule Triggered: Model Risk &gt;= {ward.riskScore}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Ward Risk Heatmap Circles & Markers */}
        {cityOverview.calculatedWards.map(ward => {
          let circleColor = '#10b981'; // green
          if (ward.riskLevel === 'CRITICAL') circleColor = '#ef4444';
          else if (ward.riskLevel === 'HIGH') circleColor = '#f97316';
          else if (ward.riskLevel === 'MODERATE') circleColor = '#eab308';

          return (
            <React.Fragment key={ward.id}>
              <Circle
                center={[ward.lat, ward.lng]}
                radius={1200}
                pathOptions={{
                  color: circleColor,
                  fillColor: circleColor,
                  fillOpacity: 0.35,
                  weight: 1.5
                }}
              />
              <Marker position={[ward.lat, ward.lng]}>
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-2">
                      <span className="font-bold text-sm text-white font-mono">{ward.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${ward.badgeColor}`}>
                        {ward.riskLevel}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-300 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Risk Score:</span>
                        <span className="font-bold text-cyan-400">{ward.riskScore} / 100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Est. Water Depth:</span>
                        <span className="font-bold text-blue-400">{ward.waterDepthCm} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Elevation:</span>
                        <span>{ward.elevation} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Population:</span>
                        <span>{ward.population.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-amber-300 mt-1 italic">
                        {ward.status}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Hospital & Critical Facility Markers */}
        {cityOverview.hospitalStatuses.map(facility => (
          <Marker
            key={facility.id}
            position={[facility.lat, facility.lng]}
            icon={hospitalIcon}
          >
            <Popup>
              <div className="p-1 min-w-[220px]">
                <div className="font-bold text-sm text-red-400 border-b border-slate-700 pb-1 mb-2 font-mono">
                  🏥 {facility.name}
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-slate-400">{facility.type}</div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Capacity:</span>
                    <span className="font-bold">{facility.capacity} beds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Access Corridor Risk:</span>
                    <span className={`font-bold ${facility.routeRisk > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {facility.routeRisk}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Access Status:</span>
                    <span className="text-amber-400 font-bold">{facility.accessStatus}</span>
                  </div>
                  <div className="mt-2 text-[10px] bg-slate-800 p-1.5 rounded text-cyan-300">
                    Route: {facility.corridorName}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Waterbodies / Reservoirs Markers */}
        {waterbodies.map(wb => (
          <Marker
            key={wb.id}
            position={[wb.lat, wb.lng]}
            icon={reservoirIcon}
          >
            <Popup>
              <div className="p-1 text-xs font-mono">
                <div className="font-bold text-sky-400 border-b border-slate-700 pb-1 mb-1">
                  💧 {wb.name}
                </div>
                <div>Max Cap: {wb.maxCapacity}</div>
                <div>Discharge: {wb.dischargeCapacity}</div>
                <div className="text-amber-400 font-bold mt-1">Status: {wb.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Deployed Resources Markers */}
        {resources.map(res => {
          let icon = pumpIcon;
          if (res.type === 'EXCAVATOR') icon = excavatorIcon;
          else if (res.type === 'TRUCK_FLEET') icon = truckIcon;

          return (
            <Marker
              key={res.id}
              position={[res.lat, res.lng]}
              icon={icon}
            >
              <Popup>
                <div className="p-1 text-xs font-mono">
                  <div className="font-bold text-emerald-400">{res.name}</div>
                  <div>Status: <span className="font-bold text-white">{res.status}</span></div>
                  <div>Assigned: {res.assignedWard}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
}
