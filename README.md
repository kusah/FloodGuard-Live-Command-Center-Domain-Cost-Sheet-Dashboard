# 🌊 FLOODGUARD | Real-City Flood Command & Resilience Platform

Real-city flood monitoring, emergency response, live simulation engine, and dynamic multi-domain resilience cost management platform built for Chennai, Tamil Nadu.

---

## 🚀 Quick Setup Guide for Collaborators

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Live Dashboard
```bash
npm run dev
```

Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

---

## ✨ Features

- **Live Parameter Controls**: Sliders to dynamically adjust Flood Area Spread ($km$), Hourly & 24h Rainfall ($mm$), Reservoir Levels (%), Power Grid (%), and Drain Siltation (%).
- **GIS Command Map**: Interactive Leaflet map visualizing Chennai wards, reservoirs, critical hospitals, ambulance access corridors, and flood spread circles.
- **Emergency Resource Allocation**: Constrained resource manager for pumps, excavators, trucks, and generators with one-click ward/hospital corridor dispatch.
- **Dynamic User Budget Controller & Auto-Scaling Cost Sheet**: Set any target budget cap (e.g., ₹1.5 Cr MVP Pilot, ₹30 Cr, ₹100 Cr, ₹250 Cr). All domain subtotals and line-item prices automatically rescale proportionally!
- **Minimum Build Cost Breakdown**: Built-in MVP startup cost breakdown (₹1.0 - 1.5 Cr pilot).
- **Historical Event Replay**: Playable 24-hour storm timeline scrubber (2015 Chennai Deluge & 2023 Cyclone Michaung).
- **CSV Export**: One-click cost sheet export to `.csv`.

---

## 🛠️ Built With

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **GIS Mapping**: Leaflet, React-Leaflet
- **Icons**: Lucide React
