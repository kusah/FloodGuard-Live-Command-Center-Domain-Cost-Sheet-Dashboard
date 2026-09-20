import React, { useState } from 'react';
import { DollarSign, Droplets, Zap, Radio, Truck, ShieldAlert, Trees, Plus, ChevronDown, ChevronUp, Download, PieChart, CheckCircle, Percent, Sparkles, Trash2, Edit3, Calculator, HardHat, RefreshCw, Sliders } from 'lucide-react';

export default function DomainCostSheet({ domains, setDomains, totalTargetBudget, setTotalTargetBudget }) {
  const [expandedDomain, setExpandedDomain] = useState('domain-1');
  const [showAddModal, setShowAddModal] = useState(null);
  const [isEditingBudgetCap, setIsEditingBudgetCap] = useState(false);
  const [tempBudgetCap, setTempBudgetCap] = useState(totalTargetBudget);

  const [newItem, setNewItem] = useState({
    title: '',
    unitCostCr: 1.0,
    qty: 1,
    priority: 'HIGH',
    phase: 'Phase 1 (Immediate)',
    status: 'Planned'
  });

  // MVP Build Cost Estimation Breakdown
  const MVP_BUILD_ESTIMATION = [
    { category: 'Software Engine & GIS Command Portal', costRange: '₹15 - 20 Lakhs', desc: 'React GIS frontend, risk engine, telemetry APIs, alert engine & cloud hosting.' },
    { category: 'IoT Sensor Network (MVP Pilot)', costRange: '₹12 - 15 Lakhs', desc: '15 ultrasonic water level radar sensors & 2 Automated Weather Stations.' },
    { category: 'Emergency Response Hardware', costRange: '₹50 - 70 Lakhs', desc: '2 high-capacity mobile de-watering pumps & 1 channel dredging excavator.' },
    { category: 'First Responder & Relief Setup', costRange: '₹15 - 20 Lakhs', desc: '20 ward boat kits, VHF comms, and responder training programs.' },
    { category: 'Total Minimum MVP Deployment Cost', costRange: '₹1.0 - 1.5 Crore', desc: 'Complete operational pilot for 2-3 high-vulnerability urban wards.', highlight: true }
  ];

  // Calculate current total allocated across all domains
  const totalAllocated = domains.reduce((acc, d) => {
    const domainItemsSubtotal = d.items.reduce((sum, item) => sum + (item.unitCostCr * item.qty), 0);
    return acc + domainItemsSubtotal;
  }, 0);

  const remainingBudget = totalTargetBudget - totalAllocated;
  const riskReductionScorePct = Math.min(98, Math.max(5, Math.round((totalAllocated / Math.max(1, totalTargetBudget)) * 82)));

  // Auto-scale all line items in all domains when budget cap changes
  const applyBudgetCapAndScaleDomains = (newCapCr) => {
    const target = parseFloat(newCapCr);
    if (isNaN(target) || target <= 0) return;

    const currentTotal = Math.max(0.01, totalAllocated);
    const scaleFactor = target / currentTotal;

    setTotalTargetBudget(target);

    // Scale unit costs of all items in all domains proportionally
    setDomains(prev => prev.map(domain => ({
      ...domain,
      allocatedCr: domain.allocatedCr * scaleFactor,
      items: domain.items.map(item => ({
        ...item,
        unitCostCr: Math.max(0.001, parseFloat((item.unitCostCr * scaleFactor).toFixed(4))),
        subtotalCr: Math.max(0.001, parseFloat((item.unitCostCr * scaleFactor * item.qty).toFixed(4)))
      }))
    })));

    setIsEditingBudgetCap(false);
  };

  const handleSaveBudgetCap = (e) => {
    e.preventDefault();
    applyBudgetCapAndScaleDomains(tempBudgetCap);
  };

  const setPresetBudget = (valCr) => {
    setTempBudgetCap(valCr);
    applyBudgetCapAndScaleDomains(valCr);
  };

  // Adjust individual domain share multiplier
  const handleDomainScaleChange = (domainId, newShareMultiplier) => {
    const multiplier = parseFloat(newShareMultiplier);
    if (isNaN(multiplier) || multiplier <= 0) return;

    setDomains(prev => prev.map(d => {
      if (d.id === domainId) {
        const currentDomainSubtotal = d.items.reduce((sum, item) => sum + (item.unitCostCr * item.qty), 0);
        if (currentDomainSubtotal === 0) return d;

        // Scale items within this domain
        const itemScale = (currentDomainSubtotal * multiplier) / currentDomainSubtotal;
        return {
          ...d,
          allocatedCr: d.allocatedCr * itemScale,
          items: d.items.map(item => ({
            ...item,
            unitCostCr: Math.max(0.001, parseFloat((item.unitCostCr * itemScale).toFixed(4))),
            subtotalCr: Math.max(0.001, parseFloat((item.unitCostCr * itemScale * item.qty).toFixed(4)))
          }))
        };
      }
      return d;
    }));
  };

  const toggleDomain = (id) => {
    setExpandedDomain(prev => prev === id ? null : id);
  };

  const deleteLineItem = (domainId, itemId) => {
    setDomains(prev => prev.map(d => {
      if (d.id === domainId) {
        return {
          ...d,
          items: d.items.filter(i => i.id !== itemId)
        };
      }
      return d;
    }));
  };

  const handleAddItemSubmit = (e, domainId) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    const createdItem = {
      id: `item-${Date.now()}`,
      title: newItem.title,
      unitCostCr: parseFloat(newItem.unitCostCr),
      qty: parseInt(newItem.qty, 10),
      subtotalCr: parseFloat(newItem.unitCostCr) * parseInt(newItem.qty, 10),
      priority: newItem.priority,
      phase: newItem.phase,
      status: newItem.status
    };

    setDomains(prev => prev.map(d => {
      if (d.id === domainId) {
        return {
          ...d,
          items: [...d.items, createdItem]
        };
      }
      return d;
    }));

    setShowAddModal(null);
    setNewItem({
      title: '',
      unitCostCr: 1.0,
      qty: 1,
      priority: 'HIGH',
      phase: 'Phase 1 (Immediate)',
      status: 'Planned'
    });
  };

  const exportToCSV = () => {
    let csvRows = [`Target Budget Cap: ₹${totalTargetBudget} Cr`];
    csvRows.push('Domain,Line Item Title,Unit Cost (Cr),Quantity,Subtotal (Cr),Priority,Implementation Phase,Status');

    domains.forEach(d => {
      d.items.forEach(item => {
        csvRows.push(`"${d.name}","${item.title}",${item.unitCostCr},${item.qty},${(item.unitCostCr * item.qty).toFixed(4)},"${item.priority}","${item.phase}","${item.status}"`);
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FloodGuard_Cost_Sheet_${totalTargetBudget}Cr.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* User Budget Controller & Dynamic Auto-Scaler */}
      <div className="bg-slate-900 border border-cyan-500/40 p-4 rounded-xl shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-cyan-400" />
              DYNAMIC USER BUDGET CONTROLLER & AUTO-SCALER
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Changing the budget cap automatically rescales all 6 domain allocations and line-item costs proportionally!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isEditingBudgetCap ? (
              <form onSubmit={handleSaveBudgetCap} className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="5000"
                  value={tempBudgetCap}
                  onChange={(e) => setTempBudgetCap(e.target.value)}
                  className="bg-slate-950 border border-cyan-500 text-white font-bold font-mono text-sm px-3 py-1.5 rounded-lg w-32 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded-lg hover:bg-cyan-400"
                >
                  Apply & Scale Sheet
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBudgetCap(false)}
                  className="px-2.5 py-1.5 bg-slate-800 text-slate-400 font-mono text-xs rounded-lg"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">Target Budget Cap</span>
                  <span className="text-lg font-bold text-cyan-400">₹{totalTargetBudget.toFixed(2)} Cr</span>
                </div>
                <button
                  onClick={() => {
                    setTempBudgetCap(totalTargetBudget);
                    setIsEditingBudgetCap(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5 text-cyan-400" /> Change & Scale Budget
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Budget Preset Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 font-mono">Quick Preset Caps:</span>
            <button
              onClick={() => setPresetBudget(1.5)}
              className={`px-3 py-1 text-xs rounded-lg font-mono font-bold transition-all ${
                Math.abs(totalTargetBudget - 1.5) < 0.1 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ₹1.5 Cr (MVP Pilot)
            </button>
            <button
              onClick={() => setPresetBudget(30.0)}
              className={`px-3 py-1 text-xs rounded-lg font-mono font-bold transition-all ${
                Math.abs(totalTargetBudget - 30.0) < 0.1 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ₹30 Cr (Ward Cluster)
            </button>
            <button
              onClick={() => setPresetBudget(100.0)}
              className={`px-3 py-1 text-xs rounded-lg font-mono font-bold transition-all ${
                Math.abs(totalTargetBudget - 100.0) < 0.1 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ₹100 Cr (Standard City)
            </button>
            <button
              onClick={() => setPresetBudget(250.0)}
              className={`px-3 py-1 text-xs rounded-lg font-mono font-bold transition-all ${
                Math.abs(totalTargetBudget - 250.0) < 0.1 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ₹250 Cr (Full Metro)
            </button>
          </div>

          <button
            onClick={() => applyBudgetCapAndScaleDomains(totalTargetBudget)}
            className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Rescale Sheet to ₹{totalTargetBudget} Cr
          </button>
        </div>
      </div>

      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs text-slate-400 font-mono">User Target Budget</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1">
            ₹{totalTargetBudget.toFixed(2)} <span className="text-sm font-normal text-slate-400">Crore</span>
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-1">User Configured Cap</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs text-slate-400 font-mono">Total Domain Allocation</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
            ₹{totalAllocated.toFixed(2)} <span className="text-sm font-normal text-slate-400">Cr</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {((totalAllocated / totalTargetBudget) * 100).toFixed(1)}% of user target
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs text-slate-400 font-mono">Unallocated Balance</div>
          <div className={`text-3xl font-extrabold font-mono mt-1 ${remainingBudget < -0.01 ? 'text-red-400' : 'text-cyan-400'}`}>
            ₹{remainingBudget.toFixed(2)} <span className="text-sm font-normal text-slate-400">Cr</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {remainingBudget < -0.01 ? 'Exceeds Cap' : 'Balanced with Cap'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs text-slate-400 font-mono">Est. Risk Reduction ROI</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1 flex items-center gap-1">
            {riskReductionScorePct}% <Percent className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Model Efficiency Score
          </div>
        </div>

      </div>

      {/* Minimum-to-Minimum Build Cost Breakdown Card */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-amber-400 font-mono flex items-center gap-2">
            <HardHat className="h-4 w-4 text-amber-400" />
            MINIMUM-TO-MINIMUM BUILD COST ESTIMATION (MVP PILOT SETUP)
          </h3>
          <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
            LEAN STARTUP BUDGET: ₹1.0 - 1.5 CR
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Estimated breakdown to build and deploy a fully functional Minimum Viable Product (MVP) of FloodGuard for initial pilot wards:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MVP_BUILD_ESTIMATION.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                item.highlight
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 lg:col-span-3'
                  : 'bg-slate-950 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold font-mono">{item.category}</span>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">{item.costRange}</span>
              </div>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Header & CSV Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            DYNAMIC DOMAIN COST SHEET (SCALED TO ₹{totalTargetBudget} CR)
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Line item prices & domain subtotals are scaled dynamically to match the current target budget cap.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center gap-2 transition-all shadow-md"
        >
          <Download className="h-4 w-4" /> Export Cost Sheet CSV
        </button>
      </div>

      {/* Domain Cards List */}
      <div className="space-y-4">
        {domains.map((domain, index) => {
          const domainSubtotal = domain.items.reduce((acc, i) => acc + (i.unitCostCr * i.qty), 0);
          const domainSharePct = ((domainSubtotal / Math.max(0.01, totalAllocated)) * 100).toFixed(1);
          const isExpanded = expandedDomain === domain.id;

          return (
            <div key={domain.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              
              {/* Domain Header Row */}
              <div
                className="p-4 bg-slate-900 hover:bg-slate-800/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800"
              >
                <div 
                  onClick={() => toggleDomain(domain.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-cyan-400 font-mono border border-slate-700">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      {domain.name}
                    </h3>
                    <p className="text-xs text-slate-400">{domain.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  
                  {/* Domain Subtotal */}
                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Domain Subtotal</div>
                    <div className="text-base font-extrabold text-emerald-400">
                      ₹{domainSubtotal < 1 ? domainSubtotal.toFixed(4) : domainSubtotal.toFixed(2)} Cr
                    </div>
                  </div>

                  {/* Share % badge */}
                  <div className="text-right font-mono hidden sm:block">
                    <div className="text-xs text-slate-400">Share</div>
                    <div className="text-xs font-bold text-cyan-400">{domainSharePct}%</div>
                  </div>

                  {/* Domain Scale Modifier Button */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDomainScaleChange(domain.id, 1.2)}
                      title="Increase domain share +20%"
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded border border-slate-700 font-mono"
                    >
                      +20%
                    </button>
                    <button
                      onClick={() => handleDomainScaleChange(domain.id, 0.8)}
                      title="Decrease domain share -20%"
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-bold rounded border border-slate-700 font-mono"
                    >
                      -20%
                    </button>
                  </div>

                  <button
                    onClick={() => toggleDomain(domain.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Itemized Breakdown Table */}
              {isExpanded && (
                <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Itemized Line Items ({domain.items.length})
                    </h4>
                    <button
                      onClick={() => setShowAddModal(domain.id)}
                      className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 rounded text-xs font-semibold font-mono flex items-center gap-1 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Custom Line Item
                    </button>
                  </div>

                  {/* Add Item Form Modal Inline */}
                  {showAddModal === domain.id && (
                    <form
                      onSubmit={(e) => handleAddItemSubmit(e, domain.id)}
                      className="bg-slate-900 p-3.5 rounded-lg border border-cyan-500/40 space-y-3"
                    >
                      <div className="text-xs font-bold text-cyan-400 font-mono">
                        Add New Project / Line Item to {domain.name}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Project title / description"
                          value={newItem.title}
                          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                          className="bg-slate-950 border border-slate-700 text-xs rounded p-2 text-white font-mono focus:outline-none focus:border-cyan-500 md:col-span-2"
                          required
                        />

                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.001"
                            placeholder="Unit Cost (Cr)"
                            value={newItem.unitCostCr}
                            onChange={(e) => setNewItem({ ...newItem, unitCostCr: e.target.value })}
                            className="bg-slate-950 border border-slate-700 text-xs rounded p-2 text-white font-mono w-full focus:outline-none focus:border-cyan-500"
                            required
                          />
                          <input
                            type="number"
                            placeholder="Qty"
                            value={newItem.qty}
                            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                            className="bg-slate-950 border border-slate-700 text-xs rounded p-2 text-white font-mono w-20 focus:outline-none focus:border-cyan-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddModal(null)}
                          className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded font-mono"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded font-mono"
                        >
                          Save Item
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5">Project / Line Item</th>
                          <th className="p-2.5">Unit Cost (Cr)</th>
                          <th className="p-2.5">Qty</th>
                          <th className="p-2.5">Subtotal</th>
                          <th className="p-2.5">Priority</th>
                          <th className="p-2.5">Phase</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {domain.items.map(item => {
                          const itemSubtotal = item.unitCostCr * item.qty;
                          return (
                            <tr key={item.id} className="hover:bg-slate-900/50">
                              <td className="p-2.5 font-semibold text-slate-200">
                                {item.title}
                              </td>
                              <td className="p-2.5 font-bold text-slate-300">
                                ₹{item.unitCostCr < 0.1 ? item.unitCostCr.toFixed(4) : item.unitCostCr.toFixed(2)} Cr
                              </td>
                              <td className="p-2.5">{item.qty}</td>
                              <td className="p-2.5 font-extrabold text-emerald-400">
                                ₹{itemSubtotal < 0.1 ? itemSubtotal.toFixed(4) : itemSubtotal.toFixed(2)} Cr
                              </td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  item.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                  item.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {item.priority}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-400">{item.phase}</td>
                              <td className="p-2.5 text-right">
                                <button
                                  onClick={() => deleteLineItem(domain.id, item.id)}
                                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                  title="Remove item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
