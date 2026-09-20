// Real Chennai Geographical & Infrastructure Data Foundation for FloodGuard

export const CHENNAI_CENTER = [13.0827, 80.2707];

export const INITIAL_SLIDERS = {
  floodAreaRadius: 4.5, // km radius of primary inundation zone
  rainfallHourly: 65, // mm/hr
  rainfall24h: 210, // mm in 24 hours
  waterLevelPct: 88, // % reservoir capacity
  powerGridPct: 65, // % grid power operational
  drainBlockagePct: 45, // % stormwater drain siltation/blockage
};

export const PRESETS = [
  {
    id: 'normal',
    name: 'Normal Weather',
    description: 'Dry spell / normal seasonal flow',
    sliders: {
      floodAreaRadius: 0.5,
      rainfallHourly: 5,
      rainfall24h: 15,
      waterLevelPct: 35,
      powerGridPct: 98,
      drainBlockagePct: 15,
    }
  },
  {
    id: 'moderate',
    name: 'Monsoon Rain Warning',
    description: 'Continuous moderate downpour',
    sliders: {
      floodAreaRadius: 3.0,
      rainfallHourly: 40,
      rainfall24h: 120,
      waterLevelPct: 70,
      powerGridPct: 85,
      drainBlockagePct: 30,
    }
  },
  {
    id: 'severe',
    name: 'Severe Storm Warning',
    description: 'Heavy rainfall with high reservoir runoff',
    sliders: {
      floodAreaRadius: 6.5,
      rainfallHourly: 95,
      rainfall24h: 290,
      waterLevelPct: 92,
      powerGridPct: 55,
      drainBlockagePct: 60,
    }
  },
  {
    id: 'deluge2015',
    name: '2015 Deluge Extreme',
    description: 'Historical record deluge event (Chembarambakkam release)',
    sliders: {
      floodAreaRadius: 9.8,
      rainfallHourly: 140,
      rainfall24h: 490,
      waterLevelPct: 99,
      powerGridPct: 25,
      drainBlockagePct: 85,
    }
  },
  {
    id: 'michaung2023',
    name: 'Cyclone Michaung (2023)',
    description: 'Severe cyclonic storm surge and urban waterlogging',
    sliders: {
      floodAreaRadius: 7.8,
      rainfallHourly: 110,
      rainfall24h: 380,
      waterLevelPct: 95,
      powerGridPct: 40,
      drainBlockagePct: 70,
    }
  }
];

export const WARDS_DATA = [
  {
    id: 'W-01',
    name: 'Velachery South',
    zone: 'Zone 13 (Adyar)',
    lat: 12.9774,
    lng: 80.2212,
    baseHazard: 85,
    population: 68000,
    elevation: 2.1, // meters above sea level
    criticalFacilities: 3,
    status: 'Vulnerable low-lying marsh basin'
  },
  {
    id: 'W-02',
    name: 'Saidapet & West Mambalam',
    zone: 'Zone 10 (Kodambakkam)',
    lat: 13.0213,
    lng: 80.2231,
    baseHazard: 78,
    population: 82000,
    elevation: 4.5,
    criticalFacilities: 4,
    status: 'Adyar River overflow zone'
  },
  {
    id: 'W-03',
    name: 'Vyasarpadi & Pulianthope',
    zone: 'Zone 4 (Tondiarpet)',
    lat: 13.1091,
    lng: 80.2611,
    baseHazard: 82,
    population: 94000,
    elevation: 1.8,
    criticalFacilities: 2,
    status: 'Otteri Nullah bottleneck'
  },
  {
    id: 'W-04',
    name: 'T. Nagar (Usman Road)',
    zone: 'Zone 10 (Kodambakkam)',
    lat: 13.0418,
    lng: 80.2341,
    baseHazard: 65,
    population: 75000,
    elevation: 6.2,
    criticalFacilities: 5,
    status: 'Commercial high-density zone'
  },
  {
    id: 'W-05',
    name: 'Perambur & Kolathur',
    zone: 'Zone 6 (Thiru-Vi-Ka Nagar)',
    lat: 13.1147,
    lng: 80.2324,
    baseHazard: 70,
    population: 110000,
    elevation: 3.5,
    criticalFacilities: 3,
    status: 'Railway subway waterlogging'
  },
  {
    id: 'W-06',
    name: 'Madipakkam & Pallikaranai',
    zone: 'Zone 14 (Perungudi)',
    lat: 12.9647,
    lng: 80.1961,
    baseHazard: 90,
    population: 59000,
    elevation: 1.2,
    criticalFacilities: 1,
    status: 'Wetland catchment basin'
  },
  {
    id: 'W-07',
    name: 'Mylapore & Mandaveli',
    zone: 'Zone 9 (Teynampet)',
    lat: 13.0339,
    lng: 80.2696,
    baseHazard: 42,
    population: 89000,
    elevation: 8.1,
    criticalFacilities: 6,
    status: 'Coastal elevated grid'
  },
  {
    id: 'W-08',
    name: 'Royapettah & Triplicane',
    zone: 'Zone 9 (Teynampet)',
    lat: 13.0569,
    lng: 80.2654,
    baseHazard: 48,
    population: 92000,
    elevation: 7.5,
    criticalFacilities: 4,
    status: 'Buckingham canal adjacent'
  }
];

export const CRITICAL_FACILITIES = [
  {
    id: 'HOSP-01',
    name: 'Rajiv Gandhi Govt General Hospital (RGGGH)',
    type: 'Super-Specialty Public Hospital',
    lat: 13.0815,
    lng: 80.2777,
    capacity: 2800, // beds
    icuBeds: 350,
    backupGenerators: '3 Units (1200 kVA)',
    corridorName: 'EVR Periyar Salai Corridor',
    status: 'ACTIVE',
    riskThreshold: 70
  },
  {
    id: 'HOSP-02',
    name: 'Apollo Hospitals, Greams Road',
    type: 'Tertiary Care Hospital',
    lat: 13.0604,
    lng: 80.2520,
    capacity: 600,
    icuBeds: 110,
    backupGenerators: '2 Units (800 kVA)',
    corridorName: 'Greams Road - Mount Road Access',
    status: 'ACTIVE',
    riskThreshold: 65
  },
  {
    id: 'HOSP-03',
    name: 'Govt Stanley Medical College Hospital',
    type: 'Regional Trauma Center',
    lat: 13.1042,
    lng: 80.2858,
    capacity: 1500,
    icuBeds: 200,
    backupGenerators: '2 Units (1000 kVA)',
    corridorName: 'Old Jail Road Transit',
    status: 'ACTIVE',
    riskThreshold: 75
  },
  {
    id: 'HOSP-04',
    name: 'Fortis Malar Hospital, Adyar',
    type: 'Emergency Cardiac & Multi-Specialty',
    lat: 13.0067,
    lng: 80.2571,
    capacity: 180,
    icuBeds: 45,
    backupGenerators: '1 Unit (500 kVA)',
    corridorName: 'Adyar Bridge Corridor',
    status: 'ACTIVE',
    riskThreshold: 60
  }
];

export const WATERBODIES = [
  {
    id: 'WB-01',
    name: 'Chembarambakkam Lake Reservoir',
    type: 'Primary Flood Control & Drinking Reservoir',
    lat: 13.0102,
    lng: 80.0543,
    maxCapacity: '3,645 Mcft',
    dischargeCapacity: '35,000 cusecs',
    currentLevelPct: 88,
    status: 'CRITICAL_MONITORING'
  },
  {
    id: 'WB-02',
    name: 'Adyar River Course',
    type: 'Urban River Channel',
    lat: 13.0125,
    lng: 80.2312,
    maxCapacity: '60,000 cusecs',
    dischargeCapacity: 'Safe threshold 40k cusecs',
    currentLevelPct: 82,
    status: 'HIGH_FLOW'
  },
  {
    id: 'WB-03',
    name: 'Cooum River Urban Channel',
    type: 'Central Urban Waterway',
    lat: 13.0720,
    lng: 80.2580,
    maxCapacity: '25,000 cusecs',
    dischargeCapacity: 'Heavy Siltation Bottleneck',
    currentLevelPct: 78,
    status: 'MODERATE_OVERFLOW'
  },
  {
    id: 'WB-04',
    name: 'Buckingham Canal Drainage',
    type: 'North-South Salt Water Transit Canal',
    lat: 13.0450,
    lng: 80.2720,
    maxCapacity: '12,000 cusecs',
    dischargeCapacity: 'Tidal Blocked',
    currentLevelPct: 75,
    status: 'MONITORING'
  }
];

export const INITIAL_RESOURCES = [
  {
    id: 'PUMP-1',
    name: 'High-Capacity Mobile Pump #1 (500 HP)',
    type: 'PUMP',
    status: 'AVAILABLE',
    assignedWard: 'None',
    lat: 13.0800,
    lng: 80.2600,
    flowRate: '12,000 Liters/min'
  },
  {
    id: 'PUMP-2',
    name: 'High-Capacity Mobile Pump #2 (500 HP)',
    type: 'PUMP',
    status: 'AVAILABLE',
    assignedWard: 'None',
    lat: 13.0400,
    lng: 80.2400,
    flowRate: '12,000 Liters/min'
  },
  {
    id: 'PUMP-3',
    name: 'High-Capacity Mobile Pump #3 (350 HP)',
    type: 'PUMP',
    status: 'AVAILABLE',
    assignedWard: 'None',
    lat: 12.9800,
    lng: 80.2100,
    flowRate: '8,500 Liters/min'
  },
  {
    id: 'PUMP-4',
    name: 'De-submersible Sludge Pump #4',
    type: 'PUMP',
    status: 'AVAILABLE',
    assignedWard: 'None',
    lat: 13.1100,
    lng: 80.2500,
    flowRate: '6,000 Liters/min'
  },
  {
    id: 'PUMP-5',
    name: 'Submersible Sludge Pump #5',
    type: 'PUMP',
    status: 'AVAILABLE',
    assignedWard: 'None',
    lat: 13.0600,
    lng: 80.2700,
    flowRate: '6,000 Liters/min'
  },
  {
    id: 'EXCA-1',
    name: 'Tracked Excavator - Channel Dredger #1',
    type: 'EXCAVATOR',
    status: 'AVAILABLE',
    assignedWard: 'None',
    lat: 13.0200,
    lng: 80.2200,
    capacity: '1.2 cu m bucket'
  },
  {
    id: 'EXCA-2',
    name: 'Long-Reach Amphibious Excavator #2',
    type: 'EXCAVATOR',
    status: 'AVAILABLE',
    assignedWard: 'None',
    lat: 13.0900,
    lng: 80.2700,
    capacity: '1.5 cu m bucket'
  },
  {
    id: 'TRUCK-1',
    name: 'Heavy Rescue Transport Fleet (10 Trucks)',
    type: 'TRUCK_FLEET',
    status: 'AVAILABLE',
    assignedWard: 'Central Operations Depot',
    lat: 13.0700,
    lng: 80.2500,
    fleetSize: 10
  },
  {
    id: 'POWER-1',
    name: 'Mobile Substation Power Generator (250 kVA)',
    type: 'POWER',
    status: 'AVAILABLE',
    assignedWard: 'None',
    lat: 13.0500,
    lng: 80.2600,
    output: '250 kVA 415V'
  }
];

// Initial ₹100 Crore Resilience Plan Domain Cost Sheet Structure
export const DOMAINS_COST_SHEET = [
  {
    id: 'domain-1',
    name: 'Drainage & Flood Control',
    icon: 'Droplets',
    allocatedCr: 30.00, // ₹30 Crore baseline
    description: 'Channel widening, stormwater drain upgrades, high-capacity pumping stations, silt clearing.',
    color: 'emerald',
    items: [
      { id: 'item-101', title: 'Macro-Drain Desilting & Dredging (Adyar & Cooum)', unitCostCr: 6.50, qty: 1, subtotalCr: 6.50, priority: 'CRITICAL', phase: 'Phase 1 (Immediate)', status: 'Approved' },
      { id: 'item-102', title: 'Automated Stormwater Sluice Gates (Chembarambakkam Outfall)', unitCostCr: 4.20, qty: 2, subtotalCr: 8.40, priority: 'HIGH', phase: 'Phase 1 (Immediate)', status: 'Approved' },
      { id: 'item-103', title: 'Velachery Marshland Underground Micro-tunnelling Drains', unitCostCr: 10.10, qty: 1, subtotalCr: 10.10, priority: 'HIGH', phase: 'Phase 2 (Medium Term)', status: 'Planned' },
      { id: 'item-104', title: 'Submersible High-Volume Pumping Stations (5 Locations)', unitCostCr: 1.00, qty: 5, subtotalCr: 5.00, priority: 'MEDIUM', phase: 'Phase 2 (Medium Term)', status: 'Planned' }
    ]
  },
  {
    id: 'domain-2',
    name: 'Power & Utilities Infrastructure',
    icon: 'Zap',
    allocatedCr: 18.00, // ₹18 Crore baseline
    description: 'Elevation of electrical TNEB transformers, microgrid battery storage for emergency hospitals.',
    color: 'amber',
    items: [
      { id: 'item-201', title: 'Waterproof Elevated Platform Base for Substation Transformers', unitCostCr: 0.85, qty: 8, subtotalCr: 6.80, priority: 'CRITICAL', phase: 'Phase 1 (Immediate)', status: 'Approved' },
      { id: 'item-202', title: 'Hospital Emergency Solar-BESS Microgrids (RGGGH & Stanley)', unitCostCr: 4.50, qty: 2, subtotalCr: 9.00, priority: 'CRITICAL', phase: 'Phase 1 (Immediate)', status: 'Approved' },
      { id: 'item-203', title: 'Submersible Underground Distribution Cabling (T. Nagar Corridor)', unitCostCr: 2.20, qty: 1, subtotalCr: 2.20, priority: 'LOW', phase: 'Phase 3 (Long Term)', status: 'Under Review' }
    ]
  },
  {
    id: 'domain-3',
    name: 'Sensors & Early Warning Telemetry',
    icon: 'Radio',
    allocatedCr: 15.00, // ₹15 Crore baseline
    description: 'IoT Ultrasonic water level sensors, rain gauges, automated siren networks, central GIS server node.',
    color: 'cyan',
    items: [
      { id: 'item-301', title: 'IoT Radar Water Level Sensors on City Canals & Drains', unitCostCr: 0.05, qty: 80, subtotalCr: 4.00, priority: 'HIGH', phase: 'Phase 1 (Immediate)', status: 'Approved' },
      { id: 'item-302', title: 'Automated Weather Stations (AWS) Grid Expansion', unitCostCr: 0.15, qty: 20, subtotalCr: 3.00, priority: 'MEDIUM', phase: 'Phase 1 (Immediate)', status: 'Approved' },
      { id: 'item-303', title: 'Community Early Warning Siren Towers with VHF Mesh', unitCostCr: 0.25, qty: 16, subtotalCr: 4.00, priority: 'HIGH', phase: 'Phase 2 (Medium Term)', status: 'Planned' },
      { id: 'item-304', title: 'Real-Time Hydrodynamic Command Center Analytics Compute Node', unitCostCr: 4.00, qty: 1, subtotalCr: 4.00, priority: 'HIGH', phase: 'Phase 1 (Immediate)', status: 'Approved' }
    ]
  },
  {
    id: 'domain-4',
    name: 'Roads & Mobility Resilience',
    icon: 'Truck',
    allocatedCr: 15.00, // ₹15 Crore baseline
    description: 'Elevated hospital access corridors, flood-proof bridge approaches, porous pavement trials.',
    color: 'blue',
    items: [
      { id: 'item-401', title: 'Elevated EVR Periyar Salai Hospital Access Flyover Ramp', unitCostCr: 7.50, qty: 1, subtotalCr: 7.50, priority: 'CRITICAL', phase: 'Phase 2 (Medium Term)', status: 'Approved' },
      { id: 'item-402', title: 'Adyar Causeway Flood Ramp & Retaining Wall Reinforcement', unitCostCr: 4.50, qty: 1, subtotalCr: 4.50, priority: 'HIGH', phase: 'Phase 2 (Medium Term)', status: 'Planned' },
      { id: 'item-403', title: 'Porous Permeable Concrete Pavement (Usman Rd Bus Corridor)', unitCostCr: 3.00, qty: 1, subtotalCr: 3.00, priority: 'MEDIUM', phase: 'Phase 3 (Long Term)', status: 'Under Review' }
    ]
  },
  {
    id: 'domain-5',
    name: 'People & Community Housing',
    icon: 'ShieldAlert',
    allocatedCr: 12.00, // ₹12 Crore baseline
    description: 'Multi-purpose cyclone relief shelters, flood protection bunds, community boat kits, first responder training.',
    color: 'rose',
    items: [
      { id: 'item-501', title: 'Multi-Purpose Cyclone & Flood Shelter Complex Construction', unitCostCr: 3.50, qty: 2, subtotalCr: 7.00, priority: 'HIGH', phase: 'Phase 1 (Immediate)', status: 'Approved' },
      { id: 'item-502', title: 'Vulnerable Ward Community Inflatable Boat & Medical Kits', unitCostCr: 0.10, qty: 30, subtotalCr: 3.00, priority: 'HIGH', phase: 'Phase 1 (Immediate)', status: 'Approved' },
      { id: 'item-503', title: 'Ward Volunteer First Responder & Disaster Response Training', unitCostCr: 0.05, qty: 40, subtotalCr: 2.00, priority: 'MEDIUM', phase: 'Phase 1 (Immediate)', status: 'Approved' }
    ]
  },
  {
    id: 'domain-6',
    name: 'Environment & Wetland Protection',
    icon: 'Trees',
    allocatedCr: 10.00, // ₹10 Crore baseline
    description: 'Pallikaranai marshland ecological restoration, urban retention ponds, riverbank bio-shielding.',
    color: 'teal',
    items: [
      { id: 'item-601', title: 'Pallikaranai Wetland Bio-Restoration & Buffer Channel Clearings', unitCostCr: 4.50, qty: 1, subtotalCr: 4.50, priority: 'HIGH', phase: 'Phase 2 (Medium Term)', status: 'Approved' },
      { id: 'item-602', title: 'Urban Flood Retention Ponds & Aquifer Recharge Wells', unitCostCr: 0.35, qty: 10, subtotalCr: 3.50, priority: 'MEDIUM', phase: 'Phase 2 (Medium Term)', status: 'Planned' },
      { id: 'item-603', title: 'Mangrove & Vetiver Bio-Shield Along Adyar Estuary', unitCostCr: 2.00, qty: 1, subtotalCr: 2.00, priority: 'LOW', phase: 'Phase 3 (Long Term)', status: 'Planned' }
    ]
  }
];
