// Flood Intelligence Engine - Real-Time Risk & Alert Computation

/**
 * Formula specified in FloodGuard Requirements:
 * Risk Score = 0.30 * Rainfall Factor
 *            + 0.25 * Water Level Factor
 *            + 0.20 * Historical Flood Factor
 *            + 0.15 * Drainage Deficit Factor
 *            + 0.10 * Critical Facility Exposure
 */

export function calculateWardRisk(ward, sliders, epicenter = { lat: 12.9774, lng: 80.2212 }) {
  // 1. Rainfall factor (0 - 100) based on hourly rain vs 100mm/hr max benchmark & 24h rain vs 300mm benchmark
  const rainfallFactor = Math.min(100, Math.max(0, (sliders.rainfallHourly * 0.5) + (sliders.rainfall24h / 300 * 50)));

  // 2. Water Level factor (0 - 100)
  const waterLevelFactor = Math.min(100, Math.max(0, sliders.waterLevelPct));

  // 3. Historical Flood Factor (0 - 100)
  const historicalFactor = ward.baseHazard;

  // 4. Drainage Deficit Factor (0 - 100)
  const drainageFactor = Math.min(100, Math.max(0, sliders.drainBlockagePct + (100 - sliders.powerGridPct) * 0.3));

  // 5. Proximity to epicenter vs flood area radius factor
  const distKm = getHaversineDistanceKm(epicenter.lat, epicenter.lng, ward.lat, ward.lng);
  const proximityMultiplier = Math.max(0.1, 1 - (distKm / (sliders.floodAreaRadius * 1.5)));
  
  const facilityExposure = ward.criticalFacilities * 15; // weight based on critical infrastructure present

  // Weighted combination
  const rawScore = (
    (0.30 * rainfallFactor) +
    (0.25 * waterLevelFactor) +
    (0.20 * historicalFactor) +
    (0.15 * drainageFactor) +
    (0.10 * facilityExposure)
  ) * Math.min(1.3, Math.max(0.7, proximityMultiplier + 0.3));

  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Water depth estimation in centimeters
  const waterDepthCm = Math.max(0, Math.round((finalScore / 100) * (sliders.rainfall24h * 0.25) / Math.max(1, ward.elevation)));

  let level = 'LOW';
  let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (finalScore >= 75) {
    level = 'CRITICAL';
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30 pulse-red';
  } else if (finalScore >= 50) {
    level = 'HIGH';
    badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  } else if (finalScore >= 25) {
    level = 'MODERATE';
    badgeColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }

  return {
    ...ward,
    distKm: distKm.toFixed(1),
    riskScore: finalScore,
    riskLevel: level,
    badgeColor,
    waterDepthCm,
    isInundated: finalScore > 40 && distKm <= sliders.floodAreaRadius
  };
}

export function computeCityOverview(wards, sliders, facilities, resources) {
  const calculatedWards = wards.map(w => calculateWardRisk(w, sliders));

  const avgRisk = Math.round(calculatedWards.reduce((acc, curr) => acc + curr.riskScore, 0) / Math.max(1, calculatedWards.length));
  
  const criticalWardsCount = calculatedWards.filter(w => w.riskLevel === 'CRITICAL').length;
  const highWardsCount = calculatedWards.filter(w => w.riskLevel === 'HIGH').length;

  // Inundated Area estimate (sq km) directly proportional to flood area slider and risk density
  const totalInundatedSqKm = (Math.PI * Math.pow(sliders.floodAreaRadius, 2) * (avgRisk / 100)).toFixed(1);

  // Population exposed calculation
  const exposedPop = calculatedWards
    .filter(w => w.riskScore >= 45)
    .reduce((acc, curr) => acc + curr.population, 0);

  // Hospital Accessibility Status
  const hospitalStatuses = facilities.map(f => {
    // Find nearest ward risk score
    const nearestWard = calculatedWards.reduce((prev, curr) => {
      const prevDist = getHaversineDistanceKm(f.lat, f.lng, prev.lat, prev.lng);
      const currDist = getHaversineDistanceKm(f.lat, f.lng, curr.lat, curr.lng);
      return currDist < prevDist ? curr : prev;
    }, calculatedWards[0]);

    const routeRisk = Math.min(100, Math.round(nearestWard.riskScore * 1.1));
    let accessStatus = 'SAFE';
    if (routeRisk >= 75) accessStatus = 'IMPAIRED_REOUTE_REQUIRED';
    else if (routeRisk >= 50) accessStatus = 'WARNING_MONITORING';

    const isResourceAssigned = resources.some(r => r.status === 'DEPLOYED' && getHaversineDistanceKm(f.lat, f.lng, r.lat, r.lng) < 2.5);

    return {
      ...f,
      nearestWard: nearestWard.name,
      routeRisk,
      accessStatus,
      isResourceAssigned
    };
  });

  // Automated Alerts Generation
  const alerts = [];
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (sliders.rainfallHourly >= 50) {
    alerts.push({
      id: 'ALT-1',
      severity: 'CRITICAL',
      title: 'HEAVY INTENSE DOWNPOUR DETECTED',
      message: `Rainfall rate crossed benchmark at ${sliders.rainfallHourly} mm/hr. Urban runoff accelerating.`,
      timestamp: nowStr,
      source: 'IMD Station Network (MODEL)',
      rule: 'Rainfall > 50 mm/hr'
    });
  }

  if (sliders.waterLevelPct >= 85) {
    alerts.push({
      id: 'ALT-2',
      severity: 'HIGH',
      title: 'RESERVOIR WATER LEVEL ELEVATED',
      message: `Chembarambakkam & Puzhal reservoirs at ${sliders.waterLevelPct}% capacity. Emergency sluice release expected.`,
      timestamp: nowStr,
      source: 'Tamil Nadu RTFF & SDSS (MODEL)',
      rule: 'Reservoir Capacity > 85%'
    });
  }

  if (hospitalStatuses.some(h => h.accessStatus === 'IMPAIRED_REOUTE_REQUIRED')) {
    alerts.push({
      id: 'ALT-3',
      severity: 'CRITICAL',
      title: 'CRITICAL HOSPITAL ACCESS ROUTE AT RISK',
      message: 'EVR Periyar & Greams corridor waterlogging threatens ambulance access to Super Specialty Hospital.',
      timestamp: nowStr,
      source: 'FloodGuard Emergency Engine',
      rule: 'Hospital Route Risk >= 75'
    });
  }

  if (sliders.drainBlockagePct >= 60) {
    alerts.push({
      id: 'ALT-4',
      severity: 'MODERATE',
      title: 'DRAINAGE SILTATION BOTTLENECK WARNING',
      message: `Stormwater drain clogging estimated at ${sliders.drainBlockagePct}%. Excavators recommended for channel clearing.`,
      timestamp: nowStr,
      source: 'GCC GIS MapServer (MODEL)',
      rule: 'Drainage Blockage > 60%'
    });
  }

  return {
    calculatedWards,
    avgRisk,
    criticalWardsCount,
    highWardsCount,
    totalInundatedSqKm,
    exposedPop,
    hospitalStatuses,
    alerts
  };
}

// Haversine formula for distance between 2 coordinates in KM
function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
