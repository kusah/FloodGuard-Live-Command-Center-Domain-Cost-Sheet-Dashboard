import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CHENNAI_CENTER } from '../data/chennaiData';
import { Shield, Hospital, Droplets, Truck, Info, AlertTriangle } from 'lucide-react';

// Custom Map icons setup
const createCustomIcon = (color, emoji) => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-size: 14px;">${emoji}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

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

export default function CommandMap({ cityOverview, sliders, resources, waterbodies }) {
  const primaryEpicenter = [12.9774, 80.2212]; // Velachery / Chembarambakkam catchment focal point

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Overlay Badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg flex items-center gap-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping"></div>
        <div>
          <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
            GIS FLOOD MAP • CHENNAI
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Radius: {sliders.floodAreaRadius} km • Dynamic Risk Heatmap
          </div>
        </div>
      </div>

      {/* Map Legend overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 border border-slate-800 backdrop-blur-md p-2.5 rounded-lg shadow-lg text-[10px] font-mono text-slate-300">
        <div className="font-bold text-slate-200 mb-1">MAP LEGEND</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500"></span> Critical Risk (&gt;75)</div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span> High Risk (50-74)</div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span> Moderate (25-49)</div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Low Risk (&lt;25)</div>
          <div className="flex items-center gap-1.5">🏥 Critical Hospital</div>
          <div className="flex items-center gap-1.5">💧 Water Reservoir</div>
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

        {/* Dynamic Inundation Spread Overlay Circle */}
        <Circle
          center={primaryEpicenter}
          radius={sliders.floodAreaRadius * 1000} // meters
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.18,
            dashArray: '8, 8',
            weight: 2
          }}
        >
          <Tooltip permanent direction="top" className="bg-red-950 text-red-200 border-red-800 font-mono text-[10px]">
            Primary Inundation Spread: {sliders.floodAreaRadius} km
          </Tooltip>
        </Circle>

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
